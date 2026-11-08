"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLearner } from "@/components/LearnerContext";
import { ThemeMode } from "@/lib/storage";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Palette,
  Layers,
  BookOpen,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateOnboarding, setTheme } = useLearner();

  const [step, setStep] = useState<number>(1);
  const [comfortLevel, setComfortLevel] = useState<string>("beginner");
  const [goal, setGoal] = useState<string>("analytics");
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(profile.settings.theme);

  const comfortOptions = [
    {
      id: "beginner",
      title: "Complete Beginner",
      desc: "Never written SQL, or only heard about tables and queries.",
      recChapter: 1,
      badge: "Starts at Chapter 1: First Queries",
    },
    {
      id: "rusty",
      title: "Rusty / Returning to SQL",
      desc: "Familiar with basic SELECT and WHERE, but need a refresher on JOINs and aggregates.",
      recChapter: 3,
      badge: "Recommends Chapter 3 or 4",
    },
    {
      id: "intermediate",
      title: "Comfortable with Basics",
      desc: "Regularly query tables, but want mastery of CTEs, Window Functions, and Business Models.",
      recChapter: 6,
      badge: "Accelerated to Chapter 6: Thinking in Steps",
    },
  ];

  const goalOptions = [
    { id: "analytics", title: "Data Analytics & BI", desc: "Build executive dashboards and answer commercial questions." },
    { id: "datascience", title: "Data Science & Machine Learning", desc: "Feature engineering, cohort slicing, and training pipelines." },
    { id: "backend", title: "Backend Software Engineering", desc: "Write performant queries, indexes, and normalized schemas." },
    { id: "interview", title: "Technical Interview Prep", desc: "Master window functions, tricky joins, and top-N puzzles." },
    { id: "curiosity", title: "Personal Mastery & Curiosity", desc: "Explore the elegant logic of relational databases." },
  ];

  const themeOptions: { id: ThemeMode; name: string; tag: string; description: string; colors: string[] }[] = [
    {
      id: "obsidian",
      name: "The Obsidian Archive",
      tag: "Dark Fantasy",
      description: "Charcoal, ink-black, near-black navy with muted gold and ember accents.",
      colors: ["#0a0d13", "#161b22", "#d4af37", "#f97316"],
    },
    {
      id: "scholar",
      name: "The Scholar's Guild",
      tag: "Medieval Warm",
      description: "Warm parchment and deep ink with forest green and burgundy accents.",
      colors: ["#f4efe4", "#ece3d2", "#1e4620", "#8c2d38"],
    },
    {
      id: "coastal",
      name: "The Coastal Lab",
      tag: "Ocean Breeze",
      description: "Soft sand and off-white with ocean blue, seafoam, and coral accents.",
      colors: ["#fbf9f5", "#f3eee3", "#0284c7", "#0d9488"],
    },
  ];

  const handleFinish = () => {
    const chosenRec = comfortOptions.find((c) => c.id === comfortLevel)?.recChapter || 1;
    updateOnboarding(comfortLevel, goal, chosenRec);
    setTheme(selectedTheme);
    router.push("/learn");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left border-b border-border-subtle pb-6">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold uppercase tracking-wider">
            <Compass className="h-4 w-4" />
            <span>Learner Diagnostic • Step {step} of 3</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl">
            Personalize Your Query Quest Journey
          </h1>
          <p className="text-xs text-text-secondary sm:text-sm font-sans">
            Customize your learning path and visual environment. All content remains unlocked regardless of your choices.
          </p>
        </div>

        {/* Step 1: SQL Comfort */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-text-primary">
              How comfortable are you with SQL right now?
            </h2>

            <div className="space-y-3">
              {comfortOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setComfortLevel(opt.id)}
                  className={`flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-all ${
                    comfortLevel === opt.id
                      ? "border-accent-gold bg-bg-card shadow-glow-gold"
                      : "border-border-subtle bg-bg-surface hover:border-border-strong hover:bg-bg-hover"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-text-primary">
                        {opt.title}
                      </span>
                      <span className="rounded bg-bg-primary px-2 py-0.5 text-[10px] font-mono text-accent-gold border border-border-subtle">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-sans">{opt.desc}</p>
                  </div>
                  <div className="pt-0.5">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        comfortLevel === opt.id
                          ? "border-accent-gold bg-accent-gold"
                          : "border-text-muted"
                      }`}
                    >
                      {comfortLevel === opt.id && (
                        <div className="h-1.5 w-1.5 rounded-full bg-bg-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded bg-accent-gold px-5 py-2 text-xs font-bold text-bg-primary shadow-glow-gold hover:opacity-95"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Learning Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Why are you learning SQL?
            </h2>

            <div className="space-y-2.5">
              {goalOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all ${
                    goal === opt.id
                      ? "border-accent-gold bg-bg-card shadow-glow-gold"
                      : "border-border-subtle bg-bg-surface hover:border-border-strong hover:bg-bg-hover"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-serif text-sm font-bold text-text-primary">
                      {opt.title}
                    </div>
                    <p className="text-xs text-text-secondary font-sans">{opt.desc}</p>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      goal === opt.id
                        ? "border-accent-gold bg-accent-gold"
                        : "border-text-muted"
                    }`}
                  >
                    {goal === opt.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded bg-accent-gold px-5 py-2 text-xs font-bold text-bg-primary shadow-glow-gold hover:opacity-95"
              >
                <span>Select Theme</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Visual Theme */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-text-primary">
              Choose your visual theme
            </h2>
            <p className="text-xs text-text-secondary font-sans">
              Themes apply design tokens across typography, contrasts, and editor color schemes. You can change themes anytime.
            </p>

            <div className="space-y-3">
              {themeOptions.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setTheme(theme.id);
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                    selectedTheme === theme.id
                      ? "border-accent-gold bg-bg-card shadow-glow-gold"
                      : "border-border-subtle bg-bg-surface hover:border-border-strong hover:bg-bg-hover"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-text-primary">
                        {theme.name}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">
                        ({theme.tag})
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-sans">{theme.description}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {theme.colors.map((c, i) => (
                        <div
                          key={i}
                          className="h-3.5 w-6 rounded border border-border-subtle"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      selectedTheme === theme.id
                        ? "border-accent-gold bg-accent-gold"
                        : "border-text-muted"
                    }`}
                  >
                    {selectedTheme === theme.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 rounded bg-accent-gold px-6 py-2.5 text-xs font-bold text-bg-primary shadow-glow-gold hover:opacity-95"
              >
                <span>Enter Curriculum</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
