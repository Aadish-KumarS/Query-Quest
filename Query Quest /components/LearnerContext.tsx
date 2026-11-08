"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  LearnerProfile,
  ThemeMode,
  loadLearnerProfile,
  saveLearnerProfile,
  resetAllLearnerData,
  calculateLevel,
  INITIAL_BADGES,
} from "@/lib/storage";

interface LearnerContextType {
  profile: LearnerProfile;
  isReady: boolean;
  awardXp: (amount: number, reason?: string) => void;
  recordLessonCompletion: (
    lessonId: string,
    sql: string,
    hintsUsed: number,
    xpReward: number
  ) => void;
  recordQueryAttempt: (
    lessonId: string,
    sql: string,
    passed: boolean,
    error?: string,
    tags?: string[]
  ) => void;
  setTheme: (theme: ThemeMode) => void;
  setReducedMotion: (enabled: boolean) => void;
  resetProgress: () => void;
  updateOnboarding: (comfortLevel: string, goal: string, recommendedChapter: number) => void;
  newBadgeUnlocked: string | null;
  clearNewBadge: () => void;
}

const LearnerContext = createContext<LearnerContextType | null>(null);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<LearnerProfile>(() => {
    if (typeof window !== "undefined") {
      return loadLearnerProfile();
    }
    return {
      xp: 0,
      level: 1,
      title: "Database Novice",
      streak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      completedLessons: {},
      history: [],
      badges: {},
      weakAreas: {},
      onboarding: { comfortLevel: "", goal: "", recommendedChapter: 1, completed: false },
      settings: { theme: "obsidian", reducedMotion: false, fontSize: "md" },
    };
  });

  const [isReady, setIsReady] = useState(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);

  // Apply theme to HTML attribute
  const applyTheme = useCallback((theme: ThemeMode, reducedMotion: boolean) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      if (reducedMotion) {
        document.documentElement.classList.add("reduced-motion");
      } else {
        document.documentElement.classList.remove("reduced-motion");
      }
    }
  }, []);

  useEffect(() => {
    const loaded = loadLearnerProfile();
    setProfile(loaded);
    applyTheme(loaded.settings.theme, loaded.settings.reducedMotion);
    setIsReady(true);

    const onStorageChange = () => {
      const updated = loadLearnerProfile();
      setProfile(updated);
      applyTheme(updated.settings.theme, updated.settings.reducedMotion);
    };

    window.addEventListener("queryquest_storage_update", onStorageChange);
    return () => window.removeEventListener("queryquest_storage_update", onStorageChange);
  }, [applyTheme]);

  // Check and unlock badges based on progress
  const checkBadges = useCallback((currentProfile: LearnerProfile): Record<string, string> => {
    const badges = { ...currentProfile.badges };
    const completedCount = Object.keys(currentProfile.completedLessons).length;
    const now = new Date().toISOString();

    // Badge 1: First Query
    if (completedCount >= 1 && !badges["first_query"]) {
      badges["first_query"] = now;
      setNewBadgeUnlocked("First Query");
    }

    // Badge 2: Filter Finder (Chapter 2 complete: ch2-l8)
    if (currentProfile.completedLessons["ch2-l8"] && !badges["filter_finder"]) {
      badges["filter_finder"] = now;
      setNewBadgeUnlocked("Filter Finder");
    }

    // Badge 3: Aggregation Adept (Chapter 3 complete: ch3-l8)
    if (currentProfile.completedLessons["ch3-l8"] && !badges["aggregation_adept"]) {
      badges["aggregation_adept"] = now;
      setNewBadgeUnlocked("Aggregation Adept");
    }

    // Badge 4: Join Apprentice (Chapter 4 complete: ch4-l8)
    if (currentProfile.completedLessons["ch4-l8"] && !badges["join_apprentice"]) {
      badges["join_apprentice"] = now;
      setNewBadgeUnlocked("Join Apprentice");
    }

    // Badge 5: CTE Cartographer (Chapter 6 complete: ch6-l7)
    if (currentProfile.completedLessons["ch6-l7"] && !badges["cte_cartographer"]) {
      badges["cte_cartographer"] = now;
      setNewBadgeUnlocked("CTE Cartographer");
    }

    // Badge 6: Window Wizard (Chapter 7 complete: ch7-l8)
    if (currentProfile.completedLessons["ch7-l8"] && !badges["window_wizard"]) {
      badges["window_wizard"] = now;
      setNewBadgeUnlocked("Window Wizard");
    }

    // Badge 7: Analytics Detective (Chapter 8 complete: ch8-l8)
    if (currentProfile.completedLessons["ch8-l8"] && !badges["analytics_detective"]) {
      badges["analytics_detective"] = now;
      setNewBadgeUnlocked("Analytics Detective");
    }

    // Badge 8: Query Quest Complete (Chapter 9 complete: ch9-l8)
    if (currentProfile.completedLessons["ch9-l8"] && !badges["query_quest_complete"]) {
      badges["query_quest_complete"] = now;
      setNewBadgeUnlocked("Query Quest Complete");
    }

    return badges;
  }, []);

  const awardXp = useCallback(
    (amount: number) => {
      setProfile((prev) => {
        const newXp = prev.xp + amount;
        const { level, title } = calculateLevel(newXp);
        const updated = {
          ...prev,
          xp: newXp,
          level,
          title,
        };
        const updatedBadges = checkBadges(updated);
        updated.badges = updatedBadges;
        saveLearnerProfile(updated);
        return updated;
      });
    },
    [checkBadges]
  );

  const recordLessonCompletion = useCallback(
    (lessonId: string, sql: string, hintsUsed: number, xpReward: number) => {
      setProfile((prev) => {
        const existing = prev.completedLessons[lessonId];
        const isFirstTime = !existing;
        const effectiveXp = isFirstTime ? Math.max(10, xpReward - hintsUsed * 5) : 5; // small repeat practice XP

        const newCompleted = {
          ...prev.completedLessons,
          [lessonId]: {
            completedAt: new Date().toISOString(),
            sql,
            attempts: (existing?.attempts || 0) + 1,
            hintsUsed,
            xpEarned: (existing?.xpEarned || 0) + effectiveXp,
          },
        };

        const newXp = prev.xp + effectiveXp;
        const { level, title } = calculateLevel(newXp);

        const updated: LearnerProfile = {
          ...prev,
          xp: newXp,
          level,
          title,
          completedLessons: newCompleted,
        };

        updated.badges = checkBadges(updated);
        saveLearnerProfile(updated);
        return updated;
      });
    },
    [checkBadges]
  );

  const recordQueryAttempt = useCallback(
    (lessonId: string, sql: string, passed: boolean, error?: string, tags: string[] = []) => {
      setProfile((prev) => {
        const newHistory = [
          {
            lessonId,
            sql,
            passed,
            timestamp: new Date().toISOString(),
            error,
          },
          ...prev.history.slice(0, 49), // retain last 50 attempts
        ];

        const newWeakAreas = { ...prev.weakAreas };
        if (!passed && tags.length > 0) {
          tags.forEach((tag) => {
            newWeakAreas[tag] = (newWeakAreas[tag] || 0) + 1;
          });
        }

        const updated = {
          ...prev,
          history: newHistory,
          weakAreas: newWeakAreas,
        };
        saveLearnerProfile(updated);
        return updated;
      });
    },
    []
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      setProfile((prev) => {
        const updated: LearnerProfile = {
          ...prev,
          settings: { ...prev.settings, theme },
        };
        applyTheme(theme, updated.settings.reducedMotion);
        saveLearnerProfile(updated);
        return updated;
      });
    },
    [applyTheme]
  );

  const setReducedMotion = useCallback(
    (enabled: boolean) => {
      setProfile((prev) => {
        const updated: LearnerProfile = {
          ...prev,
          settings: { ...prev.settings, reducedMotion: enabled },
        };
        applyTheme(prev.settings.theme, enabled);
        saveLearnerProfile(updated);
        return updated;
      });
    },
    [applyTheme]
  );

  const updateOnboarding = useCallback(
    (comfortLevel: string, goal: string, recommendedChapter: number) => {
      setProfile((prev) => {
        const updated: LearnerProfile = {
          ...prev,
          onboarding: {
            comfortLevel,
            goal,
            recommendedChapter,
            completed: true,
          },
        };
        saveLearnerProfile(updated);
        return updated;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    resetAllLearnerData();
    const fresh = loadLearnerProfile();
    setProfile(fresh);
    applyTheme(fresh.settings.theme, fresh.settings.reducedMotion);
  }, [applyTheme]);

  const clearNewBadge = useCallback(() => {
    setNewBadgeUnlocked(null);
  }, []);

  return (
    <LearnerContext.Provider
      value={{
        profile,
        isReady,
        awardXp,
        recordLessonCompletion,
        recordQueryAttempt,
        setTheme,
        setReducedMotion,
        resetProgress,
        updateOnboarding,
        newBadgeUnlocked,
        clearNewBadge,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) {
    throw new Error("useLearner must be used within a LearnerProvider");
  }
  return ctx;
}
