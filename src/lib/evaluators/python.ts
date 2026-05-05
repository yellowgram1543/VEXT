import { spawn } from 'child_process';

export interface PythonResult {
  stdout: string;
  stderr: string;
  error?: string;
}

/**
 * Executes Python code in a child process with a timeout.
 * 
 * SECURITY NOTE: This executes arbitrary code. In a production environment,
 * this MUST be run in a sandboxed container (e.g., Docker, gVisor, or AWS Lambda).
 * For this prototype, we rely on a process timeout and basic size limits.
 */
export async function runPython(code: string, timeoutMs: number = 5000): Promise<PythonResult> {
  return new Promise((resolve) => {
    // Basic sanitization: check for obviously dangerous imports
    // This is not a real security measure, just a sanity check for a prototype.
    const forbidden = ['os', 'sys', 'shutil', 'subprocess', 'socket', 'requests', 'urllib'];
    for (const mod of forbidden) {
      if (new RegExp(`\\bimport\\s+${mod}\\b`).test(code) || new RegExp(`\\bfrom\\s+${mod}\\b`).test(code)) {
        return resolve({
          stdout: '',
          stderr: '',
          error: `Security error: Import of '${mod}' is forbidden in this environment.`
        });
      }
    }

    const child = spawn('python', ['-u', '-']); // -u for unbuffered, - to read from stdin

    let stdout = '';
    let stderr = '';
    let isFinished = false;

    const timeout = setTimeout(() => {
      if (!isFinished) {
        child.kill('SIGKILL');
        isFinished = true;
        resolve({
          stdout,
          stderr,
          error: `Execution timed out after ${timeoutMs}ms`
        });
      }
    }, timeoutMs);

    child.stdout.on('data', (data: Buffer) => {
      if (stdout.length < 1000000) { // 1MB limit
        stdout += data.toString();
      }
    });

    child.stderr.on('data', (data: Buffer) => {
      if (stderr.length < 1000000) {
        stderr += data.toString();
      }
    });

    child.on('close', (exitCode: number | null) => {
      if (!isFinished) {
        isFinished = true;
        clearTimeout(timeout);
        resolve({
          stdout,
          stderr,
          error: (exitCode !== 0 && exitCode !== null) ? `Exited with code ${exitCode}` : undefined
        });
      }
    });

    child.on('error', (err: Error) => {
      if (!isFinished) {
        isFinished = true;
        clearTimeout(timeout);
        resolve({
          stdout,
          stderr,
          error: err.message
        });
      }
    });

    try {
      child.stdin.write(code);
      child.stdin.end();
    } catch (err: any) {
      if (!isFinished) {
        isFinished = true;
        clearTimeout(timeout);
        resolve({
          stdout,
          stderr,
          error: `Failed to write to stdin: ${err.message}`
        });
      }
    }
  });
}
