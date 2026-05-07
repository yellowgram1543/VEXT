'use client';

import React from 'react';
import ReinforceCell from '@/components/stages/ReinforceCell';

export default function ReinforceDebugPage() {
  const practices = [
    {
      id: "demo-1",
      tab: "concept",
      type: "Basic",
      label: "Logistic Regression Inference",
      instruction: "Explain the sigmoid foundation of binary classification.",
      solution: "A simple implementation of the sigmoid function and the linear combination $z = wx + b$.",
      scenario: "Predicting if an email is spam or not.",
      mentalModel: "Sigmoid squashes any value into a 0-1 probability range.",
      iconName: "help"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] p-8 md:p-24">
      <div className="max-w-[800px] mx-auto">
        <header className="mb-12 border-b-4 border-brand-dark pb-6">
          <h1 className="text-4xl font-black text-brand-dark uppercase tracking-tighter mb-2">
            Reinforce Layer Debugger
          </h1>
          <p className="text-brand-dark/60 font-medium italic">
            Previewing the 3-Tier Progression and Interactive Pitfalls.
          </p>
        </header>

        <div className="border-3 border-brand-dark rounded-neo bg-white shadow-[8px_8px_0px_0px_#330C2F] p-8">
          <ReinforceCell 
            practices={practices} 
            status="ACTIVE"
            loading={false}
            onComplete={() => alert('Stage Unlocked!')}
          />
        </div>

        <footer className="mt-12 text-center text-xs font-black uppercase text-brand-dark/30 tracking-widest">
          Neo-Brutalist Component Lab v1.0
        </footer>
      </div>
    </div>
  );
}
