# Requirements: ML Cognitive Coach

## v1: Gated Learning Engine

### State & Progression (STATE)
- STATE-01: Prisma schema must support the Phase → Module → Topic → Stage hierarchy.
- STATE-02: Implement `TopicProgress` to track individual stage unlocking (Content, Example, Practice, Quiz, Apply).
- STATE-03: Implement `QuizAttempt` to record performance and enforce the 80% mastery gate.
- STATE-04: Implement `UserMastery` to track aggregate skill metrics (Math, Coding, Concept).

### Content Layer (CMS)
- CMS-01: Sanity schema must support multi-stage content blocks (Theory, Socratic prompts, Sandbox specs).
- CMS-02: Implement `practice` content types for Coding (Python) and Math (Numeric/Formula) exercises.
- CMS-03: Implement `quiz` content types for Scenario-based and Visual-analysis questions.

### Brutalist UI/UX (UI)
- UI-01: Implement the "Neo-Brutalist" design language (thick borders, Space Grotesk headers, tactile feedback).
- UI-02: Create the "Guided Topic Flow" interface that respects Prisma-driven stage locks.
- UI-03: Implement the User Dashboard with "Continue Learning" guidance and mastery maps.

### Execution & Validation (EXEC)
- EXEC-01: (Phase 4) Establish a validation layer for Python code and Math submissions.
- EXEC-02: Connect evaluation results to the Prisma State Machine to trigger stage unlocking.
- EXEC-03: Record evaluation history and results for all submissions (Practice, Quiz, Apply).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| STATE-01 | Phase 1 | Completed |
| STATE-02 | Phase 1 | Completed |
| STATE-03 | Phase 1 | Completed |
| STATE-04 | Phase 1 | Completed |
| CMS-01 | Phase 2 | Completed |
| CMS-02 | Phase 2 | Completed |
| CMS-03 | Phase 2 | Completed |
| UI-01 | Phase 3 | Completed |
| UI-02 | Phase 3 | Completed |
| UI-03 | Phase 3 | Completed |
| EXEC-01 | Phase 4 | Pending |
| EXEC-02 | Phase 4 | Pending |
| EXEC-03 | Phase 4 | Pending |
