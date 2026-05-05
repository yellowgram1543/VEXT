# Phase 4 Validation: Execution Engine Integration

## Success Criteria
The phase is successful when a user can progress through the entire gated flow for a topic by providing valid code and math submissions, and those submissions are correctly evaluated and persisted.

## Verification Scenarios

### 1. Math Evaluation (EXEC-01)
- **Input**: User submits "y = mx + b" for a prompt expecting "y = b + m*x".
- **Expected**: `compareMath` identifies equivalence and returns `success: true`.
- **Input**: User submits "y = x + 1" for a prompt expecting "y = x + 2".
- **Expected**: `compareMath` identifies non-equivalence and returns `success: false`.

### 2. Python Evaluation (EXEC-01)
- **Input**: User submits `print(1 + 1)`.
- **Expected**: `runPython` captures "2\n" and returns `success: true`.
- **Input**: User submits `while True: pass`.
- **Expected**: `runPython` terminates after the timeout and returns an error.

### 3. State Machine Integration (EXEC-02, EXEC-03)
- **Action**: User passes a Practice task.
- **Verification**: 
  - `TopicProgress` highest stage moves to `TEST`.
  - A record of the submission is stored (if using a Submission history model).
- **Action**: User fails a Quiz (score < 80%).
- **Verification**: 
  - `QuizAttempt` is recorded.
  - `TopicProgress` highest stage remains `TEST`.
- **Action**: User passes a Quiz (score >= 80%).
- **Verification**: 
  - `QuizAttempt` is recorded with `passed: true`.
  - `TopicProgress` highest stage moves to `APPLY`.

### 4. End-to-End Flow (UI-02, EXEC-01, EXEC-02)
- **Flow**:
  1. Navigate to a Topic.
  2. Complete `PRACTICE` (Math/Code) -> Stage `TEST` unlocks.
  3. Complete `TEST` (Quiz) -> Stage `APPLY` unlocks.
  4. Complete `APPLY` (Project) -> Topic marked as COMPLETED.
- **Verification**: All UI transitions occur correctly without page reloads (using `router.refresh()`).

## Automated Tests
- `tests/evaluators.test.ts`: Unit tests for Math and Python evaluators.
- `tests/engine-integration.test.ts`: Integration tests for `learning-engine.ts` with evaluation logic.

## Manual UAT
- [ ] Verify toasts/feedback in `PracticeCell`.
- [ ] Verify score display and unlocking in `QuizCell`.
- [ ] Verify final completion state in `ApplyCell`.
