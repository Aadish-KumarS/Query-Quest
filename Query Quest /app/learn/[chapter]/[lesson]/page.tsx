import React from "react";
import { notFound } from "next/navigation";
import { getLessonBySlug, allChapters } from "@/lib/curriculum";
import { LessonWorkspace } from "@/components/LessonWorkspace";

interface PageProps {
  params: {
    chapter: string;
    lesson: string;
  };
}

export function generateStaticParams() {
  const params: { chapter: string; lesson: string }[] = [];
  for (const chapter of allChapters) {
    for (const lesson of chapter.lessons) {
      params.push({
        chapter: chapter.slug,
        lesson: lesson.slug,
      });
    }
  }
  return params;
}

export default function LessonPage({ params }: PageProps) {
  const data = getLessonBySlug(params.chapter, params.lesson);

  if (!data) {
    notFound();
  }

  return <LessonWorkspace chapter={data.chapter} lesson={data.lesson} />;
}
