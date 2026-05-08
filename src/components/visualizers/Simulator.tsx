'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import Visualizer from './index';

interface SimulatorProps {
  data: {
    lens: string;
    frames: any[];
    fps?: number;
    loop?: boolean;
    autoPlay?: boolean;
    title?: string;
  };
  className?: string;
}

export default function Simulator({ data, className }: SimulatorProps) {
  const { lens, frames, fps = 10, loop = true, autoPlay = false } = data;
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalFrames = frames.length;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= totalFrames - 1) {
            if (loop) return 0;
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / (fps * speed));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, fps, speed, totalFrames, loop]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleStep = (dir: number) => {
    setIsPlaying(false);
    setCurrentFrame((prev) => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next >= totalFrames) return totalFrames - 1;
      return next;
    });
  };

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[8px_8px_0px_0px_#330C2F] flex flex-col gap-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7B287D] animate-pulse" />
          Simulation: {data.title || 'System Evolution'}
        </h4>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border-2 border-brand-dark/5 text-[9px] font-black uppercase tracking-widest">
          Frame {currentFrame + 1} / {totalFrames}
        </div>
      </div>

      {/* The "Lens" (Nested Visualizer) */}
      <div className="relative border-2 border-brand-dark/5 rounded-neo-sm overflow-hidden bg-slate-50/30">
        <Visualizer 
          name={lens} 
          data={frames[currentFrame]} 
          className="border-none shadow-none bg-transparent" 
        />
        
        {/* Progress Bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
          <div 
            className="h-full bg-[#7B287D] transition-all duration-100 ease-linear"
            style={{ width: `${((currentFrame + 1) / totalFrames) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-slate-100 rounded-neo-sm border-2 border-transparent hover:border-brand-dark/10 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => handleStep(-1)}
            className="p-2 hover:bg-slate-100 rounded-neo-sm border-2 border-transparent hover:border-brand-dark/10 transition-all"
            title="Prev Frame"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full border-3 border-brand-dark transition-all shadow-[4px_4px_0px_0px_#330C2F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              isPlaying ? "bg-white text-brand-dark" : "bg-[#7B287D] text-white"
            )}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={() => handleStep(1)}
            className="p-2 hover:bg-slate-100 rounded-neo-sm border-2 border-transparent hover:border-brand-dark/10 transition-all"
            title="Next Frame"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="h-6 w-[2px] bg-brand-dark/10 mx-2" />

          <button 
            onClick={() => setSpeed(prev => prev === 2 ? 0.5 : prev === 1 ? 2 : 1)}
            className="px-3 py-1 bg-slate-100 border-2 border-brand-dark/10 rounded-neo-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-slate-200 transition-all"
          >
            <FastForward className={cn("w-3 h-3", speed > 1 && "text-[#7B287D]")} />
            {speed}x
          </button>
        </div>

        {/* Scrubbing Slider */}
        <input 
          type="range"
          min="0"
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentFrame(parseInt(e.target.value));
          }}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7B287D]"
        />
      </div>
    </div>
  );
}
