"use client";

import React, { useState } from "react";
import Link from "next/link";
import { allChapters, allLessons, LessonItem } from "@/lib/curriculum";
import { useLearner } from "@/components/LearnerContext";
import {
  Trophy,
  CheckCircle2,
  Filter,
  ArrowRight,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function ChallengePage() {
  const { profile } = useLearner();
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Collect all mastery challenges + high-yield practice challenges
  const masteryLessons = allLessons.filter(
    (l) => l.type === "mastery-challenge" || l.type === "fix-broken" || l.difficulty === "Advanced"
  );

  const allTags = ["all", "mastery", "window-functions", "joins", "cte", "aggregates", "case-when"];

  const filteredChallenges = masteryLessons.filter((l) => {
    if (selectedTag !== "all") {
      if (selectedTag === "mastery" && l.type !== "mastery-challenge") return false;
      if (selectedTag !== "mastery" && !l.tags.includes(selectedTag)) return false;
    }
    if (selectedDifficulty !== "all" && l.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border-subtle pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold uppercase tracking-wider">
            <Trophy className="h-4 w-4" />
            <span>Mastery Arena</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl">
            Analytical Challenges & Diagnostics
          </h1>
          <p className="text-xs text-text-secondary sm:text-sm font-sans max-w-2xl">
            Test your relational problem-solving against real business cases, debugging puzzles, and the 9 Chapter Mastery scenarios.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-card p-3 rounded-lg border border-border-subtle text-xs">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-text-muted text-[11px] font-mono mr-1">Topic:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded px-2.5 py-1 text-xs font-mono capitalize transition-colors ${
                  selectedTag === tag
                    ? "bg-accent-gold text-bg-primary font-bold shadow-glow-gold"
                    : "bg-bg-surface text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-border-subtle"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted text-[11px] font-mono mr-1">Level:</span>
            {["all", "Intermediate", "Advanced"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded px-2.5 py-1 text-xs font-mono capitalize transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-bg-surface text-text-primary border border-border-strong font-semibold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-3">
          {filteredChallenges.map((challenge) => {
            const chapter = allChapters.find((c) => c.id === challenge.chapterId);
            const isCompleted = !!profile.completedLessons[challenge.id];

            return (
              <div
                key={challenge.id}
                className={`rounded-lg border bg-bg-card p-4 transition-all hover:border-border-strong hover:bg-bg-hover/40 shadow-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  isCompleted ? "border-emerald-500/30" : "border-border-subtle"
                }`}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-accent-gold uppercase font-bold">
                      Chapter {challenge.chapterId} Mastery
                    </span>
                    <span className="rounded bg-bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted border border-border-subtle">
                      {challenge.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-text-primary">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed font-sans line-clamp-2">
                    {challenge.analystContext}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border-subtle">
                  <div className="font-mono text-xs text-right">
                    <div className="font-bold text-accent-gold">+{challenge.xpReward} XP</div>
                    <div className="text-[10px] text-text-muted">~{challenge.estimatedMinutes} mins</div>
                  </div>

                  <Link
                    href={`/learn/${chapter?.slug || "chapter-" + challenge.chapterId}/${challenge.slug}`}
                    className="flex items-center gap-1.5 rounded bg-bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-accent-gold hover:text-bg-primary border border-border-subtle transition-all"
                  >
                    <span>{isCompleted ? "Review" : "Launch"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
