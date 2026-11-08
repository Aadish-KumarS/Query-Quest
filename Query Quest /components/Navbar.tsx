"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLearner } from "./LearnerContext";
import { ThemeMode } from "@/lib/storage";
import {
  Compass,
  Code2,
  Trophy,
  Flame,
  Zap,
  Palette,
  Settings,
  Menu,
  X,
  Database,
  Award,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { profile, setTheme, isReady } = useLearner();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/learn", label: "Curriculum", icon: Compass },
    { href: "/challenge", label: "Challenges", icon: Trophy },
    { href: "/sandbox", label: "SQL Sandbox", icon: Database },
    { href: "/progress", label: "Mastery & Badges", icon: Award },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const themes: { id: ThemeMode; name: string; tag: string }[] = [
    { id: "obsidian", name: "The Obsidian Archive", tag: "Dark Fantasy" },
    { id: "scholar", name: "The Scholar's Guild", tag: "Medieval Warm" },
    { id: "coastal", name: "The Coastal Lab", tag: "Ocean Breeze" },
  ];

  const currentThemeObj = themes.find((t) => t.id === profile.settings.theme) || themes[0];

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-accent bg-bg-surface text-accent-gold shadow-glow-gold transition-transform group-hover:scale-105">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-text-primary group-hover:text-accent-gold transition-colors">
                  Query Quest
                </span>
                <span className="hidden rounded border border-border-subtle bg-bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted sm:inline-block">
                  v2.0 WASM
                </span>
              </div>
              <p className="hidden text-[11px] text-text-muted sm:block">
                In-Browser Relational Analytics
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-bg-surface text-text-primary border border-border-strong shadow-subtle"
                      : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-accent-gold" : "text-text-muted"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Gamification & Theme Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <div
            title={`Active streak: ${profile.streak} calendar days`}
            className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400"
          >
            <Flame className="h-3.5 w-3.5 animate-pulse text-orange-500" />
            <span>{isReady ? profile.streak : 1}d</span>
          </div>

          {/* XP pill */}
          <Link
            href="/progress"
            title="Total Experience Points"
            className="flex items-center gap-1 rounded-full border border-accent-gold/40 bg-accent-gold/10 px-2.5 py-1 text-xs font-semibold text-accent-gold hover:border-accent-gold transition-colors"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>{isReady ? profile.xp : 0} XP</span>
          </Link>

          {/* Learner Level Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-surface px-2.5 py-1 text-xs text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-status-success"></span>
            <span className="font-medium text-text-primary">
              Lv. {isReady ? profile.level : 1}
            </span>
            <span className="text-[11px] text-text-muted">
              ({isReady ? profile.title : "Novice"})
            </span>
          </div>

          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-surface px-2.5 py-1.5 text-xs text-text-secondary hover:border-border-strong hover:text-text-primary transition-all"
              title="Change visual theme"
              aria-label="Change theme"
            >
              <Palette className="h-3.5 w-3.5 text-accent-gold" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {currentThemeObj.tag}
              </span>
            </button>

            {themeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border-strong bg-bg-card p-1.5 shadow-elevated z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Themes
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-xs transition-colors ${
                        profile.settings.theme === t.id
                          ? "bg-bg-hover text-text-primary font-medium"
                          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                      }`}
                    >
                      <div>
                        <div>{t.name}</div>
                        <div className="text-[10px] text-text-muted">{t.tag}</div>
                      </div>
                      {profile.settings.theme === t.id && (
                        <div className="h-1.5 w-1.5 rounded-full bg-accent-gold"></div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md border border-border-subtle p-1.5 text-text-secondary hover:bg-bg-surface hover:text-text-primary"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-surface px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-bg-card text-text-primary font-semibold border border-border-subtle"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-accent-gold" : "text-text-muted"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
