# Putovní kruh (Astro)

This project uses **Astro + MDX content collections** so circle data is maintained in one place and reused across:

- `Hero.astro` (short upcoming info)
- `Schedule.astro` (next + following circle)
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
| `title` | `string` | ✅ | – | Circle title |
| `topic` | `string` | ❌ | – | If missing, UI shows `bude upřesněno` |
| `description` | `string` | ✅ | – | Short summary used in UI + structured data |
| `startsAt` | `date` | ✅ | – | ISO datetime (with timezone recommended) |
| `endsAt` | `date` | ❌ | – | If missing, app assumes +2.5h for past/upcoming split |
| `place` | `string` | ✅ | – | Human-readable place |
| `locality` | `string` | ❌ | `Blansko` | Used for structured data |
| `addressRegion` | `string` | ❌ | `Jihomoravský kraj` | Used for structured data |
| `addressCountry` | `string` | ❌ | `CZ` | Used for structured data |
| `gallery` | array of `{ src, alt }` | ❌ | `[]` | `src` is validated via Astro `image()` |

### Important behavior

- Circles are sorted by `startsAt`.
- `nextCircle` = first upcoming entry.
- `followingCircle` = second upcoming entry.
- `pastCircles` are shown newest first.
- If `topic` is missing, schedule/hero fallback is **"bude upřesněno"**.

Implementation: `src/lib/circles.ts`.

### MDX template (copy/paste)

```mdx
---
title: Název kruhu
topic: Volitelné téma
description: "Krátký popis kruhu."
startsAt: 2026-05-13T17:30:00+02:00
endsAt: 2026-05-13T20:00:00+02:00
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
