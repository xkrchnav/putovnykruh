import { getCollection, type CollectionEntry } from 'astro:content';

export type CircleEntry = CollectionEntry<'circles'>;

export interface CirclesState {
  allCircles: CircleEntry[];
  pastCircles: CircleEntry[];
  upcomingCircles: CircleEntry[];
  nextCircle: CircleEntry | null;
  followingCircle: CircleEntry | null;
}

const FALLBACK_EVENT_DURATION_MS = 2.5 * 60 * 60 * 1000;

function byStartsAtAsc(a: CircleEntry, b: CircleEntry): number {
  return a.data.startsAt.getTime() - b.data.startsAt.getTime();
}

export async function getCirclesState(referenceDate = new Date()): Promise<CirclesState> {
  const allCircles: CircleEntry[] = (await getCollection('circles')).sort(byStartsAtAsc);

  const pastCircles = allCircles
    .filter((circle: CircleEntry) => {
      const endsAt = circle.data.endsAt ?? new Date(circle.data.startsAt.getTime() + FALLBACK_EVENT_DURATION_MS);
      return endsAt.getTime() < referenceDate.getTime();
    })
    .sort((a: CircleEntry, b: CircleEntry) => b.data.startsAt.getTime() - a.data.startsAt.getTime());

  const upcomingCircles = allCircles
    .filter((circle: CircleEntry) => {
      const endsAt = circle.data.endsAt ?? new Date(circle.data.startsAt.getTime() + FALLBACK_EVENT_DURATION_MS);
      return endsAt.getTime() >= referenceDate.getTime();
    })
    .sort(byStartsAtAsc);

  return {
    allCircles,
    pastCircles,
    upcomingCircles,
    nextCircle: upcomingCircles[0] ?? null,
    followingCircle: upcomingCircles[1] ?? null,
  };
}

export function formatCircleDateTime(date: Date): string {
  const datePart = new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Prague',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Prague',
  }).format(date);

  return `${datePart} o ${timePart}`;
}

export function formatCircleDate(date: Date): string {
  return new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Prague',
  }).format(date);
}

export function circleTopicLabel(circle: CircleEntry): string {
  return circle.data.topic ?? 'téma bude upřesněna';
}
