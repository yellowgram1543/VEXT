# Phase 2: Content Architecture (Sanity) - Research

**Researched:** 2024-05-20
**Domain:** Sanity CMS Content Modeling for ML Curriculum
**Confidence:** HIGH

## Summary
The project is pivoting from a passive JLPT learning app to an active **ML Cognitive Coach**. Phase 1 established the state machine in Prisma. Phase 2 requires designing the "Knowledge Layer" in Sanity to provide structured content for the 3-tier hierarchy (**Phase -> Module -> Topic**) and the 4-stage topic flow (**Understand, Reinforce, Test, Apply**).

**Primary recommendation:** Use a modular schema design with custom PortableText blocks for Socratic prompts, coding exercises, and math formulas. Synchronize Sanity and Prisma using `slug.current` as the unique join key to allow seamless merging of volatile user state (locks/progress) and non-volatile learning content.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Content Storage | Sanity (CMS) | — | Sanity owns all non-volatile learning material and assets. |
| User Progress | Prisma (DB) | — | Prisma tracks mastery, locks, and gated unlocking state. |
| Content Fetching | Next.js (SSR) | — | Server components fetch from Sanity using slugs from the URL. |
| State-Content Join | Next.js (Client) | — | The UI joins Prisma state (e.g., highestUnlockedStage) with Sanity content blocks. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sanity` | 3.x | CMS core | Industry standard for structured content. |
| `next-sanity` | 12.x | Next.js integration | Optimized for App Router and fetch caching. |
| `@sanity/code-input` | 7.x | Coding blocks | Robust syntax highlighting and CodeMirror integration. |
| `sanity-plugin-latex-input` | 2.x | Math formulas | Standard way to manage LaTeX for mathematical notations. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `@portabletext/react` | 3.x | Content rendering | Rendering rich text and custom blocks in Topic pages. |
| `lucide-react` | 0.x | UI Icons | Visual indicators for stage status (Locked/Complete). |

**Verified Versions:**
- `@sanity/code-input`: 7.1.0 [VERIFIED: npm registry]
- `sanity-plugin-latex-input`: 2.0.7 [VERIFIED: npm registry]
- `next-sanity`: 12.4.0 [VERIFIED: npm registry]

## Architecture Patterns

### Recommended Project Structure
```
src/sanity/
├── schemaTypes/
│   ├── phase.ts           # Top-level curriculum grouping
│   ├── module.ts          # Grouping within a phase (e.g., "Linear Algebra")
│   ├── topic.ts           # The learning unit containing the 4-stage flow
│   ├── objects/           # Stage-specific reusable blocks
│   │   ├── understand.ts  # Theoretical content + Socratic prompts
│   │   ├── reinforce.ts   # Coding/Math practice blocks
│   │   ├── test.ts        # Quiz questions (Scenario/Visual)
│   │   ├── apply.ts       # Mini-project specs + Sandbox config
│   │   └── common/        # Shared components (choices, hints, etc.)
│   └── index.ts           # Schema registration
```

### Pattern 1: Multi-Stage Topic Document
Instead of splitting stages into separate documents, we will embed them as objects within the `topic` document. This allows a single GROQ query to retrieve the entire learning journey for a topic while maintaining high structure.

**Join Strategy:**
The `topic` document in Sanity MUST have a `slug` field. This slug matches the `Topic.slug` in Prisma.
- **Sanity Query:** `*[_type == "topic" && slug.current == $slug][0]`
- **Prisma Query:** `prisma.topic.findUnique({ where: { slug: $slug } })`

### Anti-Patterns to Avoid
- **Hard-coding Stage Order:** Do not hard-code "Understand -> Reinforce" in Sanity. The order is managed by the Prisma `StageType` enum and `learning-engine.ts`. Sanity simply provides the content for each key.
- **Large Binary Blobs:** Do not store dataset files in Sanity. Use Sanity Assets for small images/PDFs, but link to external cloud storage for ML datasets.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code Editor | Custom textarea | `@sanity/code-input` | Provides proper indentation, highlighting, and validation. |
| Math Rendering | SVG/Images | LaTeX + KaTeX | LaTeX is the lingua franca of ML research; KaTeX is fast and accessible. |
| Rich Text | Markdown | PortableText | Allows embedding interactive Socratic prompts directly within text flow. |

## Common Pitfalls

### Pitfall 1: Slug Mutability
**What goes wrong:** If an editor changes a slug in Sanity, the link to the user's progress in Prisma is severed.
**How to avoid:** Implement a validation rule in Sanity that warns or prevents slug changes after the topic has been "published" to production.

### Pitfall 2: PortableText Complexity
**What goes wrong:** Overloading PortableText with too many custom types makes the frontend serializer complex.
**How to avoid:** Keep custom types focused on the 4 stages. Shared components (like "Alerts" or "Tips") should be standard blocks.

## Code Examples

### Sanity Topic Schema (Simplified)
```typescript
// src/sanity/schemaTypes/topic.ts
export default {
  name: 'topic',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'module', type: 'reference', to: [{ type: 'module' }] },
    { 
      name: 'understand', 
      title: '1. Understand (Theory)',
      type: 'object',
      fields: [
        { name: 'content', type: 'array', of: [{ type: 'block' }, { type: 'socraticPrompt' }] }
      ]
    },
    {
      name: 'reinforce',
      title: '2. Reinforce (Practice)',
      type: 'object',
      fields: [
        { name: 'practices', type: 'array', of: [{ type: 'codingBlock' }, { type: 'mathBlock' }] }
      ]
    }
  ]
}
```

### Socratic Prompt Object
```typescript
// src/sanity/schemaTypes/objects/socraticPrompt.ts
export default {
  name: 'socraticPrompt',
  type: 'object',
  fields: [
    { name: 'question', type: 'string', title: 'The Question' },
    { name: 'hint', type: 'text', title: 'Gentle Nudge' },
    { name: 'explanation', type: 'text', title: 'The "Aha!" Moment' }
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JLPT Chapters | ML Topics | Phase 2 | Shift from passive reading to active stage-based learning. |
| Single Content Block | Multi-Stage Objects | Phase 2 | Enables gated progress and specialized UI for coding/math. |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `slug.current` is sufficient for joining | Architecture | Difficulty in renaming topics without data migration scripts. |
| A2 | `@sanity/code-input` supports Python 3 | Standard Stack | Need custom implementation for ML code blocks. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All | ✓ | 20+ | — |
| npm | Plugins | ✓ | 10+ | — |
| Sanity Studio | Content management | ✓ | v3 | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| REQ-01 | Phase/Module/Topic hierarchy matches Prisma | Unit | `npx vitest tests/schema.test.ts` |
| REQ-02 | Topic document contains all 4 stages | Integration | `npx vitest tests/sanity-fetch.test.ts` |

## Security Domain

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Insecure Sandbox Config | Elevation of Privilege | Sanity validation to restrict environment variables; frontend santization. |

## Sources

### Primary (HIGH confidence)
- Sanity Documentation - Schema Design
- Prisma Schema (`prisma/schema.prisma`)
- `next-sanity` README

### Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via npm.
- Architecture: HIGH - Follows established Sanity/Next.js patterns.
- Pitfalls: MEDIUM - Based on common CMS integration challenges.

**Research date:** 2024-05-20
**Valid until:** 2024-06-20
