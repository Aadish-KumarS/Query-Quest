"use client";

import React, { useState } from "react";
import Link from "next/link";
import { allChapters } from "@/lib/curriculum";
import { useLearner } from "@/components/LearnerContext";
import {
  Compass,
  Database,
  ArrowRight,
  Terminal,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  RotateCcw,
  BookOpen,
  Layers,
  SearchCheck,
  ShieldCheck,
  Code2,
} from "lucide-react";

export default function HomePage() {
  const { profile } = useLearner();
  const [activeTab, setActiveTab] = useState<"query" | "results">("query");

  // Interactive micro-demo query on the landing page
  const demoQuery = `-- Live Analytical Demonstration
SELECT
  c.name AS category_name,
  COUNT(p.id) AS total_products,
  ROUND(AVG(p.price), 2) AS average_price,
  ROUND(SUM(p.price * p.stock_quantity), 2) AS total_inventory_value
FROM categories c
JOIN products p ON c.id = p.category_id
WHERE p.status = 'active'
GROUP BY c.id, c.name
HAVING COUNT(p.id) >= 2
ORDER BY total_inventory_value DESC;`;

  const demoResults = [
    { category: "Computing", count: 2, avg: "$269.25", value: "$10,021.00" },
    { category: "Audio", count: 3, avg: "$124.66", value: "$13,447.55" },
    { category: "Home & Office", count: 3, avg: "$189.33", value: "$10,619.60" },
    { category: "Stationery", count: 3, avg: "$54.83", value: "$11,750.00" },
  ];

  const totalLessons = allChapters.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div className="bg-bg-primary text-text-primary">
      {/* Editorial Hero Section */}
      <section className="border-b border-border-subtle px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded border border-border-strong bg-bg-surface px-3 py-1 text-xs font-mono text-accent-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse"></span>
              <span>Pure In-Browser WebAssembly Engine • Zero Cloud Dependency</span>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.15]">
              Real Analytical SQL.
              <br />
              <span className="text-text-secondary font-normal italic">
                From raw tables to executive reasoning.
              </span>
            </h1>

            <p className="max-w-2xl text-base text-text-secondary leading-relaxed sm:text-lg font-sans">
              Query Quest teaches real SQL by running queries against an authentic
              in-memory SQLite database inside your browser. No mock data, no syntax
              memorization—just genuine query execution, rich schemas, and structured analytical mental models.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/onboarding"
                className="flex items-center gap-2 rounded bg-accent-gold px-5 py-2.5 text-sm font-semibold text-bg-primary shadow-glow-gold hover:opacity-95 transition-all"
              >
                <span>Begin Your Quest</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/learn"
                className="flex items-center gap-2 rounded border border-border-strong bg-bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-bg-hover transition-colors"
              >
                <Compass className="h-4 w-4 text-accent-gold" />
                <span>Explore the 9 Chapters</span>
              </Link>

              <Link
                href="/sandbox"
                className="flex items-center gap-2 rounded px-4 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                <Database className="h-4 w-4" />
                <span>Open Free Sandbox</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Micro-Workspace Preview */}
      <section className="border-b border-border-subtle bg-bg-secondary px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-accent-gold uppercase tracking-wider">
                Interactive Environment Preview
              </span>
              <h2 className="font-serif text-xl font-bold text-text-primary mt-0.5">
                The Anatomy of an Analytical Query
              </h2>
            </div>
            <span className="rounded bg-bg-card px-2 py-1 font-mono text-[11px] text-text-muted border border-border-subtle">
              SQLite v3.45 (WASM)
            </span>
          </div>

          {/* Interactive Window Shell */}
          <div className="rounded-lg border border-border-strong bg-editor-bg shadow-elevated overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle bg-bg-surface px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-xs text-text-secondary">
                  analysis_session.sql
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("query")}
                  className={`rounded px-2.5 py-1 text-xs transition-colors ${
                    activeTab === "query"
                      ? "bg-bg-primary text-text-primary border border-border-subtle"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Query Definition
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  className={`rounded px-2.5 py-1 text-xs transition-colors ${
                    activeTab === "results"
                      ? "bg-bg-primary text-text-primary border border-border-subtle"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Computed Matrix (4 rows)
                </button>
              </div>
            </div>

            {/* Editor vs Results preview */}
            {activeTab === "query" ? (
              <pre className="p-4 text-xs leading-relaxed text-text-primary overflow-x-auto whitespace-pre font-mono">
                {demoQuery}
              </pre>
            ) : (
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle text-text-muted">
                      <th className="py-1.5 font-semibold">category_name</th>
                      <th className="py-1.5 font-semibold text-right">total_products</th>
                      <th className="py-1.5 font-semibold text-right">average_price</th>
                      <th className="py-1.5 font-semibold text-right">total_inventory_value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-text-primary">
                    {demoResults.map((row, i) => (
                      <tr key={i} className="hover:bg-bg-surface/50">
                        <td className="py-2 text-text-accent font-medium">{row.category}</td>
                        <td className="py-2 text-right">{row.count}</td>
                        <td className="py-2 text-right text-accent-cyan">{row.avg}</td>
                        <td className="py-2 text-right font-semibold text-accent-gold">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The 9-Chapter Curriculum Grid */}
      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center sm:text-left">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-wider">
              Complete Structured Curriculum
            </span>
            <h2 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl mt-1">
              From First Queries to Analytical Mastery
            </h2>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl font-sans">
              9 sequential chapters spanning {totalLessons} interactive exercises and mastery challenges.
              Start from zero or test out of early topics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {allChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/learn`}
                className="group flex flex-col justify-between rounded-lg border border-border-subtle bg-bg-card p-5 hover:border-border-strong hover:bg-bg-hover/50 transition-all shadow-subtle"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-accent-gold">Chapter {chapter.id}</span>
                    <span className="text-text-muted">{chapter.lessons.length} lessons</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-text-primary group-hover:text-accent-gold transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 font-sans">
                    {chapter.capabilityStatement}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-text-muted font-mono">
                  <span>~{chapter.estimatedHours}h</span>
                  <span className="text-accent-gold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{chapter.totalXp} XP</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="border-t border-border-subtle bg-bg-secondary px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8 text-center sm:text-left">
          <div className="space-y-3">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-wider">
              Pedagogical Architecture
            </span>
            <h2 className="font-serif text-2xl font-bold text-text-primary sm:text-3xl">
              Why Query Quest Teaches Differently
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
            <div className="space-y-2 border-l-2 border-accent-gold pl-3">
              <h4 className="font-serif font-bold text-text-primary text-sm">
                Authentic SQLite Engine
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                No simulated outputs. Your SQL actually parses and runs inside a WebAssembly SQLite worker, returning authentic results or compiler errors.
              </p>
            </div>

            <div className="space-y-2 border-l-2 border-accent-emerald pl-3">
              <h4 className="font-serif font-bold text-text-primary text-sm">
                Semantic Query Validation
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Never checks raw SQL strings. The platform compares output rows and columns, giving you the freedom to write joins, CTEs, or subqueries your way.
              </p>
            </div>

            <div className="space-y-2 border-l-2 border-accent-cyan pl-3">
              <h4 className="font-serif font-bold text-text-primary text-sm">
                Zero Cloud Lock-in
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                All progress, notes, XP, and streak data live strictly inside your browser&apos;s localStorage. No tracking, accounts, or unexpected bills.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-subtle">
            <div className="text-xs text-text-secondary">
              Ready to build genuine analytical muscle?
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded bg-accent-gold px-5 py-2.5 text-xs font-bold text-bg-primary shadow-glow-gold hover:opacity-95 transition-all"
            >
              <span>Personalize Your Path</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
