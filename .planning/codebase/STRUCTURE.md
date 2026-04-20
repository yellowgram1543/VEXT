# Codebase Structure

**Analysis Date:** 2025-01-24

## Directory Layout

```
jlpt/
├── prisma/             # Database schema and configurations
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js App Router (Pages and API)
│   │   ├── api/        # API Route Handlers (auth, progress)
│   │   ├── chapters/   # Chapter/Lesson pages
│   │   ├── modules/    # Module overview pages
│   │   └── studio/     # Sanity Studio embedded route
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI primitives
│   │   └── layout/     # Page layout components
│   ├── data/           # Mock/Sample data for development
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Library clients (Prisma, Sanity)
│   ├── sanity/         # Sanity CMS schema definitions
│   └── types/          # TypeScript type definitions
└── next.config.ts      # Next.js configuration
```

## Directory Purposes

**src/app/api:**
- Purpose: Backend logic for the application.
- Contains: `route.ts` files for different endpoints.
- Key files: `src/app/api/progress/route.ts`

**src/sanity/schemaTypes:**
- Purpose: Definition of content types for Sanity CMS.
- Contains: Schema configuration objects.
- Key files: `src/sanity/schemaTypes/chapter.ts`

**src/data:**
- Purpose: Temporary storage for sample content until Sanity fetching is implemented.
- Contains: TypeScript files exporting constants.
- Key files: `src/data/sample-content.ts`

**src/lib:**
- Purpose: Initialization of external service clients.
- Contains: Client singletons.
- Key files: `src/lib/prisma.ts`, `src/lib/sanity.ts`

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Application landing page.
- `src/app/layout.tsx`: Root layout with Auth Provider.

**Configuration:**
- `prisma/schema.prisma`: Database model definitions.
- `sanity.config.ts`: Sanity Studio and client configuration.

**Core Logic:**
- `src/app/api/progress/route.ts`: Progress tracking logic.

**Testing:**
- Not detected.

## Naming Conventions

**Files:**
- [PascalCase].tsx: React components.
- [camelCase].ts: Logic/utilities.
- [kebab-case]: Directory names.

**Directories:**
- `[slug]`, `[id]`: Next.js dynamic routes.
- `[[...index]]`: Next.js catch-all routes.

## Where to Add New Code

**New Feature:**
- Primary code: `src/app/[feature-name]/page.tsx`
- Logic: `src/lib/` or `src/hooks/`

**New Component/Module:**
- Implementation: `src/components/`

**Utilities:**
- Shared helpers: `src/lib/utils.ts` (if created)

## Special Directories

**graphify-out:**
- Purpose: Auto-generated knowledge graph data.
- Generated: Yes
- Committed: Yes

---

*Structure analysis: 2025-01-24*
