'use client';

import React, { useState, useId } from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import { cn } from '@/lib/utils';

interface SocraticPromptProps {
  question: string;
  hint?: string;
  explanation: string;
}

const SocraticPrompt = ({ question, hint, explanation }: SocraticPromptProps) => {
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const hintId = useId();
  const explanationId = useId();

  return (
    <div className="my-8 border-3 border-brand-dark rounded-neo bg-white overflow-hidden shadow-[4px_4px_0px_0px_#330C2F]">
      <div className="bg-[#7B287D] text-white p-4 border-b-3 border-brand-dark flex items-center gap-2">
        <HelpCircle className="w-5 h-5" aria-hidden="true" />
        <h4 className="font-heading font-black uppercase tracking-widest text-xs">Critical Reflection</h4>
      </div>
      <div className="p-6">
        <div className="text-xl font-bold text-brand-dark mb-4">
          <MathRenderer math={question} />
        </div>
        
        <div className="flex flex-col gap-3">
          {hint && (
            <div>
              <button 
                onClick={() => setShowHint(!showHint)}
                aria-expanded={showHint}
                aria-controls={hintId}
                className="text-sm font-black text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 transition-colors"
              >
                {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showHint ? 'Hide Hint' : 'Need a hint?'}
              </button>
              {showHint && (
                <div 
                  id={hintId}
                  className="mt-2 p-3 bg-secondary-container border-2 border-brand-dark rounded-neo-sm italic text-sm text-brand-dark"
                >
                  <MathRenderer math={hint} />
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            aria-expanded={showExplanation}
            aria-controls={explanationId}
            className={cn(
              "mt-2 w-full py-3 border-3 border-brand-dark font-black uppercase rounded-neo transition-all",
              showExplanation 
                ? "bg-gray-100 text-gray-400 cursor-default" 
                : "bg-[#A7C7E7] text-brand-dark shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            )}
          >
            {showExplanation ? 'Reflected' : 'Reveal Explanation'}
          </button>

          {showExplanation && (
            <div 
              id={explanationId}
              className="mt-4 p-4 bg-green-50 border-3 border-green-800 rounded-neo animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-800 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-green-900 font-medium">
                  <MathRenderer math={explanation} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import MLVisualizer from '@/components/MLVisualizer';

const components: PortableTextComponents = {
  types: {
    socraticPrompt: ({ value }) => (
      <SocraticPrompt 
        question={value.question}
        hint={value.hint}
        explanation={value.explanation}
      />
    ),
    visualization: ({ value }) => (
      <MLVisualizer 
        type={value.type}
        title={value.title}
        data={value.data}
        className="my-8"
      />
    ),
  },
  block: {
    normal: ({ children }) => {
      const text = Array.isArray(children) ? children.join('') : children;
      const match = typeof text === 'string' && text.match(/^(\d+\.\d+\.\d+)\s+(.*)/);
      
      if (match) {
        return (
          <section className="my-4 border-3 border-brand-dark/10 rounded-neo-sm overflow-hidden bg-white hover:border-brand-dark/30 transition-colors">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer group">
              <span className="font-code font-bold text-brand-dark/70 text-sm shrink-0 mr-4">{match[1]}</span>
              <span className="font-heading font-black text-brand-dark uppercase tracking-tight flex-grow">{match[2]}</span>
              <ChevronDown className="w-5 h-5 text-brand-dark/20 group-hover:text-brand-dark transition-colors" />
            </div>
          </section>
        );
      }

      return <p className="text-lg text-brand-dark/90 mb-4 leading-relaxed font-medium">{children}</p>;
    },
    h2: ({ children }) => <h2 className="text-3xl font-black text-brand-dark mb-6 mt-10 uppercase tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-black text-brand-dark mb-4 mt-8 uppercase tracking-tight">{children}</h3>,
  },
};

interface UnderstandCellProps {
  content: any[];
  onComplete?: () => void;
  status?: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  loading?: boolean;
}

export default function UnderstandCell({ content, onComplete, status, loading }: UnderstandCellProps) {
  const [isGated, setIsGated] = useState(false);
  const isCompleted = status === 'COMPLETED';
  const gateId = useId();

  return (
    <div className="bg-white space-y-8">
      <article aria-label="Understand Stage Content">
        <PortableText value={content} components={components} />
      </article>
      
      <div className="pt-8 border-t-3 border-brand-dark/10">
        {!isCompleted && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-secondary-container/30 border-2 border-brand-dark rounded-neo-sm">
            <input
              type="checkbox"
              id={gateId}
              checked={isGated}
              onChange={(e) => setIsGated(e.target.checked)}
              className="w-5 h-5 border-3 border-brand-dark rounded-none checked:bg-brand-dark focus:ring-0 cursor-pointer transition-all"
            />
            <label htmlFor={gateId} className="font-heading font-black uppercase text-xs text-brand-dark cursor-pointer select-none">
              I have reflected on the content and am ready to move to the reinforcement stage.
            </label>
          </div>
        )}

        <button
          onClick={onComplete}
          disabled={(!isGated && !isCompleted) || loading}
          className={cn(
            "w-full py-4 border-3 border-brand-dark font-heading font-black uppercase tracking-widest text-sm rounded-neo transition-all flex items-center justify-center gap-3",
            isCompleted
              ? "bg-green-100 text-green-700 cursor-default opacity-80"
              : loading
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : (!isGated ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300" : "bg-[#7B287D] text-white shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none")
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Understand Stage Completed</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Unlocking Stage...</span>
            </>
          ) : (
            <span>Continue to Reinforce →</span>
          )}
        </button>
      </div>
    </div>
  );
}

