"use client";

import React from "react";
import { Flame } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { useProgress } from "@/components/ProgressContext";

interface TopNavProps {
  topicTitle?: string;
  currentStage?: string;
  progress?: number;
}

const STAGE_STEPS: Record<string, string> = {
  "Content": "1/5",
  "Example": "2/5",
  "Practice": "3/5",
  "Quiz": "4/5",
  "Apply": "5/5"
};

const TopNav = ({ 
  topicTitle: propTopicTitle, 
  currentStage: propCurrentStage, 
  progress: propProgress 
}: TopNavProps) => {
  const { totalMastery, streak: globalStreak, contextualInfo } = useProgress();
  
  // Prioritize context if available, fallback to props
  const topicTitle = contextualInfo.topicTitle || propTopicTitle;
  const currentStage = contextualInfo.currentStage || propCurrentStage;
  const progress = contextualInfo.progress !== undefined ? contextualInfo.progress : propProgress;

  const stepLabel = currentStage ? (STAGE_STEPS[currentStage] || "1/5") : "";

  return (
    <nav 
      className="fixed top-0 right-0 z-40 h-20 bg-white border-b-3 border-brand-dark flex items-center px-8 transition-[left] duration-300"
      style={{ left: 'var(--sidebar-width)' }}
    >
      <div className="w-full flex items-center justify-between gap-8">
        {/* Left: Content Start (Contextual) */}
        <div className="flex items-center gap-10 min-w-0">
          {topicTitle ? (
            <>
              <div className="flex items-baseline gap-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
                  Topic:
                </span>
                <span className="font-heading font-black text-brand-dark uppercase truncate max-w-[180px]">
                  {topicTitle}
                </span>
              </div>

              {currentStage && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
                    Stage:
                  </span>
                  <div className="bg-[#7B287D] text-white px-3 py-0.5 rounded-neo-sm border-2 border-brand-dark text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#330C2F]">
                    {currentStage} (Step {stepLabel})
                  </div>
                </div>
              )}

              {progress !== undefined && (
                <div className="flex items-center gap-3 flex-grow max-w-[200px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 whitespace-nowrap">
                    Stage Progress:
                  </span>
                  <div className="flex-grow">
                     <ProgressBar progress={progress} size="sm" />
                  </div>
                  <span className="text-[10px] font-black text-brand-dark">{progress}%</span>
                </div>
              )}
            </>
          ) : (
            <div className="font-heading font-black text-brand-dark uppercase tracking-widest opacity-20">
              Machine Learning Lab
            </div>
          )}
        </div>

        {/* Right: Actions & Global Progress */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end gap-1 mr-2">
                <span className="text-[9px] font-black uppercase tracking-tighter text-brand-dark/40 leading-none">Global Mastery</span>
                <div className="w-32">
                   <ProgressBar progress={totalMastery} size="sm" />
                </div>
             </div>
             
             <div className="flex items-center gap-2 bg-[#FFADAD] text-brand-dark border-3 border-brand-dark px-4 py-1.5 rounded-neo shadow-[3px_3px_0px_0px_#330C2F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
               <Flame className="w-4 h-4 fill-current" />
               <span className="font-heading font-black text-xs uppercase">{globalStreak} Day Streak</span>
             </div>
          </div>

          <button className="relative w-12 h-12 rounded-full border-3 border-brand-dark shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all overflow-hidden bg-[#A7C7E7]">
            <div className="w-full h-full flex items-center justify-center text-brand-dark font-black">
              AI
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
