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
  // TEMPORARY: Unlocked all chapters for development as requested
  return false;
}
