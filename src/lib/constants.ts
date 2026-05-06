import { StageType } from "@prisma/client";

export const STAGE_ORDER: StageType[] = [
  StageType.UNDERSTAND,
  StageType.REINFORCE,
  StageType.PRACTICE,
  StageType.TEST,
  StageType.APPLY,
];

export const STAGE_LABELS: Record<StageType, string> = {
  [StageType.UNDERSTAND]: 'Content',
  [StageType.REINFORCE]: 'Example',
  [StageType.PRACTICE]: 'Practice',
  [StageType.TEST]: 'Quiz',
  [StageType.APPLY]: 'Apply',
};
