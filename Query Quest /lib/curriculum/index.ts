import { Chapter, LessonItem } from "./types";
import { chapter1 } from "./chapter1";
import { chapter2 } from "./chapter2";
import { chapter3 } from "./chapter3";
import { chapter4 } from "./chapter4";
import { chapter5 } from "./chapter5";
import { chapter6 } from "./chapter6";
import { chapter7 } from "./chapter7";
import { chapter8 } from "./chapter8";
import { chapter9 } from "./chapter9";

export * from "./types";

export const allChapters: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
];

export const allLessons: LessonItem[] = allChapters.flatMap((c) => c.lessons);

export function getChapterBySlug(slug: string): Chapter | undefined {
  return allChapters.find((c) => c.slug === slug || String(c.id) === slug);
}

export function getLessonBySlug(chapterSlug: string, lessonSlug: string): { chapter: Chapter; lesson: LessonItem } | null {
  const chapter = getChapterBySlug(chapterSlug);
  if (!chapter) return null;
  const lesson = chapter.lessons.find((l) => l.slug === lessonSlug || l.id === lessonSlug);
  if (!lesson) return null;
  return { chapter, lesson };
}

export function getLessonById(id: string): { chapter: Chapter; lesson: LessonItem } | null {
  for (const chapter of allChapters) {
    const lesson = chapter.lessons.find((l) => l.id === id);
    if (lesson) return { chapter, lesson };
  }
  return null;
}

export function getNextLesson(currentId: string): LessonItem | null {
  const idx = allLessons.findIndex((l) => l.id === currentId);
  if (idx !== -1 && idx < allLessons.length - 1) {
    return allLessons[idx + 1];
  }
  return null;
}

export function getPreviousLesson(currentId: string): LessonItem | null {
  const idx = allLessons.findIndex((l) => l.id === currentId);
  if (idx > 0) {
    return allLessons[idx - 1];
  }
  return null;
}

export function getChapterProgress(
  chapterId: number,
  completedLessonIds: Record<string, any>
): {
  completedCount: number;
  totalCount: number;
  percentage: number;
  isUnlocked: boolean;
  isMastered: boolean;
} {
  const chapter = allChapters.find((c) => c.id === chapterId);
  if (!chapter) {
    return { completedCount: 0, totalCount: 0, percentage: 0, isUnlocked: false, isMastered: false };
  }

  const completedCount = chapter.lessons.filter((l) => !!completedLessonIds[l.id]).length;
  const totalCount = chapter.lessons.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isMastered = completedCount === totalCount;

  // Chapter 1 is always unlocked. Subsequent chapters unlock if previous chapter has >= 60% completion or is chapter 1
  let isUnlocked = chapterId === 1;
  if (chapterId > 1) {
    const prevChapter = allChapters.find((c) => c.id === chapterId - 1);
    if (prevChapter) {
      const prevDone = prevChapter.lessons.filter((l) => !!completedLessonIds[l.id]).length;
      isUnlocked = (prevDone / prevChapter.lessons.length) >= 0.5;
    }
  }

  return {
    completedCount,
    totalCount,
    percentage,
    isUnlocked,
    isMastered,
  };
}

export function getTotalCurriculumXp(): number {
  return allChapters.reduce((acc, c) => acc + c.totalXp, 0);
}

export function getWeakAreaSuggestions(
  weakAreas: Record<string, number>,
  completedIds: Record<string, any>
): { tag: string; errorCount: number; recommendedLessons: LessonItem[] }[] {
  const entries = Object.entries(weakAreas)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0)
    .slice(0, 3);

  return entries.map(([tag, errorCount]) => {
    const matchingLessons = allLessons
      .filter((l) => l.tags.includes(tag))
      .slice(0, 3);
    return {
      tag,
      errorCount,
      recommendedLessons: matchingLessons,
    };
  });
}
