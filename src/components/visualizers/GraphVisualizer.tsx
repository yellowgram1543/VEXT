'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
  type?: 'circle' | 'rect';
  size?: number;
  value?: number; // for highlighting or thickness
}

interface Edge {
  from: string;
  to: string;
  label?: string;
  color?: string;
  width?: number;
  opacity?: number;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
  layout?: 'manual' | 'neural' | 'tree';
  viewBox?: { x: number; y: number; width: number; height: number };
}

interface GraphVisualizerProps {
  data: GraphData;
  title?: string;
  className?: string;
}

export default function GraphVisualizer({ data, title, className }: GraphVisualizerProps) {
  const viewBox = data.viewBox || { x: 0, y: 0, width: 400, height: 300 };
  
  const findNode = (id: string) => data.nodes.find(n => n.id === id);

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[6px_6px_0px_0px_#330C2F] flex flex-col gap-4",
      className
    )}>
      {title && (
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7B287D]" />
          {title}
        </h4>
      )}

      <div className="relative w-full aspect-[4/3] bg-slate-50/50 rounded-neo-sm border-2 border-brand-dark/5 overflow-hidden">
        <svg 
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} 
          className="w-full h-full"
        >
          {/* Edges */}
          <defs>
            <marker
              id="graph-arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="15" // Offset so it doesn't overlap circle
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>

          {data.edges.map((edge, i) => {
            const start = findNode(edge.from);
            const end = findNode(edge.to);
            if (!start || !end) return null;

            return (
              <g key={`edge-${i}`} style={{ color: edge.color || '#330C2F' }}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="currentColor"
                  strokeWidth={edge.width || 2}
                  strokeOpacity={edge.opacity || 0.3}
                  markerEnd="url(#graph-arrowhead)"
                />
                {edge.label && (
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 5}
                    textAnchor="middle"
                    fontSize="8"
                    fill="currentColor"
                    className="font-black uppercase tracking-tighter"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {data.nodes.map((node) => {
            const size = node.size || 20;
            const isCircle = node.type !== 'rect';
            
            return (
              <g key={node.id} style={{ color: node.color || '#7B287D' }}>
                {isCircle ? (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size / 2}
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                ) : (
                  <rect
                    x={node.x - size / 2}
                    y={node.y - size / 2}
                    width={size}
                    height={size}
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="3"
                    rx="4"
                  />
                )}
                {node.label && (
                  <text
                    x={node.x}
                    y={node.y + (isCircle ? 0 : 2)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="#330C2F"
                    className="font-black uppercase tracking-tighter pointer-events-none"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
