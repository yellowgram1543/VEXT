# Requirements: JLPT Learning Platform

## v1: Core Learning Experience

### CMS Integration (CMS)
- CMS-01: Connect to a real Sanity project (configure env vars and client).
- CMS-02: Migrate data fetches in `src/app/chapters/[slug]/page.tsx` from sample data to Sanity.
- CMS-03: Migrate data fetches in `src/app/modules/[id]/page.tsx` from sample data to Sanity.
- CMS-04: Ensure `sanity.config.ts` and schema types reflect the lesson structure needed.

### Progress Tracking (PROG)
- PROG-01: Extend `prisma/schema.prisma` to include a `UserProgress` model (UserId, ChapterId, ModuleId, status).
- PROG-02: Implement `POST /api/progress` to record lesson completion.
- PROG-03: Implement `GET /api/progress` to retrieve all completions for the current user.

### Authentication & Protection (AUTH)
- AUTH-01: Configure at least one authentication provider in `src/app/api/auth/[...nextauth]/route.ts`.
- AUTH-02: Secure `/chapters` and `/modules` routes so they redirect to login if unauthenticated.
- AUTH-03: Surface the active user's session in the UI (profile icon, name).

### Bunpo-Style UI/UX (UI)
- UI-01: Implement a clean minimalist design following the Bunpo-style aesthetic.
- UI-02: Create interactive lesson cards for immersive and focused learning.
- UI-03: Implement progress visualization (progress bars, level stats) matching the Bunpo experience.
- UI-04: Implement a main navigation sidebar showing JLPT levels or chapters.
- UI-05: Ensure responsive design for all interactive elements (mobile-first).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMS-01 | Phase 2 | Pending |
| CMS-02 | Phase 2 | Pending |
| CMS-03 | Phase 2 | Pending |
| CMS-04 | Phase 2 | Pending |
| PROG-01 | Phase 3 | Pending |
| PROG-02 | Phase 3 | Pending |
| PROG-03 | Phase 3 | Pending |
| AUTH-01 | Phase 1 | In Progress |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| UI-01 | Phase 4 | Pending |
| UI-02 | Phase 4 | Pending |
| UI-03 | Phase 4 | Pending |
| UI-04 | Phase 4 | Pending |
| UI-05 | Phase 4 | Pending |
