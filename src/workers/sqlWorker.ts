// Dedicated Web Worker for isolated, non-blocking SQL execution with timeout safety
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

const MAX_QUERY_LENGTH = 10000;
const MAX_ROW_LIMIT = 5000;

interface WorkerRequest {
  id: string;
  type: 'execute' | 'validate' | 'init';
  schemaSql?: string;
  userSql?: string;
  solutionSql?: string;
}

interface QueryResult {
  columns: string[];
  values: any[][];
  error?: string;
  rowCount: number;
  executionTimeMs: number;
  truncated?: boolean;
}

interface ValidationResult {
  passed: boolean;
  message: string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
  mismatchReason?: string;
}

interface WorkerResponse {
  id: string;
  type: 'execute' | 'validate' | 'init';
  success: boolean;
  result?: QueryResult;
  validation?: ValidationResult;
  error?: string;
}

async function getEngine(): Promise<SqlJsStatic> {
  if (SQL) return SQL;
  // Locate the self-hosted wasm binary relative to base path or public root
  SQL = await initSqlJs({
    locateFile: (file: string) => {
      // In Vite worker build, import.meta.url gives worker location
      return new URL(`/${file}`, self.location.origin).href;
    },
  });
  return SQL;
}

function runQueryOnFreshDb(schemaSql: string, sql: string): QueryResult {
  const startTime = performance.now();

  if (!sql || !sql.trim()) {
    return {
      columns: [],
      values: [],
      error: 'Please enter a SQL query before executing.',
      rowCount: 0,
      executionTimeMs: 0,
    };
  }

  if (sql.length > MAX_QUERY_LENGTH) {
    return {
      columns: [],
      values: [],
      error: `Query exceeds maximum allowed length of ${MAX_QUERY_LENGTH.toLocaleString()} characters.`,
      rowCount: 0,
      executionTimeMs: 0,
    };
  }

  if (!SQL) {
    return {
      columns: [],
      values: [],
      error: 'SQL engine is still initializing. Please retry in a moment.',
      rowCount: 0,
      executionTimeMs: 0,
    };
  }

  let localDb: Database | null = null;
  try {
    localDb = new SQL.Database();

    // 1. Initialize schema & sample tables
    if (schemaSql && schemaSql.trim()) {
      localDb.run(schemaSql);
    }

    // 2. Execute user query safely
    const cleanSql = sql.trim().replace(/;+$/, '');
    const res = localDb.exec(cleanSql);

    const execTime = Math.round(performance.now() - startTime);

    if (!res || res.length === 0) {
      return {
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs: execTime,
      };
    }

    const lastResult = res[res.length - 1];
    const totalRows = lastResult.values.length;
    let truncated = false;
    let values = lastResult.values;

    if (totalRows > MAX_ROW_LIMIT) {
      values = values.slice(0, MAX_ROW_LIMIT);
      truncated = true;
    }

    return {
      columns: lastResult.columns || [],
      values,
      rowCount: totalRows,
      executionTimeMs: execTime,
      truncated,
    };
  } catch (err: any) {
    const execTime = Math.round(performance.now() - startTime);
    return {
      columns: [],
      values: [],
      error: formatSqlError(err?.message || String(err)),
      rowCount: 0,
      executionTimeMs: execTime,
    };
  } finally {
    if (localDb) {
      try {
        localDb.close();
      } catch {}
    }
  }
}

function formatSqlError(raw: string): string {
  if (raw.includes('no such table')) {
    const tbl = raw.split('no such table:')[1]?.trim() || '';
    return `Table "${tbl}" does not exist. Check table name spelling and schema tables.`;
  }
  if (raw.includes('no such column')) {
    const col = raw.split('no such column:')[1]?.trim() || '';
    return `Column "${col}" not found. Verify column names in the schema.`;
  }
  if (raw.includes('syntax error')) {
    return `Syntax error: ${raw}. Check your keywords, commas, and parentheses.`;
  }
  if (raw.includes('misuse of aggregate function')) {
    return 'Aggregate functions (COUNT, SUM, AVG) cannot appear in WHERE clause; use HAVING instead.';
  }
  return raw;
}

