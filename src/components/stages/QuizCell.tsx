'use client';

import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, Timer, Send, CheckCircle2, XCircle, 
  Loader2, Lightbulb, UserCheck, 
  ArrowRight, BarChart, Smile, Meh, Frown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import MathRenderer from '@/components/MathRenderer';
import MasteryBreadcrumbs, { StageType } from '@/components/MasteryBreadcrumbs';

export type QuestionType = 
  | 'mcq' 
  | 'true-false' 
  | 'scenario' 
  | 'debugging' 
  | 'interpretation' 
  | 'model-selection' 
  | 'interview' 
  | 'numerical';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  code?: string;
  image?: string;
  hint?: string;
}

interface QuizCellProps {
  topicId: string;
  questions: QuizQuestion[];
  title?: string;
  description?: string;
  onComplete?: (score: number) => void;
}

export default function QuizCell({ 
  topicId: _topicId,
  questions, 
  title = "Mastery Check", 
  description = "Demonstrate your understanding across all 7 cognitive dimensions.", 
  onComplete 
}: QuizCellProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [numericalAnswer, setNumericalAnswer] = useState<string>('');
  const [essayAnswer, setEssayAnswer] = useState<string>('');
  const [checkedPoints, setCheckedPoints] = useState<boolean[]>([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<'low' | 'med' | 'high' | null>(null);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { val: any; confidence: string | null }>>({});
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const DEMO_QUESTIONS: QuizQuestion[] = [
    {
      id: 'demo-q1',
      type: 'mcq',
      question: 'Which loss function is most appropriate for a multi-class classification problem where the labels are mutually exclusive?',
      options: ['Mean Squared Error', 'Binary Cross-Entropy', 'Categorical Cross-Entropy', 'Huber Loss'],
      correctAnswer: 2,
      explanation: 'Categorical Cross-Entropy is designed for multi-class problems. Binary Cross-Entropy is for 2 classes, and MSE is typically for regression.'
    },
    {
      id: 'demo-q2',
      type: 'numerical',
      question: 'Calculate the Entropy (in bits) of a biased coin that lands heads with probability $p=0.5$.',
      hint: 'For $p=0.5$, both states have $p_i=0.5$. $\\log_2(0.5) = -1$.',
      correctAnswer: '1',
      explanation: '$H(X) = -(0.5 \\cdot (-1) + 0.5 \\cdot (-1)) = 1$. This is the maximum entropy for a binary variable.'
    },
    {
      id: 'demo-q3',
      type: 'interview',
      question: 'Briefly explain the concept of "Self-Attention" in the context of the Transformer architecture.',
      correctAnswer: [
        'Mention that it relates words within the same sequence.',
        'Explain that it uses Query, Key, and Value vectors.',
        'Mention that it allows for parallelization compared to RNNs.'
      ],
      explanation: 'Self-attention allows the model to look at other words in the input sequence to get a better encoding for the word it is currently processing.'
    }
  ];

  const activeQuestions = questions && questions.length > 0 ? questions : DEMO_QUESTIONS;
  const currentQuestion = activeQuestions[currentQuestionIndex];
  
  const dimensionBreakdown = useMemo(() => {
    if (!quizFinished) return null;
    
    const breakdown: Record<string, { total: number; correct: number }> = {};
    activeQuestions.forEach(q => {
      const typeLabel = q.type.charAt(0).toUpperCase() + q.type.slice(1).replace('-', ' ');
      if (!breakdown[typeLabel]) breakdown[typeLabel] = { total: 0, correct: 0 };
      breakdown[typeLabel].total += 1;
      
      const answer = answers[q.id];
      if (answer && checkCorrect(q, answer.val)) {
        breakdown[typeLabel].correct += 1;
      }
    });
    return breakdown;
  }, [quizFinished, answers, activeQuestions]);

  function checkCorrect(q: QuizQuestion, val: any) {
    if (q.type === 'numerical') {
      return val?.toString().trim() === q.correctAnswer.toString().trim();
    }
    if (q.type === 'interview' || q.type === 'scenario') {
      const points = val as boolean[];
      if (!points || points.length === 0) return false;
      const checkedCount = points.filter(Boolean).length;
      return checkedCount >= points.length * 0.7;
    }
    return val === q.correctAnswer;
  }

  const getCurrentVal = () => {
    if (currentQuestion.type === 'numerical') return numericalAnswer;
    if (currentQuestion.type === 'interview' || currentQuestion.type === 'scenario') return checkedPoints;
    return selectedOption;
  };

  const handleRevealChecklist = async () => {
    if (essayAnswer.length < 20) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsAnalyzing(false);
    setShowChecklist(true);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const val = getCurrentVal();
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: { val, confidence } }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setNumericalAnswer('');
      setEssayAnswer('');
      setCheckedPoints([]);
      setShowChecklist(false);
      setIsSubmitted(false);
      setConfidence(null);
    } else {
      setLoading(true);
      const allAnswers = { ...answers, [currentQuestion.id]: { val: getCurrentVal(), confidence } };
      const correctCount = activeQuestions.filter(q => checkCorrect(q, allAnswers[q.id].val)).length;
      const score = correctCount / activeQuestions.length;
      
      setFinalScore(score);
      setQuizFinished(true);
      onComplete?.(score);
      setLoading(false);
    }
  };

  if (quizFinished) {
    const passed = finalScore !== null && finalScore >= 0.8;
    return (
      <div className="flex flex-col gap-8">
        <MasteryBreadcrumbs currentStage={StageType.QUIZ} />
        
        <div className="bg-white flex flex-col items-center gap-8 p-12 text-center border-3 border-brand-dark rounded-neo shadow-[12px_12px_0px_0px_#330C2F] animate-in zoom-in-95 duration-500">
          <div className={cn(
            "w-24 h-24 rounded-full border-4 border-brand-dark flex items-center justify-center shadow-[4px_4px_0px_0px_#330C2F]",
            passed ? "bg-green-400" : "bg-red-400"
          )}>
            {passed ? <CheckCircle2 className="w-12 h-12 text-brand-dark" /> : <XCircle className="w-12 h-12 text-brand-dark" />}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter">
              {passed ? "Mastery Achieved!" : "Mastery Failed"}
            </h2>
            <div className="text-brand-dark/40 font-black uppercase tracking-[0.3em] text-xs">
              Score: {Math.round((finalScore || 0) * 100)}% | Goal: 80%+
            </div>
          </div>

          <div className="w-full max-w-lg space-y-6 bg-slate-50 p-8 rounded-neo border-3 border-brand-dark shadow-[6px_6px_0px_0px_#330C2F]">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-dark/60 flex items-center gap-2 justify-center">
              <BarChart className="w-4 h-4" /> Dimension Breakdown
            </h3>
            <div className="space-y-4">
              {dimensionBreakdown && Object.entries(dimensionBreakdown).map(([dim, stats], idx) => {
                const perc = (stats.correct / stats.total) * 100;
                return (
                  <div key={dim} className="space-y-2 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 150}ms` } as any}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-brand-dark/70">
                      <span>{dim}</span>
                      <span>{stats.correct} / {stats.total}</span>
                    </div>
                    <div className="h-3 bg-white border-2 border-brand-dark rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", perc >= 80 ? "bg-green-400" : perc >= 50 ? "bg-yellow-400" : "bg-red-400")} 
                        style={{ width: `${perc}%` } as any}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            {!passed && (
              <button 
                onClick={() => window.location.reload()}
                className="bg-white text-brand-dark border-3 border-brand-dark px-10 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Retry Assessment
              </button>
            )}
            {passed && (
              <button 
                onClick={() => window.history.back()}
                title="Proceed to Apply Stage"
                className="bg-[#7B287D] text-white border-3 border-brand-dark px-10 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
              >
                Proceed to Apply <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <MasteryBreadcrumbs currentStage={StageType.QUIZ} />
      
      <div className="bg-white flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-3 border-brand-dark pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter leading-none">{title}</h2>
            <p className="text-sm text-brand-dark/50 font-bold uppercase tracking-widest">{description}</p>
          </div>
          <div className="flex items-center gap-3 bg-white border-3 border-brand-dark text-brand-dark px-6 py-3 rounded-neo text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#330C2F]">
            <Timer className="w-4 h-4 text-[#7B287D]" />
            <span>Question {currentQuestionIndex + 1} / {activeQuestions.length}</span>
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start gap-5">
            <div className="flex items-center justify-center w-12 h-12 border-3 border-brand-dark rounded-neo font-heading font-black text-xl bg-[#CDB4DB] shrink-0 shadow-[4px_4px_0px_0px_#330C2F]">
              {currentQuestionIndex + 1}
            </div>
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-dark/5 border-2 border-brand-dark/10 rounded-full w-fit text-[10px] font-black uppercase tracking-widest text-brand-dark/60">
                {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1).replace('-', ' ')}
              </div>
              <h4 className="text-2xl font-black text-brand-dark leading-tight max-w-3xl">
                <MathRenderer math={currentQuestion.question} />
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pl-16">
            {currentQuestion.type === 'mcq' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      disabled={isSubmitted || loading}
                      onClick={() => setSelectedOption(index)}
                      className={cn(
                        "p-6 text-left border-3 border-brand-dark rounded-neo font-black transition-all shadow-[6px_6px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none group",
                        selectedOption === index 
                          ? isSubmitted 
                            ? checkCorrect(currentQuestion, index) 
                              ? "bg-green-400 text-brand-dark" 
                              : "bg-red-400 text-brand-dark"
                            : "bg-[#7B287D] text-white"
                          : isSubmitted && index === currentQuestion.correctAnswer
                            ? "bg-green-100 border-green-600 text-green-900 border-dashed"
                            : "bg-white text-brand-dark hover:bg-surface-container"
                      )}
                    >
                      <MathRenderer math={option} />
                    </button>
                  ))}
                </div>
                
                {selectedOption !== null && !isSubmitted && (
                  <div className="animate-in slide-in-from-top-4 duration-300 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40 text-center">Confidence Level</p>
                    <div className="flex justify-center gap-3">
                      {[
                        { id: 'low', icon: Frown, label: 'Uncertain' },
                        { id: 'med', icon: Meh, label: 'Fair' },
                        { id: 'high', icon: Smile, label: 'Confident' }
                      ].map((level) => (
                        <button 
                          key={level.id}
                          title={level.label}
                          onClick={() => setConfidence(level.id as any)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-neo border-3 border-brand-dark text-xs font-black uppercase tracking-widest transition-all",
                            confidence === level.id 
                              ? "bg-[#7B287D] text-white shadow-[4px_4px_0px_0px_#330C2F] translate-y-[-2px]" 
                              : "bg-white text-brand-dark/60 hover:text-brand-dark"
                          )}
                        >
                          <level.icon className="w-4 h-4" />
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentQuestion.type === 'numerical' && (
              <div className="space-y-4">
                <input 
                  type="text"
                  value={numericalAnswer}
                  onChange={(e) => setNumericalAnswer(e.target.value)}
                  disabled={isSubmitted || loading}
                  placeholder="Type your calculated value..."
                  title="Numerical Answer Input"
                  className="w-full p-6 text-2xl font-black border-3 border-brand-dark rounded-neo shadow-[6px_6px_0px_0px_#330C2F] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder:text-brand-dark/20"
                />
                {currentQuestion.hint && !isSubmitted && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-neo-sm">
                    <div className="p-2 bg-yellow-200 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-yellow-700" />
                    </div>
                    <div className="text-sm font-bold text-yellow-800">
                      <span className="uppercase text-[9px] font-black opacity-50 block tracking-widest">Pro-tip</span>
                      <MathRenderer math={currentQuestion.hint} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {(currentQuestion.type === 'interview' || currentQuestion.type === 'scenario') && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="essay-answer" className="text-xs font-black uppercase tracking-widest text-brand-dark/40">Your Explanation</label>
                  <textarea 
                    id="essay-answer"
                    value={essayAnswer}
                    onChange={(e) => setEssayAnswer(e.target.value)}
                    disabled={isSubmitted || showChecklist || isAnalyzing}
                    placeholder="Explain your reasoning..."
                    className="w-full p-6 h-40 text-lg font-bold border-3 border-brand-dark rounded-neo shadow-[6px_6px_0px_0px_#330C2F] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all bg-slate-50"
                  />
                </div>
                
                {!showChecklist && !isSubmitted && (
                  <button 
                    onClick={handleRevealChecklist}
                    disabled={essayAnswer.length < 20 || isAnalyzing}
                    className="w-full py-4 bg-white border-3 border-brand-dark rounded-neo font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scanning Reasoning...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Finalize Answer & Self-Check</span>
                      </>
                    )}
                  </button>
                )}

                {showChecklist && (
                  <div className="animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-[#7B287D] text-white p-4 rounded-t-neo border-x-3 border-t-3 border-brand-dark">
                      <h5 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <UserCheck className="w-4 h-4" /> Self-Evaluation Checklist
                      </h5>
                    </div>
                    <div className="border-3 border-brand-dark p-6 space-y-4 rounded-b-neo bg-white shadow-[6px_6px_0px_0px_#330C2F]">
                      {(currentQuestion.correctAnswer as string[]).map((point, idx) => (
                        <label key={idx} className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={checkedPoints[idx] || false}
                            disabled={isSubmitted}
                            onChange={(e) => {
                              const newPoints = [...checkedPoints];
                              newPoints[idx] = e.target.checked;
                              setCheckedPoints(newPoints);
                            }}
                            className="w-6 h-6 border-3 border-brand-dark rounded-md checked:bg-green-400 transition-all cursor-pointer"
                          />
                          <span className="font-bold text-sm text-brand-dark/80 group-hover:text-brand-dark">{point}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isSubmitted && (
          <div className={cn(
            "ml-16 p-8 border-3 rounded-neo animate-in fade-in slide-in-from-top-4 shadow-[6px_6px_0px_0px_#330C2F]",
            checkCorrect(currentQuestion, getCurrentVal()) ? "bg-green-50 border-green-800" : "bg-red-50 border-red-800"
          )}>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-brand-dark" />
              <span className="font-black uppercase tracking-widest text-sm text-brand-dark">Coaching Insight</span>
            </div>
            <div className="font-bold text-brand-dark/80 leading-relaxed border-t-2 border-brand-dark/10 pt-4">
              <MathRenderer math={currentQuestion.explanation} />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-6 pt-8 border-t-3 border-brand-dark border-dashed mt-8">
          {!isSubmitted ? (
            <button 
              disabled={(currentQuestion.type === 'mcq' && (selectedOption === null || !confidence)) || (currentQuestion.type === 'numerical' && !numericalAnswer) || ((currentQuestion.type === 'interview' || currentQuestion.type === 'scenario') && checkedPoints.filter(Boolean).length === 0) || loading}
              onClick={handleSubmit}
              className="bg-[#7B287D] text-white border-3 border-brand-dark px-12 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Submit Verdict
            </button>
          ) : (
            <button 
              onClick={handleNext}
              disabled={loading}
              className="bg-white text-brand-dark border-3 border-brand-dark px-12 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              {currentQuestionIndex < activeQuestions.length - 1 ? 'Next Challenge' : 'Complete Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
