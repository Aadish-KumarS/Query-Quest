"use client";

import React from "react";
import Link from "next/link";
import { allChapters, getChapterProgress } from "@/lib/curriculum";
import { useLearner } from "@/components/LearnerContext";
import {
  Compass,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  Clock,
  Zap,
  Play,
  Trophy,
  ChevronRight,
  Award,
} from "lucide-react";

export default function LearnPage() {
  const { profile } = useLearner();

  // Find the next incomplete lesson to "Continue where you stopped"
  let continueLesson = null;
  let continueChapter = null;

  for (const ch of allChapters) {
    for (const l of ch.lessons) {
      if (!profile.completedLessons[l.id]) {
        continueLesson = l;
        continueChapter = ch;
        break;
      }
    }
    if (continueLesson) break;
  }

  // Fallback if all finished
  if (!continueLesson) {
    continueChapter = allChapters[0];
    continueLesson = allChapters[0].lessons[0];
  }

  const completedTotal = Object.keys(profile.completedLessons).length;
  const totalLessons = allChapters.reduce((acc, c) => acc + c.lessons.length, 0);
  const globalProgress = Math.round((completedTotal / totalLessons) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="space-y-8">
        {/* Header and Progress Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-subtle pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                <span>The Learning Map</span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl mt-1">
                Relational SQL Curriculum
              </h1>
              <p className="text-xs text-text-secondary sm:text-sm font-sans mt-0.5">
                9 structured chapters from foundational projections to multi-touch business diagnostics.
              </p>
            </div>

            {/* Quick stats box */}
            <div className="flex items-center gap-4 bg-bg-card border border-border-subtle p-3 rounded-lg text-xs font-mono">
              <div>
                <div className="text-text-muted text-[10px] uppercase">Completed</div>
                <div className="font-bold text-text-primary">
                  {completedTotal} / {totalLessons}
                </div>
              </div>
              <div className="h-8 w-px bg-border-subtle" />
              <div>
                <div className="text-text-muted text-[10px] uppercase">Curriculum XP</div>
                <div className="font-bold text-accent-gold">{profile.xp} XP</div>
              </div>
            </div>
          </div>

          {/* Continue Where You Stopped Callout */}
          {continueLesson && continueChapter && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-accent-gold/40 bg-accent-gold/10 p-4 shadow-subtle">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-accent-gold px-2 py-0.5 text-[10px] font-bold text-bg-primary font-mono uppercase">
                    Resume Mission
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    Ch {continueChapter.id} • Lesson {continueLesson.order}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-text-primary">
                  {continueLesson.title}
                </h3>
                <p className="text-xs text-text-secondary font-sans line-clamp-1">
                  {continueLesson.analystContext}
                </p>
              </div>

              <Link
                href={`/learn/${continueChapter.slug}/${continueLesson.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded bg-accent-gold px-4 py-2 text-xs font-bold text-bg-primary shadow-glow-gold hover:opacity-95 transition-all shrink-0"
              >
                <span>Continue Querying</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Chapters Stack */}
        <div className="space-y-6">
          {allChapters.map((chapter) => {
            const stats = getChapterProgress(chapter.id, profile.completedLessons);
            const isUnlocked = stats.isUnlocked;

            return (
              <div
                key={chapter.id}
                className={`rounded-lg border bg-bg-card transition-all overflow-hidden ${
                  stats.isMastered
                    ? "border-emerald-500/40 shadow-subtle"
                    : isUnlocked
                    ? "border-border-subtle hover:border-border-strong"
                    : "border-border-subtle/50 opacity-75"
                }`}
              >
                {/* Chapter Banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-bg-surface/50 border-b border-border-subtle">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent-gold uppercase">
                        Chapter {chapter.id}
                      </span>
                      {stats.isMastered ? (
                        <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Mastered</span>
                        </span>
                      ) : !isUnlocked ? (
                        <span className="flex items-center gap-1 rounded bg-bg-primary px-2 py-0.5 text-[10px] font-mono text-text-muted border border-border-subtle">
                          <Lock className="h-3 w-3" />
                          <span>Locked</span>
                        </span>
                      ) : null}
                    </div>

                    <h2 className="font-serif text-lg font-bold text-text-primary">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {chapter.capabilityStatement}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                    <div>
                      <div className="text-[10px] text-text-muted uppercase">Progress</div>
                      <div className="font-bold text-text-primary">
                        {stats.completedCount} / {stats.totalCount} ({stats.percentage}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-text-muted uppercase">Reward</div>
                      <div className="font-bold text-accent-gold">+{chapter.totalXp} XP</div>
                    </div>
                  </div>
                </div>

                {/* Lesson Nodes List */}
                <div className="divide-y divide-border-subtle">
                  {chapter.lessons.map((lesson) => {
                    const isDone = !!profile.completedLessons[lesson.id];
                    const isMasteryChallenge = lesson.type === "mastery-challenge";

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${chapter.slug}/${lesson.slug}`}
                        className={`flex items-center justify-between p-4 hover:bg-bg-hover transition-colors group ${
                          isDone ? "bg-bg-surface/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold ${
                              isDone
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : isMasteryChallenge
                                ? "bg-accent-gold/20 text-accent-gold border border-accent-gold/40"
                                : "bg-bg-surface text-text-secondary border border-border-subtle"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : isMasteryChallenge ? (
                              <Trophy className="h-3.5 w-3.5" />
                            ) : (
                              lesson.order
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-text-primary group-hover:text-accent-gold transition-colors">
                                {lesson.title}
                              </span>
                              {isMasteryChallenge && (
                                <span className="rounded bg-accent-gold/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-accent-gold border border-accent-gold/30">
                                  Mastery Challenge
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted font-sans flex items-center gap-2 mt-0.5">
                              <span>{lesson.difficulty}</span>
                              <span>•</span>
                              <span>~{lesson.estimatedMinutes} mins</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs">
                          <span className="text-text-muted text-[11px]">
                            +{lesson.xpReward} XP
                          </span>
                          <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent-gold group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
