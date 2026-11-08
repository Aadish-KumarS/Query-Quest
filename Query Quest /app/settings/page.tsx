"use client";

import React, { useState } from "react";
import { useLearner } from "@/components/LearnerContext";
import { ThemeMode } from "@/lib/storage";
import {
  Settings,
  Palette,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Type,
  ShieldAlert,
} from "lucide-react";

export default function SettingsPage() {
  const { profile, setTheme, setReducedMotion, resetProgress } = useLearner();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const themes: { id: ThemeMode; name: string; tag: string; desc: string; colors: string[] }[] = [
    {
      id: "obsidian",
      name: "The Obsidian Archive",
      tag: "Dark Fantasy",
      desc: "Charcoal, ink-black, and dark violet with muted gold accents. Crisp high-contrast code typography.",
      colors: ["#0a0d13", "#161b22", "#d4af37", "#f97316"],
    },
    {
      id: "scholar",
      name: "The Scholar's Guild",
      tag: "Medieval Fantasy",
      desc: "Warm parchment, manuscript borders, deep ink, forest green, and burgundy accents.",
      colors: ["#f4efe4", "#ece3d2", "#1e4620", "#8c2d38"],
    },
    {
      id: "coastal",
      name: "The Coastal Lab",
      tag: "Beach & Ocean",
      desc: "Soft sand, off-white, ocean blue, seafoam, and sunset navy accents. Modern, calm, airy.",
      colors: ["#fbf9f5", "#f3eee3", "#0284c7", "#0d9488"],
    },
  ];

  const handleReset = () => {
    resetProgress();
    setShowConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-subtle pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold uppercase tracking-wider">
            <Settings className="h-4 w-4" />
            <span>Preferences & System</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl">
            Settings & Appearance
          </h1>
          <p className="text-xs text-text-secondary sm:text-sm font-sans max-w-xl">
            Configure visual themes, accessibility settings, and local database cache.
          </p>
        </div>

        {/* Section 1: Themes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-accent-gold" />
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Design Theme
            </h2>
          </div>

          <div className="space-y-3">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-all ${
                  profile.settings.theme === t.id
                    ? "border-accent-gold bg-bg-card shadow-glow-gold"
                    : "border-border-subtle bg-bg-surface hover:border-border-strong hover:bg-bg-hover"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-text-primary">
                      {t.name}
                    </span>
                    <span className="rounded bg-bg-primary px-2 py-0.5 text-[10px] font-mono text-text-muted border border-border-subtle">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary font-sans leading-relaxed">
                    {t.desc}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {t.colors.map((c, i) => (
                      <div
                        key={i}
                        className="h-4 w-7 rounded border border-border-subtle"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      profile.settings.theme === t.id
                        ? "border-accent-gold bg-accent-gold"
                        : "border-text-muted"
                    }`}
                  >
                    {profile.settings.theme === t.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Accessibility */}
        <div className="space-y-4 border-t border-border-subtle pt-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-accent-cyan" />
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Accessibility & Motion
            </h2>
          </div>

          <div className="rounded-lg border border-border-subtle bg-bg-card p-4 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Reduced Motion</div>
                <div className="text-[11px] text-text-muted font-sans mt-0.5">
                  Disables UI animations, particle effects, and confetti celebrations.
                </div>
              </div>
              <button
                onClick={() => setReducedMotion(!profile.settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile.settings.reducedMotion ? "bg-accent-gold" : "bg-bg-hover border border-border-subtle"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-bg-primary transition-transform ${
                    profile.settings.reducedMotion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Data & Reset */}
        <div className="space-y-4 border-t border-border-subtle pt-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-status-error" />
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Data Storage & Reset
            </h2>
          </div>

          <div className="rounded-lg border border-status-error/30 bg-status-error/5 p-4 space-y-3 text-xs">
            <div>
              <div className="font-semibold text-text-primary">
                Reset Learner Progress
              </div>
              <p className="text-[11px] text-text-muted font-sans mt-1">
                Clears all earned XP, completed lessons, streaks, unlocked badges, and error history from localStorage.
              </p>
            </div>

            {resetDone && (
              <div className="flex items-center gap-2 text-status-success font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>All progress successfully cleared.</span>
              </div>
            )}

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="rounded border border-status-error/40 px-3 py-1.5 text-xs font-semibold text-status-error hover:bg-status-error/10 transition-colors"
              >
                Reset All Progress
              </button>
            ) : (
              <div className="rounded border border-status-error/60 bg-bg-card p-3 space-y-2">
                <p className="font-bold text-status-error">
                  Are you absolutely certain? This cannot be undone.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="rounded bg-status-error px-3 py-1.5 font-bold text-white hover:opacity-90"
                  >
                    Yes, Erase Everything
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="rounded border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-hover"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
