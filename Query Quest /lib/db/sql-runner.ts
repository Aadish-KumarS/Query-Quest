import { QueryResult, ValidationOutcome, validateQueryOutput, ValidationRule } from "../validator";
import { defaultDataset } from "../datasets";

export interface SchemaColumn {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: any;
  pk: boolean;
}

export interface SchemaForeignKey {
  from: string;
  table: string;
  to: string;
}

export interface SchemaTable {
  name: string;
  rowCount: number;
  columns: SchemaColumn[];
  foreignKeys: SchemaForeignKey[];
}

type MessageCallback = (data: any) => void;

class SqlEngine {
  private worker: Worker | null = null;
  private pendingCallbacks: Map<string, { resolve: (val: any) => void; reject: (err: any) => void }> = new Map();
  private reqCounter = 0;
  private readyPromise: Promise<void> | null = null;
  private currentDatasetId = "ecommerce";
  private initializedDatasets = new Set<string>();

  constructor() {
    // Lazy initialized on first client call
  }

  public async init(): Promise<void> {
    if (typeof window === "undefined") return;
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = new Promise((resolve, reject) => {
      try {
        this.worker = new Worker("/sql-worker.js");

        this.worker.onmessage = (e: MessageEvent) => {
          const { id, type, payload, error } = e.data;

          if (type === "READY") {
            // Preload default dataset
            this.loadDataset(defaultDataset.id, defaultDataset.sql)
              .then(() => resolve())
              .catch((err) => reject(err));
            return;
          }

          if (id && this.pendingCallbacks.has(id)) {
            const { resolve: cbResolve, reject: cbReject } = this.pendingCallbacks.get(id)!;
            this.pendingCallbacks.delete(id);

            if (type === "ERROR" || type === "VALIDATION_ERROR") {
              cbReject(new Error(error || payload?.rawError || "SQL execution failed"));
            } else {
              cbResolve(payload);
            }
          }
        };

        this.worker.onerror = (err) => {
          console.error("SQL Worker error:", err);
          reject(err);
        };
      } catch (err) {
        console.error("Failed to construct SQL worker:", err);
        reject(err);
      }
    });

    return this.readyPromise;
  }

  private postRequest<T>(type: string, payload?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        return reject(new Error("SQL engine is not initialized"));
      }

      const id = `req_${++this.reqCounter}_${Date.now()}`;
      this.pendingCallbacks.set(id, { resolve, reject });

      // Safety timeout after 15 seconds
      setTimeout(() => {
        if (this.pendingCallbacks.has(id)) {
          this.pendingCallbacks.delete(id);
          reject(new Error("Query execution timed out after 15 seconds."));
        }
      }, 15000);

      this.worker.postMessage({ id, type, payload });
    });
  }

  public async loadDataset(datasetId: string, sql: string): Promise<void> {
    await this.init();
    if (this.initializedDatasets.has(datasetId)) {
      this.currentDatasetId = datasetId;
      return;
    }
    await this.postRequest("INIT_DATASET", { datasetId, sql });
    this.initializedDatasets.add(datasetId);
    this.currentDatasetId = datasetId;
  }

  public async resetDatabase(datasetId?: string): Promise<void> {
    await this.init();
    const target = datasetId || this.currentDatasetId;
    await this.postRequest("RESET_DATABASE", { datasetId: target });
  }

  public async runQuery(
    sql: string,
    options: { useEphemeral?: boolean; datasetId?: string } = {}
  ): Promise<QueryResult> {
    await this.init();
    const datasetId = options.datasetId || this.currentDatasetId;
    return this.postRequest<QueryResult>("RUN_QUERY", {
      sql,
      useEphemeral: options.useEphemeral ?? false,
      datasetId,
    });
  }

  public async validateExercise(
    userSql: string,
    referenceSql: string,
    rules: ValidationRule = {},
    datasetId?: string
  ): Promise<{
    userResult: QueryResult;
    expectedResult: QueryResult;
    validation: ValidationOutcome;
  }> {
    await this.init();
    const targetDataset = datasetId || this.currentDatasetId;

    const res = await this.postRequest<{
      userResult: QueryResult;
      expectedResult: QueryResult;
      rules: ValidationRule;
    }>("VALIDATE_EXERCISE", {
      userSql,
      referenceSql,
      rules,
      datasetId: targetDataset,
    });

    const validation = validateQueryOutput(res.userResult, res.expectedResult, rules);

    return {
      userResult: res.userResult,
      expectedResult: res.expectedResult,
      validation,
    };
  }

  public async getSchema(): Promise<SchemaTable[]> {
    await this.init();
    return this.postRequest<SchemaTable[]>("GET_SCHEMA");
  }

  public getCurrentDatasetId(): string {
    return this.currentDatasetId;
  }
}

// Global singleton instance for the browser
export const sqlEngine = new SqlEngine();
