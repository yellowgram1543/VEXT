'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Axis {
  label: string;
  value: number; // 0 to 1
}

interface CognitiveRadarProps {
  data?: Axis[];
  size?: number;
  className?: string;
}

const DEFAULT_DATA: Axis[] = [
  { label: 'Theory', value: 0.8 },
  { label: 'Numerical', value: 0.6 },
  { label: 'Coding', value: 0.9 },
  { label: 'Practical', value: 0.7 },
  { label: 'Intuition', value: 0.5 },
  { label: 'Architecture', value: 0.4 },
];

export default function CognitiveRadar({ 
  data = DEFAULT_DATA, 
  size = 200,
  className 
}: CognitiveRadarProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.6; // Reduced from 0.7 to give more room for labels
  const angleStep = (Math.PI * 2) / data.length;

  // Generate points for the background grid (3 levels)
  const gridLevels = [0.33, 0.66, 1];
  const gridPoints = gridLevels.map(level => {
    return data.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * level * Math.cos(angle);
      const y = center + radius * level * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  // Generate points for the actual data
  const dataPoints = data.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = Math.max(0.1, axis.value); // Minimum visibility
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={cn("relative flex items-center justify-center overflow-visible", className)} style={{ width: `${size}px`, height: `${size}px` }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Grid lines (Axes) */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-brand-dark/10 stroke-1"
            />
          );
        })}

        {/* Level Hexagons */}
        {gridPoints.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            className="stroke-brand-dark/10 stroke-1"
          />
        ))}

        {/* Data Area */}
        <polygon
          points={dataPoints}
          className="fill-[#7B287D]/20 stroke-[#7B287D] stroke-3 transition-all duration-1000"
        />

        {/* Axis Points */}
        {data.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * axis.value * Math.cos(angle);
          const y = center + radius * axis.value * Math.sin(angle);
          return (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={4}
              className="fill-[#7B287D] stroke-brand-dark stroke-2"
            />
          );
        })}

        {/* Labels */}
        {data.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 22; // Increased distance
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          
          // Precise text alignment
          let textAnchor: "start" | "middle" | "end" = 'middle';
          if (Math.cos(angle) > 0.1) textAnchor = 'start';
          else if (Math.cos(angle) < -0.1) textAnchor = 'end';

          let dy = '0.35em';
          if (Math.sin(angle) > 0.5) dy = '1em';
          else if (Math.sin(angle) < -0.5) dy = '-0.2em';

          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dy={dy}
              className="font-heading font-black text-[8px] uppercase tracking-tighter fill-brand-dark/60"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
