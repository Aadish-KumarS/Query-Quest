"use client";

import React, { useState } from "react";
import { DatasetMeta } from "@/lib/datasets";
import { Key, Link as LinkIcon, Database, ChevronDown, ChevronRight, Table as TableIcon, Copy, Play } from "lucide-react";

interface SchemaExplorerProps {
  dataset: DatasetMeta;
  onInsertSql?: (sql: string) => void;
}

export function SchemaExplorer({ dataset, onInsertSql }: SchemaExplorerProps) {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [dataset.tables[0]?.name || ""]: true,
    [dataset.tables[1]?.name || ""]: true,
  });
  const [copiedCol, setCopiedCol] = useState<string | null>(null);

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const copyColumn = (colName: string) => {
    navigator.clipboard.writeText(colName);
    setCopiedCol(colName);
    setTimeout(() => setCopiedCol(null), 1200);
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-border-subtle bg-bg-card shadow-subtle overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-secondary px-3 py-2">
        <div className="flex items-center gap-1.5 font-semibold text-text-primary">
          <Database className="h-4 w-4 text-accent-gold" />
          <span>Schema: {dataset.name}</span>
        </div>
        <span className="rounded bg-bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted border border-border-subtle">
          {dataset.tables.length} tables
        </span>
      </div>

      {/* Tables Accordion */}
      <div className="flex-1 overflow-y-auto divide-y divide-border-subtle p-1">
        {dataset.tables.map((table) => {
          const isExpanded = !!expandedTables[table.name];
          return (
            <div key={table.name} className="py-1">
              {/* Table Bar */}
              <div
                onClick={() => toggleTable(table.name)}
                className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-bg-hover cursor-pointer transition-colors group select-none"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  )}
                  <TableIcon className="h-3.5 w-3.5 text-accent-cyan" />
                  <span className="font-mono font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                    {table.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {onInsertSql && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInsertSql(`SELECT * FROM ${table.name} LIMIT 10;`);
                      }}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 rounded bg-bg-surface px-1.5 py-0.5 text-[10px] text-text-secondary hover:text-accent-gold border border-border-subtle transition-all"
                      title={`Preview ${table.name}`}
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>Preview</span>
                    </button>
                  )}
                  <span className="text-[10px] text-text-muted font-mono">
                    {table.columns.length} cols
                  </span>
                </div>
              </div>

              {/* Columns List */}
              {isExpanded && (
                <div className="ml-5 mt-1 mb-2 space-y-1 border-l-2 border-border-subtle pl-2.5">
                  <p className="text-[10px] text-text-muted italic mb-1.5">{table.description}</p>
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      onClick={() => copyColumn(col.name)}
                      className="group flex items-center justify-between rounded px-1.5 py-0.5 hover:bg-bg-hover cursor-pointer transition-colors"
                      title={`${col.description || col.name} (Click to copy name)`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        {col.isPrimary && (
                          <span title="Primary Key">
                            <Key className="h-3 w-3 text-accent-gold shrink-0" />
                          </span>
                        )}
                        {col.isForeign && (
                          <span title={`Foreign Key: ${col.references}`}>
                            <LinkIcon className="h-3 w-3 text-accent-orange shrink-0" />
                          </span>
                        )}
                        {!col.isPrimary && !col.isForeign && (
                          <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 shrink-0"></span>
                        )}
                        <span className="text-text-primary group-hover:text-accent-gold">
                          {col.name}
                        </span>
                        {copiedCol === col.name && (
                          <span className="text-[9px] text-status-success font-sans">copied!</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted">
                        {col.references && (
                          <span className="text-[9px] text-accent-orange/80">
                            → {col.references}
                          </span>
                        )}
                        <span className="rounded bg-bg-surface px-1 text-[9px] text-text-secondary border border-border-subtle">
                          {col.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
