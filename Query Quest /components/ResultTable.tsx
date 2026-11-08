"use client";

import React, { useState } from "react";
import { QueryResult } from "@/lib/validator";
import { ErrorDiagnosis } from "@/lib/db/error-helper";
import { AlertCircle, HelpCircle, CheckCircle2, Table, Clock, Rows } from "lucide-react";

interface ResultTableProps {
  result: QueryResult | null;
  error: ErrorDiagnosis | null;
  rawError?: string | null;
  isLoading?: boolean;
}

export function ResultTable({ result, error, rawError, isLoading = false }: ResultTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  if (isLoading) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-border-subtle bg-bg-surface p-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-gold border-t-transparent mb-3" />
        <p className="text-xs font-mono text-text-secondary">Executing in SQLite WebAssembly...</p>
      </div>
    );
  }

  // Error State with Diagnostic Help Layer
  if (error || rawError) {
    return (
      <div className="rounded-lg border border-status-error/40 bg-status-error/10 p-4 text-xs font-sans">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-status-error shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-status-error uppercase tracking-wider text-[11px]">
                {error?.category || "SQLite Error"}
              </span>
            </div>

            <p className="font-mono text-text-primary text-[12px] bg-bg-primary/50 p-2 rounded border border-status-error/20">
              {rawError || error?.friendlyMessage}
            </p>

            {error?.hint && (
              <div className="flex items-start gap-2 rounded bg-bg-surface/80 p-2 text-text-secondary border border-border-subtle">
                <HelpCircle className="h-4 w-4 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-primary">Suggestion: </span>
                  {error.hint}
                </div>
              </div>
            )}

            {error?.exampleFix && (
              <div className="rounded bg-bg-primary/80 p-2 font-mono text-[11px] text-accent-gold border border-border-subtle">
                <span className="text-text-muted">Example pattern: </span>
                {error.exampleFix}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No Query Run Yet State
  if (!result) {
    return (
      <div className="flex h-44 flex-col items-center justify-center rounded-lg border border-dashed border-border-subtle bg-bg-card/50 p-6 text-center text-text-muted">
        <Table className="h-8 w-8 stroke-1 text-border-strong mb-2" />
        <p className="text-xs font-medium text-text-secondary">Query output will appear here</p>
        <p className="text-[11px] text-text-muted mt-1">
          Write SQL above and press <kbd className="rounded bg-bg-surface px-1 py-0.5 text-[10px] text-text-secondary">⌘+Enter</kbd>
        </p>
      </div>
    );
  }

  // Empty Results (0 rows)
  if (result.columns.length === 0 || result.rowCount === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-border-subtle bg-bg-surface p-4 text-center">
        <Rows className="h-6 w-6 text-text-muted mb-1" />
        <p className="text-xs font-semibold text-text-primary">Query executed with zero rows returned</p>
        <p className="text-[11px] text-text-muted mt-0.5">
          Execution time: {result.executionTimeMs ?? 0}ms
        </p>
      </div>
    );
  }

  // Paginated Results
  const totalPages = Math.ceil(result.values.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentRows = result.values.slice(startIdx, startIdx + pageSize);

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-bg-surface shadow-subtle overflow-hidden text-xs">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-secondary px-3 py-1.5 text-[11px] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-text-secondary font-medium">
            <Rows className="h-3.5 w-3.5 text-accent-gold" />
            {result.rowCount} {result.rowCount === 1 ? "row" : "rows"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {result.executionTimeMs ?? 0}ms
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded px-1.5 py-0.5 text-text-secondary hover:bg-bg-hover disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded px-1.5 py-0.5 text-text-secondary hover:bg-bg-hover disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[320px]">
        <table className="w-full border-collapse text-left font-mono text-[11px]">
          <thead className="sticky top-0 bg-bg-card border-b border-border-strong text-text-secondary select-none">
            <tr>
              <th className="w-10 px-2 py-2 text-center text-[10px] text-text-muted border-r border-border-subtle">
                #
              </th>
              {result.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 font-semibold text-text-primary border-r border-border-subtle last:border-r-0 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {currentRows.map((row, rIdx) => {
              const rowNumber = startIdx + rIdx + 1;
              return (
                <tr
                  key={rIdx}
                  className="hover:bg-bg-hover/60 transition-colors odd:bg-bg-surface even:bg-bg-card/40"
                >
                  <td className="px-2 py-1.5 text-center text-[10px] text-text-muted border-r border-border-subtle">
                    {rowNumber}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3 py-1.5 border-r border-border-subtle last:border-r-0 whitespace-nowrap ${
                        cell === null
                          ? "text-text-muted italic"
                          : typeof cell === "number"
                          ? "text-right font-medium text-accent-cyan"
                          : "text-text-primary"
                      }`}
                    >
                      {cell === null ? (
                        <span className="rounded bg-bg-primary px-1 py-0.5 text-[10px] font-sans font-semibold text-amber-500/80">
                          NULL
                        </span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
