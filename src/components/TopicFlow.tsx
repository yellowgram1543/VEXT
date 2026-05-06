'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StageType } from '@prisma/client';
import { Topic } from '@/types';
import UnderstandCell from './stages/UnderstandCell';
import ReinforceCell from './stages/ReinforceCell';
import PracticeCell from './stages/PracticeCell';
import QuizCell from './stages/QuizCell';
import ApplyCell from './stages/ApplyCell';
import { STAGE_ORDER, STAGE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lock, Play } from 'lucide-react';
import { useProgress } from './ProgressContext';
import MLVisualizer from './MLVisualizer';
import ProbabilityVisualizer from './ProbabilityVisualizer';

interface TopicFlowProps {
  topic: Topic;
  initialHighestStage: StageType;
}

type BlockStatus = 'COMPLETED' | 'ACTIVE' | 'LOCKED';


export default function TopicFlow({ topic, initialHighestStage }: TopicFlowProps) {
  const router = useRouter();
  const { setContextualInfo } = useProgress();
  const [highestStage, setHighestStage] = useState<StageType>(initialHighestStage);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const highestIndex = STAGE_ORDER.indexOf(highestStage);

  useEffect(() => {
    // Calculate stage-based progress for the topic (each stage is 20%)
    const stageProgress = Math.min(100, (highestIndex + 1) * 20);
    
    setContextualInfo({
      topicTitle: topic.title,
      currentStage: STAGE_LABELS[highestStage],
      progress: stageProgress
    });

    // Cleanup on unmount
    return () => setContextualInfo({});
  }, [topic.title, highestStage, highestIndex, setContextualInfo]);

  const handleUnlock = async (currentStage: StageType, score?: number) => {
    if (isUnlocking) return;
    
    setIsUnlocking(true);
    console.log(`[TopicFlow] Requesting unlock for stage: ${currentStage}${score !== undefined ? ` with score: ${score}` : ''}`);
    try {
      const response = await fetch(`/api/progress/${topic._id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStage, score }),
      });

      console.log(`[TopicFlow] Response received: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`[TopicFlow] Unlock success:`, data);
        setHighestStage(data.highestStage);
        router.refresh();
      } else {
        console.error('Failed to unlock stage:', await response.text());
      }
    } catch (error) {
      console.error('Failed to unlock stage:', error);
    } finally {
      setIsUnlocking(false);
    }
  };

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
    const title = `${STAGE_ORDER.indexOf(stage) + 1}. ${label}`;
    
    return (
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
    );
  };

  const renderUnlockOverlay = (stage: StageType) => {
    const status = getStatus(stage);
    if (status !== 'LOCKED') return null;

    const prevLabel = STAGE_ORDER[STAGE_ORDER.indexOf(stage) - 1] ? STAGE_LABELS[STAGE_ORDER[STAGE_ORDER.indexOf(stage) - 1]] : "";

    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/20">
         <div className="bg-white border-3 border-brand-dark px-6 py-3 rounded-neo shadow-[6px_6px_0px_0px_#330C2F] flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <Lock className="w-5 h-5 text-[#7B287D]" />
            <span className="font-heading font-black text-xs uppercase tracking-widest text-brand-dark">
              Unlock after completing {prevLabel}
            </span>
         </div>
      </div>
    );
  };

  return (
    <div className="max-w-[800px] mx-auto py-12 flex flex-col">
      {renderStageIndicator()}

      <div className="flex flex-col gap-12">
        {/* 1. Understand Block */}
        <section className="relative border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all">
          <div className={cn(
            "transition-all duration-500",
            getStatus(StageType.UNDERSTAND) === 'LOCKED' && "blur-[8px] grayscale opacity-40 pointer-events-none select-none"
          )}>
            {renderBlockHeader(StageType.UNDERSTAND, "bg-[#A7C7E7]")}
            <div className="p-8">
              <MLVisualizer 
                type="loss" 
                title="Model Training Dynamics (Live Demo)"
                className="mb-8"
                data={{
                  labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5', 'Epoch 6', 'Epoch 7', 'Epoch 8', 'Epoch 9', 'Epoch 10'],
                  trainLoss: [0.9, 0.7, 0.55, 0.45, 0.38, 0.32, 0.28, 0.25, 0.22, 0.2],
                  valLoss: [0.95, 0.8, 0.65, 0.58, 0.55, 0.53, 0.52, 0.51, 0.5, 0.5],
                  xAxisLabel: 'Training Progression',
                  yAxisLabel: 'Error (Loss)'
                }}
              />
              <ProbabilityVisualizer />
              <div className="mb-8" />
              <UnderstandCell 
                content={topic.understand?.content || []} 
                onComplete={() => handleUnlock(StageType.UNDERSTAND)}
                status={getStatus(StageType.UNDERSTAND)}
                loading={isUnlocking}
              />
            </div>
          </div>
          {renderUnlockOverlay(StageType.UNDERSTAND)}
        </section>

        {/* 2. Reinforce Block */}
        <section className="relative border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all">
          <div className={cn(
            "transition-all duration-500",
            getStatus(StageType.REINFORCE) === 'LOCKED' && "blur-[8px] grayscale opacity-40 pointer-events-none select-none"
          )}>
            {renderBlockHeader(StageType.REINFORCE, "bg-[#F1D6FF]")}
            <div className="p-8">
              <ReinforceCell 
                practices={topic.reinforce?.practices || []} 
                onComplete={() => handleUnlock(StageType.REINFORCE)}
                status={getStatus(StageType.REINFORCE)}
                loading={isUnlocking}
              />
            </div>
          </div>
          {renderUnlockOverlay(StageType.REINFORCE)}
        </section>

        {/* 3. Practice Block */}
        <section className="relative border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all">
          <div className={cn(
            "transition-all duration-500",
            getStatus(StageType.PRACTICE) === 'LOCKED' && "blur-[8px] grayscale opacity-40 pointer-events-none select-none"
          )}>
            {renderBlockHeader(StageType.PRACTICE, "bg-white")}
            <div className="p-8">
              <PracticeCell 
                topicId={topic._id} 
                onComplete={() => handleUnlock(StageType.PRACTICE)}
                status={getStatus(StageType.PRACTICE)}
                loading={isUnlocking}
              />
            </div>
          </div>
          {renderUnlockOverlay(StageType.PRACTICE)}
        </section>

        {/* 4. Test Block */}
        <section className="relative border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all">
          <div className={cn(
            "transition-all duration-500",
            getStatus(StageType.TEST) === 'LOCKED' && "blur-[8px] grayscale opacity-40 pointer-events-none select-none"
          )}>
            {renderBlockHeader(StageType.TEST, "bg-white")}
            <div className="p-8">
              <QuizCell 
                questions={topic.test?.questions || []} 
                topicId={topic._id} 
                onComplete={(score) => handleUnlock(StageType.TEST, score)}
              />
            </div>
          </div>
          {renderUnlockOverlay(StageType.TEST)}
        </section>

        {/* 5. Apply Block */}
        <section className="relative border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] overflow-hidden bg-white transition-all">
          <div className={cn(
            "transition-all duration-500",
            getStatus(StageType.APPLY) === 'LOCKED' && "blur-[8px] grayscale opacity-40 pointer-events-none select-none"
          )}>
            {renderBlockHeader(StageType.APPLY, "bg-[#FFADAD]")}
            <div className="p-8">
              <ApplyCell 
                topicId={topic._id} 
                instruction={topic.apply?.instruction} 
              />
            </div>
          </div>
          {renderUnlockOverlay(StageType.APPLY)}
        </section>
      </div>
    </div>
  );
}
