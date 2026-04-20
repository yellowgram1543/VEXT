# Technology Stack

**Analysis Date:** 2025-01-24

## Languages

**Primary:**
- TypeScript 5.x - Used throughout the project for both frontend and backend logic.

**Secondary:**
- JavaScript (ESM) - Used for configuration files like `eslint.config.mjs` and `next.config.ts`.

## Runtime

**Environment:**
- Node.js (implied by Next.js and Prisma)
- React 19.2.4

**Package Manager:**
- npm (package-lock.json present)
- Lockfile: present

## Frameworks

**Core:**
- Next.js 16.2.4 (according to package.json, though likely intended as 15.x based on React 19 usage) - Full-stack framework for the JLPT learning platform.

**Testing:**
- Not detected - No test frameworks (Jest, Vitest, etc.) found in `package.json`.

**Build/Dev:**
- Tailwind CSS 4.x - Utility-first CSS framework.
- PostCSS - CSS transformation.
- ESLint 9.x - Linting.

## Key Dependencies

**Critical:**
- `prisma` 7.7.0 - Database ORM for user data and progress tracking.
- `next-auth` 4.24.14 - Authentication framework.
- `next-sanity` 12.3.0 - Sanity CMS integration for learning content.

**Infrastructure:**
- `@next-auth/prisma-adapter` - Connects NextAuth to Prisma.
- `lucide-react` - Icon library.

## Configuration

**Environment:**
- Configured via `.env` file (existence noted).
- `DATABASE_URL` is required for Prisma.

**Build:**
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.
- `prisma.config.ts`: Prisma configuration.
- `sanity.config.ts`: Sanity configuration.

## Platform Requirements

**Development:**
- Node.js and npm/pnpm.
- PostgreSQL (database provider specified in `schema.prisma`).

**Production:**
- Vercel (implied by Next.js usage).

---

*Stack analysis: 2025-01-24*
