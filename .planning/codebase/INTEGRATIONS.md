# External Integrations

**Analysis Date:** 2025-01-24

## APIs & External Services

**Content Management:**
- Sanity CMS - Source of truth for learning modules, chapters, and lesson content.
  - SDK/Client: `next-sanity`, `@sanity/client`
  - Auth: Configuration in `sanity.config.ts`

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `DATABASE_URL` env var
  - Client: Prisma (`@prisma/client`)

**File Storage:**
- Sanity Asset Pipeline (implied by Sanity usage for images/media)
- Local filesystem (public assets in `public/`)

**Caching:**
- None detected (standard Next.js caching might be used)

## Authentication & Identity

**Auth Provider:**
- NextAuth.js
  - Implementation: Prisma Adapter for user persistence (`src/app/api/auth/[...nextauth]/route.ts`)
  - Session handling: `getServerSession` on server, `useSession` on client.

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Console logging.

## CI/CD & Deployment

**Hosting:**
- Likely Vercel.

**CI Pipeline:**
- None detected.

## Environment Configuration

**Required env vars:**
- `DATABASE_URL`: Connection string for PostgreSQL.
- `NEXTAUTH_SECRET`: Secret for NextAuth session signing.
- `SANITY_PROJECT_ID`: ID for Sanity project.
- `SANITY_DATASET`: Dataset name for Sanity.

**Secrets location:**
- `.env` file (local development).

## Webhooks & Callbacks

**Incoming:**
- NextAuth callbacks (e.g., Google/GitHub login redirects, if configured).

**Outgoing:**
- None detected.

---

*Integration audit: 2025-01-24*
