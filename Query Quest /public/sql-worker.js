/* eslint-disable no-undef */
importScripts('/sql-wasm.js');

let SQL = null;
let currentDb = null;
let snapshots = {}; // datasetId -> Uint8Array
let currentDatasetId = 'ecommerce';

// Initialize sql.js WebAssembly
initSqlJs({
  locateFile: (file) => '/' + file,
}).then((sqlModule) => {
  SQL = sqlModule;
  postMessage({ type: 'READY' });
}).catch((err) => {
  postMessage({ type: 'ERROR', error: err.message || 'Failed to initialize SQLite WebAssembly' });
});

function executeSql(db, sql) {
  const startTime = performance.now();
  const results = db.exec(sql);
  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  if (!results || results.length === 0) {
    return {
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs,
    };
  }

  const lastResult = results[results.length - 1];
  return {
    columns: lastResult.columns,
    values: lastResult.values,
    rowCount: lastResult.values.length,
    executionTimeMs,
  };
}

onmessage = function (e) {
  const { id, type, payload } = e.data;

  if (!SQL && type !== 'PING') {
    postMessage({ id, type: 'ERROR', error: 'SQLite engine is still loading...' });
    return;
  }

  try {
    switch (type) {
      case 'INIT_DATASET': {
        const { datasetId, sql } = payload;
        currentDatasetId = datasetId;
        const newDb = new SQL.Database();
        newDb.run(sql);
        const snapshot = newDb.export();
        snapshots[datasetId] = snapshot;
        currentDb = newDb;

        postMessage({
          id,
          type: 'DATASET_INITIALIZED',
          payload: { datasetId },
        });
        break;
      }

      case 'RESET_DATABASE': {
        const datasetId = payload?.datasetId || currentDatasetId;
        if (snapshots[datasetId]) {
          currentDb = new SQL.Database(snapshots[datasetId]);
          postMessage({
            id,
            type: 'DATABASE_RESET',
            payload: { datasetId },
          });
        } else {
          postMessage({ id, type: 'ERROR', error: 'No snapshot available to reset.' });
        }
        break;
      }

      case 'RUN_QUERY': {
        const { sql, useEphemeral = false, datasetId = currentDatasetId } = payload;
        let dbToUse = currentDb;

        if (useEphemeral) {
          if (snapshots[datasetId]) {
            dbToUse = new SQL.Database(snapshots[datasetId]);
          } else {
            throw new Error(`Dataset snapshot ${datasetId} not found`);
          }
        }

        const result = executeSql(dbToUse, sql);
        postMessage({
          id,
          type: 'QUERY_RESULT',
          payload: result,
        });
        break;
      }

      case 'VALIDATE_EXERCISE': {
        const { userSql, referenceSql, rules = {}, datasetId = currentDatasetId } = payload;

        if (!snapshots[datasetId]) {
          throw new Error(`Dataset snapshot ${datasetId} is missing.`);
        }

        // Ephemeral copy for learner
        const userDb = new SQL.Database(snapshots[datasetId]);
        let userResult;
        try {
          userResult = executeSql(userDb, userSql);
        } catch (err) {
          postMessage({
            id,
            type: 'VALIDATION_ERROR',
            payload: {
              rawError: err.message,
              isRuntimeError: true,
            },
          });
          return;
        }

        // Ephemeral copy for reference
        const refDb = new SQL.Database(snapshots[datasetId]);
        const refResult = executeSql(refDb, referenceSql);

        postMessage({
          id,
          type: 'VALIDATION_COMPLETE',
          payload: {
            userResult,
            expectedResult: refResult,
            rules,
          },
        });
        break;
      }

      case 'GET_SCHEMA': {
        if (!currentDb) {
          postMessage({ id, type: 'SCHEMA_RESULT', payload: [] });
          return;
        }

        const tablesRes = currentDb.exec(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
        );

        if (!tablesRes || tablesRes.length === 0) {
          postMessage({ id, type: 'SCHEMA_RESULT', payload: [] });
          return;
        }

        const tableNames = tablesRes[0].values.map((row) => row[0]);
        const schema = tableNames.map((tableName) => {
          const infoRes = currentDb.exec(`PRAGMA table_info("${tableName}");`);
          const fkRes = currentDb.exec(`PRAGMA foreign_key_list("${tableName}");`);
          const countRes = currentDb.exec(`SELECT COUNT(*) FROM "${tableName}";`);

          const columns = infoRes && infoRes.length > 0 ? infoRes[0].values.map((col) => ({
            cid: col[0],
            name: col[1],
            type: col[2],
            notnull: col[3] === 1,
            dflt_value: col[4],
            pk: col[5] === 1,
          })) : [];

          const foreignKeys = fkRes && fkRes.length > 0 ? fkRes[0].values.map((fk) => ({
            from: fk[3],
            table: fk[2],
            to: fk[4],
          })) : [];

          const rowCount = countRes && countRes.length > 0 ? countRes[0].values[0][0] : 0;

          return {
            name: tableName,
            columns,
            foreignKeys,
            rowCount,
          };
        });

        postMessage({
          id,
          type: 'SCHEMA_RESULT',
          payload: schema,
        });
        break;
      }

      default:
        postMessage({ id, type: 'ERROR', error: `Unknown message type: ${type}` });
    }
  } catch (error) {
    postMessage({
      id,
      type: 'ERROR',
      error: error.message || 'An unexpected SQL error occurred',
    });
  }
};
