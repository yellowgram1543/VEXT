import { describe, it, expect } from 'vitest';
import { compareMath } from '../src/lib/evaluators/math';
import { runPython } from '../src/lib/evaluators/python';

describe('Math Evaluator', () => {
  it('should identify symbolic equality', () => {
    expect(compareMath('y = m*x + b', 'y = b + m*x')).toBe(true);
    expect(compareMath('x^2 + 2x + 1', '(x + 1)^2')).toBe(true);
    expect(compareMath('sin(x)^2 + cos(x)^2', '1')).toBe(true);
  });

  it('should identify non-equality', () => {
    expect(compareMath('x + 1', 'x + 2')).toBe(false);
    expect(compareMath('x^2', 'x^3')).toBe(false);
  });
});

describe('Python Evaluator', () => {
  it('should execute simple code and capture stdout', async () => {
    const result = await runPython('print(1 + 1)');
    expect(result.stdout.trim()).toBe('2');
    expect(result.error).toBeUndefined();
  });

  it('should capture stderr on error', async () => {
    const result = await runPython('print(x)');
    expect(result.stderr).toContain('NameError');
    expect(result.error).toBeDefined();
  });

  it('should timeout on infinite loops', async () => {
    const result = await runPython('while True: pass', 1000);
    expect(result.error).toContain('timed out');
  });

  it('should block forbidden imports', async () => {
    const result = await runPython('import os\nprint(os.name)');
    expect(result.error).toContain('forbidden');
  });
});
