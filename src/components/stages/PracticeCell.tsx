'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, Loader2, AlertCircle, 
  RefreshCw, ArrowRight, Calculator, Search, 
  Layers, MessageSquare, Lightbulb, TrendingUp, FileCode, Zap, Play, Terminal,
  ChevronRight, Eye, HelpCircle, RotateCcw
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

interface PracticeCellProps {
  topicId: string;
  onComplete?: () => void;
  status?: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  loading?: boolean;
}

interface Exercise {
  id: string;
  tab: TabType;
  type: string;
  label: string;
  instruction: string;
  icon: any;
  hints: string[];
  solution: string;
  checklist?: string[];
  expected: string;
  initialCode?: string;
}

const ALL_EXERCISES: Exercise[] = [
  // CODING TAB
  { 
    id: 'code-completion', 
    tab: 'coding', 
    type: 'Completion',
    label: 'Vectorized Dot Product', 
    icon: FileCode,
    instruction: 'Complete the vectorized implementation of the dot product using NumPy. Do NOT use loops.',
    hints: [
      'NumPy provides a dedicated function for matrix multiplication and dot products.',
      'Check the `np.dot()` or `@` operator documentation.'
    ],
    solution: 'import numpy as np\n\ndef dot_product(a, b):\n    return np.dot(a, b)',
    expected: 'dot',
    initialCode: 'import numpy as np\n\ndef dot_product(a, b):\n    # TODO: Implement vectorized dot product\n    pass'
  },
  { 
    id: 'code-debugging', 
    tab: 'coding', 
    type: 'Debugging',
    label: 'Shape Mismatch Debug', 
    icon: Search,
    instruction: 'Fix the error in this matrix multiplication. The weights $W$ and input $X$ have incompatible shapes.',
    hints: [
      'Matrix multiplication $AB$ requires the columns of $A$ to match the rows of $B$.',
      'Use `.T` to transpose a matrix if needed.'
    ],
    solution: 'import numpy as np\n\nX = np.random.randn(10, 5)\nW = np.random.randn(10, 5)\n# Fix: Transpose W\nresult = np.dot(X, W.T)',
    expected: 'W.T',
    initialCode: 'import numpy as np\n\nX = np.random.randn(10, 5)\nW = np.random.randn(10, 5)\n\n# This currently fails. Fix it!\nresult = np.dot(X, W)'
  },
  
  // MATH TAB
  { 
    id: 'math-numerical', 
    tab: 'math', 
    type: 'Numerical',
    label: 'Gradient Calculation', 
    icon: Calculator,
    instruction: 'Calculate the partial derivative $\\frac{\\partial f}{\\partial w}$ for $f(w, x) = \\sigma(wx + b)$ where $\\sigma$ is the sigmoid function, at $w=0.5, x=2, b=0$. (Recall: $\\sigma\'(z) = \\sigma(z)(1-\\sigma(z))$)',
    hints: [
      'Use the chain rule: $\\frac{\\partial f}{\\partial w} = \\frac{\\partial \\sigma}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}$.',
      'First calculate $z = wx + b$, then $\\sigma(z)$, then the final derivative.',
      '$\\sigma(1) \\approx 0.73$. So $\\sigma\'(1) = 0.73 \\cdot (1 - 0.73) \\approx 0.197$. Now multiply by $x=2$.'
    ],
    solution: 'The final result is approximately 0.394.',
    expected: '0.39'
  },
  { 
    id: 'math-derivation', 
    tab: 'math', 
    type: 'Derivations',
    label: 'MSE Gradient', 
    icon: Layers,
    instruction: 'Derive the gradient of the Mean Squared Error loss $L = \\frac{1}{2}(y - \\hat{y})^2$ with respect to $\\hat{y}$.',
    hints: [
      'Apply the power rule and the chain rule.',
      'The outer derivative is $2 \\cdot \\frac{1}{2} (y - \\hat{y})^{2-1}$.',
      'Don\'t forget the inner derivative of $(y - \\hat{y})$ with respect to $\\hat{y}$.'
    ],
    solution: 'Using the chain rule: $\\frac{\\partial L}{\\partial \\hat{y}} = (y - \\hat{y}) \\cdot (-1) = \\hat{y} - y$.',
    expected: 'y'
  },

  // CONCEPT TAB
  { 
    id: 'concept-scenario', 
    tab: 'concept', 
    type: 'Scenarios',
    label: 'Regularization Strategy', 
    icon: MessageSquare,
    instruction: 'Your model is overfitting heavily (Train Accuracy: 99%, Val Accuracy: 72%). Which regularization would you apply if you want to perform feature selection simultaneously?',
    hints: [
      'L2 (Ridge) penalizes large weights but keeps them non-zero.',
      'L1 (Lasso) encourages sparsity by driving some weights exactly to zero.'
    ],
    checklist: [
      'Identified L1 Regularization (Lasso) as the technique.',
      'Explained that L1 penalties create sparse weight vectors.',
      'Noted that zeroed-out weights effectively perform feature selection.'
    ],
    solution: 'L1 Regularization (Lasso) is the ideal choice here. Unlike L2, the L1 penalty uses the absolute value of weights, which tends to shrink less important feature weights to exactly zero, thus performing automated feature selection while reducing overfitting.',
    expected: 'l1'
  },
  { 
    id: 'concept-tradeoff', 
    tab: 'concept', 
    type: 'Trade-offs',
    label: 'Bias-Variance Dilemma', 
    icon: TrendingUp,
    instruction: 'As you decrease the $k$ in $k$-Nearest Neighbors ($k$-NN), what happens to the model\'s complexity and variance?',
    hints: [
      'Small $k$ (e.g., $k=1$) makes the model very sensitive to local noise.',
      'Higher sensitivity to noise means higher variance and higher complexity.'
    ],
    checklist: [
      'Mentioned that smaller $k$ leads to a more complex decision boundary.',
      'Correctly identified that variance increases as $k$ decreases.',
      'Noted that small $k$ models are prone to overfitting local noise.'
    ],
    solution: 'As $k$ decreases, the model complexity increases because it begins to fit the local noise in the training data rather than the overall distribution. Consequently, the variance increases because the model\'s predictions become highly sensitive to changes in the training set.',
    expected: 'increase'
  }
];

