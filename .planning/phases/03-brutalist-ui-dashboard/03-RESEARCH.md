# Research: Phase 3 - Brutalist UI & Dashboard

## Design System Analysis (from stitch_ml_dashboard/technical_playfulness/DESIGN.md)

### Design Tokens
- **Colors**: 
  - Primary: `#42617d` (Surface Tint)
  - Secondary: `#6b5779`
  - Accent/Purple: `#7B287D`
  - Border/Dark: `#330C2F`
  - Background: `#faf9fb`
- **Typography**:
  - Headings: **Space Grotesk** (Bold, 32px-48px)
  - Body: **Inter** (16px-18px)
  - Code/Meta: **JetBrains Mono** (14px)
- **Borders & Shapes**:
  - Thickness: 3px solid `#330C2F`
  - Radius: 10px (Standard), 4px (Nested)
  - Shadows: 4px hard shadows (offset x:4, y:4)
- **Interactions**:
  - Active: Translate 4px down/right, remove shadow.

### Core Components
- **TopAppBar**: Fixed, 80px high, 3px bottom border.
- **Sidebar**: Fixed, 64px (256px) wide, 3px right border.
- **Cards/Cells**: White/Light-gray background, 3px border, hard shadow.
- **Navigation Row (Stepper)**: 5 stages (Content, Example, Practice, Quiz, Apply).

## Component Mapping

| UI Element | Source Asset | Notes |
|------------|--------------|-------|
| Global Layout | `top_navigation_bar`, `left_sidebar_navigation` | Use for `layout.tsx` |
| Module Cards | `practice_block_card_1` (style) | Apply hard shadows and 3px borders to home page cards |
| Topic View | `linear_regression_dashboard` | The main layout for learning stages |
| Content Stage | `understand.ts` (Sanity) + `DESIGN.md` | Notebook-style rich text cells |
| Practice Stage | `practice_block_card_1` | Code editor with "Run Cell" behavior |
| Quiz Stage | `quiz_block_card_1` | Scenario/Visual questions with submit flow |

## Implementation Strategy

1.  **Tailwind Configuration**: Port colors, fonts, and shadows into `tailwind.config.ts`.
2.  **Base Layout**: Create a persistent Shell with Nav and Sidebar.
3.  **State Integration**: 
    - Fetch progress from Prisma to drive the "Stage Stepper" (unlocked/locked states).
    - Render Sanity content blocks within the "Brutalist Cell" containers.
4.  **Interactivity**: Implement the "Active Shift" effect on all buttons and cards.
