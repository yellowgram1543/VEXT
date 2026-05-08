'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GridCell {
  value: number;
  label?: string;
  color?: string;
  highlight?: boolean;
}

interface GridData {
  rows: number;
  cols: number;
  cells: GridCell[][];
  showLabels?: boolean;
  colorScale?: {
    min: number;
    max: number;
    startColor: string; // e.g., 'white'
    endColor: string;   // e.g., '#7B287D'
  };
}

interface GridVisualizerProps {
  data: GridData;
  title?: string;
  className?: string;
}

export default function GridVisualizer({ data, title, className }: GridVisualizerProps) {
  const { rows, cols, cells, showLabels = true, colorScale } = data;

  // Simple linear interpolation for colors
  const getColor = (value: number) => {
    if (!colorScale) return 'transparent';
    const { min, max, startColor, endColor } = colorScale;
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    
    // Simple hex interpolation (simplified for this component)
    // In a production app, use a library like d3-color or tinycolor
    if (ratio > 0.5) return endColor;
    return startColor;
  };

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[6px_6px_0px_0px_#330C2F] flex flex-col gap-4",
      className
    )}>
      {title && (
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A7C7E7]" />
          {title}
        </h4>
      )}

      <div className="relative w-full overflow-auto">
        <div 
          className="grid gap-1 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))`,
            width: 'fit-content'
          }}
        >
          {cells.map((row, rIdx) => (
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={cn(
                  "aspect-square flex items-center justify-center border-2 border-brand-dark/10 rounded-neo-sm transition-all text-[10px] font-black",
                  cell.highlight && "border-brand-dark border-3 scale-105 z-10 shadow-md bg-yellow-100"
                )}
                style={{ 
                  backgroundColor: cell.color || (colorScale ? getColor(cell.value) : 'white')
                }}
              >
                {showLabels && (cell.label || cell.value.toFixed(1))}
              </div>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}
