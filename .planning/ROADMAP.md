# Project Roadmap: ML Cognitive Coach

## Global Mandates
- **Phase Completion**: STOP and SUMMARIZE after every phase completion. Do not proceed to the next phase without a summary and user confirmation.
- **3-Tier Separation**: Ensure State, Content, and Execution logic remain decoupled.

## Summary Checklist

- [x] **Phase 1: State Machine & Schema Engine** - Define the learning flow and mastery tracking in Prisma.
- [x] **Phase 2: Content Architecture & Persistence** - Model the CMS for ML topics and implement persistent progress.
- [x] **Phase 3: Brutalist UI & Dashboard** - Implement the high-contrast Neo-Brutalist UI and dashboard state.
- [x] **Phase 4: Execution Engine Integration** - Connect the validation layer for code and math evaluation.

## Phase Details

### Phase 1: State Machine & Schema Engine
**Goal**: The database becomes the source of truth for the learning state machine.
**Plans**: 2 plans
- [x] 01-01-PLAN.md — Implement the 3-tier hierarchy and mastery models in Prisma.
- [x] 01-02-PLAN.md — Validate schema integrity and implement core engine utility logic.

**Success Criteria**:
  1. Prisma schema supports `Phase`, `Module`, `Topic`, and `Stage` hierarchy.
  2. `TopicProgress` model tracks gated stage unlocking (Content -> Example -> Practice -> Quiz -> Apply).
  3. `QuizAttempt` and `UserMastery` models track performance and skill metrics.

### Phase 2: Content Architecture & Persistence
**Goal**: Sanity CMS is structured to deliver content tailored to the 5 stages of the learning engine, and progress is persisted in the database.
**Plans**: 4 plans
- [x] 02-01-PLAN.md (Sanity) — Implement core hierarchy (Phase/Module/Topic) and theoretical stages.
- [x] 02-02-PLAN.md (Sanity) — Implement advanced stages (Test/Apply) and fetch validation.
- [x] 02-01-PLAN.md (Progress) — Establish database foundation and core API for progress tracking.
- [x] 02-02-PLAN.md (Progress) — Integrate persistent progress tracking into the UI.

**Success Criteria**:
  1. Sanity schema supports `practice` (Coding/Math) and `quiz` (Scenario/Visual) types.
  2. Content blocks include Socratic prompts and sandbox configuration metadata.
  3. API layer successfully fetches multi-stage content blocks for a specific topic.
  4. User progress is persisted in the database and reflected across the UI.

### Phase 3: Brutalist UI & Dashboard
**Goal**: The application adopts the high-signal Neo-Brutalist design language.
**Plans**: 3 plans
- [x] 03-01-PLAN.md — Setup Tailwind tokens, global layout shell, and 5-stage backend alignment.
- [x] 03-02-PLAN.md — Implement Brutalist Dashboard, Module cards, and Skill Mastery Maps.
- [x] 03-03-PLAN.md — Implement Guided Topic Flow with gated navigation and stage-specific cells.

**Success Criteria**:
  1. Global styles reflect the thick borders, loud typography, and tactile feedback.
  2. The Dashboard displays the "Resume Learning" path and skill-mastery maps.
  3. Topic pages respect the Prisma-driven locks on stages (tabs).

### Phase 4: Execution Engine Integration
**Goal**: The platform can evaluate user-submitted code and math.
**Plans**: 3 plans
- [x] 04-01-PLAN.md — Establish backend foundation for Python and Math evaluation.
- [x] 04-02-PLAN.md — Implement API evaluation layer and learning engine integration.
- [x] 04-03-PLAN.md — Connect UI cells to evaluation endpoints and finalize gated flow.

**Success Criteria**:
  1. A backend service (or edge function) validates Python code output against expected results.
  2. Math inputs are evaluated for correctness.
  3. Evaluation results are recorded in Prisma and trigger stage unlocking.

## Progress Table

| Phase | Status |
|-------|--------|
| 1. State Machine & Schema Engine | Completed |
| 2. Content Architecture & Persistence | Completed |
| 3. Brutalist UI & Dashboard | Completed |
| 4. Execution Engine Integration | Completed |
