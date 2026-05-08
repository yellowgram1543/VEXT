'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Vector {
  x: number;
  y: number;
  label?: string;
  color?: string;
  width?: number;
}

interface Point {
  x: number;
  y: number;
  label?: string;
  color?: string;
  radius?: number;
}

interface Line {
  m: number; // slope
  c: number; // intercept
  label?: string;
  color?: string;
  width?: number;
  dashed?: boolean;
}

interface GeometryData {
  vectors?: Vector[];
  points?: Point[];
  lines?: Line[];
  gridSize?: number; // default 10
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface GeometryVisualizerProps {
  data: GeometryData;
  title?: string;
  className?: string;
}

export default function GeometryVisualizer({ data, title, className }: GeometryVisualizerProps) {
  const gridSize = data.gridSize || 10;
  const showGrid = data.showGrid !== false;
  
  // Viewbox settings
  const size = 400;
  const padding = 40;
  const innerSize = size - padding * 2;
  const halfSize = innerSize / 2;
  
  // Coordinate transformation: Map (-gridSize, gridSize) to (padding, size-padding)
  const scale = innerSize / (gridSize * 2);
  
  const toScreen = (val: number, isY = false) => {
    const center = size / 2;
    if (isY) {
      return center - (val * scale); // SVG Y is down
    }
    return center + (val * scale);
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    const lines = [];
    for (let i = -gridSize; i <= gridSize; i++) {
      if (i === 0) continue;
      const pos = toScreen(i);
      // Vertical
      lines.push(
        <line 
          key={`v-${i}`} 
          x1={pos} y1={padding} x2={pos} y2={size - padding} 
          stroke="rgba(0,0,0,0.05)" strokeWidth="1" 
        />
      );
      // Horizontal
      lines.push(
        <line 
          key={`h-${i}`} 
          x1={padding} y1={pos} x2={size - padding} y2={pos} 
          stroke="rgba(0,0,0,0.05)" strokeWidth="1" 
        />
      );
    }
    return lines;
  };

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[6px_6px_0px_0px_#330C2F] flex flex-col gap-4",
      className
    )}>
      {title && (
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" style={{ backgroundColor: '#7B287D' }} />
          {title}
        </h4>
      )}

      <div className="relative aspect-square w-full max-w-[400px] mx-auto bg-slate-50/50 rounded-neo-sm border-2 border-brand-dark/5 overflow-hidden">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full font-heading font-black">
          {/* Grid */}
          {renderGrid()}

          {/* Axes */}
          <line 
            x1={padding} y1={size/2} x2={size-padding} y2={size/2} 
            stroke="currentColor" strokeWidth="2" className="text-brand-dark/20" 
          />
          <line 
            x1={size/2} y1={padding} x2={size/2} y2={size-padding} 
            stroke="currentColor" strokeWidth="2" className="text-brand-dark/20" 
          />

          {/* Lines: y = mx + c */}
          {data.lines?.map((line, i) => {
            // Find intersection with boundaries
            const x1 = -gridSize;
            const y1 = line.m * x1 + line.c;
            const x2 = gridSize;
            const y2 = line.m * x2 + line.c;

            return (
              <line
                key={`line-${i}`}
                x1={toScreen(x1)}
                y1={toScreen(y1, true)}
                x2={toScreen(x2)}
                y2={toScreen(y2, true)}
                stroke={line.color || '#330C2F'}
                strokeWidth={line.width || 3}
                strokeDasharray={line.dashed ? "8 4" : "0"}
              />
            );
          })}

          {/* Points */}
          {data.points?.map((pt, i) => (
            <circle
              key={`pt-${i}`}
              cx={toScreen(pt.x)}
              cy={toScreen(pt.y, true)}
              r={pt.radius || 4}
              fill={pt.color || '#7B287D'}
              stroke="#330C2F"
              strokeWidth="2"
            />
          ))}

          {/* Vectors (Arrows) */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>

          {data.vectors?.map((vec, i) => (
            <g key={`vec-${i}`} style={{ color: vec.color || '#7B287D' }}>
              <line
                x1={toScreen(0)}
                y1={toScreen(0, true)}
                x2={toScreen(vec.x)}
                y2={toScreen(vec.y, true)}
                stroke="currentColor"
                strokeWidth={vec.width || 4}
                markerEnd="url(#arrowhead)"
              />
              {vec.label && (
                <text
                  x={toScreen(vec.x)}
                  y={toScreen(vec.y, true) - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  className="drop-shadow-sm"
                >
                  {vec.label}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Axis Labels */}
        <div className="absolute bottom-2 right-1/2 translate-x-1/2 text-[8px] font-black uppercase tracking-widest text-brand-dark/20">
          {data.xAxisLabel || 'x-axis'}
        </div>
        <div className="absolute left-2 top-1/2 -rotate-90 origin-left -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-brand-dark/20">
          {data.yAxisLabel || 'y-axis'}
        </div>
      </div>
    </div>
  );
}
