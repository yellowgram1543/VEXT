interface Chapter {
  _id: string;
}

interface Module {
  chapters?: Chapter[];
}

interface ProgressRecord {
  chapterId: string;
  completedAt?: Date | string | null;
}

/**
 * Shared logic to determine if a chapter is locked based on sequential completion.
 */
export function isChapterLocked(
  chapterId: string,
  modules: Module[],
  progressData: ProgressRecord[]
): boolean {
  // 1. Flatten all chapters in curriculum order
  const allChapters = modules.flatMap(m => m.chapters || []);
  const currentIndex = allChapters.findIndex(c => c._id === chapterId);
  
  // If chapter not found or it's the first chapter, it's never locked
  if (currentIndex <= 0) return false;

  // 2. Check if the previous chapter is completed
  const prevChapter = allChapters[currentIndex - 1];
  const prevRecord = progressData.find(p => p.chapterId === prevChapter._id);
  
  return !prevRecord?.completedAt;
}
