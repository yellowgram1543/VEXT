# Graph Report - .  (2026-04-18)

## Corpus Check
- Corpus is ~2,618 words - fits in a single context window. You may not need a graph.

## Summary
- 58 nodes · 27 edges · 34 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Content & Pages|Content & Pages]]
- [[_COMMUNITY_Auth & Prisma|Auth & Prisma]]
- [[_COMMUNITY_Sanity Integration|Sanity Integration]]
- [[_COMMUNITY_Agent Logic|Agent Logic]]
- [[_COMMUNITY_App Structure|App Structure]]
- [[_COMMUNITY_API Methods|API Methods]]
- [[_COMMUNITY_Admin Studio|Admin Studio]]
- [[_COMMUNITY_Auth Hook|Auth Hook]]
- [[_COMMUNITY_Auth Provider|Auth Provider]]
- [[_COMMUNITY_Gemini AI|Gemini AI]]
- [[_COMMUNITY_Lint Rules|Lint Rules]]
- [[_COMMUNITY_Env Setup|Env Setup]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Setup|PostCSS Setup]]
- [[_COMMUNITY_Prisma Setup|Prisma Setup]]
- [[_COMMUNITY_Sanity Setup|Sanity Setup]]
- [[_COMMUNITY_Route Logic|Route Logic]]
- [[_COMMUNITY_Data Seed|Data Seed]]
- [[_COMMUNITY_DB Instance|DB Instance]]
- [[_COMMUNITY_CMS Instance|CMS Instance]]
- [[_COMMUNITY_Chapter Type|Chapter Type]]
- [[_COMMUNITY_Schema Registry|Schema Registry]]
- [[_COMMUNITY_Module Type|Module Type]]
- [[_COMMUNITY_Domain Types|Domain Types]]
- [[_COMMUNITY_ESLint|ESLint]]
- [[_COMMUNITY_Next.js|Next.js]]
- [[_COMMUNITY_PostCSS|PostCSS]]
- [[_COMMUNITY_Sanity CMS|Sanity CMS]]
- [[_COMMUNITY_Project Docs|Project Docs]]
- [[_COMMUNITY_Doc Icon|Doc Icon]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Next.js Logo|Next.js Logo]]
- [[_COMMUNITY_Vercel Logo|Vercel Logo]]
- [[_COMMUNITY_Window Icon|Window Icon]]

