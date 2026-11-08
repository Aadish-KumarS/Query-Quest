"use client";

import React, { useState, useEffect } from "react";
import { allDatasets, getDataset, DatasetMeta } from "@/lib/datasets";
import { sqlEngine } from "@/lib/db/sql-runner";
import { diagnoseSqlError, ErrorDiagnosis } from "@/lib/db/error-helper";
import { QueryResult } from "@/lib/validator";
import { SqlEditor } from "@/components/SqlEditor";
import { ResultTable } from "@/components/ResultTable";
import { SchemaExplorer } from "@/components/SchemaExplorer";
import {
  Database,
  RotateCcw,
  Sparkles,
  BookOpen,
  Info,
  Terminal,
  Play,
  Layers,
} from "lucide-react";

export default function SandboxPage() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("ecommerce");
  const [activeDataset, setActiveDataset] = useState<DatasetMeta>(getDataset("ecommerce"));

  const [sql, setSql] = useState<string>(
    "-- Free SQL Playground\n-- Select any dataset and run arbitrary SQLite queries\nSELECT * FROM customers LIMIT 10;"
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<ErrorDiagnosis | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"results" | "schema">("results");

  // Switch dataset
  const handleDatasetChange = async (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    const ds = getDataset(datasetId);
    setActiveDataset(ds);
    setQueryResult(null);
    setQueryError(null);
    setRawError(null);

    try {
      await sqlEngine.loadDataset(ds.id, ds.sql);
      const defaultSample = ds.sampleQueries[0]?.sql || `SELECT * FROM ${ds.tables[0]?.name} LIMIT 10;`;
      setSql(defaultSample);
    } catch (e) {
      console.error("Failed to load dataset in sandbox:", e);
    }
  };

  const handleRunQuery = async () => {
    if (!sql.trim()) return;
    setIsRunning(true);
    setQueryError(null);
    setRawError(null);
    setActiveTab("results");

    try {
      const res = await sqlEngine.runQuery(sql, { datasetId: activeDataset.id });
      setQueryResult(res);
      setHistory((prev) => [sql, ...prev.slice(0, 19)]);
    } catch (err: any) {
      const msg = err?.message || "Execution failed";
      setRawError(msg);
      const diag = diagnoseSqlError(msg, sql);
      setQueryError(diag);
      setQueryResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetDb = async () => {
    try {
      await sqlEngine.resetDatabase(activeDataset.id);
      setQueryResult(null);
      setQueryError(null);
      setRawError(null);
    } catch (e) {
      console.error("Reset sandbox DB failed:", e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-61px)] overflow-hidden bg-bg-primary text-text-primary">
      {/* Sandbox Sub-header */}
      <div className="flex flex-wrap items-center justify-between border-b border-border-subtle bg-bg-secondary px-4 py-2.5 text-xs gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-text-primary">
            <Database className="h-4 w-4 text-accent-gold" />
            <span>Interactive SQL Sandbox</span>
          </div>

          {/* Dataset selector */}
          <div className="flex items-center gap-1 rounded bg-bg-surface p-0.5 border border-border-subtle">
            {Object.values(allDatasets).map((ds) => (
              <button
                key={ds.id}
                onClick={() => handleDatasetChange(ds.id)}
                className={`rounded px-2.5 py-1 text-xs font-mono transition-colors ${
                  activeDataset.id === ds.id
                    ? "bg-accent-gold text-bg-primary font-bold shadow-glow-gold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {ds.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Informational notice */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-text-muted font-sans">
          <Info className="h-3.5 w-3.5 text-text-muted" />
          <span>Running in-browser SQLite WebAssembly. DDL & DML statements supported.</span>
        </div>
      </div>

      {/* Main Sandbox Layout: Editor + Output on left, Schema + Examples on right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Editor & Result Table */}
        <div className="lg:col-span-8 flex flex-col h-full border-r border-border-subtle overflow-hidden">
          {/* Top Half: Editor */}
          <div className="flex-1 min-h-[220px] max-h-[50%] p-3 overflow-hidden">
            <SqlEditor
              value={sql}
              onChange={setSql}
              onRun={handleRunQuery}
              onResetDb={handleResetDb}
              isRunning={isRunning}
              history={history}
              placeholder={`Write any SQLite query against ${activeDataset.name}...`}
            />
          </div>

          {/* Bottom Half: Result Table */}
          <div className="flex-1 border-t border-border-subtle overflow-y-auto p-3 bg-bg-surface/30">
            <ResultTable
              result={queryResult}
              error={queryError}
              rawError={rawError}
              isLoading={isRunning}
            />
          </div>
        </div>

        {/* Right Column: Schema Explorer & Sample Queries */}
        <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto p-4 space-y-4 bg-bg-card">
          {/* Dataset metadata box */}
          <div className="rounded-lg border border-border-subtle bg-bg-surface p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-text-primary text-sm">
                {activeDataset.name}
              </span>
              <span className="rounded bg-bg-card px-1.5 py-0.5 text-[10px] font-mono text-accent-gold border border-border-subtle">
                {activeDataset.badge}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed font-sans text-[11px]">
              {activeDataset.description}
            </p>
          </div>

          {/* Sample Queries */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
              <span>Sample Queries</span>
            </div>

            <div className="space-y-2">
              {activeDataset.sampleQueries.map((sq, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-subtle bg-bg-surface p-2.5 text-xs space-y-1 hover:border-border-strong transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-primary">{sq.title}</span>
                    <button
                      onClick={() => setSql(sq.sql)}
                      className="text-[10px] font-mono text-accent-gold hover:underline flex items-center gap-0.5"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>Load</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted font-sans">{sq.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Schema Explorer */}
          <div className="flex-1 min-h-[300px]">
            <SchemaExplorer
              dataset={activeDataset}
              onInsertSql={(s) => setSql(s)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
