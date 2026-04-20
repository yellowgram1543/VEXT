# Requirements: JLPT Learning Platform

## v1: Core Learning Experience

### CMS Integration (CMS)
- CMS-01: Connect to a real Sanity project (configure env vars and client).
- CMS-02: Migrate data fetches in `src/app/chapters/[slug]/page.tsx` from sample data to Sanity.
- CMS-03: Migrate data fetches in `src/app/modules/[id]/page.tsx` from sample data to Sanity.
- CMS-04: Ensure `sanity.config.ts` and schema types reflect the lesson structure needed.

### Progress Tracking (PROG)
- PROG-01: Extend `prisma/schema.prisma` to include a `Progress` model (ChapterId, ModuleId, status).
- PROG-02: Implement `POST /api/progress` to record lesson completion.
- PROG-03: Implement `GET /api/progress` to retrieve all completions.

### Bunpo-Style UI/UX (UI)
- UI-01: Implement a clean minimalist design following the Bunpo-style aesthetic.
- UI-02: Create interactive lesson cards for immersive and focused learning.
- UI-03: Implement progress visualization (progress bars, level stats) matching the Bunpo experience.
- UI-04: Implement a main navigation sidebar showing JLPT levels or chapters.
- UI-05: Ensure responsive design for all interactive elements (mobile-first).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMS-01 | Phase 1 | Pending |
| CMS-02 | Phase 1 | Pending |
| CMS-03 | Phase 1 | Pending |
| CMS-04 | Phase 1 | Pending |
| PROG-01 | Phase 2 | Pending |
| PROG-02 | Phase 2 | Pending |
| PROG-03 | Phase 2 | Pending |
| UI-01 | Phase 3 | Partially Complete |
| UI-02 | Phase 3 | Complete |
| UI-03 | Phase 3 | Pending |
| UI-04 | Phase 3 | Pending |
| UI-05 | Phase 3 | Complete |
