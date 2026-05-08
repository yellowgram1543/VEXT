'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  BrainCircuit, Lightbulb, AlertTriangle, HelpCircle, 
  BookOpen, ChevronRight, Quote, MessageSquare 
} from 'lucide-react';
import { PortableText } from '@portabletext/react';
import MathRenderer from '../MathRenderer';
import Visualizer from '../visualizers';

/**
 * THE BLOCK REGISTRY
 * Implementation of the "Modular Teaching Toolkit"
 */

const MentalModelBlock = ({ anchor, content }: any) => (
  <div className="bg-[#330C2F] text-white p-6 rounded-neo shadow-[6px_6px_0px_0px_#7B287D] transform rotate-[-0.5deg] my-8 border-t-4 border-brand-primary">
    <div className="flex items-center gap-3 mb-4">
      <BrainCircuit className="w-6 h-6 text-brand-primary animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">Mental Model Anchor</span>
    </div>
    <h3 className="text-xl font-black mb-3 italic tracking-tight">&quot;{anchor}&quot;</h3>
    <div className="text-xs font-medium text-white/70 leading-relaxed">
      {content}
    </div>
  </div>
);

const PitfallBlock = ({ misconception, correction }: any) => (
  <div className="bg-orange-50 border-3 border-orange-200 p-6 rounded-neo my-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <AlertTriangle className="w-12 h-12 text-orange-500" />
    </div>
    <div className="space-y-4 relative z-10">
      <div className="space-y-1">
        <span className="text-[8px] font-black uppercase text-orange-600 tracking-widest">Common Pitfall</span>
        <p className="text-sm font-bold text-orange-900 line-through decoration-2 opacity-60">{misconception}</p>
      </div>
      <div className="flex items-start gap-3 bg-white p-3 rounded-neo-sm border-2 border-orange-100 shadow-sm">
        <ChevronRight className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
        <div>
          <span className="text-[8px] font-black uppercase text-green-600 tracking-widest">The Correction</span>
          <p className="text-sm font-black text-brand-dark">{correction}</p>
        </div>
      </div>
    </div>
  </div>
);

const AnalogyBlock = ({ title, content }: any) => (
  <div className="bg-[#F1D6FF] border-3 border-brand-dark p-6 rounded-neo my-8 shadow-[6px_6px_0px_0px_#330C2F]">
    <div className="flex items-center gap-3 mb-3">
      <Lightbulb className="w-5 h-5 text-[#7B287D]" />
      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7B287D]">{title || 'The Analogy'}</h4>
    </div>
    <div className="text-base font-bold text-brand-dark/80 italic leading-relaxed pl-8 border-l-3 border-[#7B287D]/20">
      {content}
    </div>
  </div>
);

const SocraticBlock = ({ question, hint }: any) => (
  <div className="bg-white border-3 border-dashed border-brand-dark/20 p-6 rounded-neo my-8 hover:border-[#7B287D]/40 transition-colors group">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-slate-50 rounded-lg border-2 border-brand-dark/5 group-hover:bg-[#F1D6FF]/30 transition-colors">
        <HelpCircle className="w-5 h-5 text-brand-dark/40 group-hover:text-[#7B287D]" />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-black text-brand-dark leading-snug">{question}</p>
        {hint && (
          <details className="cursor-pointer">
            <summary className="text-[9px] font-black uppercase tracking-widest text-brand-dark/30 hover:text-[#7B287D] transition-colors">
              Need a nudge?
            </summary>
            <p className="mt-2 text-[11px] font-bold text-[#7B287D] italic bg-[#F1D6FF]/20 p-2 rounded border border-[#7B287D]/10">
              {hint}
            </p>
          </details>
        )}
      </div>
    </div>
  </div>
);

const WorkedExampleBlock = ({ title, steps, insight }: any) => (
  <div className="bg-white border-3 border-brand-dark rounded-neo my-8 overflow-hidden shadow-[8px_8px_0px_0px_#330C2F]">
    <div className="bg-[#A7C7E7] px-6 py-3 border-b-3 border-brand-dark flex justify-between items-center">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-brand-dark" />
        <span className="text-[10px] font-black uppercase tracking-widest">{title || 'Worked Example'}</span>
      </div>
    </div>
    <div className="p-6 space-y-6">
      {steps.map((step: any, i: number) => (
        <div key={i} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full border-2 border-brand-dark flex items-center justify-center text-[10px] font-black group-hover:bg-[#A7C7E7] transition-colors">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-brand-dark/10 my-1" />}
          </div>
          <div className="pb-4">
             <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 mb-1">{step.label}</h5>
             <div className="text-sm font-bold text-brand-dark/80">
               <MathRenderer math={step.content} />
             </div>
          </div>
        </div>
      ))}
      {insight && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-brand-dark/10 flex items-start gap-3">
          <MessageSquare className="w-4 h-4 text-[#7B287D] shrink-0 mt-0.5" />
          <p className="text-[11px] font-black text-[#7B287D]/60 uppercase tracking-tight">{insight}</p>
        </div>
      )}
    </div>
  </div>
);

export const BlockRegistry: Record<string, React.FC<any>> = {
  'text': ({ content }) => <div className="prose prose-slate max-w-none prose-sm font-body font-bold text-brand-dark/70 leading-relaxed"><PortableText value={content} /></div>,
  'mental-model': ({ meta, content }) => <MentalModelBlock anchor={meta?.anchor} content={content} />,
  'pitfall': ({ meta }) => <PitfallBlock misconception={meta?.misconception} correction={meta?.correction} />,
  'analogy': ({ title, content }) => <AnalogyBlock title={title} content={content} />,
  'socratic-prompt': ({ content, meta }) => <SocraticBlock question={content} hint={meta?.insight} />,
  'worked-example': ({ title, data, meta }) => <WorkedExampleBlock title={title} steps={data} insight={meta?.insight} />,
  'visualizer': ({ data, meta, title }) => <Visualizer name={data?.lens} data={data?.visualizerData} title={title || meta?.anchor} />,
};

export default function TeachingBlock({ block }: { block: any }) {
  const Component = BlockRegistry[block.type];
  if (!Component) return null;
  return <Component {...block} />;
}
