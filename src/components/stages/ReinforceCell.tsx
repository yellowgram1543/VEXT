'use client';

import React from 'react';
import { Lightbulb, Code, FunctionSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlock {
  _type: 'code';
  code: string;
  language: string;
}

interface LatexBlock {
  _type: 'latex';
  body: string;
}

type PracticeBlock = CodeBlock | LatexBlock;

interface ReinforceCellProps {
  practices: PracticeBlock[];
  onComplete?: () => void;
  status?: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  loading?: boolean;
}

export default function ReinforceCell({ practices, onComplete, status, loading }: ReinforceCellProps) {
  const isCompleted = status === 'COMPLETED';

  return (
    <div className="space-y-8 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#F1D6FF] p-2 rounded-neo-sm border-2 border-brand-dark">
          <Lightbulb className="w-6 h-6 text-brand-dark" />
        </div>
        <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Concrete Examples</h2>
      </div>

      {practices && practices.map((practice, index) => (
        <div key={index} className="border-3 border-brand-dark rounded-neo overflow-hidden shadow-[2px_2px_0px_0px_#330C2F]">
          <div className="bg-[#F1D6FF]/30 border-b-3 border-brand-dark px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {practice._type === 'code' ? <Code className="w-4 h-4" /> : <FunctionSquare className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
                {practice._type === 'code' ? `Code: ${practice.language}` : 'Mathematical Formula'}
              </span>
            </div>
          </div>
          <div className="p-6 bg-white overflow-x-auto">
            {practice._type === 'code' ? (
              <pre className="font-code text-sm text-brand-dark leading-relaxed">
                <code>{practice.code}</code>
              </pre>
            ) : (
              <div className="py-6 text-center text-2xl font-heading font-black text-brand-dark bg-surface-container-low rounded-neo-sm">
                {practice.body}
              </div>
            )}
          </div>
        </div>
      ))}

      {(!practices || practices.length === 0) && (
        <p className="text-brand-dark/50 italic font-medium">No examples available for this topic.</p>
      )}

      <div className="pt-8 border-t-3 border-brand-dark/10">
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
