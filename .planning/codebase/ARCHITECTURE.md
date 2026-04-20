# Architecture

**Analysis Date:** 2025-01-24

## Pattern Overview

**Overall:** Headless CMS with relational user data (Hybrid Architecture)

**Key Characteristics:**
- Separation of Concerns: Sanity handles static learning content; Prisma handles dynamic user data.
- Server-Side Rendering (Next.js): App Router usage with hybrid Client/Server components.
- API-based Progress Tracking: Decoupled client-side interactions for progress updates.

## Layers

**UI / Presentation:**
- Purpose: Render learning modules and lesson content.
- Location: `src/app/`
- Contains: React components, Tailwind styles.
- Depends on: `src/data/` (temporary), `src/lib/sanity.ts` (future).
- Used by: End users.

**API Layer:**
- Purpose: Handle authentication and progress persistence.
- Location: `src/app/api/`
- Contains: Next.js Route Handlers.
- Depends on: Prisma, NextAuth.
- Used by: Frontend components.

**Data Layer (Relational):**
- Purpose: Store users, accounts, and progress.
- Location: `prisma/`
- Contains: `schema.prisma`
- Depends on: PostgreSQL.
- Used by: `src/lib/prisma.ts`

**Data Layer (CMS):**
- Purpose: Content definitions and storage.
- Location: `src/sanity/`
- Contains: Sanity schema types.
- Depends on: Sanity Cloud.
- Used by: Sanity Studio (`src/app/studio/`) and frontend.

## Data Flow

**Progress Tracking Flow:**

1. User clicks "Mark Completed" in `src/app/chapters/[slug]/page.tsx`.
2. Frontend sends POST request to `/api/progress`.
3. `src/app/api/progress/route.ts` verifies session via NextAuth.
4. API upserts progress record in PostgreSQL via Prisma.
5. Response returned to frontend to update UI state.

**State Management:**
- React `useState` for local UI state (e.g., completion toggle).
- NextAuth `useSession` for authentication state.
- Server-side data fetching (intended) for lesson content.

## Key Abstractions

**Sanity Schemas:**
- Purpose: Define the shape of learning content.
- Examples: `src/sanity/schemaTypes/module.ts`, `src/sanity/schemaTypes/chapter.ts`
- Pattern: Schema-driven development.

**Prisma Client:**
- Purpose: Singleton instance for database access.
- Examples: `src/lib/prisma.ts`
- Pattern: Singleton.

## Entry Points

**App Entry:**
- Location: `src/app/page.tsx`
- Triggers: URL visit to `/`.
- Responsibilities: Render homepage.

**Progress API:**
- Location: `src/app/api/progress/route.ts`
- Triggers: POST request from chapter pages.
- Responsibilities: Authorize user and update DB.

## Error Handling

**Strategy:** Localized error handling in components and API routes.

**Patterns:**
- Try/catch blocks in async functions (e.g., `handleToggleComplete` in `src/app/chapters/[slug]/page.tsx`).
- HTTP status codes for API responses (401 Unauthorized, 404 Not Found, etc.).

## Cross-Cutting Concerns

**Logging:** Basic console logging.
**Validation:** Sanity schema-level validation; Prisma type safety.
**Authentication:** NextAuth.js middleware/session checks.

---

*Architecture analysis: 2025-01-24*
