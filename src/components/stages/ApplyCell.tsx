'use client';

import React, { useState } from 'react';
import { Rocket, CheckCircle, Loader2, AlertCircle, CheckCircle2, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ApplyCellProps {
  topicId: string;
  instruction?: string;
}

export default function ApplyCell({ 
  topicId, 
  instruction = "Complete the final laboratory project to master this topic."
}: ApplyCellProps) {
  const [code, setCode] = useState("def solve():\n    # Implement your solution here\n    pass");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/evaluate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          submission: code,
          userId: 'default-user', // Fallback for prototype
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({ 
          success: true, 
          message: "Mastery Confirmed! You have successfully completed the laboratory project." 
        });
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setFeedback({ 
          success: false, 
          message: data.result || "Validation failed. Please review the project requirements and try again." 
        });
      }
    } catch (error) {
      setFeedback({ success: false, message: "An error occurred during evaluation." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-6 h-6 text-brand-dark" />
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight">Laboratory Project</h2>
          </div>
          <div className="bg-[#FFF4E6] border-3 border-brand-dark p-6 rounded-neo shadow-[inset_0px_2px_10px_rgba(0,0,0,0.05)]">
            <h3 className="font-heading font-black mb-2 uppercase text-xs tracking-widest text-brand-dark/60">Specification</h3>
            <p className="text-lg font-medium text-brand-dark leading-relaxed italic">
              "{instruction}"
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="space-y-6">
        <div className="relative">
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 bg-[#1E1E2F] text-white border-3 border-brand-dark rounded-neo p-8 font-code text-sm focus:ring-0 focus:outline-none placeholder:text-white/30 shadow-[6px_6px_0px_0px_#330C2F] transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[8px_8px_0px_0px_#330C2F]"
            placeholder="Implement your solution..."
          />
        </div>

        {feedback && (
          <div className={cn(
            "p-6 border-3 rounded-neo flex items-start gap-4 animate-in fade-in slide-in-from-top-4",
            feedback.success 
              ? "bg-green-100 border-green-700 text-green-900 shadow-[4px_4px_0px_0px_#14532d]" 
              : "bg-red-100 border-red-700 text-red-900 shadow-[4px_4px_0px_0px_#7f1d1d]"
          )}>
            {feedback.success ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
            <div>
              <p className="font-black uppercase tracking-widest text-xs mb-1">
                {feedback.success ? "Project Completed" : "Validation Feedback"}
              </p>
              <pre className="font-bold text-base whitespace-pre-wrap leading-relaxed">{feedback.message}</pre>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
          <div className="flex items-center gap-4 text-brand-dark/40 font-black uppercase text-[10px] tracking-widest">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="w-2 h-2 rounded-full bg-brand-dark/10" />
            </div>
            <span>Evaluation: Real-time Output Check</span>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={loading || (feedback?.success)}
            className="w-full sm:w-auto bg-[#FFADAD] text-brand-dark border-3 border-brand-dark px-12 py-4 rounded-neo font-heading font-black uppercase text-base tracking-widest shadow-[6px_6px_0px_0px_#330C2F] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
            {feedback?.success ? "Mastery Achieved" : "Finalize Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