function normalizeVal(v: any): string {
  if (v === null || v === undefined) return '__NULL__';
  if (typeof v === 'number') {
    return Number.isInteger(v) ? String(v) : v.toFixed(4);
  }
  return String(v).trim().toLowerCase();
}

function validate(schemaSql: string, userSql: string, solutionSql: string): ValidationResult {
  const userResult = runQueryOnFreshDb(schemaSql, userSql);
  if (userResult.error) {
    return {
      passed: false,
      message: 'Query Execution Error',
      mismatchReason: userResult.error,
      userResult,
    };
  }

  const expectedResult = runQueryOnFreshDb(schemaSql, solutionSql);
  if (expectedResult.error) {
    return {
      passed: false,
      message: 'Benchmark Solution Error',
      mismatchReason: `Internal error in benchmark query: ${expectedResult.error}`,
      userResult,
      expectedResult,
    };
  }

  // 1. Column count check
  if (userResult.columns.length !== expectedResult.columns.length) {
    return {
      passed: false,
      message: 'Column Count Mismatch',
      mismatchReason: `Expected ${expectedResult.columns.length} column(s) (${expectedResult.columns.join(', ')}), but your query returned ${userResult.columns.length} column(s) (${userResult.columns.join(', ')}).`,
      userResult,
      expectedResult,
    };
  }

  // 2. Row count check
  if (userResult.rowCount !== expectedResult.rowCount) {
    return {
      passed: false,
      message: 'Row Count Mismatch',
      mismatchReason: `Expected ${expectedResult.rowCount} row(s), but your query returned ${userResult.rowCount} row(s). Check your WHERE, JOIN, or GROUP BY filtering conditions.`,
      userResult,
      expectedResult,
    };
  }

  // 3. Values check
  const hasOrderBy = solutionSql.toUpperCase().includes('ORDER BY');
  if (hasOrderBy) {
    for (let r = 0; r < expectedResult.values.length; r++) {
      for (let c = 0; c < expectedResult.columns.length; c++) {
        const uVal = normalizeVal(userResult.values[r]?.[c]);
        const eVal = normalizeVal(expectedResult.values[r]?.[c]);
        if (uVal !== eVal) {
          return {
            passed: false,
            message: 'Value / Order Mismatch at Row ' + (r + 1),
            mismatchReason: `Row ${r + 1}, column "${expectedResult.columns[c]}": Expected "${expectedResult.values[r]?.[c]}", but received "${userResult.values[r]?.[c]}". Ensure your ORDER BY clause matches specifications.`,
            userResult,
            expectedResult,
          };
        }
      }
    }
  } else {
    // Unordered comparison: serialize rows
    const serializeRow = (row: any[]) => row.map(normalizeVal).join(':::');
    const userRows = (userResult.values || []).map(serializeRow).sort();
    const expRows = (expectedResult.values || []).map(serializeRow).sort();

    for (let i = 0; i < expRows.length; i++) {
      if (userRows[i] !== expRows[i]) {
        return {
          passed: false,
          message: 'Output Data Mismatch',
          mismatchReason: 'The output rows do not match the expected dataset. Verify your filtering or join logic.',
          userResult,
          expectedResult,
        };
      }
    }
  }

  return {
    passed: true,
    message: 'All Test Cases Passed! Excellent SQL mastery.',
    userResult,
    expectedResult,
  };
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  try {
    await getEngine();

    if (req.type === 'init') {
      self.postMessage({ id: req.id, type: 'init', success: true } as WorkerResponse);
      return;
    }

    if (req.type === 'execute') {
      const result = runQueryOnFreshDb(req.schemaSql || '', req.userSql || '');
      self.postMessage({
        id: req.id,
        type: 'execute',
        success: !result.error,
        result,
      } as WorkerResponse);
      return;
    }

    if (req.type === 'validate') {
      const validation = validate(
        req.schemaSql || '',
        req.userSql || '',
        req.solutionSql || ''
      );
      self.postMessage({
        id: req.id,
        type: 'validate',
        success: validation.passed,
        validation,
      } as WorkerResponse);
      return;
    }
  } catch (err: any) {
    self.postMessage({
      id: req.id,
      type: req.type,
      success: false,
      error: err?.message || String(err),
    } as WorkerResponse);
  }
};
