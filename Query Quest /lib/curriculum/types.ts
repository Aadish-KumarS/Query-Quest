export type ExerciseType =
  | "scratch"
  | "fill-in-the-blank"
  | "fix-broken"
  | "predict"
  | "misleading-result"
  | "choose-join"
  | "reorder-clauses"
  | "case-study"
  | "mastery-challenge";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LessonHint {
  costXp: number;
  text: string;
}

export interface LessonItem {
  id: string;
  chapterId: number;
  slug: string;
  order: number;
  title: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  type: ExerciseType;
  conceptExplanation: string;
  syntaxExamples: string;
  whyItMatters: string;
  commonMistakes: string;
  rememberThis: string;
  analystContext: string;
  taskPrompt: string;
  starterSql: string;
  referenceSql: string;
  requireOrdering?: boolean;
  hints: LessonHint[];
  solutionExplanation: string;
  xpReward: number;
  tags: string[];
  prerequisites: string[];
  options?: string[]; // for multiple choice / prediction / clause ordering if applicable
  correctOptionIndex?: number;
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  capabilityStatement: string;
  estimatedHours: number;
  totalXp: number;
  badgeId?: string;
  lessons: LessonItem[];
}
