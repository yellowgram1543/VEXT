'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, Loader2, AlertCircle, 
  RefreshCw, ArrowRight, Calculator, Search, 
  Layers, MessageSquare, Lightbulb, TrendingUp, FileCode, Zap, Play, Terminal,
  ChevronRight, Eye, HelpCircle
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
    solution: '0.394',
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
    solution: '-(y - \\hat{y}) or (\\hat{y} - y)',
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
    solution: 'L1 Regularization (Lasso)',
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
    solution: 'Complexity increases, Variance increases.',
    expected: 'increase'
  }
];

const ProgressiveHint = ({ hints, solution, id }: { hints: string[]; solution: string; id: string }) => {
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {hints.map((_, idx) => (
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
              ? "bg-purple-100 border-purple-600 text-purple-700" 
              : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-dark/30"
          )}
        >
          <Eye className="w-3 h-3" />
          {showSolution ? 'Hide Solution' : 'Solution'}
        </button>
      </div>

      <div className="space-y-2">
        {hintLevel > 0 && Array.from({ length: hintLevel }).map((_, idx) => (
          <div key={idx} className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-neo-sm flex items-start gap-3 animate-in slide-in-from-left-2 duration-200">
            <HelpCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-yellow-900 italic">
              <MathRenderer math={hints[idx]} />
            </div>
          </div>
        ))}
        {showSolution && (
          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-neo-sm animate-in zoom-in-95 duration-200">
            <div className="text-[10px] font-black uppercase text-purple-600 mb-2 flex items-center gap-2">
              <CheckCircle className="w-3 h-3" /> Expected Solution
            </div>
            <pre className="font-code text-xs text-purple-900 bg-white/50 p-2 rounded border border-purple-100 overflow-x-auto">
              <code>{solution}</code>
            </pre>
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
    // Pre-fill initial code for coding tasks
    const initial: Record<string, string> = {};
    ALL_EXERCISES.forEach(ex => {
      if (ex.initialCode) initial[ex.id] = ex.initialCode;
    });
    return initial;
  });
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
          : "Not quite correct. Try using the hints above to refine your answer!"
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
          const completedCount = ALL_EXERCISES.filter(ex => ex.tab === tab && answers[ex.id] && answers[ex.id] !== ex.initialCode).length;
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
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-dark/40">{ex.type}</span>
                  <h3 className="font-heading font-black uppercase text-sm tracking-widest">{ex.label}</h3>
                </div>
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

              <ProgressiveHint hints={ex.hints} solution={ex.solution} id={ex.id} />
              
              <div className="mt-6">
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
              </div>
              
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

