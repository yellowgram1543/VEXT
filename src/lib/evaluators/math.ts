import { simplify, evaluate } from 'mathjs';

/**
 * Compares two mathematical expressions for symbolic equality.
 * Uses mathjs to parse and simplify both expressions before comparing.
 */
export function compareMath(input: string, expected: string): boolean {
  if (!input || !expected) return false;

  const toExpression = (expr: string) => {
    const clean = expr.trim();
    if (clean.includes('=')) {
      const [left, right] = clean.split('=');
      return `(${left}) - (${right})`;
    }
    return `(${clean})`;
  };

  try {
    const expr1 = toExpression(input);
    const expr2 = toExpression(expected);

    // 1. Difference check: (expr1) - (expr2) should simplify to 0
    const diff = simplify(`(${expr1}) - (${expr2})`).toString();
    if (diff === "0") return true;

    // 2. Fallback: compare strings of simplified versions
    const s1 = simplify(expr1).toString();
    const s2 = simplify(expr2).toString();
    if (s1 === s2) return true;

    // 3. Robust Fallback: Numeric Sampling
    // Evaluate (expr1) - (expr2) at multiple random points
    // Collect all variables
    const combined = `(${expr1}) - (${expr2})`;
    
    // Simple way to get variables: anything that looks like a word but isn't a function
    // For this prototype, we'll just try evaluating with some common variables if they exist
    const testVars = ['x', 'y', 'z', 'a', 'b', 'c', 'm', 'n'];
    const scope1: any = {};
    const scope2: any = {};
    
    // Sample at two different points to reduce collision probability
    for (const baseVal of [1.5, 3.7]) {
      testVars.forEach((v, index) => {
        // Use unique values for each variable based on the base value and index
        scope1[v] = baseVal + index * 0.1;
        scope2[v] = baseVal + 0.5 + index * 0.1;
      });

      try {
        const val1 = evaluate(combined, scope1);
        const val2 = evaluate(combined, scope2);
        
        // Use a small epsilon for float comparison
        if (Math.abs(val1) > 1e-10 || Math.abs(val2) > 1e-10) return false;
      } catch {
        // If evaluation fails (e.g. unknown variables), we skip numeric check
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
