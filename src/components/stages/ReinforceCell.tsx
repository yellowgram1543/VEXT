import React from 'react';
import { 
  ArrowRight, 
  Lightbulb, 
  MonitorPlay, 
  AlertTriangle,
  BrainCircuit,
  Layers,
  HelpCircle,
  Calculator,
  FileCode
} from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import { cn } from '@/lib/utils';

interface Practice {
  id: string;
  instruction: string;
  options?: string[];
  answer?: string;
  hint?: string;
  iconName?: string;
  icon?: any;
  checklist?: string[];
  explanation?: string;
  solution?: string;
  // 7-Point Rubric Fields
  scenario?: string;
  observation?: string;
  why?: string;
  commonMistake?: string;
  realWorldImplication?: string;
  mentalModel?: string;
}

interface ReinforceCellProps {
  practices: Practice[];
  onComplete: () => void;
  status: string;
  loading: boolean;
}

export default function ReinforceCell({ practices, onComplete, status, loading }: ReinforceCellProps) {
  const isCompleted = status === 'COMPLETED';

  const getIcon = (iconName?: string | any) => {
    if (!iconName) return HelpCircle;
    if (typeof iconName !== 'string') return iconName;
    switch (iconName.toLowerCase()) {
      case 'calculator': return Calculator;
      case 'help': return HelpCircle;
      case 'code': return FileCode;
      default: return HelpCircle;
    }
  };

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
          practices.map((practice: any, index: number) => {
            const Icon = getIcon(practice.iconName || practice.icon);
            return (
              <div key={practice.id || index} className="border-3 border-brand-dark rounded-neo p-6 bg-white shadow-[4px_4px_0px_0px_#330C2F]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-dark/5 rounded-neo-xs border border-brand-dark/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-brand-dark" />
                    </div>
                    <span className="bg-brand-dark text-white text-[10px] font-black px-2 py-1 rounded-neo-sm">Q{index + 1}</span>
                  </div>
                  <div className="font-bold text-lg text-brand-dark leading-snug">
                    <MathRenderer math={practice.instruction} />
                  </div>
                </div>
                
                {practice.options ? (
                  <div className="grid gap-3">
                    <div className="text-[10px] font-black uppercase text-brand-dark/40 mb-1 tracking-widest">Options & Analysis</div>
                    {practice.options.map((option: string, i: number) => {
                      const isCorrect = i === (practice.correctAnswer - 1) || i === practice.correctAnswer; // Handle 0 or 1 based index
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "p-4 border-2 rounded-neo-sm text-sm font-bold transition-all flex items-start gap-3",
                            isCorrect 
                              ? "border-green-500 bg-green-50 text-green-900 shadow-[2px_2px_0px_0px_#22c55e]" 
                              : "border-brand-dark/10 bg-slate-50/50 text-brand-dark/60 opacity-60"
                          )}
                        >
                          <span className={cn(
                            "w-5 h-5 flex-shrink-0 text-[10px] flex items-center justify-center rounded-full mt-0.5",
                            isCorrect ? "bg-green-500 text-white" : "bg-brand-dark/20 text-brand-dark"
                          )}>
                            {isCorrect ? '✓' : i+1}
                          </span>
                          <MathRenderer math={option} />
                        </div>
                      );
                    })}
                    
                    <div className="mt-4 p-6 bg-blue-50 border-3 border-blue-200 rounded-neo shadow-[4px_4px_0px_0px_#bfdbfe] animate-in slide-in-from-top-2 duration-300 space-y-6">
                      {/* Scenario & Observation */}
                      {practice.scenario && (
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                            <MonitorPlay className="w-3 h-3" /> Scenario
                          </p>
                          <p className="text-sm font-bold text-purple-900/80 leading-relaxed italic">&quot;{practice.scenario}&quot;</p>
                          {practice.observation && (
                             <p className="text-xs font-bold text-blue-800/60 mt-1 pl-5 border-l-2 border-blue-200 italic">&quot;{practice.observation}&quot;</p>
                          )}
                        </div>
                      )}

                      {/* Expert Logic */}
                      <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl border-2 border-blue-100">
                        <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Expert Logic</p>
                          <div className="text-sm font-bold text-blue-900 leading-relaxed">
                            <MathRenderer math={practice.solution || practice.explanation || ''} />
                          </div>
                        </div>
                      </div>

                      {/* Common Pitfall */}
                      {practice.commonMistake && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-0.5">Common Pitfall</p>
                            <p className="text-xs font-bold text-red-800/80">{practice.commonMistake}</p>
                          </div>
                        </div>
                      )}

                      {/* Real World & Mental Model */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {practice.realWorldImplication && (
                          <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl">
                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Industry Context</p>
                            <p className="text-xs font-bold text-emerald-800/70">{practice.realWorldImplication}</p>
                          </div>
                        )}
                        {practice.mentalModel && (
                          <div className="p-4 bg-[#7B287D] text-white rounded-xl shadow-lg transform rotate-[-1deg] flex items-start gap-3">
                             <BrainCircuit className="w-5 h-5 text-purple-200 shrink-0 mt-1" />
                             <div>
                                <p className="text-[10px] font-black uppercase text-purple-200 tracking-widest mb-1">Mental Model</p>
                                <p className="text-sm font-black italic">&quot;{practice.mentalModel}&quot;</p>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-brand-dark rounded-neo-sm">
                    <p className="text-sm font-medium mb-2">{practice.answer}</p>
                    {practice.hint && <p className="text-xs italic text-brand-dark/60">Hint: {practice.hint}</p>}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center border-3 border-dashed border-brand-dark/20 rounded-neo">
             <p className="text-brand-dark/40 font-black uppercase tracking-widest text-sm">No reinforcement data found</p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={onComplete}
          disabled={loading || isCompleted}
          className="group relative px-12 py-4 bg-brand-dark text-white rounded-neo font-heading font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_#F1D6FF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : isCompleted ? 'Completed' : 'Continue to Practice'}
          <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
