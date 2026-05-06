# Deferred Items - Phase 01 Plan 02

## Linting Issues (Out of Scope)

The following linting issues were discovered but are out of scope for this plan as they were not caused by the current changes:

- `src/app/chapters/[slug]/page.tsx`: 
  - Unexpected any (`@typescript-eslint/no-explicit-any`)
  - Unescaped entities (`react/no-unescaped-entities`)
- `src/sanity/schemaTypes/chapter.ts`:
  - Unexpected any (`@typescript-eslint/no-explicit-any`)
  - Anonymous default export warning (`import/no-anonymous-default-export`)
- `src/sanity/schemaTypes/module.ts`:
  - Unexpected any (`@typescript-eslint/no-explicit-any`)
  - Anonymous default export warning (`import/no-anonymous-default-export`)
