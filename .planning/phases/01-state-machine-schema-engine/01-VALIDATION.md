# Phase 01 Validation: State Machine & Schema Engine

## Goal
Implement the Prisma schema and core logic for the gated learning engine, ensuring a robust foundation for sequential progression and mastery tracking.

## Requirements Coverage

| Req ID | Description | Verification Method | Status |
|--------|-------------|---------------------|--------|
| STATE-01 | Phase -> Module -> Topic hierarchy | `npx vitest tests/schema.test.ts` | [ ] |
| STATE-02 | TopicProgress with highestStage Enum | `npx vitest tests/schema.test.ts` | [ ] |
| STATE-03 | QuizAttempt & 80% Threshold Logic | `npx vitest tests/engine.test.ts` | [ ] |
| STATE-04 | UserMastery aggregate metrics | `npx vitest tests/schema.test.ts` | [ ] |

## Automated Verification Suite

### Schema & Relational Integrity
**Command:** `npx prisma validate && npx vitest tests/schema.test.ts --run`
**Expectations:**
- Prisma schema is valid.
- Creation of a Phase with nested Modules and Topics succeeds.
- TopicProgress unique constraints (userId + topicId) are enforced.
- Records for QuizAttempt and UserMastery can be created and linked to users/topics.

### State Machine Logic
**Command:** `npx vitest tests/engine.test.ts --run`
**Expectations:**
- `isStageUnlocked` returns `true` for stages <= highestUnlocked.
- `isStageUnlocked` returns `false` for stages > highestUnlocked.
- `getNextStage` returns `APPLY` ONLY if `quizScore >= 0.8` when coming from `TEST`.
- `getNextStage` returns `TEST` if `quizScore < 0.8` when coming from `TEST`.

## Manual Checkpoints
- **Database Inspection:** After migration, use a SQLite viewer (or `npx prisma studio`) to verify that the `StageType` enum is stored correctly as TEXT in the `TopicProgress` table and that all new models are present.

## Success Criteria
- [ ] Prisma schema successfully migrated to `dev.db`.
- [ ] All automated integration and unit tests pass (100% green).
- [ ] Phase summary generated and requirements marked complete in ROADMAP.
