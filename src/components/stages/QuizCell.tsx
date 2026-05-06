'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, Timer, Save, Send, CheckCircle2, XCircle, 
  Loader2, Lightbulb, Code as CodeIcon, BarChart3, 
  Calculator, MessageSquare, Target, UserCheck, Search, ArrowRight, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
// @ts-ignore
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import MathRenderer from '@/components/MathRenderer';

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
  correctAnswer: string | number | string[]; // string[] for interview key points
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
  topicId,
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white flex flex-col gap-8 p-8 text-center border-3 border-dashed border-brand-dark/30 rounded-neo">
        <p className="text-brand-dark/50 italic font-medium">No quiz questions available for this topic.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  const checkCorrect = (q: QuizQuestion, val: any) => {
    if (q.type === 'numerical') {
      return val?.toString().trim() === q.correctAnswer.toString().trim();
    }
    if (q.type === 'interview' || q.type === 'scenario') {
      const points = val as boolean[];
      if (!points || points.length === 0) return false;
      const checkedCount = points.filter(Boolean).length;
      return checkedCount >= points.length * 0.7; // 70% of points for individual question pass
    }
    return val === q.correctAnswer;
  };

  const getCurrentVal = () => {
    if (currentQuestion.type === 'numerical') return numericalAnswer;
    if (currentQuestion.type === 'interview' || currentQuestion.type === 'scenario') return checkedPoints;
    return selectedOption;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const val = getCurrentVal();
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setNumericalAnswer('');
      setEssayAnswer('');
      setCheckedPoints([]);
      setIsSubmitted(false);
    } else {
      setLoading(true);
      const allAnswers = { ...answers, [currentQuestion.id]: getCurrentVal() };
      const correctCount = questions.filter(q => checkCorrect(q, allAnswers[q.id])).length;
      const score = correctCount / questions.length;
      
      setFinalScore(score);
      setQuizFinished(true);
      onComplete?.(score);
      setLoading(false);
    }
  };

  if (quizFinished) {
    const passed = finalScore !== null && finalScore >= 0.8;
    return (
      <div className="bg-white flex flex-col items-center gap-6 p-12 text-center border-3 border-brand-dark rounded-neo shadow-[12px_12px_0px_0px_#330C2F] animate-in zoom-in-95 duration-300">
        <div className={cn(
          "w-24 h-24 rounded-full border-4 border-brand-dark flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#330C2F]",
          passed ? "bg-green-400" : "bg-red-400"
        )}>
          {passed ? <CheckCircle2 className="w-12 h-12 text-brand-dark" /> : <XCircle className="w-12 h-12 text-brand-dark" />}
        </div>
        <div>
          <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight mb-2">
            {passed ? "Mastery Achieved!" : "Mastery Failed"}
          </h2>
          <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-xs">
            Threshold Required: 80%
          </p>
        </div>
        <div className="text-7xl font-black text-[#7B287D] tracking-tighter">
          {Math.round((finalScore || 0) * 100)}%
        </div>
        <p className="text-xl font-medium text-brand-dark/70 max-w-md leading-relaxed">
          {passed 
            ? "Impressive! You have demonstrated deep cognitive mastery across all dimensions. The 'Apply' stage is now unlocked." 
            : "You didn't reach the mastery threshold. Review the 'Reinforce' and 'Practice' layers to strengthen your weak areas."}
        </p>
        <div className="flex gap-4">
          {!passed && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-brand-dark border-3 border-brand-dark px-10 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Retry Quiz
            </button>
          )}
          {passed && (
            <button 
              onClick={() => window.history.back()}
              className="mt-4 bg-[#7B287D] text-white border-3 border-brand-dark px-10 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              Proceed to Apply <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: QuestionType) => {
    switch(type) {
      case 'debugging': return <Search className="w-4 h-4" />;
      case 'interpretation': return <BarChart3 className="w-4 h-4" />;
      case 'numerical': return <Calculator className="w-4 h-4" />;
      case 'scenario': return <Target className="w-4 h-4" />;
      case 'interview': return <UserCheck className="w-4 h-4" />;
      case 'model-selection': return <Layers className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const isCorrect = currentQuestion && checkCorrect(currentQuestion, getCurrentVal());

  return (
    <div className="bg-white flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-3 border-brand-dark pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter leading-none">{title}</h2>
          <p className="text-sm text-brand-dark/50 font-bold uppercase tracking-widest">{description}</p>
        </div>
        <div className="flex items-center gap-3 bg-white border-3 border-brand-dark text-brand-dark px-6 py-3 rounded-neo text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#330C2F]">
          <Timer className="w-4 h-4 text-[#7B287D]" />
          <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="space-y-8">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-12 h-12 border-3 border-brand-dark rounded-neo font-heading font-black text-xl bg-[#CDB4DB] shrink-0 shadow-[4px_4px_0px_0px_#330C2F]">
            {currentQuestionIndex + 1}
          </div>
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-dark/5 border-2 border-brand-dark/10 rounded-full w-fit text-[10px] font-black uppercase tracking-widest text-brand-dark/60">
              {getTypeIcon(currentQuestion.type)}
              {currentQuestion.type.replace('-', ' ')}
            </div>
            <h4 className="text-2xl font-black text-brand-dark leading-tight max-w-3xl">
              <MathRenderer math={currentQuestion.question} />
            </h4>
          </div>
        </div>

        {/* Code Block for Debugging */}
        {currentQuestion.code && (
          <div className="ml-16 rounded-neo overflow-hidden border-3 border-brand-dark shadow-[8px_8px_0px_0px_#330C2F]">
            <div className="bg-brand-dark px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Python Debugging Target</span>
            </div>
            <pre className="p-6 bg-[#1E1E2F] text-sm overflow-x-auto leading-relaxed">
              <code dangerouslySetInnerHTML={{ 
                __html: highlight(currentQuestion.code, languages.python, 'python') 
              }} />
            </pre>
          </div>
        )}

        {/* Image for Interpretation */}
        {currentQuestion.image && (
          <div className="ml-16 rounded-neo overflow-hidden border-3 border-brand-dark shadow-[8px_8px_0px_0px_#330C2F] bg-white group">
            <img src={currentQuestion.image} alt="Visual for Analysis" className="max-w-full h-auto mx-auto p-8 transition-transform group-hover:scale-[1.02]" />
          </div>
        )}
        
        {/* Answer Selection */}
        <div className="grid grid-cols-1 gap-4 pl-16">
          {currentQuestion.type === 'numerical' ? (
            <div className="space-y-4">
              <input 
                type="text"
                value={numericalAnswer}
                onChange={(e) => setNumericalAnswer(e.target.value)}
                disabled={isSubmitted || loading}
                placeholder="Type your final calculated value..."
                className="w-full p-6 text-2xl font-black border-3 border-brand-dark rounded-neo shadow-[6px_6px_0px_0px_#330C2F] focus:outline-none focus:ring-0 focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all placeholder:text-brand-dark/20"
              />
              {currentQuestion.hint && !isSubmitted && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-neo-sm">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-bold text-yellow-800">
                    <span className="uppercase text-[10px] opacity-60 block">Pro-tip</span>
                    {currentQuestion.hint}
                  </p>
                </div>
              )}
            </div>
          ) : (currentQuestion.type === 'interview' || currentQuestion.type === 'scenario') ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-brand-dark/40">Your Explanation</label>
                <textarea 
                  value={essayAnswer}
                  onChange={(e) => setEssayAnswer(e.target.value)}
                  disabled={isSubmitted}
                  placeholder="Explain your reasoning clearly and concisely..."
                  className="w-full p-6 h-40 text-lg font-bold border-3 border-brand-dark rounded-neo shadow-[6px_6px_0px_0px_#330C2F] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all bg-slate-50"
                />
              </div>
              
              {essayAnswer.length > 20 && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-[#7B287D] text-white p-4 rounded-t-neo border-x-3 border-t-3 border-brand-dark">
                    <h5 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <UserCheck className="w-4 h-4" /> Self-Evaluation Checklist
                    </h5>
                    <p className="text-xs opacity-80 mt-1">Did your explanation cover these critical points?</p>
                  </div>
                  <div className="border-3 border-brand-dark p-6 space-y-4 rounded-b-neo bg-white shadow-[6px_6px_0px_0px_#330C2F]">
                    {(currentQuestion.correctAnswer as string[]).map((point, idx) => (
                      <label key={idx} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox"
                            checked={checkedPoints[idx] || false}
                            disabled={isSubmitted}
                            onChange={(e) => {
                              const newPoints = [...checkedPoints];
                              newPoints[idx] = e.target.checked;
                              setCheckedPoints(newPoints);
                            }}
                            className="peer appearance-none w-6 h-6 border-3 border-brand-dark rounded-md checked:bg-green-400 transition-all cursor-pointer"
                          />
                          <CheckCircle2 className="absolute top-0.5 left-0.5 w-5 h-5 text-brand-dark opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <span className="font-bold text-sm text-brand-dark/80 group-hover:text-brand-dark transition-colors">{point}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
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
                        ? isCorrect 
                          ? "bg-green-400 text-brand-dark" 
                          : "bg-red-400 text-brand-dark"
                        : "bg-[#7B287D] text-white"
                      : isSubmitted && index === currentQuestion.correctAnswer
                        ? "bg-green-100 border-green-600 text-green-900 border-dashed"
                        : "bg-white text-brand-dark hover:bg-surface-container"
                  )}
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm sm:text-base leading-snug">
                      <MathRenderer math={option} />
                    </span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 border-brand-dark flex items-center justify-center shrink-0 transition-all",
                      selectedOption === index ? "bg-white scale-110" : "bg-transparent"
                    )}>
                      {isSubmitted && index === currentQuestion.correctAnswer && <CheckCircle2 className="w-4 h-4 text-brand-dark" />}
                      {isSubmitted && selectedOption === index && !isCorrect && <XCircle className="w-4 h-4 text-brand-dark" />}
                      {!isSubmitted && <div className={cn("w-2 h-2 rounded-full bg-brand-dark transition-all", selectedOption === index ? "opacity-100" : "opacity-0")} />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isSubmitted && (
        <div className={cn(
          "ml-16 p-8 border-3 rounded-neo animate-in fade-in slide-in-from-top-4 shadow-[6px_6px_0px_0px_#330C2F]",
          isCorrect ? "bg-green-50 border-green-800" : "bg-red-50 border-red-800"
        )}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-700" /> : <XCircle className="w-6 h-6 text-red-700" />}
            <span className="font-black uppercase tracking-[0.2em] text-sm text-brand-dark">
              {isCorrect ? "Mastery Verified" : "Conceptual Gap Detected"}
            </span>
          </div>
          <div className="font-bold text-brand-dark/80 leading-relaxed border-t-2 border-brand-dark/10 pt-4">
            <MathRenderer math={currentQuestion.explanation} />
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row justify-end gap-6 pt-8 border-t-3 border-brand-dark border-dashed mt-8">
        {!isSubmitted ? (
          <button 
            disabled={(currentQuestion.type === 'numerical' ? !numericalAnswer : (currentQuestion.type === 'interview' || currentQuestion.type === 'scenario') ? checkedPoints.filter(Boolean).length === 0 : selectedOption === null) || loading}
            onClick={handleSubmit}
            className="bg-[#7B287D] text-white border-3 border-brand-dark px-12 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            Submit Verdict
            <Send className="w-5 h-5 inline ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button 
            onClick={handleNext}
            disabled={loading}
            className="bg-white text-brand-dark border-3 border-brand-dark px-12 py-4 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin inline mr-3" /> : <CheckCircle2 className="w-5 h-5 inline mr-3" />}
            {currentQuestionIndex < questions.length - 1 ? 'Next Challenge' : 'Complete Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}
