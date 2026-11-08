export type ThemeMode = "obsidian" | "scholar" | "coastal";

export interface LessonAttempt {
  lessonId: string;
  sql: string;
  passed: boolean;
  timestamp: string;
  error?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: string;
}

export interface LearnerProfile {
  xp: number;
  level: number;
  title: string;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessons: Record<
    string,
    {
      completedAt: string;
      sql: string;
      attempts: number;
      hintsUsed: number;
      xpEarned: number;
    }
  >;
  history: LessonAttempt[];
  badges: Record<string, string>; // badgeId -> unlockedAt
  weakAreas: Record<string, number>; // topic tag -> error count
  onboarding: {
    comfortLevel: string;
    goal: string;
    recommendedChapter: number;
    completed: boolean;
  };
  settings: {
    theme: ThemeMode;
    reducedMotion: boolean;
    fontSize: "sm" | "md" | "lg";
  };
}

const STORAGE_KEY = "query_quest_learner_profile_v1";

export const INITIAL_BADGES: Badge[] = [
  {
    id: "first_query",
    name: "First Query",
    description: "Successfully executed your inaugural SQL SELECT statement",
    icon: "Sparkles",
    unlockedAt: null,
    requirement: "Complete your first lesson in Chapter 1",
  },
  {
    id: "filter_finder",
    name: "Filter Finder",
    description: "Mastered WHERE clauses, ranges, and pattern matches",
    icon: "Filter",
    unlockedAt: null,
    requirement: "Complete Chapter 2: Finding the Right Rows",
  },
  {
    id: "aggregation_adept",
    name: "Aggregation Adept",
    description: "Commanded GROUP BY, HAVING, and aggregate statistical functions",
    icon: "BarChart3",
    unlockedAt: null,
    requirement: "Complete Chapter 3: Summarising the Evidence",
  },
  {
    id: "join_apprentice",
    name: "Join Apprentice",
    description: "Bridged relational datasets using INNER, LEFT, and self joins",
    icon: "GitMerge",
    unlockedAt: null,
    requirement: "Complete Chapter 4: Connecting the Tables",
  },
  {
    id: "cte_cartographer",
    name: "CTE Cartographer",
    description: "Mapped complex multi-stage data pipelines using WITH expressions",
    icon: "Compass",
    unlockedAt: null,
    requirement: "Complete Chapter 6: Thinking in Steps",
  },
  {
    id: "window_wizard",
    name: "Window Wizard",
    description: "Calculated running metrics, ranks, and lead/lag across row partitions",
    icon: "Layers",
    unlockedAt: null,
    requirement: "Complete Chapter 7: Analysing Across Rows",
  },
  {
    id: "analytics_detective",
    name: "Analytics Detective",
    description: "Solved high-stakes real-world business intelligence cases",
    icon: "SearchCheck",
    unlockedAt: null,
    requirement: "Complete Chapter 8: Solving Business Questions",
  },
  {
    id: "query_quest_complete",
    name: "Query Quest Complete",
    description: "Finished the entire analytical SQL mastery journey",
    icon: "Crown",
    unlockedAt: null,
    requirement: "Complete all 9 chapters",
  },
];

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; progressPercent: number } {
  // Levels:
  // L1: 0 - 150 (Apprentice)
  // L2: 151 - 400 (Query Scribe)
  // L3: 401 - 800 (Guild Analyst)
  // L4: 801 - 1400 (Data Navigator)
  // L5: 1401 - 2200 (Query Architect)
  // L6: 2201 - 3200 (Grandmaster of the Relational Realm)
  const thresholds = [
    { level: 1, title: "Database Novice", xp: 0 },
    { level: 2, title: "Query Scribe", xp: 200 },
    { level: 3, title: "Guild Analyst", xp: 500 },
    { level: 4, title: "Data Navigator", xp: 1000 },
    { level: 5, title: "Query Architect", xp: 1800 },
    { level: 6, title: "Relational Grandmaster", xp: 3000 },
  ];

  let current = thresholds[0];
  let next = thresholds[1];

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i].xp) {
      current = thresholds[i];
      next = thresholds[i + 1] || { level: current.level + 1, title: "Legendary Scholar", xp: current.xp + 1500 };
      break;
    }
  }

  const range = next.xp - current.xp;
  const earnedInRange = xp - current.xp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)));

  return {
    level: current.level,
    title: current.title,
    nextLevelXp: next.xp,
    progressPercent,
  };
}

export function getDefaultProfile(): LearnerProfile {
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
    onboarding: {
      comfortLevel: "",
      goal: "",
      recommendedChapter: 1,
      completed: false,
    },
    settings: {
      theme: "obsidian",
      reducedMotion: false,
      fontSize: "md",
    },
  };
}

export function loadLearnerProfile(): LearnerProfile {
  if (typeof window === "undefined") return getDefaultProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();
    const parsed = JSON.parse(raw);

    // Verify streak against current date
    const today = new Date().toISOString().split("T")[0];
    if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
      const last = new Date(parsed.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        parsed.streak = (parsed.streak || 0) + 1;
        parsed.lastActiveDate = today;
      } else if (diffDays > 1) {
        parsed.streak = 1;
        parsed.lastActiveDate = today;
      }
    }

    const { level, title } = calculateLevel(parsed.xp || 0);
    parsed.level = level;
    parsed.title = title;

    return { ...getDefaultProfile(), ...parsed };
  } catch (e) {
    console.error("Failed to parse learner profile from localStorage:", e);
    return getDefaultProfile();
  }
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  if (typeof window === "undefined") return;
  try {
    const { level, title } = calculateLevel(profile.xp);
    profile.level = level;
    profile.title = title;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Trigger custom event so reactive hooks re-render across views
    window.dispatchEvent(new Event("queryquest_storage_update"));
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }
}

export function resetAllLearnerData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("queryquest_storage_update"));
}
