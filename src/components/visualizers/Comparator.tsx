'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Visualizer from './index';
import { Columns } from 'lucide-react';

interface VisualizerConfig {
  name: string;
  data: any;
  title?: string;
}

interface ComparatorProps {
  data: {
    left: VisualizerConfig;
    right: VisualizerConfig;
    layout?: 'horizontal' | 'vertical';
    syncScroll?: boolean;
  };
  className?: string;
}

export default function Comparator({ data, className }: ComparatorProps) {
  const { left, right, layout = 'horizontal' } = data;

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[10px_10px_0px_0px_#330C2F] flex flex-col gap-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-brand-dark/5 pb-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <Columns className="w-3 h-3 text-[#7B287D]" />
          Comparative Analysis
        </h4>
        <div className="flex items-center gap-2">
           <div className="px-2 py-1 bg-[#F1D6FF] text-[#7B287D] rounded text-[8px] font-black uppercase tracking-widest border border-[#7B287D]/20">
             Contrast Mode
           </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={cn(
        "grid gap-6",
        layout === 'horizontal' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}>
        {/* Left Side */}
        <div className="space-y-3">
          {left.title && (
            <div className="text-[10px] font-black uppercase tracking-widest text-center py-1 bg-slate-50 border-2 border-brand-dark/5 rounded-full">
              {left.title}
            </div>
          )}
          <Visualizer 
            name={left.name} 
            data={left.data} 
            className="border-2 border-brand-dark/10 shadow-sm"
          />
        </div>

        {/* Right Side */}
        <div className="space-y-3">
          {right.title && (
            <div className="text-[10px] font-black uppercase tracking-widest text-center py-1 bg-slate-50 border-2 border-brand-dark/5 rounded-full">
              {right.title}
            </div>
          )}
          <Visualizer 
            name={right.name} 
            data={right.data} 
            className="border-2 border-brand-dark/10 shadow-sm"
          />
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-brand-dark text-white p-4 rounded-neo-sm flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="font-black text-xs">VS</span>
        </div>
        <p className="text-[10px] font-bold leading-relaxed opacity-80 italic">
          Compare the behaviors above. Look for differences in gradients, boundaries, or convergence rates.
        </p>
      </div>
    </div>
  );
}
