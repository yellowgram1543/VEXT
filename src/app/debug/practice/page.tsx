'use client';

import React from 'react';
import PracticeCell from '@/components/stages/PracticeCell';

export default function PracticeDebugPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] p-8 md:p-24">
      <div className="max-w-[900px] mx-auto">
        <header className="mb-12 border-b-4 border-brand-dark pb-6">
          <h1 className="text-4xl font-black text-brand-dark uppercase tracking-tighter mb-2">
            Practice Layer Debugger
          </h1>
          <p className="text-brand-dark/60 font-medium italic">
            Previewing Skill Building Tabs and Progressive Hint Systems.
          </p>
        </header>

        <div className="border-3 border-brand-dark rounded-neo bg-white shadow-[8px_8px_0px_0px_#330C2F] p-8">
          <PracticeCell 
            topicId="debug-ml-fundamentals"
            status="ACTIVE"
            onComplete={() => alert('Practice Phase Mastered!')}
          />
        </div>

        <footer className="mt-12 text-center text-xs font-black uppercase text-brand-dark/30 tracking-widest">
          Interactive Learning Engine v1.0
        </footer>
      </div>
    </div>
  );
}
