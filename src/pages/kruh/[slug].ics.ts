import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CircleEntry } from '../../lib/circles';
import { circleTopicLabel } from '../../lib/circles';
import { resolvePlace } from '../../lib/places';

const SITE_URL = 'https://putovnykruh.cz';

export async function getStaticPaths() {
  const circles = await getCollection('circles');

  return circles.map((circle) => ({
    params: { slug: circle.id },
    props: { circle },
  }));
}

/** UTC timestamp in the format ICS expects (20261119T163000Z). */
function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/** RFC 5545 text escaping. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** RFC 5545 line folding at 75 octets, UTF-8 safe. */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const parts: string[] = [];
  let current = '';

  for (const char of line) {
    if (encoder.encode(current + char).length > 74) {
      parts.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  parts.push(current);

  return parts.map((part, index) => (index === 0 ? part : ` ${part}`)).join('\r\n');
}

export const GET: APIRoute = ({ props }) => {
  const { circle } = props as { circle: CircleEntry };
  const place = resolvePlace(circle.data);

  const startsAt = circle.data.startsAt;
  const endsAt = circle.data.endsAt ?? new Date(startsAt.getTime() + 2.5 * 60 * 60 * 1000);
  const summary = `Putovní mužský kruh – ${circleTopicLabel(circle)}`;

  const location = [place.name, circle.data.locality, circle.data.addressRegion]
    .filter(Boolean)
    .join(', ');

  const description = [
    circle.data.description,
    place.mapUrl ? `Mapa: ${place.mapUrl}` : '',
    'Nic neplatíš. Dáš jen slovo, že přijdeš.',
    `${SITE_URL}/#prihlaska`,
  ]
    .filter(Boolean)
    .join('\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Putovni muzsky kruh//Kruhy//CS',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${circle.id}@putovnykruh.cz`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(startsAt)}`,
    `DTEND:${icsDate(endsAt)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    ...(place.lat != null && place.lng != null ? [`GEO:${place.lat};${place.lng}`] : []),
    `URL:${SITE_URL}/#prihlaska`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(summary)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const body = lines.map(foldLine).join('\r\n') + '\r\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="kruh-${circle.id}.ics"`,
    },
  });
};
