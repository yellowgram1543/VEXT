'use client';

import React, { useState, useMemo } from 'react';
import { Settings2, RotateCcw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Visualizer from './index';

interface Control {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  default: any;
  description?: string;
}

interface PlaygroundProps {
  data: {
    lens: string;
    controls: Control[];
    initialData: any;
    // Map control ID to a path in the data object (e.g. "lines[0].m")
    mapping: Record<string, string>;
    title?: string;
  };
  className?: string;
}

/**
 * Helper to set a value in a nested object by path
 */
function setByPath(obj: any, path: string, value: any) {
  const parts = path.split(/[.\[\]]/).filter(Boolean);
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextNumeric = !isNaN(Number(nextPart));
    
    if (!(part in current)) {
      current[part] = isNextNumeric ? [] : {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

export default function Playground({ data, className }: PlaygroundProps) {
  const { lens, controls, initialData, mapping } = data;
  
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    controls.forEach(c => initial[c.id] = c.default);
    return initial;
  });

  const [showDocs, setShowDocs] = useState<string | null>(null);

  const visualizerData = useMemo(() => {
    // Deep clone initial data
    const newData = JSON.parse(JSON.stringify(initialData));
    
    // Apply mappings
    Object.entries(values).forEach(([id, val]) => {
      const path = mapping[id];
      if (path) {
        setByPath(newData, path, val);
      }
    });
    
    return newData;
  }, [initialData, mapping, values]);

  const handleReset = () => {
    const resetValues: Record<string, any> = {};
    controls.forEach(c => resetValues[c.id] = c.default);
    setValues(resetValues);
  };

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[12px_12px_0px_0px_#330C2F] flex flex-col gap-8",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-brand-dark/5 pb-4">
        <div className="flex flex-col">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2 mb-1">
            <Settings2 className="w-3 h-3 text-[#7B287D]" />
            Interactive Playground
          </h4>
          <h3 className="font-heading font-black uppercase text-lg tracking-tighter">
            {data.title || 'Parameter Lab'}
          </h3>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 hover:bg-slate-100 rounded-neo-sm border-2 border-transparent hover:border-brand-dark/10 transition-all text-brand-dark/40 hover:text-brand-dark"
          title="Reset Parameters"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Controls Panel */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {controls.map((control) => (
            <div key={control.id} className="space-y-3 p-4 bg-slate-50 border-2 border-brand-dark/5 rounded-neo-sm relative group">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60 flex items-center gap-2">
                  {control.label}
                  {control.description && (
                    <button 
                      onMouseEnter={() => setShowDocs(control.id)}
                      onMouseLeave={() => setShowDocs(null)}
                      className="text-brand-dark/20 hover:text-[#7B287D]"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </label>
                <span className="px-2 py-1 bg-brand-dark text-white rounded text-[10px] font-black min-w-[32px] text-center">
                  {typeof values[control.id] === 'number' ? values[control.id].toFixed(control.step && control.step < 1 ? 2 : 0) : values[control.id]}
                </span>
              </div>

              {control.type === 'slider' && (
                <input 
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step || 1}
                  value={values[control.id]}
                  onChange={(e) => setValues(prev => ({ ...prev, [control.id]: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7B287D]"
                />
              )}

              {control.type === 'toggle' && (
                <button 
                  onClick={() => setValues(prev => ({ ...prev, [control.id]: !prev[control.id] }))}
                  className={cn(
                    "w-full py-2 rounded-neo-sm border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                    values[control.id] ? "bg-[#7B287D] border-brand-dark text-white" : "bg-white border-brand-dark/10 text-brand-dark/40"
                  )}
                >
                  {values[control.id] ? 'Enabled' : 'Disabled'}
                </button>
              )}

              {control.type === 'select' && (
                <select
                  value={values[control.id]}
                  onChange={(e) => setValues(prev => ({ ...prev, [control.id]: e.target.value }))}
                  className="w-full p-2 bg-white border-2 border-brand-dark/10 rounded-neo-sm font-black text-[10px] uppercase outline-none focus:border-[#7B287D]"
                >
                  {control.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {/* Hover Tooltip for description */}
              {showDocs === control.id && control.description && (
                <div className="absolute left-0 bottom-full mb-2 w-full p-3 bg-[#330C2F] text-white text-[10px] font-bold rounded-neo-sm shadow-xl z-50 animate-in fade-in slide-in-from-bottom-1">
                  {control.description}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-auto p-4 bg-[#F1D6FF] border-2 border-[#7B287D]/20 rounded-neo-sm">
            <p className="text-[10px] font-bold text-[#7B287D] italic leading-relaxed">
              &quot;The magic of learning happens in the gap between what you think will happen and what actually happens.&quot;
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="xl:col-span-3">
          <Visualizer 
            name={lens} 
            data={visualizerData} 
            className="h-full min-h-[400px]"
          />
        </div>
      </div>
    </div>
  );
}
