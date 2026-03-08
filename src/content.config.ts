import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const circles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/circles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      topic: z.string().optional(),
      description: z.string(),
      startsAt: z.coerce.date(),
      endsAt: z.coerce.date().optional(),
      place: z.string(),
      locality: z.string().default('Blansko'),
      addressRegion: z.string().default('Jihomoravský kraj'),
      addressCountry: z.string().default('CZ'),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
          }),
        )
        .default([]),
    }),
});

export const collections = { circles };
