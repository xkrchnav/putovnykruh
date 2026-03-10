# Putovní kruh (Astro)

This project uses **Astro + MDX content collections** so circle data is maintained in one place and reused across:

- `Hero.astro` (short upcoming info)
- `Schedule.astro` (next circle + up to 3 following upcoming circles)
- `PastCircles.astro` (timeline with optional gallery)
- `StructuredData.astro` (JSON-LD event metadata)

---

## Circles content (MDX)

All circles live in:

`src/content/circles/*.mdx`

Schema is defined in:

`src/content.config.ts`

### Frontmatter fields

| Field | Type | Required | Default | Notes |
|---|---|---:|---|---|
| `topic` | `string` | ❌ | – | If missing, UI shows `bude upřesněno` |
| `description` | `string` | ✅ | – | Short summary used in UI + structured data |
| `startsAt` | `string` (`YYYY-MM-DDTHH:mm`) | ✅ | – | Prague local datetime, parsed in `content.config.ts` |
| `endsAt` | `string` (`YYYY-MM-DDTHH:mm`) | ❌ | – | Same format as `startsAt`; if missing, app assumes +2.5h |
| `place` | `string` | ✅ | – | Human-readable place |
| `locality` | `string` | ❌ | `Blansko` | Used for structured data |
| `addressRegion` | `string` | ❌ | `Jihomoravský kraj` | Used for structured data |
| `addressCountry` | `string` | ❌ | `CZ` | Used for structured data |
| `gallery` | array of `{ src, alt }` | ❌ | `[]` | `src` is validated via Astro `image()` |

> Note: `title` is **not** part of the current schema and should not be used in frontmatter.

### Important behavior

- Circles are sorted by `startsAt`.
- `upcomingCircles` are all circles with `endsAt >= now` (or `startsAt + 2.5h` if `endsAt` is missing).
- `nextCircle` = first upcoming entry.
- `followingCircle` = second upcoming entry (still present in `CirclesState` for compatibility).
- `pastCircles` are shown newest first.
- Home page wiring (`src/pages/index.astro`):
  - `Hero` gets `upcomingCircle={nextCircle}`
  - `Schedule` gets `nextCircle={nextCircle}`
  - `Schedule` also gets `nextUpcomingCircles={upcomingCircles.slice(1, 4)}` (up to 3 nearest future terms after `nextCircle`)
- In `Schedule`, label switches automatically:
  - `Další termín` for one item
  - `Další termíny` for 2+ items
- If `topic` is missing, hero/schedule/past circles fallback is **"bude upřesněno"**.
- UI date rendering (`formatCircleDate`, `formatCircleDateTime`) uses `Intl.DateTimeFormat('cs-CZ', { timeZone: 'Europe/Prague' })`.
- Prague local datetime parsing in `content.config.ts` also uses `Intl.DateTimeFormat('cs-CZ', ...)` for timezone offset handling.

Implementation: `src/lib/circles.ts`.

### Core component props (current)

- `Hero.astro`
  - `upcomingCircle?: CircleEntry | null`
- `Schedule.astro`
  - `nextCircle: CircleEntry`
  - `nextUpcomingCircles?: CircleEntry[]`
- `PastCircles.astro`
  - `circles: CircleEntry[]`

### MDX template (copy/paste)

```mdx
---
topic: Volitelné téma
description: "Krátký popis kruhu."
startsAt: 2026-05-13T17:30
endsAt: 2026-05-13T20:00
place: Bílovice nad Svitavou
locality: Bílovice nad Svitavou
addressRegion: Jihomoravský kraj
addressCountry: CZ
gallery:
  - src: ../../assets/images/gallery05/photo-1.jpg
    alt: Oheň před začátkem kruhu
  - src: ../../assets/images/gallery05/photo-2.jpg
    alt: Sdílení v kruhu
---

Sem dej delší text, odkazy, kontext, inspirace atd.
```

### Notes for writing frontmatter

- Use valid YAML indentation (2 spaces for nested items).
- Use datetime format exactly: `YYYY-MM-DDTHH:mm` (no timezone suffix).
- If a value contains `:`, wrap it in quotes.
  - Example: `description: "Respekt: důvěra a prostor mluvit."`
- `gallery.src` should point to local files in `src/assets/images/...` (relative from the MDX file).

### Add a new circle

1. Create a new `.mdx` file in `src/content/circles/` (recommended file name: `YYYY-MM-DD-slug.mdx`).
2. Fill frontmatter (`startsAt`, `place`, `description`, etc.).
3. Add optional `gallery` images with `alt` text.
4. Run build check:

```bash
npm run build
```

If build passes, the new data will automatically appear in hero/schedule/past circles/structured data.

---

## Image generation script (`scripts/generate-images.js`)

Script location:

`scripts/generate-images.js`

Run manually:

```bash
node scripts/generate-images.js
```

### Prerequisites

1. Install dependencies:

```bash
npm install
```

2. Ensure source images exist:

- `src/assets/images/bg.jpg` (OG background, optional fallback gradient exists)
- `src/assets/images/favicon-source.jpg` (logo for OG image)
- `src/assets/images/jozo.jpg` (optional photo profile)
- `src/assets/images/martin.jpeg` (optional photo profile)

### What it generates

Output folder (auto-created if missing):

`public/images/`

Generated files:

- `og-image.jpg` (1200x630 social preview)
- `profile-jozo.jpg` (initials-style circle avatar)
- `profile-martin.jpg` (initials-style circle avatar)
- `profile-jozo-photo.jpg` (photo-based circular crop, if source exists)
- `profile-martin-photo.jpg` (photo-based circular crop, if source exists)

### Script caveats

- Existing files with the same names are overwritten.
- If photo files are missing, initials avatars are still generated.
- If `bg.jpg` is missing, the script falls back to a gradient background.

---

## Quick verification after content/image changes

```bash
npm run build
```

This validates MDX frontmatter, content collection types, and final static output.
