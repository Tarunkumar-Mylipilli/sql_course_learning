// High-level Client Pool & Dispatcher for sqlWorker
// Enforces max execution timeout (5000ms), worker recreation on freeze, and input caps

export interface QueryResult {
  columns: string[];
  values: any[][];
  error?: string;
  rowCount: number;
  executionTimeMs: number;
  truncated?: boolean;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
  mismatchReason?: string;
}

const DEFAULT_TIMEOUT_MS = 5000;
let workerInstance: Worker | null = null;
let currentRequestId = 0;
const pendingRequests = new Map<
  string,
  {
    resolve: (val: any) => void;
    reject: (err: any) => void;
    timer: any;
  }
>();

function createWorker(): Worker {
  // Vite worker instantiation
  const worker = new Worker(new URL('../workers/sqlWorker.ts', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (e: MessageEvent) => {
    const { id, result, validation, error, success } = e.data;
    const req = pendingRequests.get(id);
    if (!req) return;

    clearTimeout(req.timer);
    pendingRequests.delete(id);

    if (validation !== undefined) {
      req.resolve(validation);
    } else if (result !== undefined) {
      req.resolve(result);
    } else if (error) {
      req.resolve({
        columns: [],
        values: [],
        error,
        rowCount: 0,
        executionTimeMs: 0,
      });
    } else {
      req.resolve({ success });
    }
  };

  worker.onerror = (err) => {
    console.error('SQL Worker internal error:', err);
    // Terminate and reject all active requests
    terminateWorker('SQL execution worker crashed. Recreating engine...');
  };

  return worker;
}

function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = createWorker();
  }
  return workerInstance;
}

function terminateWorker(reason: string) {
  if (workerInstance) {
    try {
      workerInstance.terminate();
    } catch {}
    workerInstance = null;
  }
  pendingRequests.forEach(({ resolve, timer }) => {
    clearTimeout(timer);
    resolve({
      columns: [],
      values: [],
      error: reason,
      rowCount: 0,
      executionTimeMs: DEFAULT_TIMEOUT_MS,
    });
  });
  pendingRequests.clear();
}

function dispatchRequest<T>(payload: any, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    const id = `req_${++currentRequestId}_${Date.now()}`;

    const timer = setTimeout(() => {
      pendingRequests.delete(id);
      terminateWorker(`Query exceeded execution timeout (${timeoutMs / 1000}s). Runaway/infinite loop query was killed to keep your browser responsive.`);
      resolve({
        columns: [],
        values: [],
        error: `Execution timed out (${timeoutMs / 1000}s). The query was safely terminated to prevent freezing your browser. Optimize joins or remove runaway conditions.`,
        rowCount: 0,
        executionTimeMs: timeoutMs,
      } as any);
    }, timeoutMs);

    pendingRequests.set(id, { resolve, reject, timer });
    worker.postMessage({ id, ...payload });
  });
}

// Public API
export async function executeQuery(
  schemaSql: string,
  userSql: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<QueryResult> {
  return dispatchRequest<QueryResult>(
    {
      type: 'execute',
      schemaSql,
      userSql,
    },
    timeoutMs
  );
}

export async function validateSolution(
  schemaSql: string,
  userSql: string,
  solutionSql: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ValidationResult> {
  return dispatchRequest<ValidationResult>(
    {
      type: 'validate',
      schemaSql,
      userSql,
      solutionSql,
    },
    timeoutMs
  );
}

export async function preloadSqlEngine(): Promise<void> {
  try {
    await dispatchRequest({ type: 'init' }, 8000);
  } catch {}
}
