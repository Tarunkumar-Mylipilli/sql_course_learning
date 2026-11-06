// SQL Execution Engine for In-Browser Interactive Learning
// Uses sql.js WebAssembly SQLite engine with fallback error handling

export interface QueryResult {
  columns: string[];
  values: any[][];
  error?: string;
  rowCount: number;
  executionTimeMs: number;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
  mismatchReason?: string;
}

let sqlJsModule: any = null;
let sqlJsLoadingPromise: Promise<any> | null = null;

// Dynamically load sql.js in the browser
export async function getSqlEngine(): Promise<any> {
  if (sqlJsModule) return sqlJsModule;
  if (sqlJsLoadingPromise) return sqlJsLoadingPromise;

  sqlJsLoadingPromise = (async () => {
    try {
      // First check if window.initSqlJs is already loaded via CDN script
      if (typeof window !== 'undefined' && (window as any).initSqlJs) {
        sqlJsModule = await (window as any).initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
        });
        return sqlJsModule;
      }

      // Try importing from node_modules or CDN
      try {
        const initSqlJs = (await import('sql.js')).default;
        sqlJsModule = await initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
        });
        return sqlJsModule;
      } catch (importErr) {
        // Fallback: inject script tag
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load sql-wasm.js from CDN'));
          document.head.appendChild(script);
        });

        if ((window as any).initSqlJs) {
          sqlJsModule = await (window as any).initSqlJs({
            locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
          });
          return sqlJsModule;
        }
      }
    } catch (err) {
      console.error('SQL Engine init error:', err);
    }
    return null;
  })();

  return sqlJsLoadingPromise;
}

// Execute query against schema in an isolated in-memory SQLite database
export async function executeQuery(schemaSql: string, userSql: string): Promise<QueryResult> {
  const startTime = performance.now();
  const SQL = await getSqlEngine();

  if (!SQL) {
    return {
      columns: [],
      values: [],
      error: 'SQL engine is initializing or failed to load WebAssembly. Please refresh or check connection.',
      rowCount: 0,
      executionTimeMs: 0,
    };
  }

  let db: any = null;
  try {
    db = new SQL.Database();

    // 1. Initialize schema and sample seed rows
    if (schemaSql && schemaSql.trim()) {
      db.run(schemaSql);
    }

    // Clean user SQL (remove trailing comments or spaces)
    const trimmedSql = userSql.trim();
    if (!trimmedSql) {
      return {
        columns: [],
        values: [],
        error: 'Please enter a SQL query to execute.',
        rowCount: 0,
        executionTimeMs: 0,
      };
    }

    // 2. Execute user query
    const results = db.exec(trimmedSql);
    const endTime = performance.now();

    if (!results || results.length === 0) {
      // May be an INSERT/UPDATE or query returning 0 rows
      return {
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs: Math.round(endTime - startTime),
      };
    }

    const firstResult = results[0];
    return {
      columns: firstResult.columns || [],
      values: firstResult.values || [],
      rowCount: firstResult.values?.length || 0,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      columns: [],
      values: [],
      error: err?.message || String(err),
      rowCount: 0,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } finally {
    if (db) {
      try {
        db.close();
      } catch (_) {}
    }
  }
}

// Compare user query result against expected solution
export async function validateSolution(
  schemaSql: string,
  userSql: string,
  solutionSql: string,
  expectedColumns?: string[]
): Promise<ValidationResult> {
  // Execute user SQL
  const userResult = await executeQuery(schemaSql, userSql);
  if (userResult.error) {
    return {
      passed: false,
      message: `Execution Error: ${userResult.error}`,
      userResult,
      mismatchReason: userResult.error,
    };
  }

  // Execute expected solution SQL
  const expectedResult = await executeQuery(schemaSql, solutionSql);
  if (expectedResult.error) {
    return {
      passed: false,
      message: `System Benchmark Error: ${expectedResult.error}`,
      userResult,
      expectedResult,
      mismatchReason: 'Internal benchmark error.',
    };
  }

  // 1. Column count verification
  if (userResult.columns.length !== expectedResult.columns.length) {
    const msg = `Column mismatch: Expected ${expectedResult.columns.length} columns (${expectedResult.columns.join(
      ', '
    )}), but your query returned ${userResult.columns.length} columns (${userResult.columns.join(', ')}).`;
    return {
      passed: false,
      message: msg,
      userResult,
      expectedResult,
      mismatchReason: msg,
    };
  }

  // 2. Row count verification
  if (userResult.rowCount !== expectedResult.rowCount) {
    const msg = `Row count mismatch: Expected ${expectedResult.rowCount} rows, but your query returned ${userResult.rowCount} rows.`;
    return {
      passed: false,
      message: msg,
      userResult,
      expectedResult,
      mismatchReason: msg,
    };
  }

  // 3. Normalize and compare row values
  const stringifyRow = (row: any[]) =>
    row
      .map((val) => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return Number(val.toFixed(4)).toString();
        return String(val).trim().toLowerCase();
      })
      .join(' | ');

  const userRowsStr = userResult.values.map(stringifyRow);
  const expectedRowsStr = expectedResult.values.map(stringifyRow);

  // Check if ORDER BY is tested in the solution
  const hasOrderBy = solutionSql.toUpperCase().includes('ORDER BY');

  if (hasOrderBy) {
    for (let i = 0; i < expectedRowsStr.length; i++) {
      if (userRowsStr[i] !== expectedRowsStr[i]) {
        const msg = `Value mismatch at row ${i + 1}:\nExpected: [${expectedResult.values[i].join(
          ', '
        )}]\nReceived: [${userResult.values[i].join(', ')}]`;
        return {
          passed: false,
          message: msg,
          userResult,
          expectedResult,
          mismatchReason: msg,
        };
      }
    }
  } else {
    // Sort rows for comparison if order doesn't matter
    const sortedUser = [...userRowsStr].sort();
    const sortedExpected = [...expectedRowsStr].sort();

    for (let i = 0; i < sortedExpected.length; i++) {
      if (sortedUser[i] !== sortedExpected[i]) {
        const msg = `Output data mismatch. Check your filter conditions or calculations.`;
        return {
          passed: false,
          message: msg,
          userResult,
          expectedResult,
          mismatchReason: msg,
        };
      }
    }
  }

  return {
    passed: true,
    message: '🎉 Outstanding! All test cases passed successfully.',
    userResult,
    expectedResult,
  };
}
