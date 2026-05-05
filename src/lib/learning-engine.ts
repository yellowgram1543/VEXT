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
  let progress = await prisma.progress.findUnique({
    where: {
      chapterId: topicId,
    },
  });

  if (!progress) {
    progress = await prisma.progress.create({
      data: {
        chapterId: topicId,
        highestStage: StageType.UNDERSTAND,
      },
    });
  }

  return progress;
}

/**
 * DB: Unlock the next stage sequentially.
 * This handles UNDERSTAND -> REINFORCE -> PRACTICE -> TEST.
 * TEST -> APPLY is handled by submitQuiz.
 */
export async function unlockNextStage(topicId: string, currentStage: StageType) {
  const progress = await getTopicProgress(topicId);
  
  const nextStage = getNextStage(currentStage);

  // If the logic says we can move forward and it's beyond current progress
  if (STAGE_ORDER.indexOf(nextStage) > STAGE_ORDER.indexOf(progress.highestStage)) {
    return await prisma.progress.update({
      where: { chapterId: topicId },
      data: { highestStage: nextStage },
    });
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
export async function submitQuiz(userId: string, topicId: string, score: number) {
  const passed = score >= 0.8;
  
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      topicId,
      score,
      passed,
    },
  });

  if (passed) {
    await prisma.progress.upsert({
      where: {
        chapterId: topicId,
      },
      create: {
        chapterId: topicId,
        highestStage: StageType.APPLY,
      },
      update: {
        highestStage: StageType.APPLY,
      },
    });
    
    // Update UserMastery
    await prisma.userMastery.upsert({
      where: { userId },
      create: {
        userId,
        conceptsScore: score * 100,
      },
      update: {
        conceptsScore: {
          increment: 5,
        },
      },
    });
  }

  return attempt;
}
