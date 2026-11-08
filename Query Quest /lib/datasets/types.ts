export interface TableSchema {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    nullable?: boolean;
    description: string;
  }[];
}

export interface DatasetMeta {
  id: string;
  name: string;
  badge: string;
  description: string;
  tableCount: number;
  tables: TableSchema[];
  sql: string;
  sampleQueries: {
    title: string;
    description: string;
    sql: string;
  }[];
}
