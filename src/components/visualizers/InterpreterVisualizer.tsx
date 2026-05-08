'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, HelpCircle, AlertCircle, Info } from 'lucide-react';

interface ImportanceItem {
  feature: string;
  value: number; // 0 to 1
  impact: 'positive' | 'negative' | 'neutral';
  description?: string;
}

interface InterpreterData {
  type: 'importance' | 'force' | 'saliency';
  items?: ImportanceItem[];
  // For force plots
  baseValue?: number;
  prediction?: number;
  // For saliency
  grid?: number[][]; // 2D array of intensity
}

interface InterpreterVisualizerProps {
  data: InterpreterData;
  title?: string;
  className?: string;
}

export default function InterpreterVisualizer({ data, title, className }: InterpreterVisualizerProps) {
  const { type, items = [], baseValue = 0.5, prediction = 0.8 } = data;

  const renderImportance = () => (
    <div className="space-y-4">
      {items.sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-brand-dark/60">{item.feature}</span>
            <span className={cn(
              item.impact === 'positive' ? "text-green-600" : "text-red-600"
            )}>
              {item.impact === 'positive' ? '+' : '-'}{(item.value * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-brand-dark/5 flex">
            {item.impact === 'negative' && (
               <div className="flex-1 flex justify-end">
                  <div 
                    className="h-full bg-red-400 rounded-l-full" 
                    style={{ width: `${item.value * 100}%` }} 
                  />
               </div>
            )}
            <div className="w-[2px] h-full bg-brand-dark z-10" />
            {item.impact === 'positive' && (
               <div className="flex-1">
                  <div 
                    className="h-full bg-green-400 rounded-r-full" 
                    style={{ width: `${item.value * 100}%` }} 
                  />
               </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderForcePlot = () => {
    const totalDiff = prediction - baseValue;
    return (
      <div className="space-y-8 py-4">
        <div className="relative h-12 w-full bg-slate-100 rounded-neo-sm border-2 border-brand-dark overflow-hidden flex items-center">
          <div className="absolute inset-y-0 left-0 bg-red-100 border-r border-red-200" style={{ width: `${baseValue * 100}%` }} />
          <div className="absolute inset-y-0 right-0 bg-green-100 border-l border-green-200" style={{ width: `${(1 - prediction) * 100}%` }} />
          
          {/* Base Value Marker */}
          <div className="absolute top-0 bottom-0 w-[3px] bg-brand-dark/20 z-10" style={{ left: `${baseValue * 100}%` }} />
          
          {/* Prediction Arrow/Zone */}
          <div 
            className={cn(
              "absolute inset-y-0 z-20 flex items-center justify-center font-black text-xs text-white shadow-inner",
              totalDiff > 0 ? "bg-[#7B287D]" : "bg-red-500"
            )}
            style={{ 
              left: `${Math.min(baseValue, prediction) * 100}%`,
              width: `${Math.abs(totalDiff) * 100}%`
            }}
          >
            {prediction.toFixed(2)}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-dark/40 px-2">
           <div className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-red-300" />
             Base ({baseValue})
           </div>
           <div className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-[#7B287D]" />
             Prediction ({prediction})
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[8px_8px_0px_0px_#330C2F] flex flex-col gap-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <Eye className="w-3 h-3 text-[#7B287D]" />
          Explanation Lens: {type}
        </h4>
        <div className="group relative">
           <HelpCircle className="w-4 h-4 text-brand-dark/20 cursor-help" />
           <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-brand-dark text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
             This view explains the "Reasoning" behind the model's output by showing feature contributions.
           </div>
        </div>
      </div>

      <div className="bg-slate-50/50 border-2 border-dashed border-brand-dark/10 p-6 rounded-neo-sm">
        {type === 'importance' && renderImportance()}
        {type === 'force' && renderForcePlot()}
        {type === 'saliency' && (
           <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
             <AlertCircle className="w-8 h-8 text-brand-dark/10" />
             <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/20">Saliency View Placeholder</p>
           </div>
        )}
      </div>

      {/* Insight Box */}
      <div className="flex items-start gap-3 p-4 bg-[#E0FAFF] border-2 border-[#A7C7E7] rounded-neo-sm">
         <Info className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
         <p className="text-[10px] font-bold text-[#0077B6] leading-relaxed">
           Interpretation reveals that the model is heavily weighted on specific features. Does this align with your domain intuition?
         </p>
      </div>
    </div>
  );
}
