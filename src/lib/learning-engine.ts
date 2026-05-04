import { prisma } from "./prisma";
import { StageType } from "@prisma/client";

export const STAGE_ORDER: StageType[] = [
  StageType.UNDERSTAND,
  StageType.REINFORCE,
  StageType.TEST,
  StageType.APPLY,
];

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
 * DB: Retrieve or initialize TopicProgress.
 */
export async function getTopicProgress(userId: string, topicId: string) {
  let progress = await prisma.topicProgress.findUnique({
    where: {
      userId_topicId: { userId, topicId },
    },
  });

  if (!progress) {
    progress = await prisma.topicProgress.create({
      data: {
        userId,
        topicId,
        highestStage: StageType.UNDERSTAND,
      },
    });
  }

  return progress;
}

/**
 * DB: Unlock the next stage sequentially.
 * This handles UNDERSTAND -> REINFORCE -> TEST.
 * TEST -> APPLY is handled by submitQuiz.
 */
export async function unlockNextStage(userId: string, topicId: string, currentStage: StageType) {
  const progress = await getTopicProgress(userId, topicId);
  
  const nextStage = getNextStage(currentStage);

  // If the logic says we can move forward and it's beyond current progress
  if (STAGE_ORDER.indexOf(nextStage) > STAGE_ORDER.indexOf(progress.highestStage)) {
    return await prisma.topicProgress.update({
      where: { id: progress.id },
      data: { highestStage: nextStage },
    });
  }

  return progress;
}

/**
 * DB: Record quiz attempt and unlock APPLY if passed.
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
    await prisma.topicProgress.upsert({
      where: {
        userId_topicId: { userId, topicId },
      },
      create: {
        userId,
        topicId,
        highestStage: StageType.APPLY,
      },
      update: {
        highestStage: StageType.APPLY,
      },
    });
    
    // Update UserMastery - simplistic for now as per plan focus on state machine
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
