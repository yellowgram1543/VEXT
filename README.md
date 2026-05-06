# ML Cognitive Coach

An intelligent, state-driven Machine Learning Cognitive Coach that enforces active learning through a gated, multi-stage flow.

## 🚀 Core Value
This platform prioritizes deep understanding and practical application over passive content consumption. Progression is strictly controlled by a gated stage system, ensuring mastery before moving forward.

## 🧠 Learning Flow
Every topic follows a 5-stage mastery path:
1. **Understand (Content)**: High-signal theoretical foundation.
2. **Reinforce (Example)**: Socratic prompts and detailed examples.
3. **Practice (Exercise)**: Interactive coding (Python) or math validation.
4. **Test (Quiz)**: Scenario-based and visual-analysis assessment (80% gate).
5. **Apply (Project)**: Hands-on implementation in a laboratory environment.

## 🛠️ Technical Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **State Machine**: Prisma (SQLite) - Manages progression and mastery logic.
- **Content Layer**: Sanity CMS - Delivers multi-stage learning blocks.
- **Execution Engine**: Node.js `child_process` for Python and `mathjs` for symbolic evaluation.
- **UI/UX**: Neo-Brutalist Design (Tailwind CSS, Space Grotesk, Inter).

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
npx prisma db push
```

### 3. Sanity Connection
Ensure your `.env` contains:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_token
```

### 4. Run Development Server
```bash
npm run dev
```

## 🧪 Testing
Run the test suites for the learning engine and evaluators:
```bash
npx vitest
```

---
*Built with technical playfulness and high-contrast signal.*
