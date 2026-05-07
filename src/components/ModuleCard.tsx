import React from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import CognitiveRadar from './CognitiveRadar';
import { Module } from '@/types';

interface ModuleCardProps {
  module: Module;
  progressPercentage: number;
  completedCount: number;
  totalChapters: number;
  cognitiveProfile?: { label: string; value: number }[];
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  progressPercentage,
  completedCount,
  totalChapters,
  cognitiveProfile
}) => {
  // Generate a mock profile if none exists, based on the module progress
  const defaultProfile = [
    { label: 'Theory', value: Math.min(1, (progressPercentage / 100) * 1.2) },
    { label: 'Numerical', value: Math.min(1, (progressPercentage / 100) * 0.8) },
    { label: 'Coding', value: Math.min(1, (progressPercentage / 100) * 0.9) },
    { label: 'Practical', value: Math.min(1, (progressPercentage / 100) * 0.7) },
    { label: 'Intuition', value: Math.min(1, (progressPercentage / 100) * 0.6) },
    { label: 'Arch', value: Math.min(1, (progressPercentage / 100) * 0.5) },
  ];

  return (
    <Link
      href={`/modules/${module._id}`}
      className="group block w-full bg-white border-3 border-brand-dark rounded-neo neo-brutal-shadow neo-brutal-interactive overflow-hidden flex flex-col sm:flex-row h-full"
    >
      {/* Left Column: Info (Flexible) */}
      <div className="p-6 flex-[3] flex flex-col justify-between border-b-3 sm:border-b-0 sm:border-r-3 border-brand-dark bg-primary-container/20">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-brand-dark/60 bg-white px-2 py-1 border-2 border-brand-dark rounded-neo-sm">
              Module 0{module.order}
            </span>
          </div>
          <h2 className="text-2xl font-black text-brand-dark mb-2 leading-tight group-hover:text-[#7B287D] transition-colors">
            {module.title}
          </h2>
          <p className="text-sm font-body font-medium text-brand-dark/80 line-clamp-2">
            {module.description}
          </p>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading font-bold text-brand-dark uppercase text-[10px] tracking-widest">
              {completedCount} / {totalChapters} Chapters
            </span>
            <span className="font-heading font-black text-brand-dark text-xs">
              {Math.round(progressPercentage)}% Mastery
            </span>
          </div>
          <ProgressBar progress={progressPercentage} size="sm" />
        </div>
      </div>

      {/* Right Column: Cognitive Profile (Fixed Width) */}
      <div className="p-6 bg-slate-50 flex flex-col items-center justify-center w-full sm:w-[200px] overflow-visible border-t-3 sm:border-t-0 border-brand-dark">
        <span className="font-heading font-black text-[8px] uppercase tracking-[0.2em] text-brand-dark/30 mb-2">
          Cognitive Profile
        </span>
        <div className="relative overflow-visible w-full flex justify-center">
          <CognitiveRadar 
            data={cognitiveProfile || defaultProfile} 
            size={140} 
          />
        </div>
      </div>
    </Link>
    </Link>
  );
};

export default ModuleCard;
