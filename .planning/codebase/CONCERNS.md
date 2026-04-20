# Codebase Concerns

**Analysis Date:** 2025-01-24

## Tech Debt

**Skeleton Code:**
- Issue: Several pages use hardcoded sample data instead of fetching from Sanity CMS.
- Files: `src/app/chapters/[slug]/page.tsx`, `src/app/modules/[id]/page.tsx`
- Impact: Content in the CMS is not reflected in the application.
- Fix approach: Implement Sanity GROQ queries and replace sample data imports with CMS fetching.

**Types Quality:**
- Issue: `content` field in `Chapter` interface is typed as `any[]`.
- Files: `src/types/index.ts`
- Impact: Loss of type safety when rendering Portable Text.
- Fix approach: Define proper Portable Text types or use Sanity-generated types.

## Known Bugs

**Progress Tracking Integrity:**
- Issue: No check if `moduleId` or `chapterId` actually exist in Sanity before saving progress in PostgreSQL.
- Files: `src/app/api/progress/route.ts`
- Symptoms: Database could contain progress records for non-existent content.
- Trigger: Malicious or buggy POST request to `/api/progress`.
- Workaround: Add validation against Sanity client in the API route.

## Security Considerations

**Auth Verification:**
- Risk: `getServerSession` is used, but ensure `authOptions` are robustly shared across API and SSR.
- Files: `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/progress/route.ts`
- Current mitigation: Basic session check is present.
- Recommendations: Implement middleware-based protection for all `/api/` and `/modules/` routes.

## Performance Bottlenecks

**Client-Side Navigation:**
- Problem: `ChapterPage` is a Client Component (`'use client'`).
- Files: `src/app/chapters/[slug]/page.tsx`
- Cause: Using `useSession` and local `useState` for completion toggle.
- Improvement path: Convert to a Server Component for initial render and use Server Actions for progress updates to improve SEO and initial load.

## Fragile Areas

**CMS/DB Synchronization:**
- Files: `prisma/schema.prisma`, `src/sanity/schemaTypes/*.ts`
- Why fragile: The relationship between Sanity IDs and Prisma IDs is "soft" (stored as strings).
- Safe modification: Ensure Sanity IDs are never changed once referenced in the database.

## Scaling Limits

**Relational Progress Tracking:**
- Current capacity: Individual row per user-chapter.
- Limit: As user base and content grow, the `Progress` table will grow linearly (Users * Chapters).
- Scaling path: Consider indexing or periodic archival/summarization if performance degrades.

## Dependencies at Risk

**Next.js 16.2.4:**
- Risk: This version number in `package.json` appears non-standard or ahead of stable (Next.js 15 is current stable).
- Impact: Potential compatibility issues with third-party libraries.
- Migration plan: Verify the version and downgrade to stable Next.js 15 if necessary.

## Missing Critical Features

**Sanity Integration (Client Side):**
- Problem: `src/lib/sanity.ts` likely exists but isn't being used in the main pages.
- Blocks: Dynamic content updates from CMS.

## Test Coverage Gaps

**Entire Application:**
- What's not tested: API routes, authentication, UI components, data fetching.
- Files: All files.
- Risk: High risk of regressions during refactoring (e.g., when moving from sample data to CMS).
- Priority: High.

---

*Concerns audit: 2025-01-24*
