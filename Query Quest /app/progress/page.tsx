"use client";

import React from "react";
import Link from "next/link";
import { useLearner } from "@/components/LearnerContext";
import { allChapters, allLessons, getChapterProgress, getWeakAreaSuggestions } from "@/lib/curriculum";
import { INITIAL_BADGES, calculateLevel } from "@/lib/storage";
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Compass,
  Trophy,
  History,
  TrendingUp,
} from "lucide-react";

export default function ProgressPage() {
  const { profile } = useLearner();
  const levelInfo = calculateLevel(profile.xp);

  const completedCount = Object.keys(profile.completedLessons).length;
  const totalLessons = allLessons.length;
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  // Weak area suggestions based on actual logged query errors
  const weakSuggestions = getWeakAreaSuggestions(profile.weakAreas, profile.completedLessons);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-subtle pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>Learner Dossier</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl">
            Progress & Analytical Badges
          </h1>
          <p className="text-xs text-text-secondary sm:text-sm font-sans max-w-2xl">
            Track your journey through the relational realm. All metrics are computed locally from your in-browser query executions.
          </p>
        </div>

        {/* Level & XP Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Level */}
          <div className="rounded-lg border border-border-subtle bg-bg-card p-5 space-y-3 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">Rank & Title</span>
              <span className="rounded-full bg-accent-gold/20 px-2 py-0.5 text-xs font-mono font-bold text-accent-gold">
                Level {levelInfo.level}
              </span>
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-text-primary">
                {levelInfo.title}
              </div>
              <p className="text-xs text-text-secondary font-sans mt-0.5">
                {levelInfo.nextLevelXp - profile.xp > 0
                  ? `${levelInfo.nextLevelXp - profile.xp} XP to next milestone`
                  : "Maximum rank achieved"}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-bg-surface border border-border-subtle">
                <div
                  className="h-full bg-accent-gold transition-all duration-500 rounded-full"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>{profile.xp} XP earned</span>
                <span>{levelInfo.progressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Streak */}
          <div className="rounded-lg border border-border-subtle bg-bg-card p-5 space-y-2 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">Query Streak</span>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div className="font-serif text-3xl font-extrabold text-orange-400">
              {profile.streak} <span className="text-base font-normal text-text-secondary">Days</span>
            </div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Consecutive calendar days with SQL exercises executed.
            </p>
          </div>

          {/* Card 3: Completion */}
          <div className="rounded-lg border border-border-subtle bg-bg-card p-5 space-y-2 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase">Curriculum Completion</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-serif text-3xl font-extrabold text-emerald-400">
              {completionPercentage}%
            </div>
            <p className="text-xs text-text-secondary font-sans">
              {completedCount} of {totalLessons} lessons mastered.
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Mastery Badges
            </h2>
            <span className="text-xs font-mono text-text-muted">
              {Object.keys(profile.badges).length} of {INITIAL_BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {INITIAL_BADGES.map((badge) => {
              const isUnlocked = !!profile.badges[badge.id];

              return (
                <div
                  key={badge.id}
                  className={`rounded-lg border p-4 transition-all flex flex-col justify-between space-y-3 ${
                    isUnlocked
                      ? "border-accent-gold/40 bg-accent-gold/5 shadow-subtle"
                      : "border-border-subtle bg-bg-card opacity-60"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm ${
                          isUnlocked
                            ? "border-accent-gold bg-accent-gold/20 text-accent-gold shadow-glow-gold"
                            : "border-border-subtle bg-bg-surface text-text-muted"
                        }`}
                      >
                        {isUnlocked ? <Trophy className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </div>
                      <span className="font-mono text-[10px] text-text-muted">
                        {isUnlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-bold text-text-primary">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-text-secondary font-sans leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="border-t border-border-subtle pt-2 text-[10px] text-text-muted font-sans">
                    {badge.requirement}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Areas & Targeted Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Targeted Review Recommendations
            </h2>
          </div>

          {weakSuggestions.length === 0 ? (
            <div className="rounded-lg border border-border-subtle bg-bg-card p-6 text-center text-xs text-text-secondary">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="font-medium text-text-primary">No recurring query errors detected yet!</p>
              <p className="text-[11px] text-text-muted mt-1">
                As you practice, any stumbling blocks (e.g. join mistakes, group by issues, syntax slips) will generate personalized recommendations here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weakSuggestions.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 uppercase text-[11px]">
                      Topic: {item.tag}
                    </span>
                    <span className="rounded bg-bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted border border-border-subtle">
                      {item.errorCount} mistakes
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed font-sans text-[11px]">
                    We detected repeated query retries around this topic. Review these exercises:
                  </p>
                  <div className="space-y-1 pt-1">
                    {item.recommendedLessons.map((l) => (
                      <Link
                        key={l.id}
                        href={`/learn`}
                        className="flex items-center justify-between rounded p-1.5 text-[11px] text-text-primary bg-bg-surface hover:text-accent-gold border border-border-subtle transition-colors"
                      >
                        <span className="truncate">{l.title}</span>
                        <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Query Attempts Log */}
        {profile.history.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-text-muted" />
              <h2 className="font-serif text-lg font-bold text-text-primary">
                Recent Query Activity
              </h2>
            </div>

            <div className="rounded-lg border border-border-subtle bg-bg-card divide-y divide-border-subtle max-h-72 overflow-y-auto text-xs font-mono">
              {profile.history.slice(0, 15).map((attempt, idx) => (
                <div key={idx} className="p-3 flex items-start justify-between gap-3 hover:bg-bg-hover transition-colors">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          attempt.passed
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {attempt.passed ? "PASSED" : "FAILED"}
                      </span>
                      <span className="text-text-muted text-[10px]">
                        {new Date(attempt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-text-secondary text-[11px] truncate">
                      {attempt.sql}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
