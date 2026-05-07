import { prisma } from "./prisma";
import { StageType } from "@prisma/client";
import { STAGE_ORDER } from "./constants";
import { compareMath } from "./evaluators/math";
import { runPython } from "./evaluators/python";

/**
 * Pure logic to check if a stage is unlocked given the highest unlocked stage.
 */
export function isStageUnlocked(highestUnlocked: StageType, requested: StageType): boolean {
  const highestIndex = STAGE_ORDER.indexOf(highestUnlocked);
  const requestedIndex = STAGE_ORDER.indexOf(requested);
  return requestedIndex <= highestIndex;
}

/**
 * Pure logic to determine what the next stage should be.
 */
export function getNextStage(current: StageType, quizScore?: number): StageType {
  const currentIndex = STAGE_ORDER.indexOf(current);
  
  if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
    return current;
  }

  const next = STAGE_ORDER[currentIndex + 1];

  if (next === StageType.APPLY) {
    if (quizScore !== undefined && quizScore >= 0.8) {
      return StageType.APPLY;
    }
    return current; // Stay at TEST if score < 0.8
  }

  return next;
}

/**
 * DB: Retrieve or initialize Progress.
 * Note: Progress is now global (no userId) for the current prototype.
 */
export async function getTopicProgress(topicId: string) {
  try {
    const progress = await prisma.progress.upsert({
      where: { chapterId: topicId },
      update: { lastVisitedAt: new Date() },
      create: {
        chapterId: topicId,
        highestStage: StageType.UNDERSTAND,
        lastVisitedAt: new Date(),
      },
    });

    return progress;
  } catch (e) {
    console.warn(`Database unreachable for topic ${topicId}, using default progress:`, e);
    return {
      chapterId: topicId,
      highestStage: StageType.UNDERSTAND,
      lastVisitedAt: new Date(),
      completedAt: null,
    };
  }
}

/**
 * DB: Unlock the next stage sequentially.
 * This handles UNDERSTAND -> REINFORCE -> PRACTICE -> TEST.
 * TEST -> APPLY is handled by submitQuiz.
 */
export async function unlockNextStage(
  topicId: string, 
  currentStage: StageType, 
  quizScore?: number,
  breakdown?: Record<string, { total: number; correct: number }>
) {
  const progress = await getTopicProgress(topicId);
  
  const nextStage = getNextStage(currentStage, quizScore);

  // If it's a quiz, we should also record the attempt and update mastery
  // We'll use a mock userId for now as per the existing pattern
  if (currentStage === StageType.TEST && quizScore !== undefined) {
    await submitQuiz("prototype-user-id", topicId, quizScore, breakdown);
  }

  // If the logic says we can move forward and it's beyond current progress
  if (STAGE_ORDER.indexOf(nextStage) > STAGE_ORDER.indexOf(progress.highestStage)) {
    try {
      return await prisma.progress.update({
        where: { chapterId: topicId },
        data: { highestStage: nextStage },
      });
    } catch (e) {
      console.error('Failed to update stage in database:', e);
      return { ...progress, highestStage: nextStage }; // Return optimistic update
    }
  }

  return progress;
}

/**
 * DB: Evaluate practice submission and record it.
 */
export async function evaluatePractice(
  topicId: string,
  type: 'math' | 'code',
  submission: string,
  expected: string,
  userId?: string
) {
  let success = false;
  let result = "";

  if (type === 'math') {
    success = compareMath(submission, expected);
    result = success ? "Correct" : "Incorrect";
  } else {
    const evalResult = await runPython(submission);
    result = evalResult.stdout || evalResult.stderr || evalResult.error || "";
    success = !evalResult.error && evalResult.stdout.trim() === expected.trim();
  }

  // Record submission
  try {
    await prisma.submission.create({
      data: {
        topicId,
        stage: StageType.PRACTICE,
        userId,
        content: submission,
        result,
        success,
      },
    });
  } catch (e) {
    console.error('Failed to record submission:', e);
  }

  if (success) {
    await unlockNextStage(topicId, StageType.PRACTICE);
  }

  return { success, result };
}

/**
 * DB: Evaluate apply stage submission and record it.
 */
export async function evaluateApply(topicId: string, submission: string, userId?: string) {
  const evalResult = await runPython(submission);
  const result = evalResult.stdout || evalResult.stderr || evalResult.error || "";
  const success = !evalResult.error;

  // Record submission
  await prisma.submission.create({
    data: {
      topicId,
      stage: StageType.APPLY,
      userId,
      content: submission,
      result,
      success,
    },
  });

  if (success) {
    await prisma.progress.update({
      where: { chapterId: topicId },
      data: { 
        completedAt: new Date(),
      },
    });
  }

  return { success, result };
}

/**
 * DB: Record quiz attempt and unlock APPLY if passed.
 * Note: QuizAttempt still references User for historical reasons, 
 * but Progress (the lock) is now global.
 */
export async function submitQuiz(
  userId: string, 
  topicId: string, 
  score: number, 
  breakdown?: Record<string, { total: number; correct: number }>
) {
  const passed = score >= 0.8;
  
  let attempt = null;
  try {
    attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        topicId,
        score,
        passed,
      },
    });
  } catch (e) {
    console.error('Failed to record quiz attempt:', e);
    attempt = { userId, topicId, score, passed, createdAt: new Date() };
  }

  if (passed) {
    await prisma.progress.upsert({
      where: { chapterId: topicId },
      create: {
        chapterId: topicId,
        highestStage: StageType.APPLY,
      },
      update: {
        highestStage: StageType.APPLY,
      },
    });
    
    if (breakdown) {
      const masteryData: Record<string, { increment: number }> = {};
      const mapping: Record<string, string> = {
        'Theory': 'theoryScore',
        'Numerical': 'numericalScore',
        'Coding': 'codingScore',
        'Practical': 'practicalScore',
        'Intuition': 'intuitionScore',
        'Architecture': 'architectureScore'
      };

      Object.entries(breakdown).forEach(([dim, stats]) => {
        const field = mapping[dim];
        if (field) {
          const dimScore = (stats.correct / stats.total) * 100;
          masteryData[field] = { increment: dimScore / 5 }; // Weighted increment
        }
      });

      await prisma.userMastery.upsert({
        where: { userId },
        create: {
          userId,
          theoryScore: masteryData.theoryScore?.increment || 0,
          numericalScore: masteryData.numericalScore?.increment || 0,
          codingScore: masteryData.codingScore?.increment || 0,
          practicalScore: masteryData.practicalScore?.increment || 0,
          intuitionScore: masteryData.intuitionScore?.increment || 0,
          architectureScore: masteryData.architectureScore?.increment || 0,
        },
        update: masteryData,
      });
    }
  }

  return attempt;
}
