'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Database, Zap, Cpu, Search, CheckCircle2, FlaskConical, Globe } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  type: 'data' | 'transform' | 'model' | 'eval' | 'deploy';
  description?: string;
  status?: 'pending' | 'active' | 'completed';
}

interface DataShape {
  label: string; // e.g. "(1000, 20)"
  color?: string;
}

interface PipelineData {
  steps: Step[];
  dataShapes?: Record<string, DataShape>; // Map after-step-id to shape
  orientation?: 'horizontal' | 'vertical';
}

interface PipelineVisualizerProps {
  data: PipelineData;
  title?: string;
  className?: string;
}

const ICON_MAP = {
  data: Database,
  transform: Zap,
  model: Cpu,
  eval: Search,
  deploy: Globe
};

export default function PipelineVisualizer({ data, title, className }: PipelineVisualizerProps) {
  const { steps, dataShapes, orientation = 'horizontal' } = data;

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[8px_8px_0px_0px_#330C2F] flex flex-col gap-8",
      className
    )}>
      {title && (
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <FlaskConical className="w-3 h-3 text-[#7B287D]" />
          {title}
        </h4>
      )}

      <div className={cn(
        "flex items-center gap-4 overflow-x-auto py-4 scrollbar-hide",
        orientation === 'horizontal' ? "flex-row" : "flex-col"
      )}>
        {steps.map((step, index) => {
          const Icon = ICON_MAP[step.type] || Database;
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="flex flex-col items-center gap-3 min-w-[140px]">
                <div className={cn(
                  "w-16 h-16 rounded-neo-sm border-3 flex items-center justify-center transition-all relative",
                  isActive ? "bg-[#7B287D] border-brand-dark text-white scale-110 shadow-[4px_4px_0px_0px_#330C2F]" :
                  isCompleted ? "bg-green-100 border-green-600 text-green-700" :
                  "bg-white border-brand-dark/10 text-brand-dark/20"
                )}>
                  <Icon className="w-8 h-8" />
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full border-2 border-white p-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isActive ? "text-brand-dark" : "text-brand-dark/40"
                  )}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[8px] font-bold text-brand-dark/20 mt-1 max-w-[120px] leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector & Data Shape */}
              {index < steps.length - 1 && (
                <div className="flex flex-col items-center gap-2 px-2">
                  <ArrowRight className={cn(
                    "w-6 h-6",
                    isCompleted ? "text-green-500" : "text-brand-dark/10"
                  )} />
                  {dataShapes?.[step.id] && (
                    <div className="bg-slate-50 border-2 border-brand-dark/5 px-2 py-1 rounded text-[8px] font-black font-code text-brand-dark/40 shadow-sm">
                      {dataShapes[step.id].label}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Legend / Process Note */}
      <div className="bg-slate-50 border-2 border-brand-dark/5 p-4 rounded-neo-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#7B287D]" />
            <span className="text-[8px] font-black uppercase text-brand-dark/40">Active Step</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[8px] font-black uppercase text-brand-dark/40">Verified Output</span>
          </div>
        </div>
      </div>
    </div>
  );
}
