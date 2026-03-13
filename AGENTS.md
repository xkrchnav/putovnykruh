# AGENTS.md — putovnykruh.cz

## Project

Czech men's circle community site. Single-page Astro 5 static site deployed to Cloudflare Workers.
Language: Czech (lang="cs"). Some founder bio text is Slovak.

## Stack

- Astro 5 + MDX content collections + Zod schema validation
- TypeScript strict mode (via `astro/tsconfigs/strict`)
- Vanilla CSS with custom properties — no Tailwind, no CSS framework
- Cloudflare Workers static deploy (`wrangler.toml`, assets from `dist/`)
- Node 22 (`.nvmrc`)

## Architecture

Single page (`src/pages/index.astro`) wires `getCirclesState()` into 12 Astro components.
No SSR, no API routes, no database. Content-driven via MDX files.

```
src/pages/index.astro          → single entry point, calls getCirclesState()
src/lib/circles.ts             → core logic: sorting, filtering, date formatting
src/content.config.ts          → Zod schema + custom Prague datetime parser
src/content/circles/*.mdx      → event entries (8 files)
src/components/*.astro         → 12 PascalCase components with scoped CSS
src/layouts/BaseLayout.astro   → HTML shell, meta, OG, GA, StructuredData
src/styles/global.css          → design system (CSS custom properties)
```

## Content Model (circles collection)

MDX files in `src/content/circles/`. Named `YYYY-MM-DD-slug.mdx`.

### Frontmatter schema (src/content.config.ts)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| topic | string | no | Missing → UI shows "bude upřesněno" |
| description | string | yes | Used in UI + JSON-LD structured data |
| startsAt | string→Date | yes | Format: `YYYY-MM-DDTHH:mm` (no TZ suffix) |
| endsAt | string→Date | no | Missing → fallback startsAt + 2.5 hours |
| place | string | yes | Human-readable venue name |
| locality | string | no | Default: "Blansko" |
| addressRegion | string | no | Default: "Jihomoravský kraj" |
| addressCountry | string | no | Default: "CZ" |
| gallery | array | no | `[{ src: image(), alt: string }]`, default `[]` |

**`title` field does NOT exist in schema — do not use it.**

### DateTime parsing gotcha

`content.config.ts` contains `parsePragueLocalDateTime` — custom Zod transformer that parses
`YYYY-MM-DDTHH:mm` strings as Prague-local time using `Intl.DateTimeFormat` with `shortOffset`.
This is non-standard and may behave differently across Node versions. Do not add timezone suffixes
to `startsAt`/`endsAt` values.

## Key Types

```typescript
// src/lib/circles.ts
type CircleEntry = CollectionEntry<'circles'>;
interface CirclesState {
  allCircles: CircleEntry[];      // sorted by startsAt ascending
  pastCircles: CircleEntry[];     // endsAt < now, sorted newest-first
  upcomingCircles: CircleEntry[]; // endsAt >= now
  nextCircle: CircleEntry | undefined;
  followingCircle: CircleEntry | undefined;
}
```

## Components

All in `src/components/`, PascalCase `.astro` files. Scoped `<style>` blocks.
Some have inline `<script>` for client-side behavior (ContactForm, Schedule, Header, VisitedPlacesMap).

- **Schedule.astro** (555 lines) — largest file, signup form + client JS, submits to Google Apps Script
- **ContactForm.astro** — contact form, separate Google Apps Script endpoint
- **VisitedPlacesMap.astro** — Leaflet map via CDN, hardcoded places array (not from content collection)
- **StructuredData.astro** — JSON-LD (Event, Organization, LocalBusiness)

## CSS Design System (src/styles/global.css)

407 lines. Mobile-first. Fire/ember color theme.
- Custom properties: `--color-*`, `--space-*`, `--font-*`
- Fonts: Montserrat (headings) + Source Sans 3 (body) via Google Fonts CDN
- BEM-like class naming
- `build.inlineStylesheets: 'always'` in astro config — all CSS inlined at build

## External Services

- Google Apps Script: two endpoints for signup + contact forms (fetched with `no-cors` — cannot verify response)
- Google Analytics: G-RX3B3JFBES
- Leaflet via CDN (map component)
- Google Fonts via CDN

## Build & Deploy

```bash
npm run dev      # astro dev
npm run build    # astro build → dist/
npm run preview  # astro preview
npx wrangler deploy  # Cloudflare Workers
```

No CI/CD pipeline. No tests. No linter/prettier config.

## Scripts

`scripts/generate-images.js` — node-canvas based OG + profile image generator.
Requires native `canvas` devDep (needs build toolchain on Windows). Manual run only.

## Known Gotchas

- `no-cors` fetch to Google Apps Script = opaque response, can't verify submission success
- `StructuredData.astro` generates `validFrom: new Date().toISOString()` — build-time timestamp, stale until next build
- VisitedPlacesMap places array is hardcoded, not derived from content collection
- `.astro/` dir in repo (generated types) — gitignored but `nul` file at root is a Windows artifact
- WhatsApp group link hardcoded in Hero.astro: `https://chat.whatsapp.com/JVL1HKS5Jj0K8hsY5YBsL4`
- Geo coordinates hardcoded: 49.3626, 16.6441 (Blansko area)
- Phone number hardcoded: +420777347591

## Anti-patterns to Avoid

- Do not add `title` to MDX frontmatter — not in schema, will be ignored
- Do not append timezone suffix to `startsAt`/`endsAt` — Prague parser handles it
- Do not suppress TypeScript errors with `as any` or `@ts-ignore`
- Do not import React/Vue — pure Astro components only
- Do not add Tailwind — project uses vanilla CSS custom properties system
