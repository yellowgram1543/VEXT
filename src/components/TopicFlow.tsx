'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
import { CheckCircle2, Lock, Play, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
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
  const [activeStage, setActiveStage] = useState<StageType>(initialHighestStage);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const highestIndex = useMemo(() => STAGE_ORDER.indexOf(highestStage), [highestStage]);
  const activeIndex = useMemo(() => STAGE_ORDER.indexOf(activeStage), [activeStage]);

  useEffect(() => {
    const stageProgress = Math.min(100, (highestIndex + 1) * 20);
    
    setContextualInfo({
      topicTitle: topic.title,
      currentStage: STAGE_LABELS[activeStage],
      progress: stageProgress
    });

    return () => setContextualInfo({});
  }, [topic.title, highestStage, activeStage, highestIndex, setContextualInfo]);

  const handleUnlock = async (currentStage: StageType, score?: number) => {
    if (isUnlocking) return;
    
    setIsUnlocking(true);
    try {
      const response = await fetch(`/api/progress/${topic._id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStage, score }),
      });

      if (response.ok) {
        const data = await response.json();
        setHighestStage(data.highestStage);
        
        // Auto-advance to next stage
        const nextIndex = STAGE_ORDER.indexOf(currentStage) + 1;
        if (nextIndex < STAGE_ORDER.length) {
          setTimeout(() => {
            setDirection('next');
            setActiveStage(STAGE_ORDER[nextIndex]);
          }, 1500); // Small delay to show completion state
        }
        router.refresh();
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

  const handleStageClick = (stage: StageType) => {
    const status = getStatus(stage);
    if (status === 'LOCKED') return;
    
    const targetIndex = STAGE_ORDER.indexOf(stage);
    setDirection(targetIndex > activeIndex ? 'next' : 'prev');
    setActiveStage(stage);
  };

  const renderStageIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap bg-white/50 backdrop-blur-md p-4 rounded-neo border-3 border-brand-dark sticky top-24 z-30 shadow-[6px_6px_0px_0px_#330C2F]">
        {STAGE_ORDER.map((stage, index) => {
          const status = getStatus(stage);
          const isActive = activeStage === stage;
          return (
            <div key={stage} className="flex items-center gap-2">
              <button 
                onClick={() => handleStageClick(stage)}
                disabled={status === 'LOCKED'}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-3 border-brand-dark rounded-neo font-heading font-black uppercase text-[10px] md:text-xs tracking-widest transition-all",
                  isActive ? "bg-[#7B287D] text-white shadow-[4px_4px_0px_0px_#330C2F] translate-x-[-2px] translate-y-[-2px]" :
                  status === 'COMPLETED' ? "bg-green-100 text-green-700 hover:bg-green-200" :
                  status === 'ACTIVE' ? "bg-white text-brand-dark hover:bg-slate-50" :
                  "bg-gray-100 text-brand-dark/20 border-dashed cursor-not-allowed"
                )}
              >
                {status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> :
                 status === 'LOCKED' ? <Lock className="w-4 h-4" /> :
                 <Play className={cn("w-3 h-3", isActive ? "fill-white" : "fill-brand-dark")} />}
                <span className="hidden sm:inline">{STAGE_LABELS[stage]}</span>
              </button>
              {index < STAGE_ORDER.length - 1 && (
                <div className="h-[2px] w-2 md:w-4 bg-brand-dark/10 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderActiveStage = () => {
    const status = getStatus(activeStage);
    
    return (
      <div key={activeStage} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        <section className="relative border-3 border-brand-dark rounded-neo shadow-[12px_12px_0px_0px_#330C2F] overflow-hidden bg-white">
          {/* Header */}
          <div className={cn(
            "px-8 py-6 border-b-3 border-brand-dark flex justify-between items-center",
            activeStage === StageType.UNDERSTAND ? "bg-[#A7C7E7]" :
            activeStage === StageType.REINFORCE ? "bg-[#F1D6FF]" :
            activeStage === StageType.PRACTICE ? "bg-[#CDB4DB]" :
            activeStage === StageType.TEST ? "bg-[#FFC8DD]" : "bg-[#FFADAD]"
          )}>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-1">
                Module 0{activeIndex + 1}
              </span>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tighter">
                {STAGE_LABELS[activeStage]}
              </h2>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-neo border-3 border-brand-dark font-black text-xs uppercase tracking-widest",
              status === 'COMPLETED' ? "bg-green-500 text-white shadow-[4px_4px_0px_0px_#14532d]" :
              "bg-white text-brand-dark shadow-[4px_4px_0px_0px_#330C2F]"
            )}>
              {status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-[#7B287D]" />}
              {status === 'COMPLETED' ? "Mastered" : "In Progress"}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {activeStage === StageType.UNDERSTAND && (
              <div className="space-y-12">
                <MLVisualizer 
                  type="loss" 
                  title="Model Training Dynamics (Live Demo)"
                  data={{
                    labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5', 'Epoch 6', 'Epoch 7', 'Epoch 8', 'Epoch 9', 'Epoch 10'],
                    trainLoss: [0.9, 0.7, 0.55, 0.45, 0.38, 0.32, 0.28, 0.25, 0.22, 0.2],
                    valLoss: [0.95, 0.8, 0.65, 0.58, 0.55, 0.53, 0.52, 0.51, 0.5, 0.5],
                    xAxisLabel: 'Training Progression',
                    yAxisLabel: 'Error (Loss)'
                  }}
                />
                <ProbabilityVisualizer />
                <UnderstandCell 
                  content={topic.understand?.content || []} 
                  onComplete={() => handleUnlock(StageType.UNDERSTAND)}
                  status={status}
                  loading={isUnlocking}
                />
              </div>
            )}

            {activeStage === StageType.REINFORCE && (
              <ReinforceCell 
                practices={topic.reinforce?.practices || []} 
                onComplete={() => handleUnlock(StageType.REINFORCE)}
                status={status}
                loading={isUnlocking}
              />
            )}

            {activeStage === StageType.PRACTICE && (
              <PracticeCell 
                topicId={topic._id} 
                onComplete={() => handleUnlock(StageType.PRACTICE)}
                status={status}
                loading={isUnlocking}
              />
            )}

            {activeStage === StageType.TEST && (
              <QuizCell 
                questions={topic.test?.questions || []} 
                topicId={topic._id} 
                onComplete={(score, breakdown) => handleUnlock(StageType.TEST, score, breakdown)}
              />
            )}

            {activeStage === StageType.APPLY && (
              <ApplyCell 
                topicId={topic._id} 
                instruction={topic.apply?.instruction} 
                onComplete={() => handleUnlock(StageType.APPLY)}
              />
            )}
          </div>

          {/* Footer Navigation */}
          <div className="bg-slate-50 border-t-3 border-brand-dark p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            {activeIndex === 0 ? (
              /* First Block: Content */
              topic.prevChapter ? (
                <button
                  onClick={() => router.push(`/chapters/${topic.prevChapter?.slug.current}`)}
                  className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-brand-dark/40 hover:text-brand-dark transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Prev Chapter
                </button>
              ) : (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-brand-dark/40 hover:text-brand-dark transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Prev Module
                </button>
              )
            ) : (
              /* Intermediate Blocks */
              <button
                onClick={() => handleStageClick(STAGE_ORDER[activeIndex - 1])}
                className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-brand-dark/40 hover:text-brand-dark transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Prev Block
              </button>
            )}
            
            <div className="flex gap-2">
              {STAGE_ORDER.map((_, i) => (
                <div key={i} className={cn(
                  "w-2 h-2 rounded-full border-2 border-brand-dark transition-all",
                  i === activeIndex ? "w-6 bg-[#7B287D]" : i < highestIndex ? "bg-green-500" : "bg-white"
                )} />
              ))}
            </div>

            {activeIndex === STAGE_ORDER.length - 1 ? (
              /* Last Block: Apply */
              topic.nextChapter ? (
                <button
                  onClick={() => router.push(`/chapters/${topic.nextChapter?.slug.current}`)}
                  className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-[#7B287D] hover:translate-x-1 transition-all"
                >
                  Next Chapter <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-green-600 hover:translate-x-1 transition-all"
                >
                  Next Module <ArrowRight className="w-4 h-4" />
                </button>
              )
            ) : (
              /* Intermediate Blocks */
              <button
                onClick={() => handleStageClick(STAGE_ORDER[activeIndex + 1])}
                disabled={getStatus(STAGE_ORDER[activeIndex + 1]) === 'LOCKED'}
                className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-[#7B287D] hover:translate-x-1 disabled:opacity-0 transition-all"
              >
                Next Block <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="max-w-[1000px] mx-auto py-12 px-6 flex flex-col min-h-screen">
      {renderStageIndicator()}
      {renderActiveStage()}
      
      {/* Visual background element */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-5">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B287D] rounded-full blur-[128px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#CDB4DB] rounded-full blur-[128px]" />
      </div>
    </div>
  );
}
