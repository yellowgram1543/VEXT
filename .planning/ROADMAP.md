# Project Roadmap: JLPT Learning Platform

## Global Mandates
- **Phase Completion**: STOP and SUMMARIZE after every phase completion. Do not proceed to the next phase without a summary and user confirmation.

## Summary checklist

- [ ] **Phase 1: Foundation & Auth** - Set up secure access and user sessions.
- [ ] **Phase 2: Live Content Integration** - Transition from sample data to dynamic Sanity CMS fetches.
- [ ] **Phase 3: Progress & Persistence** - Implement database-driven user progress tracking.
- [ ] **Phase 4: Bunpo-Style UI/UX & Interactivity** - Implement a clean, minimalist experience with interactive lesson cards and visualizations.

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Users can securely access the platform and their session is managed throughout the app.
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. User can sign in using at least one authentication provider.
  2. Unauthenticated users are automatically redirected to the login page when accessing protected learning routes.
  3. The active user's name and profile information are visible in the app header.
**Plans**:
- [x] 01-01-PLAN.md — Fix stability issues (Prisma, Next.js 15 params) and generate client.
- [ ] 01-02-PLAN.md — Configure NextAuth with Prisma and implement route protection middleware.
- [ ] 01-03-PLAN.md — Create Navbar with profile support and verify end-to-end flow.
**UI hint**: yes

### Phase 2: Live Content Integration
**Goal**: All learning content is dynamically fetched from Sanity CMS, removing reliance on sample files.
**Depends on**: Phase 1
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04
**Success Criteria** (what must be TRUE):
  1. The application successfully connects to a live Sanity project without configuration errors.
  2. Chapter and module pages render data fetched directly from Sanity.
  3. The `src/data/sample-content.ts` file is deprecated and can be safely removed.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Progress & Persistence
**Goal**: User accomplishments are recorded and retrieved from the database to ensure continuity.
**Depends on**: Phase 1, Phase 2
**Requirements**: PROG-01, PROG-02, PROG-03
**Success Criteria** (what must be TRUE):
  1. Prisma schema supports `UserProgress` records linked to the authenticated user.
  2. Completing a lesson triggers a successful API call to save progress in the database.
  3. Returning users see their previously completed lessons correctly marked in the interface.
**Plans**: TBD

### Phase 4: Bunpo-Style UI/UX & Interactivity
**Goal**: The platform provides a clean, minimalist learning experience matching the Bunpo app aesthetic.
**Depends on**: Phase 2, Phase 3
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05
**Success Criteria** (what must be TRUE):
  1. Interface uses a clean, minimalist design (whitespace, typography, and color palette) matching the Bunpo style.
  2. Lessons are presented through interactive cards that the user can progress through.
  3. Circular or linear progress bars provide clear visualization of completion percentage for chapters/levels.
  4. Sidebar navigation allows seamless transitions between levels and chapters.
  5. The entire interactive experience is fully responsive and optimized for mobile-first usage.
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 1/3 | In Progress | 2026-04-20 |
| 2. Live Content Integration | 0/1 | Not started | - |
| 3. Progress & Persistence | 0/1 | Not started | - |
| 4. Bunpo-Style UI/UX & Interactivity | 0/1 | Not started | - |
