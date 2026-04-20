# Coding Conventions

**Analysis Date:** 2025-01-24

## Naming Patterns

**Files:**
- Component files: PascalCase (e.g., `AuthContext.tsx`).
- Route handlers: `route.ts`.
- Schema types: camelCase (e.g., `module.ts`).

**Functions:**
- React components: PascalCase.
- Event handlers: `handle[Event]` (e.g., `handleToggleComplete`).
- API methods: `GET`, `POST`, `PATCH`, `DELETE` (uppercase exported functions).

**Variables:**
- camelCase for local variables and props.
- UPPER_SNAKE_CASE for environment variables.

**Types:**
- PascalCase for interfaces and type aliases (e.g., `interface Module`).

## Code Style

**Formatting:**
- Likely Prettier (standard for Next.js projects), though no `.prettierrc` was found in root.
- Tailwind CSS 4 for styling.

**Linting:**
- ESLint 9.x with `eslint-config-next`.
- Rules defined in `eslint.config.mjs`.

## Import Organization

**Order:**
1. React / Next.js core (e.g., `'next/link'`, `'react'`)
2. External libraries (e.g., `'next-auth/react'`)
3. Internal modules with `@/` alias (e.g., `'@/data/sample-content'`)
4. Styles (if any)

**Path Aliases:**
- `@/*` maps to `src/*` (configured in `tsconfig.json`).

## Error Handling

**Patterns:**
- Try/catch for async operations in components.
- Returning `NextResponse` with appropriate status codes in API routes.

## Logging

**Framework:** `console`

**Patterns:**
- `console.error` for failed API requests or runtime errors.

## Comments

**When to Comment:**
- To explain temporary workarounds (e.g., "In a real app, you would fetch...").
- JSDoc is not consistently used.

## Function Design

**Size:** Generally small, single-responsibility functions.

**Parameters:** Props objects for React components; `req: Request` for API routes.

**Return Values:** JSX for components; `Promise<NextResponse>` for API handlers.

## Module Design

**Exports:**
- Named exports for types and data.
- Default exports for page components and Sanity schemas.

**Barrel Files:**
- `src/sanity/schemaTypes/index.ts` is used as a barrel file for Sanity schemas.
- `src/types/index.ts` is used as a barrel file for domain types.

---

*Convention analysis: 2025-01-24*
