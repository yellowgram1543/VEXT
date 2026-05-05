'use client';

import React from 'react';
import { StageType } from '@prisma/client';
import { Topic } from '@/types';
import UnderstandCell from './stages/UnderstandCell';
import ReinforceCell from './stages/ReinforceCell';
import PracticeCell from './stages/PracticeCell';
import QuizCell from './stages/QuizCell';
import ApplyCell from './stages/ApplyCell';
import { STAGE_ORDER } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lock, Play, Circle } from 'lucide-react';

interface TopicFlowProps {
  topic: Topic;
  initialHighestStage: StageType;
}

type BlockStatus = 'COMPLETED' | 'ACTIVE' | 'LOCKED';

const STAGE_LABELS: Record<StageType, string> = {
  [StageType.UNDERSTAND]: 'Content',
  [StageType.REINFORCE]: 'Example',
  [StageType.PRACTICE]: 'Practice',
  [StageType.TEST]: 'Quiz',
  [StageType.APPLY]: 'Apply',
};

export default function TopicFlow({ topic, initialHighestStage }: TopicFlowProps) {
  const highestIndex = STAGE_ORDER.indexOf(initialHighestStage);

  const getStatus = (stage: StageType): BlockStatus => {
    const stageIndex = STAGE_ORDER.indexOf(stage);
    if (stageIndex < highestIndex) return 'COMPLETED';
    if (stageIndex === highestIndex) return 'ACTIVE';
    return 'LOCKED';
  };

  const renderStageIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
        {STAGE_ORDER.map((stage, index) => {
          const status = getStatus(stage);
          return (
            <div key={stage} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 border-3 border-brand-dark rounded-neo font-heading font-black uppercase text-xs tracking-widest transition-all",
                status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                status === 'ACTIVE' ? "bg-[#7B287D] text-white shadow-[4px_4px_0px_0px_#330C2F]" :
                "bg-gray-100 text-brand-dark/30 border-dashed"
              )}>
                {status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
                {status === 'ACTIVE' && <Play className="w-4 h-4 fill-current" />}
                {status === 'LOCKED' && <Lock className="w-4 h-4" />}
                <span>{STAGE_LABELS[stage]}</span>
              </div>
              {index < STAGE_ORDER.length - 1 && (
                <div className="h-[3px] w-4 bg-brand-dark/20 rounded-full hidden md:block" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBlockHeader = (stage: StageType, colorClass: string) => {
    const status = getStatus(stage);
    const label = STAGE_LABELS[stage];
    const prevLabel = STAGE_ORDER[STAGE_ORDER.indexOf(stage) - 1] ? STAGE_LABELS[STAGE_ORDER[STAGE_ORDER.indexOf(stage) - 1]] : "";
    const title = `${STAGE_ORDER.indexOf(stage) + 1}. ${label}`;
    
    return (
      <div className="relative group/block">
        <div className={cn(
          "px-6 py-4 border-b-3 border-brand-dark flex justify-between items-center transition-all",
          status === 'LOCKED' ? "bg-gray-100" : colorClass
        )}>
          <span className="font-heading font-black text-sm uppercase tracking-widest">
            {title}
          </span>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-neo-sm border-2 border-brand-dark font-black text-[10px] uppercase",
            status === 'COMPLETED' ? "bg-green-500 text-white shadow-[2px_2px_0px_0px_#330C2F]" :
            status === 'ACTIVE' ? "bg-[#7B287D] text-white shadow-[2px_2px_0px_0px_#330C2F]" :
            "bg-gray-400 text-white"
          )}>
            {status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
            {status === 'ACTIVE' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            {status === 'LOCKED' && <Lock className="w-3 h-3" />}
            {status}
          </div>
        </div>

        {status === 'LOCKED' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/40 backdrop-blur-[1px]">
             <div className="bg-white border-2 border-brand-dark px-4 py-2 rounded-neo shadow-[4px_4px_0px_0px_#330C2F] flex items-center gap-3">
                <Lock className="w-4 h-4 text-brand-dark/40" />
                <span className="font-heading font-black text-[10px] uppercase tracking-widest text-brand-dark/60">
                  Unlock after completing {prevLabel}
                </span>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[800px] mx-auto py-12 flex flex-col">
      {renderStageIndicator()}

      <div className="flex flex-col gap-12">
        {/* 1. Understand Block */}
        <section className={cn(
          "border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all",
          getStatus(StageType.UNDERSTAND) === 'LOCKED' && "opacity-50 blur-[2px] pointer-events-none grayscale select-none"
        )}>
          {renderBlockHeader(StageType.UNDERSTAND, "bg-[#A7C7E7]")}
          <div className="p-8">
            <UnderstandCell content={topic.understand?.content || []} />
          </div>
        </section>

        {/* 2. Reinforce Block */}
        <section className={cn(
          "border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all",
          getStatus(StageType.REINFORCE) === 'LOCKED' && "opacity-50 blur-[2px] pointer-events-none grayscale select-none"
        )}>
          {renderBlockHeader(StageType.REINFORCE, "bg-[#F1D6FF]")}
          <div className="p-8">
            <ReinforceCell practices={topic.reinforce?.practices || []} />
          </div>
        </section>

        {/* 3. Practice Block */}
        <section className={cn(
          "border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all",
          getStatus(StageType.PRACTICE) === 'LOCKED' && "opacity-50 blur-[2px] pointer-events-none grayscale select-none"
        )}>
          {renderBlockHeader(StageType.PRACTICE, "bg-white")}
          <div className="p-8">
            <PracticeCell topicId={topic._id} />
          </div>
        </section>

        {/* 4. Test Block */}
        <section className={cn(
          "border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all",
          getStatus(StageType.TEST) === 'LOCKED' && "opacity-50 blur-[2px] pointer-events-none grayscale select-none"
        )}>
          {renderBlockHeader(StageType.TEST, "bg-white")}
          <div className="p-8">
            <QuizCell questions={topic.test?.questions || []} topicId={topic._id} />
          </div>
        </section>

        {/* 5. Apply Block */}
        <section className={cn(
          "border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all",
          getStatus(StageType.APPLY) === 'LOCKED' && "opacity-50 blur-[2px] pointer-events-none grayscale select-none"
        )}>
          {renderBlockHeader(StageType.APPLY, "bg-[#FFADAD]")}
          <div className="p-8">
            <ApplyCell 
              topicId={topic._id} 
              instruction={topic.apply?.instruction} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}
