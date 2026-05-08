'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Play, Terminal, RefreshCw, Loader2, RotateCcw, Code2 } from 'lucide-react';
import { usePyodide } from '@/hooks/usePyodide';

// Dynamically load Monaco editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#1E1E2F] flex items-center justify-center text-gray-500 font-code text-xs">Loading Editor...</div>
});

interface SandboxData {
  initialCode?: string;
  language?: string;
}

interface SandboxVisualizerProps {
  data: SandboxData;
  title?: string;
  className?: string;
}

export default function SandboxVisualizer({ data, title, className }: SandboxVisualizerProps) {
  const { initialCode = '# Write your code here\n', language = 'python' } = data;
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<{ stdout: string; stderr: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { runCode, resetKernel } = usePyodide();

  const handleRunCode = async () => {
    if (!code || language !== 'python') return;

    setIsExecuting(true);
    try {
      const result = await runCode(code);
      setOutput(result);
    } catch (err: any) {
      setOutput({ stdout: "", stderr: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
  };

  return (
    <div className={cn(
      "bg-white border-3 border-brand-dark rounded-neo p-6 shadow-[8px_8px_0px_0px_#330C2F] flex flex-col gap-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <Code2 className="w-3 h-3 text-[#7B287D]" />
          Sandbox Environment
        </h4>
        {title && (
          <div className="px-2 py-1 bg-slate-100 rounded text-[8px] font-black uppercase tracking-widest border border-brand-dark/10">
            {title}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Editor Container */}
        <div className="w-full min-h-[300px] bg-[#1E1E2F] border-3 border-brand-dark rounded-neo overflow-hidden shadow-[4px_4px_0px_0px_#330C2F] font-code text-sm relative flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-brand-dark/20 border-b-2 border-brand-dark/30">
            <span className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" /> {language} kernel
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                title="Reset Code"
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/10 text-white/60 border border-transparent hover:border-white/20 rounded-neo-sm text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button 
                onClick={() => { resetKernel(); setOutput(null); }}
                title="Restart Kernel"
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-yellow-500/20 text-white/60 hover:text-yellow-400 border border-transparent rounded-neo-sm text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <div className="w-[2px] h-4 bg-white/10 mx-1" />
              <button 
                onClick={handleRunCode}
                disabled={isExecuting || language !== 'python'}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#7B287D] hover:bg-[#923494] text-white rounded-neo-sm border-2 border-brand-dark/20 text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 disabled:opacity-50 transition-all"
              >
                {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-white" />}
                {isExecuting ? "Running..." : "Run"}
              </button>
            </div>
          </div>
          
          {/* Monaco Editor */}
          <div className="flex-1 min-h-[250px]">
            <Editor
              height="100%"
              language={language === 'python' ? 'python' : 'plaintext'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                fontFamily: '"JetBrains Mono", monospace',
                renderLineHighlight: 'all',
                contextmenu: false,
                tabSize: 4,
              }}
            />
          </div>
        </div>

        {/* Output Console */}
        <div className={cn(
          "w-full bg-[#0F0F17] border-3 border-brand-dark rounded-neo p-4 font-code text-xs shadow-inner transition-all duration-300",
          (!output && !isExecuting) ? "h-12 overflow-hidden opacity-50" : "min-h-[100px]"
        )}>
          <div className="flex items-center gap-2 mb-2 text-white/30 uppercase font-black tracking-widest text-[9px]">
            <Terminal className="w-3 h-3" /> Console Output
          </div>
          {isExecuting && !output && (
            <div className="text-yellow-400/80 animate-pulse font-bold mt-2">Mounting virtual environment & executing...</div>
          )}
          {output?.stdout && <pre className="text-green-400 whitespace-pre-wrap font-bold leading-relaxed">{output.stdout}</pre>}
          {output?.stderr && <pre className="text-red-400 whitespace-pre-wrap font-bold leading-relaxed">{output.stderr}</pre>}
          {!isExecuting && !output && (
            <div className="text-white/20 italic">Ready. Press Run to execute code.</div>
          )}
        </div>
      </div>
    </div>
  );
}
