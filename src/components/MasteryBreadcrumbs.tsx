'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, Zap, Dumbbell, Target, Rocket, ChevronRight 
} from 'lucide-react';

export enum StageType {
  CONCEPT = 'CONCEPT',
  REINFORCE = 'REINFORCE',
  PRACTICE = 'PRACTICE',
  QUIZ = 'QUIZ',
  APPLY = 'APPLY'
}

interface MasteryBreadcrumbsProps {
  currentStage: StageType;
}

const STAGES = [
  { id: StageType.CONCEPT, label: 'Concept', icon: Lightbulb, color: '#CDB4DB' },
  { id: StageType.REINFORCE, label: 'Reinforce', icon: Zap, color: '#A7C7E7' },
  { id: StageType.PRACTICE, label: 'Practice', icon: Dumbbell, color: '#FFC8DD' },
  { id: StageType.QUIZ, label: 'Quiz', icon: Target, color: '#BDE0FE' },
  { id: StageType.APPLY, label: 'Apply', icon: Rocket, color: '#FFAFCC' },
];

export default function MasteryBreadcrumbs({ currentStage }: MasteryBreadcrumbsProps) {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full mb-12 flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30">
           Cognitive Mastery Journey
         </span>
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30">
           {currentIndex + 1} / {STAGES.length} Complete
         </span>
      </div>
      
      <div className="flex items-center justify-between bg-white border-3 border-brand-dark rounded-neo p-2 shadow-[4px_4px_0px_0px_#330C2F] relative overflow-hidden">
        {/* Progress Fill Layer */}
        <div 
          className="absolute inset-y-0 left-0 bg-[#7B287D]/5 transition-all duration-700 ease-in-out" 
          style={{ width: `${((currentIndex + 1) / STAGES.length) * 100}%` } as React.CSSProperties}
        />

        {STAGES.map((stage, idx) => {
          const isActive = stage.id === currentStage;
          const isPast = idx < currentIndex;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              <div className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-neo transition-all duration-500 relative z-10",
                isActive ? "bg-white border-3 border-brand-dark shadow-[4px_4px_0px_0px_#330C2F] translate-y-[-2px] scale-105" : "border-3 border-transparent",
                isPast ? "opacity-100" : isActive ? "opacity-100" : "opacity-30 grayscale"
              )}>
                <div className={cn(
                  "p-1.5 rounded-lg border-2 border-brand-dark transition-colors duration-500",
                  isActive ? "bg-brand-dark text-white" : "bg-white text-brand-dark",
                  isPast && "bg-green-400"
                )}>
                  <Icon className={cn("w-3.5 h-3.5", isActive && "animate-pulse")} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest hidden md:block",
                  isActive ? "text-brand-dark" : "text-brand-dark/40"
                )}>
                  {stage.label}
                </span>
                
                {isActive && (
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#7B287D] rounded-full animate-ping" />
                )}
              </div>
              
              {idx < STAGES.length - 1 && (
                <div className="flex-shrink-0 px-1 opacity-20">
                  <ChevronRight className="w-4 h-4 text-brand-dark" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
