# Project: ML Cognitive Coach

## Core Value
An intelligent, state-driven Machine Learning Cognitive Coach that enforces active learning through a gated, multi-stage flow: **Understand → Reinforce → Test → Apply → Reflect**. It prioritizes deep understanding and practical application over passive content consumption.

## Success Definition
Users navigate a structured ML curriculum where progression is strictly controlled by mastery gates (80% score threshold) and culminates in hands-on implementation projects in a sandboxed environment.

## Current Focus
Pivoting the architecture from a generic JLPT reader to a 3-tier ML learning engine: State (Prisma), Content (Sanity), and Execution (Backend).

## Technical Stack
- **State Machine**: Prisma (PostgreSQL/SQLite) - Enforces the learning hierarchy and progression logic.
- **Content Layer**: Sanity CMS - Stores rich technical content, Socratic prompts, and sandbox specs.
- **Execution Engine**: (Future) Backend compute service for code/math validation.
- **Frontend**: Next.js (App Router) - Delivers a high-contrast Neo-Brutalist UI.
- **Styling**: Tailwind CSS with custom Brutalist theme.
- **Typography**: Space Grotesk (Headers), Inter (Body), JetBrains Mono (Code).
