import React, { useState } from 'react';
import { 
  CheckCircle, Loader2, AlertCircle, 
  RefreshCw, ArrowRight, Calculator, Search, 
  Layers, MessageSquare, Lightbulb, TrendingUp, FileCode, Zap, Play, Terminal
} from 'lucide-react';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-[#1e1e1e] flex items-center justify-center text-gray-500 font-code text-xs">Loading Editor...</div>
});
import MathRenderer from '@/components/MathRenderer';
import { usePyodide } from '@/hooks/usePyodide';
import { cn } from '@/lib/utils';

type TabType = 'coding' | 'math' | 'concept';

interface Exercise {
  id: string;
  tab: TabType;
  label: string;
  instruction: string;
  icon: any;
  hint: string;
  expected: string;
}

interface PracticeCellProps {
  topicId: string;
  onComplete?: () => void;
  status?: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  loading?: boolean;
}

const ALL_EXERCISES: Exercise[] = [
  // CODING TAB
  { 
    id: 'code-completion', 
    tab: 'coding', 
    label: 'Code Completion', 
    icon: FileCode,
    instruction: 'Complete the dot product logic. The input arrays a and b are provided.',
    hint: 'Use sum(x*y for x,y in zip(a,b))',
    expected: 'zip'
  },
  { 
    id: 'code-debugging', 
    tab: 'coding', 
    label: 'NumPy Test', 
    icon: Search,
    instruction: 'Import numpy as np and print a 2x2 matrix of zeros.',
    hint: 'import numpy as np; print(np.zeros((2,2)))',
    expected: 'zeros'
  },
  { 
    id: 'code-optimization', 
    tab: 'coding', 
    label: 'Optimization', 
    icon: Zap,
    instruction: 'Calculate the mean of [1, 2, 3, 4, 5] using NumPy.',
    hint: 'np.mean([1,2,3,4,5])',
    expected: 'mean'
  },
  
  // MATH TAB
  { 
    id: 'math-numerical', 
    tab: 'math', 
    label: 'Numerical Problem', 
    icon: Calculator,
    instruction: 'Calculate the gradient of $f(x) = 3x^2$ at $x = 2$.',
    hint: "f'(x) = 6x, so 6 * 2 = ?",
    expected: '12'
  },
  { 
    id: 'math-formula', 
    tab: 'math', 
    label: 'Formula Application', 
    icon: Layers,
    instruction: 'What is the standard formula for $L_2$ regularization (Ridge)?',
    hint: 'It involves the sum of squared weights: $\\lambda \\sum w_j^2$',
    expected: 'lambda'
  },

  // CONCEPT TAB
  { 
    id: 'concept-scenario', 
    tab: 'concept', 
    label: 'Scenario Analysis', 
    icon: MessageSquare,
    instruction: 'A model has high training error and high test error. What is this called?',
    hint: 'High bias.',
    expected: 'underfitting'
  },
  { 
    id: 'concept-debugging', 
    tab: 'concept', 
    label: 'Reasoning Debugging', 
    icon: Lightbulb,
    instruction: 'Why is using Accuracy bad for a fraud detection model with 99.9% legit cases?',
    hint: 'Class imbalance makes accuracy misleading.',
    expected: 'imbalance'
  },
  { 
    id: 'concept-tradeoff', 
    tab: 'concept', 
    label: 'Trade-off Analysis', 
    icon: TrendingUp,
    instruction: 'As model complexity increases, what happens to Variance?',
    hint: 'It goes up.',
    expected: 'increases'
  }
];

