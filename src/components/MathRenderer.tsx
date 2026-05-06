'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * A robust wrapper for KaTeX rendering that supports mixed text and LaTeX.
 * It parses $...$ for inline math and $$...$$ for block math.
 */
export default function MathRenderer({ math, block = false, className }: MathRendererProps) {
  if (!math) return null;

  // If the user explicitly asks for block mode, render the whole thing as block math
  if (block) {
    return (
      <div className={`my-4 overflow-x-auto overflow-y-hidden ${className}`}>
        <BlockMath math={math.replace(/\$/g, '')} />
      </div>
    );
  }

  // Otherwise, parse for mixed content
  const parts = math.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        try {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return (
              <div key={index} className="my-4 overflow-x-auto overflow-y-hidden">
                <BlockMath math={part.slice(2, -2)} />
              </div>
            );
          }
          if (part.startsWith('$') && part.endsWith('$')) {
            return (
              <InlineMath key={index} math={part.slice(1, -1)} />
            );
          }
        } catch (err) {
          console.error('KaTeX rendering error:', err);
          return <code key={index} className="text-red-500">{part}</code>;
        }
        // Plain text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