const ProgressiveHint = ({ exercise }: { exercise: Exercise }) => {
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {exercise.hints.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setHintLevel(idx + 1);
              setShowSolution(false);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-black text-[10px] uppercase tracking-wider transition-all",
              hintLevel > idx 
                ? "bg-yellow-100 border-yellow-600 text-yellow-700" 
                : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-dark/30"
            )}
          >
            <Lightbulb className="w-3 h-3" />
            Hint {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setShowSolution(!showSolution)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-black text-[10px] uppercase tracking-wider transition-all",
            showSolution 
              ? "bg-purple-100 border-purple-600 text-purple-700 shadow-[2px_2px_0px_0px_#581C58]" 
              : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-dark/30"
          )}
        >
          <Eye className="w-3 h-3" />
          {showSolution ? 'Hide Solution' : 'Check Solution'}
        </button>
      </div>

      <div className="space-y-2">
        {hintLevel > 0 && Array.from({ length: hintLevel }).map((_, idx) => (
          <div key={idx} className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-neo-sm flex items-start gap-3 animate-in slide-in-from-left-2 duration-200">
            <HelpCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-yellow-900 italic">
              <MathRenderer math={exercise.hints[idx]} />
            </div>
          </div>
        ))}
        {showSolution && (
          <div className="p-5 bg-purple-50 border-3 border-purple-200 rounded-neo shadow-[4px_4px_0px_0px_#CDB4DB] animate-in zoom-in-95 duration-200 space-y-4">
            <div>
               <div className="text-[10px] font-black uppercase text-purple-600 mb-2 flex items-center gap-2">
                 <CheckCircle className="w-3 h-3" /> Reference Solution
               </div>
               <div className="font-body text-xs text-purple-900 bg-white/60 p-3 rounded-lg border border-purple-100 leading-relaxed">
                 <MathRenderer math={exercise.solution} />
               </div>
            </div>

            {exercise.checklist && (
              <div>
                <div className="text-[10px] font-black uppercase text-purple-600 mb-2">Key points for your answer</div>
                <ul className="space-y-2">
                  {exercise.checklist.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-bold text-purple-800/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <MathRenderer math={point} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PracticeCell({ 
  topicId, 
  onComplete,
  status,
  loading: externalLoading
}: PracticeCellProps) {
  const [activeTab, setActiveTab] = useState<TabType>('coding');
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    ALL_EXERCISES.forEach(ex => {
      if (ex.initialCode) initial[ex.id] = ex.initialCode;
    });
    return initial;
  });
  const [outputs, setOutputs] = useState<Record<string, { stdout: string; stderr: string }>>({});
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
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

  const resetToStarter = (id: string) => {
    const original = ALL_EXERCISES.find(ex => ex.id === id)?.initialCode;
    if (original) {
      setAnswers(prev => ({ ...prev, [id]: original }));
      setOutputs(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const activeExercises = ALL_EXERCISES.filter(ex => ex.tab === activeTab);

  if (isDone) {
    return (
      <div className="space-y-8 bg-white">
        <div className="bg-white border-4 border-brand-dark rounded-neo p-8 shadow-[12px_12px_0px_0px_#330C2F] animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-green-400 rounded-full border-4 border-brand-dark flex items-center justify-center shadow-[4px_4px_0px_0px_#14532d]">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Practice Session Finished</h2>
              <p className="text-brand-dark/60 font-medium max-w-md">
                You've completed the coding, math, and conceptual exercises. Your foundation is solid!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full pt-4">
              <button 
                onClick={() => setIsDone(false)} 
                className="px-8 py-3 bg-white border-3 border-brand-dark rounded-neo font-heading font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Review Tasks
              </button>
              <button 
                onClick={onComplete} 
                disabled={externalLoading || isCompleted} 
                className="px-8 py-3 bg-[#7B287D] text-white border-3 border-brand-dark rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {externalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Go to Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Tab Selection */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F]">
        {(['coding', 'math', 'concept'] as TabType[]).map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-4 py-3 rounded-neo border-3 border-brand-dark font-heading font-black uppercase text-[10px] tracking-widest transition-all",
              activeTab === tab 
                ? "bg-[#7B287D] text-white shadow-[3px_3px_0px_0px_#330C2F] translate-y-[-2px]" 
                : "bg-white text-brand-dark hover:bg-white/80"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Exercise Cards Stack */}
      <div className="grid grid-cols-1 gap-8">
        {activeExercises.map((ex) => {
          const output = outputs[ex.id];
          const isExecuting = executingId === ex.id;

          return (
            <div key={ex.id} className="border-3 border-brand-dark rounded-neo p-8 bg-white shadow-[8px_8px_0px_0px_#330C2F] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-brand-dark/5 rounded-xl border-2 border-brand-dark/10">
                  <ex.icon className="w-6 h-6 text-[#7B287D]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">{ex.type}</span>
                  <h3 className="font-heading font-black uppercase text-base tracking-tighter">{ex.label}</h3>
                </div>
              </div>
              
              <div className="text-base font-bold mb-6 text-brand-dark/80 leading-relaxed bg-slate-50 p-6 rounded-neo border-2 border-dashed border-brand-dark/10">
                <MathRenderer math={ex.instruction} />
              </div>

              <ProgressiveHint exercise={ex} />
              
              {activeTab === 'coding' && (
                <div className="mt-8 flex flex-col gap-4">
                  <div className="w-full min-h-[200px] bg-[#1E1E2F] border-3 border-brand-dark rounded-neo overflow-hidden shadow-[6px_6px_0px_0px_#330C2F] font-code text-sm relative">
                    <div className="flex items-center justify-between px-6 py-3 bg-brand-dark/20 border-b-2 border-brand-dark/30">
                      <span className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" /> python kernel
                      </span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => resetToStarter(ex.id)}
                          title="Reset Code"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-neo-sm text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                        <button 
                          onClick={() => resetKernel()}
                          title="Restart Kernel"
                          className="p-1.5 hover:bg-yellow-500/20 text-white/40 hover:text-yellow-400 rounded transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRunCode(ex.id)}
                          disabled={isExecuting}
                          className="flex items-center gap-2 px-5 py-2 bg-[#7B287D] hover:bg-[#923494] text-white rounded-neo-sm border-2 border-brand-dark/20 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                        >
                          {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                          {isExecuting ? "Running..." : "Run Code"}
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
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        padding: { top: 20, bottom: 20 },
                        fontFamily: '"JetBrains Mono", monospace',
                        renderLineHighlight: 'all',
                        contextmenu: false,
                      }}
                    />
                  </div>

                  {/* Output Console */}
                  {(output || isExecuting) && (
                    <div className="w-full bg-[#0F0F17] border-3 border-brand-dark rounded-neo p-6 font-code text-xs animate-in slide-in-from-top-2 duration-200 shadow-[6px_6px_0px_0px_#330C2F]">
                      <div className="flex items-center gap-2 mb-3 text-white/30 uppercase font-black tracking-widest">
                        <Terminal className="w-3.5 h-3.5" /> Runtime Output
                      </div>
                      {isExecuting && !output && (
                        <div className="text-yellow-400/80 animate-pulse font-bold">Mounting virtual environment...</div>
                      )}
                      {output?.stdout && <pre className="text-green-400 whitespace-pre-wrap font-bold leading-relaxed">{output.stdout}</pre>}
                      {output?.stderr && <pre className="text-red-400 whitespace-pre-wrap font-bold leading-relaxed">{output.stderr}</pre>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-12 border-t-4 border-brand-dark/10">
        <button 
          onClick={() => setIsDone(true)} 
          className="bg-[#7B287D] text-white border-3 border-brand-dark px-16 py-5 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[10px_10px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3 group"
        >
          <CheckCircle className="w-6 h-6" />
          {isCompleted ? "Re-Finish Practice" : "Mark Practice as Finished"}
        </button>
      </div>
    </div>
  );
}
