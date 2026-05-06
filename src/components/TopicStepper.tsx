'use client';

import React from 'react';
import { StageType } from '@prisma/client';
import { CheckCircle, Lock, Edit3, HelpCircle, BookOpen, Lightbulb, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STAGE_ORDER } from '@/lib/constants';

interface TopicStepperProps {
  highestStage: StageType;
  activeStage: StageType;
  onStageChange: (stage: StageType) => void;
}

const STAGE_LABELS: Record<StageType, string> = {
  [StageType.UNDERSTAND]: 'Understand',
  [StageType.REINFORCE]: 'Reinforce',
  [StageType.PRACTICE]: 'Practice',
  [StageType.TEST]: 'Test',
  [StageType.APPLY]: 'Apply',
};

const STAGE_ICONS: Record<StageType, React.ElementType> = {
  [StageType.UNDERSTAND]: BookOpen,
  [StageType.REINFORCE]: Lightbulb,
  [StageType.PRACTICE]: Edit3,
  [StageType.TEST]: HelpCircle,
  [StageType.APPLY]: PlayCircle,
};

export default function TopicStepper({ highestStage, activeStage, onStageChange }: TopicStepperProps) {
  const highestIndex = STAGE_ORDER.indexOf(highestStage);
  const activeIndex = STAGE_ORDER.indexOf(activeStage);

  return (
    <nav className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
      {STAGE_ORDER.map((stage, index) => {
        const isCompleted = index < highestIndex;
        const isActive = stage === activeStage;
        const isLocked = index > highestIndex;
        const Icon = STAGE_ICONS[stage];
        const label = STAGE_LABELS[stage];

        return (
          <button
            key={stage}
            disabled={isLocked}
            onClick={() => onStageChange(stage)}
            className={cn(
              "border-[3px] border-[#330C2F] p-4 rounded-lg flex items-center justify-center gap-2 transition-all",
              isActive 
                ? "bg-[#7B287D] text-white shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none" 
                : isLocked
                  ? "bg-gray-200 opacity-60 cursor-not-allowed"
                  : "bg-white text-[#330C2F] shadow-[4px_4px_0px_0px_#330C2F] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none"
            )}
          >
            {isCompleted ? (
              <CheckCircle className={cn("w-5 h-5", isActive ? "text-white" : "text-blue-600")} />
            ) : isLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span className="font-bold uppercase tracking-wider text-sm">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
