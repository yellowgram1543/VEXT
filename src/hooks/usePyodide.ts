'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initPyodide = useCallback(async () => {
    if (pyodide) return pyodide;
    
    try {
      setIsLoading(true);
      const instance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
      });
      
      // Load standard ML libraries
      await instance.loadPackage(['numpy', 'scikit-learn']);
      
      setPyodide(instance);
      setIsLoading(false);
      return instance;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      console.error("Pyodide loading failed:", err);
    }
  }, [pyodide]);

  useEffect(() => {
    // We don't auto-init because it's a large download.
    // We'll let the component trigger it when needed.
  }, []);

  const runCode = async (code: string) => {
    const py = pyodide || await initPyodide();
    if (!py) throw new Error("Pyodide not initialized");

    try {
      // Capture stdout and stderr
      py.runPython(`
import sys
import io
if not hasattr(sys, 'stdout_buffer'):
    sys.stdout_buffer = io.StringIO()
    sys.stderr_buffer = io.StringIO()

sys.stdout = sys.stdout_buffer
sys.stderr = sys.stderr_buffer
# Clear previous buffers
sys.stdout.truncate(0)
sys.stdout.seek(0)
sys.stderr.truncate(0)
sys.stderr.seek(0)
      `);

      try {
        await py.runPythonAsync(code);
      } catch (err: any) {
        // The error might already be in sys.stderr if it's a Python error
        // but we'll also catch the JS-side error message.
        const pythonError = py.runPython("sys.stderr.getvalue()");
        return { 
          stdout: py.runPython("sys.stdout.getvalue()"), 
          stderr: pythonError || err.message 
        };
      }
      
      return { 
        stdout: py.runPython("sys.stdout.getvalue()"), 
        stderr: py.runPython("sys.stderr.getvalue()") 
      };
    } catch (err: any) {
      return { stdout: "", stderr: err.message };
    }
  };

  const resetKernel = useCallback(async () => {
    if (!pyodide) return;
    try {
      pyodide.runPython(`
import sys
main = sys.modules['__main__']
for name in list(main.__dict__.keys()):
    if not name.startswith('__') and name not in ['sys', 'io']:
        del main.__dict__[name]
      `);
      console.log("Pyodide kernel reset successful");
    } catch (err) {
      console.error("Failed to reset kernel:", err);
    }
  }, [pyodide]);

  return { pyodide, isLoading, error, initPyodide, runCode, resetKernel };
}
