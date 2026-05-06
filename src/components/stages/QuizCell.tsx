'use client';

import React, { useState } from 'react';
import { HelpCircle, Timer, Save, Send, CheckCircle2, XCircle, Loader2, Lightbulb, Code as CodeIcon, BarChart3, Calculator, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
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
  correctAnswer: string | number; // string for numerical, number for mcq
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
  title = "Knowledge Check", 
  description = "Assess your understanding of the core concepts in this unit.", 
  onComplete 
}: QuizCellProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [numericalAnswer, setNumericalAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  
  const router = useRouter();

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white flex flex-col gap-8 p-8 text-center border-3 border-dashed border-brand-dark/30 rounded-neo">
        <p className="text-brand-dark/50 italic font-medium">No quiz questions available for this topic.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  const checkCorrect = (q: QuizQuestion, val: string | number) => {
    if (q.type === 'numerical') {
      return val.toString().trim() === q.correctAnswer.toString().trim();
    }
    return val === q.correctAnswer;
  };

  const currentVal = q.type === 'numerical' ? numericalAnswer : selectedOption;
  const isCorrect = currentQuestion && checkCorrect(currentQuestion, currentVal as any);

  const handleSubmit = () => {
    setIsSubmitted(true);
    const val = currentQuestion.type === 'numerical' ? numericalAnswer : selectedOption;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val as any }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setNumericalAnswer('');
      setIsSubmitted(false);
    } else {
      setLoading(true);
      const allAnswers = { ...answers, [currentQuestion.id]: (currentQuestion.type === 'numerical' ? numericalAnswer : selectedOption) as any };
      const correctCount = questions.filter(q => checkCorrect(q, allAnswers[q.id])).length;
      const score = correctCount / questions.length;
      setFinalScore(score);
      
      try {
        const response = await fetch('/api/evaluate/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicId,
            userId: 'default-user',
            score: score
          }),
        });
        
        const data = await response.json();
        setQuizFinished(true);
        onComplete?.(score);
        
        if (data.passed) {
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to submit quiz", error);
        setQuizFinished(true);
      } finally {
        setLoading(false);
      }
    }
  };

  if (quizFinished) {
    const passed = finalScore !== null && finalScore >= 0.8;
    return (
      <div className="bg-white flex flex-col items-center gap-6 p-12 text-center border-3 border-brand-dark rounded-neo shadow-[8px_8px_0px_0px_#330C2F] animate-in zoom-in-95 duration-300">
        <div className={cn(
          "w-24 h-24 rounded-full border-4 border-brand-dark flex items-center justify-center mb-4",
          passed ? "bg-green-100" : "bg-red-100"
        )}>
          {passed ? <CheckCircle2 className="w-12 h-12 text-green-600" /> : <XCircle className="w-12 h-12 text-red-600" />}
        </div>
        <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight">
          {passed ? "Mastery Achieved!" : "Keep Practicing"}
        </h2>
        <div className="text-6xl font-black text-[#7B287D]">
          {Math.round((finalScore || 0) * 100)}%
        </div>
        <p className="text-xl font-medium text-brand-dark/70 max-w-md">
          {passed 
            ? "You've successfully unlocked the next stage. Your knowledge of these concepts is solid!" 
            : "You need at least 80% to progress to the Apply stage. Review the content and try again."}
        </p>
        {!passed && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-brand-dark text-white border-3 border-brand-dark px-10 py-3 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#7B287D] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            Retry Quiz
          </button>
        )}
      </div>
    );
  }

  const getTypeIcon = (type: QuestionType) => {
    switch(type) {
      case 'debugging': return <CodeIcon className="w-4 h-4" />;
      case 'interpretation': return <BarChart3 className="w-4 h-4" />;
      case 'numerical': return <Calculator className="w-4 h-4" />;
      case 'scenario': return <MessageSquare className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight leading-none">{title}</h2>
          <p className="text-lg text-brand-dark/60 font-medium">{description}</p>
        </div>
        <div className="flex items-center gap-3 bg-brand-dark text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#7B287D]">
          <Timer className="w-4 h-4" />
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 border-3 border-brand-dark rounded-full font-heading font-black text-lg bg-surface-container shrink-0">
            {currentQuestionIndex + 1}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-dark/5 rounded-full w-fit text-[10px] font-black uppercase tracking-widest">
              {getTypeIcon(currentQuestion.type)}
              {currentQuestion.type.replace('-', ' ')}
            </div>
            <h4 className="text-xl font-black text-brand-dark leading-snug">
              <MathRenderer math={currentQuestion.question} />
            </h4>
          </div>
        </div>

        {/* Code Block for Debugging */}
        {currentQuestion.code && (
          <div className="ml-14 rounded-neo overflow-hidden border-3 border-brand-dark shadow-[4px_4px_0px_0px_#330C2F]">
            <div className="bg-brand-dark/10 px-4 py-2 border-b-3 border-brand-dark flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">Python Snippet</span>
            </div>
            <pre className="p-6 bg-[#1E1E2F] text-sm overflow-x-auto">
              <code dangerouslySetInnerHTML={{ 
                __html: highlight(currentQuestion.code, languages.python, 'python') 
              }} />
            </pre>
          </div>
        )}

        {/* Image for Interpretation */}
        {currentQuestion.image && (
          <div className="ml-14 rounded-neo overflow-hidden border-3 border-brand-dark shadow-[4px_4px_0px_0px_#330C2F] bg-white">
            <img src={currentQuestion.image} alt="Question Visual" className="max-w-full h-auto mx-auto p-4" />
          </div>
        )}
        
        {/* Answer Selection */}
        <div className="grid grid-cols-1 gap-4 pl-14">
          {currentQuestion.type === 'numerical' ? (
            <div className="space-y-4">
              <input 
                type="text"
                value={numericalAnswer}
                onChange={(e) => setNumericalAnswer(e.target.value)}
                disabled={isSubmitted || loading}
                placeholder="Enter numerical value..."
                className="w-full p-6 text-xl font-black border-3 border-brand-dark rounded-neo shadow-[4px_4px_0px_0px_#330C2F] focus:outline-none focus:ring-4 focus:ring-[#7B287D]/10 transition-all"
              />
              {currentQuestion.hint && !isSubmitted && (
                <p className="text-sm font-medium text-brand-dark/40 italic flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Hint: {currentQuestion.hint}
                </p>
              )}
            </div>
          ) : (
            currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                disabled={isSubmitted || loading}
                onClick={() => setSelectedOption(index)}
                className={cn(
                  "p-6 text-left border-3 border-brand-dark rounded-neo font-bold transition-all shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none",
                  selectedOption === index 
                    ? isSubmitted 
                      ? isCorrect 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                      : "bg-[#7B287D] text-white"
                    : isSubmitted && index === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-800 text-green-900"
                      : "bg-white text-brand-dark hover:bg-surface-container"
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">
                    {option.includes('$') ? <MathRenderer math={option.replace(/\$/g, '')} /> : option}
                  </span>
                  {isSubmitted && index === currentQuestion.correctAnswer && <CheckCircle2 className="w-6 h-6" />}
                  {isSubmitted && selectedOption === index && !isCorrect && <XCircle className="w-6 h-6" />}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {isSubmitted && (
        <div className={cn(
          "ml-14 p-6 border-3 rounded-neo animate-in fade-in slide-in-from-top-2",
          isCorrect ? "bg-green-50 border-green-800 text-green-900" : "bg-red-50 border-red-800 text-red-900"
        )}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-black uppercase tracking-widest text-xs">{isCorrect ? "Correct!" : "Not quite."}</span>
          </div>
          <p className="font-medium">
            {currentQuestion.explanation.includes('$') ? (
              <MathRenderer math={currentQuestion.explanation.replace(/\$/g, '')} />
            ) : (
              currentQuestion.explanation
            )}
          </p>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t-3 border-brand-dark border-dashed">
        {!isSubmitted ? (
          <button 
            disabled={(currentQuestion.type === 'numerical' ? !numericalAnswer : selectedOption === null) || loading}
            onClick={handleSubmit}
            className="bg-[#7B287D] text-white border-3 border-brand-dark px-10 py-3 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 inline mr-2" />
            Submit Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            disabled={loading}
            className="bg-[#CDB4DB] text-brand-dark border-3 border-brand-dark px-10 py-3 rounded-neo font-heading font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> : <Save className="w-5 h-5 inline mr-2" />}
            {currentQuestionIndex < questions.length - 1 ? 'Save & Next' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
