import { simplify } from 'mathjs';

/**
 * Compares two mathematical expressions for symbolic equality.
 * Uses mathjs to parse and simplify both expressions before comparing.
 */
export function compareMath(input: string, expected: string): boolean {
  if (!input || !expected) return false;

  try {
    const inputClean = input.trim();
    const expectedClean = expected.trim();

    // 1. Exact string match after trimming
    if (inputClean === expectedClean) return true;

    // 2. Symbolic comparison using simplify
    // We simplify both and compare strings
    const simplifiedInput = simplify(inputClean).toString();
    const simplifiedExpected = simplify(expectedClean).toString();

    if (simplifiedInput === simplifiedExpected) return true;

    // 3. Difference check (input - expected should simplify to 0)
    // Wrap in parens to ensure correct precedence
    const diff = simplify(`(${inputClean}) - (${expectedClean})`).toString();
    
    return diff === "0";
  } catch (error) {
    // If mathjs fails to parse, they aren't symbolically equal (or one is invalid)
    return false;
  }
}
