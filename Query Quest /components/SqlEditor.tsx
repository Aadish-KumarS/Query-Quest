"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Trash2, History, Copy, Check, Sparkles } from "lucide-react";

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onResetDb: () => void;
  isRunning?: boolean;
  history?: string[];
  placeholder?: string;
}

export function SqlEditor({
  value,
  onChange,
  onRun,
  onResetDb,
  isRunning = false,
  history = [],
  placeholder = "Write your SQL query here...",
}: SqlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Line numbers calculation
  const lineCount = Math.max(1, value.split("\n").length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Handle Tab key for 2 spaces and Cmd/Ctrl + Enter to run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Restore cursor position after state updates
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatSimpleSql = () => {
    // Basic automatic SQL clean up: standardize spacing & newlines after major keywords
    let formatted = value
      .replace(/\s+/g, " ")
      .replace(/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|LEFT JOIN|INNER JOIN|WITH)\b/gi, "\n$1")
      .trim();
    if (formatted) onChange(formatted);
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-border-subtle bg-editor-bg shadow-elevated overflow-hidden font-mono text-sm">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-bg-surface px-3 py-2 text-xs">
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="flex h-2 w-2 rounded-full bg-status-success animate-pulse"></span>
          <span className="font-semibold text-text-primary">SQL Editor</span>
          <span className="text-text-muted hidden sm:inline">
            (Press <kbd className="rounded bg-bg-primary px-1 py-0.5 font-mono text-[10px] text-text-secondary border border-border-subtle">⌘+Enter</kbd> to run)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Format button */}
          <button
            onClick={formatSimpleSql}
            className="flex items-center gap-1 rounded px-2 py-1 text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
            title="Clean formatting"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
            title="Copy query"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-status-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          {/* Clear button */}
          <button
            onClick={() => onChange("")}
            className="flex items-center gap-1 rounded px-2 py-1 text-text-muted hover:bg-bg-hover hover:text-status-error transition-colors"
            title="Clear editor"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* History button */}
          {history.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 rounded px-2 py-1 text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
                title="Lesson query history"
              >
                <History className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold text-accent-gold">({history.length})</span>
              </button>

              {showHistory && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowHistory(false)} />
                  <div className="absolute right-0 mt-1 w-80 max-h-60 overflow-y-auto rounded-lg border border-border-strong bg-bg-card p-2 shadow-elevated z-40">
                    <div className="mb-2 text-[11px] font-semibold text-text-muted uppercase">Query History</div>
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onChange(h);
                          setShowHistory(false);
                        }}
                        className="block w-full text-left truncate rounded p-1.5 text-xs font-mono text-text-secondary hover:bg-bg-hover hover:text-text-primary mb-1 border border-border-subtle"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Reset DB Button */}
          <button
            onClick={onResetDb}
            className="flex items-center gap-1 rounded border border-border-subtle bg-bg-card px-2 py-1 text-[11px] text-text-secondary hover:border-amber-500/50 hover:text-amber-400 transition-colors"
            title="Restore pristine database snapshot"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset DB</span>
          </button>

          {/* Run Query Button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded bg-accent-gold px-3 py-1 font-semibold text-bg-primary shadow-glow-gold hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Play className={`h-3.5 w-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Executing..." : "Run Query"}</span>
          </button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden min-h-[180px] bg-editor-bg">
        {/* Line numbers gutter */}
        <div
          aria-hidden="true"
          className="select-none border-r border-border-subtle bg-editor-bg px-2.5 py-3 text-right text-xs text-text-muted/60"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="flex-1 w-full resize-none border-none bg-transparent p-3 text-xs leading-6 text-text-primary placeholder:text-text-muted/50 focus:outline-none font-mono"
        />
      </div>
    </div>
  );
}
