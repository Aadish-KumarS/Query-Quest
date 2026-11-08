"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chapter, LessonItem, getNextLesson, getPreviousLesson } from "@/lib/curriculum";
import { defaultDataset, getDataset } from "@/lib/datasets";
import { sqlEngine } from "@/lib/db/sql-runner";
import { diagnoseSqlError, ErrorDiagnosis } from "@/lib/db/error-helper";
import { QueryResult, ValidationOutcome } from "@/lib/validator";
import { useLearner } from "./LearnerContext";
import { SqlEditor } from "./SqlEditor";
import { ResultTable } from "./ResultTable";
import { SchemaExplorer } from "./SchemaExplorer";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Terminal,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  Database,
  Lock,
  Unlock,
} from "lucide-react";

interface LessonWorkspaceProps {
  chapter: Chapter;
  lesson: LessonItem;
}

export function LessonWorkspace({ chapter, lesson }: LessonWorkspaceProps) {
  const router = useRouter();
  const { profile, recordLessonCompletion, recordQueryAttempt } = useLearner();

  // Active tab on mobile / small screens ('learn' | 'practice' | 'mission')
  const [mobileTab, setMobileTab] = useState<"learn" | "practice" | "mission">("practice");
  const [centerTab, setCenterTab] = useState<"results" | "schema">("results");

  // Query editor state
  const [sql, setSql] = useState<string>(lesson.starterSql || "");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<ErrorDiagnosis | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationOutcome | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  // Hints state
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showSolutionExplanation, setShowSolutionExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const nextLesson = getNextLesson(lesson.id);
  const prevLesson = getPreviousLesson(lesson.id);

  // Check if this lesson was already completed previously
  useEffect(() => {
    if (profile.completedLessons[lesson.id]) {
      setIsCompleted(true);
      if (profile.completedLessons[lesson.id].sql) {
        setSql(profile.completedLessons[lesson.id].sql);
      }
    } else {
      setIsCompleted(false);
      setSql(lesson.starterSql || "");
    }
    setQueryResult(null);
    setQueryError(null);
    setRawError(null);
    setValidation(null);
    setRevealedHints([]);
    setShowSolutionExplanation(false);
  }, [lesson.id, profile.completedLessons, lesson.starterSql]);

  // Execute learner query
  const handleRunQuery = async () => {
    if (!sql.trim()) return;

    setIsRunning(true);
    setQueryError(null);
    setRawError(null);
    setCenterTab("results");

    try {
      // 1. Run validation engine comparing with referenceSql on clean ephemeral snapshots
      const res = await sqlEngine.validateExercise(
        sql,
        lesson.referenceSql,
        { requireOrdering: lesson.requireOrdering }
      );

      setQueryResult(res.userResult);
      setValidation(res.validation);

      // Record to query history
      setQueryHistory((prev) => [sql, ...prev.slice(0, 19)]);

      if (res.validation.passed) {
        setIsCompleted(true);
        recordLessonCompletion(lesson.id, sql, revealedHints.length, lesson.xpReward);
        recordQueryAttempt(lesson.id, sql, true, undefined, lesson.tags);

        // Confetti celebration for passing
        try {
          if (!profile.settings.reducedMotion) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ["#d4af37", "#f97316", "#10b981", "#3b82f6"],
            });
          }
        } catch (e) {
          // ignore confetti if unavailable
        }
      } else {
        recordQueryAttempt(lesson.id, sql, false, res.validation.feedback, lesson.tags);
      }
    } catch (err: any) {
      const errMsg = err?.message || "SQL Execution error";
      setRawError(errMsg);
      const diagnosis = diagnoseSqlError(errMsg, sql);
      setQueryError(diagnosis);
      setValidation(null);
      recordQueryAttempt(lesson.id, sql, false, errMsg, lesson.tags);
    } finally {
      setIsRunning(false);
    }
  };

  // Reset database state
  const handleResetDb = async () => {
    try {
      await sqlEngine.resetDatabase(defaultDataset.id);
      setQueryResult(null);
      setQueryError(null);
      setRawError(null);
      setValidation(null);
    } catch (e) {
      console.error("Reset DB failed:", e);
    }
  };

  const handleRevealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints((prev) => [...prev, index]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-61px)] overflow-hidden bg-bg-primary text-text-primary">
      {/* Workspace Sub-header */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-secondary px-4 py-2 text-xs">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link
            href="/learn"
            className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <Compass className="h-3.5 w-3.5 text-accent-gold" />
            <span>Curriculum</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-text-muted shrink-0" />
          <span className="text-text-secondary truncate">
            Ch {chapter.id}: {chapter.title}
          </span>
          <ChevronRight className="h-3 w-3 text-text-muted shrink-0" />
          <span className="font-semibold text-text-primary truncate">
            {lesson.order}. {lesson.title}
          </span>
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-2 shrink-0">
          {prevLesson ? (
            <Link
              href={`/learn/${prevLesson.chapterId === chapter.id ? chapter.slug : "chapter-" + prevLesson.chapterId}/${prevLesson.slug}`}
              className="flex items-center gap-1 rounded px-2 py-1 text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <span className="text-text-muted/40 flex items-center gap-1 px-2 py-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </span>
          )}

          {nextLesson && (
            <Link
              href={`/learn/${nextLesson.chapterId === chapter.id ? chapter.slug : "chapter-" + nextLesson.chapterId}/${nextLesson.slug}`}
              className="flex items-center gap-1 rounded bg-bg-surface px-2.5 py-1 text-text-primary font-medium hover:bg-bg-hover border border-border-subtle transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-3.5 w-3.5 text-accent-gold" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-border-subtle bg-bg-card text-xs font-semibold">
        <button
          onClick={() => setMobileTab("learn")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            mobileTab === "learn"
              ? "border-accent-gold text-accent-gold bg-bg-hover/50"
              : "border-transparent text-text-secondary"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>1. Learn</span>
        </button>
        <button
          onClick={() => setMobileTab("practice")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            mobileTab === "practice"
              ? "border-accent-gold text-accent-gold bg-bg-hover/50"
              : "border-transparent text-text-secondary"
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>2. Practice</span>
        </button>
        <button
          onClick={() => setMobileTab("mission")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            mobileTab === "mission"
              ? "border-accent-gold text-accent-gold bg-bg-hover/50"
              : "border-transparent text-text-secondary"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>3. Mission</span>
          {isCompleted && <CheckCircle2 className="h-3 w-3 text-status-success" />}
        </button>
      </div>

      {/* Desktop 3-Panel Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* =========================================================
            LEFT PANEL: LEARN
            ========================================================= */}
        <aside
          className={`lg:col-span-3 flex flex-col border-r border-border-subtle bg-bg-card overflow-y-auto p-4 space-y-4 ${
            mobileTab === "learn" ? "block" : "hidden lg:flex"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-accent-gold uppercase tracking-wider">
              <span>Chapter {chapter.id}</span>
              <span>•</span>
              <span>Lesson {lesson.order}</span>
            </div>
            <h1 className="font-serif text-lg font-bold text-text-primary mt-1">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="rounded bg-bg-surface px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border-subtle">
                {lesson.difficulty}
              </span>
              <span className="text-[11px] text-text-muted">
                ~{lesson.estimatedMinutes} mins
              </span>
            </div>
          </div>

          {/* Concept Explanation */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-accent-gold" />
              The Concept
            </h2>
            <p className="text-xs leading-relaxed text-text-secondary whitespace-pre-line">
              {lesson.conceptExplanation}
            </p>
          </div>

          {/* Syntax Pattern Box */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Syntax Pattern
            </h3>
            <pre className="rounded-md border border-border-strong bg-editor-bg p-2.5 font-mono text-[11px] text-accent-cyan overflow-x-auto whitespace-pre-wrap">
              {lesson.syntaxExamples}
            </pre>
          </div>

          {/* Why It Matters */}
          <div className="rounded-md border border-border-subtle bg-bg-surface/60 p-3 space-y-1 text-xs">
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
              Why This Matters in Analysis
            </div>
            <p className="text-[11px] leading-relaxed text-text-secondary">
              {lesson.whyItMatters}
            </p>
          </div>

          {/* Common Mistake */}
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 space-y-1 text-xs">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Watch Out: Common Mistake
            </div>
            <p className="text-[11px] leading-relaxed text-text-secondary">
              {lesson.commonMistakes}
            </p>
          </div>

          {/* Remember This */}
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1 text-xs">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Key Takeaway
            </div>
            <p className="text-[11px] leading-relaxed text-text-secondary font-medium">
              {lesson.rememberThis}
            </p>
          </div>
        </aside>

        {/* =========================================================
            CENTER PANEL: PRACTICE (Editor + Results + Schema)
            ========================================================= */}
        <main
          className={`lg:col-span-6 flex flex-col h-full overflow-hidden border-r border-border-subtle bg-bg-primary ${
            mobileTab === "practice" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Top Half: Code Editor */}
          <div className="flex-1 min-h-[220px] max-h-[50%] p-3 overflow-hidden">
            <SqlEditor
              value={sql}
              onChange={setSql}
              onRun={handleRunQuery}
              onResetDb={handleResetDb}
              isRunning={isRunning}
              history={queryHistory}
            />
          </div>

          {/* Center Tabs: Results vs Schema Explorer */}
          <div className="flex items-center justify-between border-t border-b border-border-subtle bg-bg-secondary px-3 text-xs">
            <div className="flex items-center">
              <button
                onClick={() => setCenterTab("results")}
                className={`py-2 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  centerTab === "results"
                    ? "border-accent-gold text-accent-gold bg-bg-surface/50"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Query Results</span>
                {queryResult && (
                  <span className="rounded-full bg-accent-gold/20 px-1.5 text-[10px] text-accent-gold font-mono">
                    {queryResult.rowCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCenterTab("schema")}
                className={`py-2 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  centerTab === "schema"
                    ? "border-accent-gold text-accent-gold bg-bg-surface/50"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                <span>Schema Explorer</span>
              </button>
            </div>

            {validation && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                  validation.passed
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}
              >
                {validation.passed ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    <span>PASSED (+{lesson.xpReward} XP)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    <span>TRY AGAIN</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bottom Half: Results Table or Schema Explorer */}
          <div className="flex-1 overflow-y-auto p-3">
            {centerTab === "results" ? (
              <ResultTable
                result={queryResult}
                error={queryError}
                rawError={rawError}
                isLoading={isRunning}
              />
            ) : (
              <SchemaExplorer
                dataset={defaultDataset}
                onInsertSql={(sample) => {
                  setSql(sample);
                  setCenterTab("results");
                }}
              />
            )}
          </div>
        </main>

        {/* =========================================================
            RIGHT PANEL: MISSION (Brief + Tasks + Hints + Solution)
            ========================================================= */}
        <aside
          className={`lg:col-span-3 flex flex-col h-full overflow-y-auto p-4 space-y-4 bg-bg-card ${
            mobileTab === "mission" ? "block" : "hidden lg:flex"
          }`}
        >
          {/* Mission Objective Header */}
          <div className="rounded-lg border border-border-strong bg-bg-surface p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-accent-gold" />
                Mission Brief
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-accent-gold">
                <Zap className="h-3.5 w-3.5 fill-current" />
                +{lesson.xpReward} XP
              </span>
            </div>

            <p className="text-xs text-text-secondary italic leading-relaxed">
              &ldquo;{lesson.analystContext}&rdquo;
            </p>
          </div>

          {/* Task Instructions */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Your Objective
            </h2>
            <div className="rounded-md border border-accent-gold/30 bg-accent-gold/5 p-3 text-xs leading-relaxed text-text-primary font-medium">
              {lesson.taskPrompt}
            </div>
          </div>

          {/* Validation Feedback (When query runs) */}
          {validation && (
            <div
              className={`rounded-md p-3 text-xs space-y-1.5 border ${
                validation.passed
                  ? "border-status-success/40 bg-status-success/10 text-text-primary"
                  : "border-status-warning/40 bg-status-warning/10 text-text-primary"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {validation.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-status-success" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-status-warning" />
                )}
                <span>{validation.headline}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-secondary">
                {validation.feedback}
              </p>

              {validation.passed && nextLesson && (
                <div className="pt-2">
                  <Link
                    href={`/learn/${nextLesson.chapterId === chapter.id ? chapter.slug : "chapter-" + nextLesson.chapterId}/${nextLesson.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded bg-accent-gold py-2 text-xs font-bold text-bg-primary shadow-glow-gold hover:opacity-95 transition-all"
                  >
                    <span>Proceed to Next Lesson</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Hints Accordion */}
          {lesson.hints.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-accent-gold" />
                  Hints ({lesson.hints.length})
                </span>
                <span className="text-[10px] text-text-muted lowercase">
                  (-5 XP per hint)
                </span>
              </div>

              <div className="space-y-1.5">
                {lesson.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div
                      key={idx}
                      className="rounded border border-border-subtle bg-bg-surface overflow-hidden text-xs"
                    >
                      {isRevealed ? (
                        <div className="p-2.5 text-text-primary bg-bg-hover/30">
                          <span className="font-semibold text-accent-gold mr-1">
                            Hint {idx + 1}:
                          </span>
                          {hint.text}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRevealHint(idx)}
                          className="w-full flex items-center justify-between p-2 text-left text-text-secondary hover:bg-bg-hover transition-colors"
                        >
                          <span className="font-medium text-text-primary">
                            Reveal Hint {idx + 1}
                          </span>
                          <span className="text-[10px] text-accent-gold font-mono">
                            Unlock
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Solution Explanation */}
          <div className="border-t border-border-subtle pt-3 space-y-2">
            {!showSolutionExplanation ? (
              <button
                onClick={() => setShowSolutionExplanation(true)}
                className="w-full rounded border border-border-subtle bg-bg-surface py-2 text-xs text-text-secondary hover:text-text-primary hover:border-border-strong transition-all flex items-center justify-center gap-1.5"
              >
                <Info className="h-3.5 w-3.5 text-text-muted" />
                <span>Show Reference Solution</span>
              </button>
            ) : (
              <div className="rounded-md border border-border-strong bg-bg-surface p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">Reference Solution</span>
                  <button
                    onClick={() => setSql(lesson.referenceSql)}
                    className="text-[10px] text-accent-gold hover:underline font-mono"
                  >
                    Load into Editor
                  </button>
                </div>
                <pre className="rounded bg-editor-bg p-2 font-mono text-[10px] text-text-primary overflow-x-auto border border-border-subtle">
                  {lesson.referenceSql}
                </pre>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {lesson.solutionExplanation}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
