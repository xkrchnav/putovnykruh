import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const PRAGUE_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const timeZoneNamePart = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value;

  if (!timeZoneNamePart) {
    return 0;
  }

  const normalized = timeZoneNamePart.replace('GMT', '');
  if (normalized === '' || normalized === '0') {
    return 0;
  }

  const match = normalized.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? '0');

  return sign * (hours * 60 + minutes);
}

function parsePragueLocalDateTime(value: string): Date {
  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  const utcGuess = Date.UTC(year, month - 1, day, hours, minutes);
  const offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcGuess), 'Europe/Prague');

  return new Date(utcGuess - offsetMinutes * 60_000);
}

const pragueDateTimeSchema = z
  .string()
  .regex(PRAGUE_DATE_TIME_REGEX, 'Use format YYYY-MM-DDTHH:mm')
  .transform(parsePragueLocalDateTime);

const circles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/circles' }),
  schema: ({ image }) =>
    z.object({
      topic: z.string().optional(),
      description: z.string(),
      startsAt: pragueDateTimeSchema,
      endsAt: pragueDateTimeSchema.optional(),
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