## God Nodes (most connected - your core abstractions)
1. `Sample Learning Content` - 7 edges
2. `Progress API Route` - 3 edges
3. `Prisma Client Instance` - 3 edges
4. `Sanity Schema Types Registry` - 3 edges
5. `Sanity Configuration` - 2 edges
6. `NextAuth API Route` - 2 edges
7. `Chapter Page Component` - 2 edges
8. `Sanity Chapter Schema` - 2 edges
9. `Sanity Module Schema` - 2 edges
10. `Next.js Agent Rules` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Prisma Configuration` --configures--> `Prisma Client Instance`  [INFERRED]
  prisma.config.ts → src/lib/prisma.ts
- `Sanity Studio Page` --uses_config--> `Sanity Configuration`  [EXTRACTED]
  src/app/studio/[[...index]]/page.tsx → sanity.config.ts
- `Sanity Configuration` --uses_schema--> `Sanity Schema Types Registry`  [EXTRACTED]
  sanity.config.ts → src/sanity/schemaTypes/index.ts
- `Chapter Page Component` --uses_data--> `Sample Learning Content`  [EXTRACTED]
  src/app/chapters/[slug]/page.tsx → src/data/sample-content.ts
- `Claude Agent Reference` --cites--> `Next.js Agent Rules`  [EXTRACTED]
  CLAUDE.md → AGENTS.md

## Communities

### Community 0 - "Content & Pages"
Cohesion: 0.22
Nodes (4): Home Page, Module Page Component, Sample Learning Content, Domain Types Definitions

### Community 1 - "Auth & Prisma"
Cohesion: 0.5
Nodes (5): NextAuth API Route, Chapter Page Component, Prisma Client Instance, Prisma Configuration, Progress API Route

### Community 2 - "Sanity Integration"
Cohesion: 0.5
Nodes (5): Sanity Chapter Schema, Sanity Module Schema, Sanity Configuration, Sanity Schema Types Registry, Sanity Studio Page

### Community 3 - "Agent Logic"
Cohesion: 0.67
Nodes (3): Next.js Agent Rules, Claude Agent Reference, Rationale for Next.js Breaking Changes

### Community 4 - "App Structure"
Cohesion: 1.0
Nodes (0): 

### Community 5 - "API Methods"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Admin Studio"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Auth Hook"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Auth Provider"
Cohesion: 1.0
Nodes (2): Authentication Context Provider, Root Layout

### Community 9 - "Gemini AI"
Cohesion: 1.0
Nodes (2): Gemini Integration Guide, Rationale for Knowledge Graph Navigation

### Community 10 - "Lint Rules"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Env Setup"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Next Config"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "PostCSS Setup"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Prisma Setup"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Sanity Setup"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Route Logic"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Data Seed"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "DB Instance"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "CMS Instance"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Chapter Type"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Schema Registry"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Module Type"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Domain Types"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "ESLint"
Cohesion: 1.0
Nodes (1): ESLint Configuration

### Community 25 - "Next.js"
Cohesion: 1.0
Nodes (1): Next.js Configuration

### Community 26 - "PostCSS"
Cohesion: 1.0
Nodes (1): PostCSS Configuration

### Community 27 - "Sanity CMS"
Cohesion: 1.0
Nodes (1): Sanity Client Instance

### Community 28 - "Project Docs"
Cohesion: 1.0
Nodes (1): Project README

### Community 29 - "Doc Icon"
Cohesion: 1.0
Nodes (1): file.svg (Document Icon)

### Community 30 - "Globe Icon"
Cohesion: 1.0
Nodes (1): Globe SVG Icon

### Community 31 - "Next.js Logo"
Cohesion: 1.0
Nodes (1): Next.js Logo

### Community 32 - "Vercel Logo"
Cohesion: 1.0
Nodes (1): Vercel Logo

### Community 33 - "Window Icon"
Cohesion: 1.0
Nodes (1): Window Icon

## Knowledge Gaps
- **21 isolated node(s):** `ESLint Configuration`, `Next.js Configuration`, `PostCSS Configuration`, `Prisma Configuration`, `Root Layout` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App Structure`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Methods`** (2 nodes): `POST()`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Studio`** (2 nodes): `StudioPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Hook`** (2 nodes): `AuthContext()`, `AuthContext.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Provider`** (2 nodes): `Authentication Context Provider`, `Root Layout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Gemini AI`** (2 nodes): `Gemini Integration Guide`, `Rationale for Knowledge Graph Navigation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Lint Rules`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Env Setup`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Setup`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Setup`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sanity Setup`** (1 nodes): `sanity.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Route Logic`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Seed`** (1 nodes): `sample-content.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DB Instance`** (1 nodes): `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CMS Instance`** (1 nodes): `sanity.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chapter Type`** (1 nodes): `chapter.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema Registry`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Type`** (1 nodes): `module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Domain Types`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint`** (1 nodes): `ESLint Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js`** (1 nodes): `Next.js Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS`** (1 nodes): `PostCSS Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sanity CMS`** (1 nodes): `Sanity Client Instance`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Docs`** (1 nodes): `Project README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Doc Icon`** (1 nodes): `file.svg (Document Icon)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon`** (1 nodes): `Globe SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Logo`** (1 nodes): `Next.js Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Logo`** (1 nodes): `Vercel Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Window Icon`** (1 nodes): `Window Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Sample Learning Content` connect `Content & Pages` to `Auth & Prisma`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `Chapter Page Component` connect `Auth & Prisma` to `Content & Pages`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `ESLint Configuration`, `Next.js Configuration`, `PostCSS Configuration` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._