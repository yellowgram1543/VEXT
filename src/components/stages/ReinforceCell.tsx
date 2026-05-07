'use client';

import React, { useState } from 'react';
import { 
  Lightbulb, 
  FunctionSquare, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  ShieldAlert, 
  Layers, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MathRenderer from '@/components/MathRenderer';

interface ExampleTier {
  title: string;
  code: string;
  language: string;
  explanation: string;
}

interface Pitfall {
  mistake: string;
  correction: string;
  reason: string;
}

interface ReinforceCellProps {
  practices?: any[]; // Keep for compatibility with TopicFlow
  data?: {
    basic: ExampleTier;
    intermediate: ExampleTier;
    advanced: ExampleTier;
    pitfalls: Pitfall[];
  };
  onComplete?: () => void;
  status?: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  loading?: boolean;
}

const TierCard = ({ tier, label, icon: Icon, color, isCollapsible = false }: { 
  tier: ExampleTier; 
  label: string; 
  icon: React.ElementType; 
  color: string;
  isCollapsible?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);

  return (
    <div className={cn(
      "border-3 border-brand-dark rounded-neo overflow-hidden shadow-[4px_4px_0px_0px_#330C2F] mb-6 bg-white transition-all",
      !isExpanded && "shadow-[2px_2px_0px_0px_#330C2F]"
    )}>
      <button 
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 border-b-3 border-brand-dark cursor-pointer",
          color
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/90 p-1.5 rounded-neo-sm border-2 border-brand-dark">
            <Icon className="w-4 h-4 text-brand-dark" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-black uppercase tracking-widest text-brand-dark opacity-60">Tier {label}</span>
            <h4 className="text-sm font-black text-brand-dark uppercase">{tier.title}</h4>
          </div>
        </div>
        {isCollapsible && (
          <div className="bg-white/90 p-1 rounded-full border-2 border-brand-dark">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </button>

      {isExpanded && (
        <div className="p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="mb-4 text-sm font-medium text-brand-dark/80 leading-relaxed">
            <MathRenderer math={tier.explanation} />
          </div>
          <div className="bg-brand-dark rounded-neo-sm p-4 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[8px] font-black uppercase text-white/40 bg-white/10 px-2 py-1 rounded-full">
                {tier.language}
              </span>
            </div>
            <pre className="font-code text-sm text-secondary-container leading-relaxed overflow-x-auto">
              <code>{tier.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

const PitfallsSection = ({ pitfalls }: { pitfalls: Pitfall[] }) => {
  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-2 rounded-neo-sm border-2 border-brand-dark">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">Interactive Pitfalls</h3>
      </div>

      {pitfalls.map((pitfall, index) => (
        <div key={index} className="grid md:grid-cols-2 gap-6">
          {/* Mistake */}
          <div className="border-3 border-brand-dark rounded-neo overflow-hidden shadow-[4px_4px_0px_0px_#330C2F] bg-white">
            <div className="bg-red-500 text-white px-4 py-2 border-b-3 border-brand-dark flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Common Mistake</span>
            </div>
            <div className="p-4 bg-red-50/30">
              <pre className="font-code text-xs text-red-900 overflow-x-auto">
                <code>{pitfall.mistake}</code>
              </pre>
            </div>
          </div>

          {/* Correction */}
          <div className="border-3 border-brand-dark rounded-neo overflow-hidden shadow-[4px_4px_0px_0px_#330C2F] bg-white">
            <div className="bg-green-500 text-white px-4 py-2 border-b-3 border-brand-dark flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Correct Approach</span>
            </div>
            <div className="p-4 bg-green-50/30">
              <pre className="font-code text-xs text-green-900 overflow-x-auto">
                <code>{pitfall.correction}</code>
              </pre>
            </div>
          </div>

          {/* Why */}
          <div className="md:col-span-2 p-4 bg-blue-50 border-3 border-blue-200 rounded-neo-sm flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm font-medium text-blue-900 italic">
              <strong>Why this matters:</strong> {pitfall.reason}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ReinforceCell({ practices, onComplete, status, loading }: ReinforceCellProps) {
  const isCompleted = status === 'COMPLETED';

  return (
    <div className="space-y-8 bg-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#F1D6FF] p-2 rounded-neo-sm border-2 border-brand-dark">
          <Layers className="w-6 h-6 text-brand-dark" />
        </div>
        <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Reinforcement Lab</h2>
      </div>

      <div className="space-y-6">
        {practices && practices.length > 0 ? (
          practices.map((practice: any, index: number) => (
            <div key={practice.id || index} className="border-3 border-brand-dark rounded-neo p-6 bg-white shadow-[4px_4px_0px_0px_#330C2F]">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-dark text-white text-[10px] font-black px-2 py-1 rounded-neo-sm">Q{index + 1}</span>
                <div className="font-bold text-lg text-brand-dark leading-snug">
                  <MathRenderer math={practice.instruction} />
                </div>
              </div>
              
              {practice.options ? (
                <div className="grid gap-3">
                  {practice.options.map((option: string, i: number) => (
                    <div key={i} className="p-3 border-2 border-brand-dark rounded-neo-sm text-sm font-medium bg-slate-50">
                      {option}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border-2 border-dashed border-brand-dark rounded-neo-sm">
                  <p className="text-sm font-medium mb-2">{practice.answer}</p>
                  {practice.hint && <p className="text-xs italic text-brand-dark/60">Hint: {practice.hint}</p>}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center border-3 border-dashed border-brand-dark/20 rounded-neo">
             <p className="text-brand-dark/40 font-black uppercase tracking-widest text-sm">No reinforcement data found in JSON</p>
          </div>
        )}
      </div>

      <div className="pt-12 border-t-3 border-brand-dark/10">
        <button
          onClick={onComplete}
          disabled={isCompleted || loading}
          className={cn(
            "w-full py-4 border-3 border-brand-dark font-heading font-black uppercase tracking-widest text-sm rounded-neo transition-all flex items-center justify-center gap-3",
            isCompleted
              ? "bg-green-100 text-green-700 cursor-default opacity-80"
              : loading
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : "bg-[#7B287D] text-white shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Reinforce Stage Completed</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Unlocking Stage...</span>
            </>
          ) : (
            <span>Continue to Practice →</span>
          )}
        </button>
      </div>
    </div>
  );
}

