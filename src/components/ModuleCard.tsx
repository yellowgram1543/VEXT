import React from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { Module } from '@/types';

interface ModuleCardProps {
  module: Module;
  progressPercentage: number;
  completedCount: number;
  totalChapters: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  progressPercentage,
  completedCount,
  totalChapters
}) => {
  return (
    <Link
      href={`/modules/${module._id}`}
      className="group block w-full bg-primary-container border-3 border-brand-dark rounded-neo neo-brutal-shadow neo-brutal-interactive overflow-hidden flex flex-col"
    >
      {/* Top Header Strip */}
      <div className="px-4 py-2 bg-white/30 border-b-3 border-brand-dark flex justify-between items-center">
        <span className="font-heading font-bold text-xs uppercase tracking-widest text-brand-dark">
          Module {module.order}
        </span>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div>
          <h2 className="text-2xl font-black text-brand-dark mb-2 leading-tight group-hover:underline">
            {module.title}
          </h2>
          <p className="text-sm font-body font-medium text-brand-dark/80 line-clamp-2">
            {module.description}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading font-bold text-brand-dark uppercase text-[10px] tracking-widest">
              {completedCount} / {totalChapters} Chapters
            </span>
            <span className="font-heading font-bold text-brand-dark text-xs">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <ProgressBar progress={progressPercentage} size="sm" />
        </div>
      </div>
    </Link>
  );
};

export default ModuleCard;
