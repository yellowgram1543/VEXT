'use client';

import React from 'react';
import ApplyCell from '@/components/stages/ApplyCell';

export default function ApplyDebugPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] p-8 md:p-24">
      <div className="max-w-[1100px] mx-auto">
        <header className="mb-12 border-b-4 border-brand-dark pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-dark uppercase tracking-tighter leading-none">
              Apply Layer: Milestone Mode
            </h1>
            <p className="text-brand-dark/60 font-medium italic">
              From Planning to Production-grade Adversarial Robustness.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-brand-dark text-white rounded-neo-sm border-2 border-brand-dark text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#7B287D]">
              Topic ID: Housing-Predictor-V1
            </div>
          </div>
        </header>

        <div className="border-3 border-brand-dark rounded-neo bg-white shadow-[12px_12px_0px_0px_#330C2F] p-8 md:p-12">
          <ApplyCell 
            topicId="housing-prices"
            instruction="Build a robust Linear Regression pipeline to predict housing prices. Your model must handle significant outliers in 'Square Footage' and 'Year Built' while maintaining an R2 score > 0.85 on noisy data."
            onComplete={() => console.log('Capstone Project Finalized!')}
          />
        </div>

        <footer className="mt-12 text-center">
           <div className="inline-flex items-center gap-6 text-[10px] font-black uppercase text-brand-dark/20 tracking-[0.3em]">
             <span>Environment: Production Lab</span>
             <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/10" />
             <span>Hardware: Edge-Sim-04</span>
             <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/10" />
             <span>Status: Active</span>
           </div>
        </footer>
      </div>
    </div>
  );
}
