# Phase 2 Validation: Content Architecture (Sanity)

This document maps the Phase 2 requirements to automated verification tests.

## Requirement Mapping

| ID | Requirement | Verification Method | Automated Test |
|----|-------------|---------------------|----------------|
| CMS-01 | Sanity schema must support Phase -> Module -> Topic hierarchy and multi-stage content blocks. | Schema static analysis | `npx vitest tests/schema.test.ts` |
| CMS-02 | Implement `practice` content types for Coding (Python) and Math (Numeric/Formula) exercises. | Schema object detection | `npx vitest tests/schema.test.ts` |
| CMS-03 | Implement `quiz` content types for Scenario-based and Visual-analysis questions. | Schema object detection | `npx vitest tests/schema.test.ts` |

## Automated Test Suites

### 1. Schema Hierarchy & Objects (`tests/schema.test.ts`)
This suite imports the Sanity schema definitions and asserts their structure matches the ML-centric curriculum.
- **Goal:** Ensure Phase, Module, and Topic are correctly related.
- **Goal:** Ensure `understand`, `reinforce`, `test`, and `apply` objects exist with expected fields.
- **Goal:** Ensure `code` and `latex` plugins are integrated into the practice blocks.

### 2. Structural Data Flow (`tests/sanity-fetch.test.ts`)
This suite (implemented in Plan 02) verifies that the GROQ queries used by the client correctly retrieve the nested stage data.
- **Goal:** Ensure the client can fetch a topic and access its 4-stage content objects.
