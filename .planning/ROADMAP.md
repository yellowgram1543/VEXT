# Project Roadmap: JLPT Learning Platform

## Global Mandates
- **Phase Completion**: STOP and SUMMARIZE after every phase completion. Do not proceed to the next phase without a summary and user confirmation.

## Summary checklist

- [ ] **Phase 1: Live Content Integration** - Transition from sample data to dynamic Sanity CMS fetches.
- [ ] **Phase 2: Progress & Persistence** - Implement database-driven progress tracking.
- [ ] **Phase 3: Bunpo-Style UI/UX & Interactivity** - Implement a clean, minimalist experience with interactive lesson cards and visualizations.

## Phase Details

### Phase 1: Live Content Integration
**Goal**: All learning content is dynamically fetched from Sanity CMS, removing reliance on sample files.
**Depends on**: Nothing
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04
**Success Criteria** (what must be TRUE):
  1. The application successfully connects to a live Sanity project without configuration errors.
  2. Chapter and module pages render data fetched directly from Sanity.
  3. The `src/data/sample-content.ts` file is deprecated and can be safely removed.
**Plans**: 3 plans
- [ ] 01-01-PLAN.md — Sanity Data Layer & Access
- [ ] 01-02-PLAN.md — Live Modules (Home & Detail)
- [ ] 01-03-PLAN.md — Live Chapters & Cleanup
**UI hint**: yes

### Phase 2: Progress & Persistence
**Goal**: User accomplishments are recorded and retrieved from the database to ensure continuity.
**Depends on**: Phase 1
**Requirements**: PROG-01, PROG-02, PROG-03
**Success Criteria** (what must be TRUE):
  1. Prisma schema supports `Progress` records without authentication.
  2. Completing a lesson triggers a successful API call to save progress in the database.
  3. Returning users see their previously completed lessons correctly marked in the interface (e.g., via session or global state).
**Plans**: 2 plans
- [ ] 02-01-PLAN.md — Database & API Core
- [ ] 02-02-PLAN.md — Progress UI Integration
**UI hint**: yes

### Phase 3: Bunpo-Style UI/UX & Interactivity
**Goal**: The platform provides a clean, minimalist learning experience matching the Bunpo app aesthetic.
**Depends on**: Phase 1, Phase 2
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05
**Success Criteria** (what must be TRUE):
  1. Interface uses a clean, minimalist design (whitespace, typography, and color palette) matching the Bunpo style.
  2. Lessons are presented through interactive cards that the user can progress through.
  3. Circular or linear progress bars provide clear visualization of completion percentage for chapters/levels.
  4. Sidebar navigation allows seamless transitions between levels and chapters.
  5. The entire interactive experience is fully responsive and optimized for mobile-first usage.
**Plans**: 3 plans
- [ ] 03-01-PLAN.md — Global Aesthetics & UI Foundation
- [ ] 03-02-PLAN.md — Grammar Cards & Interactive Content
- [ ] 03-03-PLAN.md — Progress & Polish
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Live Content Integration | 0/3 | In Progress | - |
| 2. Progress & Persistence | 0/2 | Not started | - |
| 3. Bunpo-Style UI/UX & Interactivity | 0/3 | Not started | - |
