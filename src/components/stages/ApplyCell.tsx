'use client';

import React, { useState, useEffect } from 'react';
import { 
  Rocket, CheckCircle2, Loader2, FlaskConical, 
  FileText, Code2, ShieldAlert, Cpu, Timer, BarChart, 
  Terminal, ArrowRight, Zap, Target, Bug
} from 'lucide-react';
import { cn } from '@/lib/utils';
interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'failed';
}

interface ApplyCellProps {
  topicId: string;
  instruction?: string;
  onComplete?: () => void;
}

export default function ApplyCell({ 
  topicId: _topicId, 
  instruction = "Build a robust Linear Regression pipeline to predict housing prices with outlier handling.",
  onComplete
}: ApplyCellProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0: Design, 1: Implementation, 2: Gauntlet
  const [designDoc, setDesignDoc] = useState({
    strategy: '',
    metric: 'MSE',
    cleaning: ''
  });
  const [code, setCode] = useState(`import numpy as np\n\ndef preprocess(data):\n    # TODO: Handle missing values and outliers\n    return data\n\ndef train_model(X, y):\n    # TODO: Implement Linear Regression\n    return weights\n\ndef evaluate(model, X_test):\n    # TODO: Return predictions\n    return preds`);
  
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Data Ingestion', description: 'Loading 10,000 samples...', status: 'pending' },
    { id: '2', title: 'Preprocessing', description: 'Removing 5% outlier noise.', status: 'pending' },
    { id: '3', title: 'Model Training', description: 'Fitting coefficients.', status: 'pending' },
    { id: '4', title: 'Metric Validation', description: 'Verifying MSE threshold < 0.05.', status: 'pending' }
  ]);

  const [gauntletStatus, setGauntletStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [robustnessScore, setRobustnessScore] = useState<number | null>(null);

  const startImplementation = () => {
    if (designDoc.strategy.length < 10) return;
    setStep(1);
  };

  const runPipeline = async () => {
    setLoading(true);
    // Simulate pipeline steps
    for (let i = 0; i < milestones.length; i++) {
      setMilestones(prev => prev.map((m, idx) => idx === i ? { ...m, status: 'loading' } : m));
      await new Promise(r => setTimeout(r, 800));
      setMilestones(prev => prev.map((m, idx) => idx === i ? { ...m, status: 'completed' } : m));
    }
    setLoading(false);
    setStep(2);
  };

  const startGauntlet = async () => {
    setGauntletStatus('running');
    // Simulate "Attacks"
    await new Promise(r => setTimeout(r, 1000)); // Attack 1: Missing Values
    await new Promise(r => setTimeout(r, 1000)); // Attack 2: Outliers
    await new Promise(r => setTimeout(r, 1000)); // Attack 3: Distribution Shift
    
    setRobustnessScore(88);
    setGauntletStatus('completed');
    onComplete?.();
  };

  return (
    <div className="w-full bg-white flex flex-col gap-10 p-2">
      {/* Header & Specs */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#7B287D] rounded-neo-sm border-2 border-brand-dark shadow-[4px_4px_0px_0px_#330C2F]">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tighter leading-none">Capstone Laboratory</h2>
            <p className="text-xs font-black uppercase tracking-widest text-brand-dark/40 mt-1">Milestone Mode • Production Constraints</p>
          </div>
        </div>
        
        <div className="bg-slate-50 border-3 border-brand-dark p-6 rounded-neo shadow-[6px_6px_0px_0px_#330C2F]">
          <h3 className="font-black mb-2 uppercase text-[10px] tracking-widest text-[#7B287D] flex items-center gap-2">
            <Target className="w-4 h-4" /> Project Specification
          </h3>
          <p className="text-lg font-bold text-brand-dark leading-relaxed italic">
            &ldquo;{instruction}&rdquo;
          </p>
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t-2 border-brand-dark/5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white border-2 border-brand-dark/10 px-3 py-1 rounded-full">
              <Cpu className="w-3 h-3" /> Mem: 1GB Limit
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white border-2 border-brand-dark/10 px-3 py-1 rounded-full">
              <Timer className="w-3 h-3" /> Latency: &lt;50ms
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white border-2 border-brand-dark/10 px-3 py-1 rounded-full">
              <BarChart className="w-3 h-3" /> Target Metric: {designDoc.metric}
            </div>
          </div>
        </div>
      </div>

      {/* Step Container */}
      <div className="space-y-8">
        {/* Progress Tracker */}
        <div className="flex justify-between items-center px-4 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-dark/10 -translate-y-1/2 -z-10" />
          {[
            { icon: FileText, label: 'Design', s: 0 },
            { icon: Code2, label: 'Implement', s: 1 },
            { icon: ShieldAlert, label: 'Gauntlet', s: 2 }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-white px-4">
              <div className={cn(
                "w-10 h-10 rounded-full border-3 flex items-center justify-center transition-all",
                step >= item.s ? "bg-[#7B287D] border-brand-dark text-white scale-110 shadow-[4px_4px_0px_0px_#330C2F]" : "bg-white border-brand-dark/20 text-brand-dark/20"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", step >= item.s ? "text-brand-dark" : "text-brand-dark/20")}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Content */}
        {step === 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="model-strategy" className="text-xs font-black uppercase tracking-widest text-brand-dark/50 flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Model Strategy
                </label>
                <textarea 
                  id="model-strategy"
                  title="Model Strategy Description"
                  value={designDoc.strategy}
                  onChange={(e) => setDesignDoc({...designDoc, strategy: e.target.value})}
                  placeholder="e.g., Using SGD Regressor with L2 penalty to handle sparse features..."
                  className="w-full h-32 p-4 font-bold border-3 border-brand-dark rounded-neo focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_#330C2F] transition-all bg-slate-50"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="primary-metric" className="text-xs font-black uppercase tracking-widest text-brand-dark/50">Primary Metric</label>
                  <select 
                    id="primary-metric"
                    title="Select Primary Performance Metric"
                    value={designDoc.metric}
                    onChange={(e) => setDesignDoc({...designDoc, metric: e.target.value})}
                    className="w-full p-4 font-black border-3 border-brand-dark rounded-neo appearance-none bg-white cursor-pointer"
                  >
                    <option>MSE (Mean Squared Error)</option>
                    <option>MAE (Mean Absolute Error)</option>
                    <option>R2 Score</option>
                    <option>RMSE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="cleaning-strategy" className="text-xs font-black uppercase tracking-widest text-brand-dark/50">Cleaning Strategy</label>
                  <input 
                    id="cleaning-strategy"
                    title="Cleaning Strategy Details"
                    type="text" 
                    value={designDoc.cleaning}
                    onChange={(e) => setDesignDoc({...designDoc, cleaning: e.target.value})}
                    placeholder="e.g., Z-score Outlier removal (3std)"
                    className="w-full p-4 font-bold border-3 border-brand-dark rounded-neo bg-slate-50"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={startImplementation}
              disabled={designDoc.strategy.length < 10}
              className="w-full bg-[#7B287D] text-white border-3 border-brand-dark p-6 rounded-neo font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              Initialize Workspace <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in duration-500 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Code Editor */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-brand-dark text-white p-3 rounded-t-neo border-x-3 border-t-3 border-brand-dark flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-green-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">pipeline.py</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
                <textarea 
                  id="pipeline-code"
                  title="Python Pipeline Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[400px] p-6 bg-[#1E1E2F] text-[#D4D4D4] font-code text-sm border-3 border-brand-dark rounded-b-neo shadow-[8px_8px_0px_0px_#330C2F] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Milestones Sidebar */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Pipeline Checkpoints
                </h4>
                <div className="space-y-3">
                  {milestones.map((m) => (
                    <div key={m.id} className={cn(
                      "p-4 border-2 rounded-neo transition-all flex items-center justify-between",
                      m.status === 'completed' ? "bg-green-50 border-green-600 shadow-[4px_4px_0px_0px_#166534]" : 
                      m.status === 'loading' ? "bg-blue-50 border-blue-600 animate-pulse" :
                      "bg-white border-brand-dark/10"
                    )}>
                      <div>
                        <p className="font-black text-xs uppercase tracking-tight">{m.title}</p>
                        <p className="text-[10px] font-bold text-brand-dark/50">{m.description}</p>
                      </div>
                      {m.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {m.status === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={runPipeline}
                  disabled={loading}
                  className="w-full bg-[#CDB4DB] text-brand-dark border-3 border-brand-dark p-4 rounded-neo font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_#330C2F] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                  Execute Pipeline
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center gap-8 py-8">
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">The Gauntlet</h3>
              <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-xs">Adversarial Robustness Testing</p>
            </div>

            <div className="relative w-full max-w-2xl aspect-video bg-[#1A1A1A] border-4 border-brand-dark rounded-neo shadow-[12px_12px_0px_0px_#330C2F] overflow-hidden group">
              {/* Matrix Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#33FF33_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                {gauntletStatus === 'idle' && (
                  <>
                    <div className="w-20 h-20 rounded-full border-4 border-red-500/30 flex items-center justify-center animate-pulse">
                      <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <p className="text-white font-mono text-center max-w-sm">
                      Ready to attack your model with noisy, missing, and non-IID data samples.
                    </p>
                    <button 
                      onClick={startGauntlet}
                      className="bg-red-500 text-white border-3 border-brand-dark px-10 py-4 rounded-neo font-black uppercase text-sm tracking-[0.2em] hover:bg-red-600 transition-colors shadow-[6px_6px_0px_0px_#330C2F]"
                    >
                      Start Challenge
                    </button>
                  </>
                )}

                {gauntletStatus === 'running' && (
                  <div className="w-full space-y-6">
                    <div className="flex justify-between text-green-400 font-mono text-xs">
                      <span>ATTACKING_SYSTEM_INTEGRITY...</span>
                      <span className="animate-pulse">RUNNING</span>
                    </div>
                    <div className="space-y-4">
                      {['Injecting NaN values', 'Synthesizing Outliers', 'Shifting Feature Distribution'].map((t, i) => (
                        <div key={i} className={cn(
                          "flex items-center gap-3 text-white font-mono text-sm animate-in slide-in-from-left duration-500",
                          i === 1 ? "delay-[1000ms]" : i === 2 ? "delay-[2000ms]" : ""
                        )}>
                          <Bug className="w-4 h-4 text-red-500" />
                          <span>{t}</span>
                          <div className="flex-1 border-b border-dashed border-white/20" />
                          <span className="text-green-500">DEFLECTED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {gauntletStatus === 'completed' && (
                  <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                        <span className="text-4xl font-black text-green-500">{robustnessScore}%</span>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-brand-dark p-2 rounded-full border-2 border-white">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-white text-2xl font-black uppercase tracking-tight">Robustness Verified</h4>
                      <p className="text-white/60 font-mono text-xs mt-1">Model exceeded production stability thresholds.</p>
                    </div>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-green-500 text-brand-dark border-3 border-brand-dark px-12 py-4 rounded-neo font-black uppercase text-sm tracking-widest shadow-[6px_6px_0px_0px_#166534] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      Finish Topic
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