export default function PracticeCell({ 
  topicId, 
  onComplete,
  status,
  loading: externalLoading
}: PracticeCellProps) {
  const [activeTab, setActiveTab] = useState<TabType>('coding');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [outputs, setOutputs] = useState<Record<string, { stdout: string; stderr: string }>>({});
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; feedback: string }> | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const isCompleted = status === 'COMPLETED';

  const { runCode, resetKernel } = usePyodide();

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleRunCode = async (id: string) => {
    const code = answers[id];
    if (!code) return;

    setExecutingId(id);
    try {
      const result = await runCode(code);
      setOutputs(prev => ({ ...prev, [id]: result }));
    } catch (err: any) {
      setOutputs(prev => ({ ...prev, [id]: { stdout: "", stderr: err.message } }));
    } finally {
      setExecutingId(null);
    }
  };

  const handleSubmit = async () => {
    const newResults: Record<string, { success: boolean; feedback: string }> = {};
    ALL_EXERCISES.forEach(ex => {
      const answer = (answers[ex.id] || '').toLowerCase();
      const isCorrect = answer.includes(ex.expected.toLowerCase());
      newResults[ex.id] = {
        success: isCorrect,
        feedback: isCorrect 
          ? "Spot on! Great understanding." 
          : `Not quite. Hint: ${ex.hint}`
      };
    });

    setResults(newResults);
    setShowSummary(true);
  };

  const calculateScore = () => {
    if (!results) return 0;
    const correct = Object.values(results).filter(r => r.success).length;
    return Math.round((correct / ALL_EXERCISES.length) * 100);
  };

  const getWeakAreas = () => {
    if (!results) return [];
    return ALL_EXERCISES
      .filter(ex => !results[ex.id].success)
      .map(ex => `${ex.tab.toUpperCase()}: ${ex.label}`);
  };

  const activeExercises = ALL_EXERCISES.filter(ex => ex.tab === activeTab);

  if (showSummary) {
    const score = calculateScore();
    const weakAreas = getWeakAreas();

    return (
      <div className="bg-white border-4 border-brand-dark rounded-neo p-8 shadow-[8px_8px_0px_0px_#330C2F] animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-6">
          <div className={cn(
            "w-24 h-24 rounded-full border-4 border-brand-dark flex items-center justify-center text-3xl font-black shadow-[4px_4px_0px_0px_#330C2F]",
            score >= 80 ? "bg-green-400" : score >= 50 ? "bg-yellow-400" : "bg-red-400"
          )}>
            {score}%
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Practice Complete</h2>
            <p className="text-brand-dark/60 font-medium">Your skills breakdown across Coding, Math, and Concept.</p>
          </div>
          {weakAreas.length > 0 && (
            <div className="w-full bg-red-50 border-3 border-red-200 rounded-neo p-4 text-left">
              <h3 className="font-black uppercase text-xs tracking-widest text-red-600 mb-2">Weak Areas</h3>
              <ul className="list-disc list-inside text-red-800 text-sm font-medium">
                {weakAreas.map(area => <li key={area}>{area}</li>)}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-4 w-full pt-4">
            <button onClick={() => { setShowSummary(false); setResults(null); }} className="px-8 py-3 bg-white border-3 border-brand-dark rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <button onClick={onComplete} disabled={externalLoading || isCompleted} className="px-8 py-3 bg-[#7B287D] text-white border-3 border-brand-dark rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50">
              {externalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Move to Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col gap-8">
      {/* Tab Selection */}
      <div className="flex flex-wrap gap-3 p-2 bg-surface-container/30 border-3 border-brand-dark rounded-neo">
        {(['coding', 'math', 'concept'] as TabType[]).map((tab) => {
          const tabCount = ALL_EXERCISES.filter(ex => ex.tab === tab).length;
          const completedCount = ALL_EXERCISES.filter(ex => ex.tab === tab && answers[ex.id]).length;
          return (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 px-6 py-3 rounded-neo border-3 border-brand-dark font-heading font-black uppercase text-xs tracking-widest transition-all shadow-[3px_3px_0px_0px_#330C2F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                activeTab === tab ? "bg-[#7B287D] text-white" : "bg-white text-brand-dark hover:bg-surface-container"
              )}
            >
              <div className="flex flex-col gap-1">
                <span>{tab}</span>
                <span className="text-[10px] opacity-60 normal-case font-medium">{completedCount}/{tabCount} Done</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Exercise Cards Stack */}
      <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-4 duration-300">
        {activeExercises.map((ex) => {
          const result = results?.[ex.id];
          const output = outputs[ex.id];
          const isExecuting = executingId === ex.id;

          return (
            <div key={ex.id} className="border-3 border-brand-dark rounded-neo p-6 bg-white shadow-[4px_4px_0px_0px_#330C2F] hover:shadow-[6px_6px_0px_0px_#330C2F] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-dark/5 rounded-lg">
                  <ex.icon className="w-5 h-5 text-[#7B287D]" />
                </div>
                <h3 className="font-heading font-black uppercase text-sm tracking-widest">{ex.label}</h3>
                {result && (
                  <span className={cn(
                    "ml-auto text-[10px] font-black uppercase px-2 py-0.5 rounded border-2",
                    result.success ? "bg-green-100 border-green-600 text-green-700" : "bg-red-100 border-red-600 text-red-700"
                  )}>
                    {result.success ? "Correct" : "Needs Work"}
                  </span>
                )}
              </div>
              
              <div className="text-sm font-bold mb-4 text-brand-dark/80 leading-relaxed">
                <MathRenderer math={ex.instruction} />
              </div>
              
              {activeTab === 'coding' ? (
                <div className="flex flex-col gap-4">
                  <div className="w-full min-h-[140px] bg-[#1E1E2F] border-2 border-brand-dark rounded-lg overflow-hidden shadow-inner font-code text-sm group">
                    <div className="flex items-center justify-between px-4 py-2 bg-brand-dark/20 border-b border-brand-dark/30">
                      <span className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" /> python
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="relative group/tooltip">
                          <button 
                            onClick={() => resetKernel()}
                            aria-label="Reset Python Kernel"
                            className="p-1.5 bg-brand-dark/20 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded transition-all border border-white/5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-brand-dark text-white text-[11px] font-medium rounded-xl shadow-2xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all w-64 border border-white/10 z-50 leading-relaxed">
                            <span className="font-black text-[#CDB4DB] block mb-1">RESET KERNEL</span>
                            Deletes all saved variables and functions from memory. Use this to start fresh if your code behaves unexpectedly.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-dark" />
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRunCode(ex.id)}
                          disabled={isExecuting}
                          className="flex items-center gap-2 px-4 py-1.5 bg-[#7B287D] hover:bg-[#923494] text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                          {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                          {isExecuting ? "Executing..." : "Run Code"}
                        </button>
                      </div>
                    </div>
                    <Editor
                      height="200px"
                      defaultLanguage="python"
                      theme="vs-dark"
                      value={answers[ex.id] || ''}
                      onChange={(value) => handleInputChange(ex.id, value || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontWeight: 'bold',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                        renderLineHighlight: 'all',
                        contextmenu: false,
                        quickSuggestions: true,
                      }}
                    />
                  </div>

                  {/* Output Console */}
                  {(output || isExecuting) && (
                    <div className="w-full bg-[#0F0F17] border-2 border-brand-dark rounded-lg p-4 font-code text-xs animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2 mb-2 text-white/40 uppercase font-black tracking-tighter">
                        <Terminal className="w-3 h-3" /> Console Output
                      </div>
                      {isExecuting && !output && (
                        <div className="text-yellow-400/80 animate-pulse">Initializing Python environment and loading packages (NumPy, Scikit-Learn)...</div>
                      )}
                      {output?.stdout && <pre className="text-green-400 whitespace-pre-wrap">{output.stdout}</pre>}
                      {output?.stderr && <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>}
                      {!isExecuting && !output?.stdout && !output?.stderr && <div className="text-white/20 italic">Process finished with no output.</div>}
                    </div>
                  )}
                </div>
              ) : (
                <textarea 
                  value={answers[ex.id] || ''}
                  onChange={(e) => handleInputChange(ex.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className={cn(
                    "w-full h-28 rounded-lg p-4 font-body text-sm transition-all shadow-inner focus:outline-none focus:ring-2",
                    "bg-slate-50 text-brand-dark border-2 border-brand-dark/20 placeholder:text-brand-dark/30 focus:border-brand-dark focus:ring-brand-dark/5"
                  )}
                />
              )}
              {result && !result.success && (
                <div className="mt-4 flex items-start gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs font-bold leading-relaxed">
                    <MathRenderer math={result.feedback} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-8 border-t-3 border-dashed border-brand-dark/20">
        <button 
          onClick={handleSubmit} 
          className="bg-[#7B287D] text-white border-3 border-brand-dark px-14 py-5 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-3 group"
        >
          <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {isCompleted ? "Re-submit Practice" : "Submit Practice Tasks"}
        </button>
      </div>
    </div>
  );
}
