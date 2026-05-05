# Research: Execution Engine Integration (Phase 4)

## Objective
Enable evaluation of user-submitted code and math to drive the learning state machine.

## Key Areas of Investigation

### 1. Python Code Evaluation
- **Requirement**: Execute Python code and validate output against expected results.
- **Prototype Strategy**: Use `child_process.exec` or `spawn` to run `python` locally.
- **Constraints**: 
    - Security (prototype-only: no external sandbox needed yet, but must be considered).
    - Timeout handling.
    - Capturing stdout/stderr.

### 2. Math & Symbolic Evaluation
- **Requirement**: Compare mathematical expressions (e.g., "y = mx + b" vs "y = b + mx").
- **Strategy**: Use `mathjs` for symbolic simplification and comparison, or simple numeric verification for specific values.

### 3. State Machine Integration
- **Flow**: 
    1. User submits Practice (Math/Code).
    2. Backend evaluates.
    3. If correct, `unlockNextStage` is called (PRACTICE -> TEST).
    4. User completes Quiz (TEST).
    5. If score >= 80%, `submitQuiz` is called (TEST -> APPLY).
    6. User submits Apply (Project).
    7. Backend evaluates (likely more complex validation).
    8. If correct, stage is marked COMPLETED.

### 4. Component Updates
- `PracticeCell.tsx`: Needs to handle math/code submission and show results.
- `QuizCell.tsx`: Needs to call `submitQuiz` API.
- `ApplyCell.tsx`: New component for the final stage project.

## Proposed API Endpoints
- `POST /api/evaluate/practice`: Evaluates practice tasks.
- `POST /api/evaluate/quiz`: Records quiz results and updates progress.
- `POST /api/evaluate/apply`: Evaluates the final laboratory project.

## Dependencies to Add
- `mathjs`: For mathematical expression evaluation.
- `python-shell` or similar (optional): To simplify python execution.

## Risks
- **Local Environment**: Python must be installed and in the PATH of the server process.
- **Sandbox Security**: Running arbitrary code is dangerous; for the prototype, we assume a trusted environment but will add basic timeouts.
