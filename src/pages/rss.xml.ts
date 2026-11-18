/**
 * RSS kanál na /rss.xml — články z blogu i termíny kruhů.
 *
 * Slouží čtenářům v RSS čtečkách a je to zdroj, ze kterého může automat
 * publikovat nové příspěvky na Facebook (viz .github/workflows/facebook.yml).
 * Když měníš obsah, drž se prosím pole `description` — u článků je to perex,
 * u kruhů popis termínu.
 *
 * Kruhy mají `pubDate` rovnou datu setkání (`startsAt`), ne datu buildu:
 * stejný obsah tak produkuje stejný feed a čtečky ani automatizace nevidí
 * „novou“ položku při každém nasazení. Datum nadcházejícího termínu je záměrně
 * budoucí — příští kruh se v kanálu řadí nahoru.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { formatCircleDate } from '../lib/circles';
import { resolvePlace } from '../lib/places';

const xmlEscape = (value: string): string =>
  value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });

interface FeedItem {
  date: Date;
  xml: string;
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://putovnykruh.cz')).toString().replace(/\/$/, '');
  const feedUrl = `${base}/rss.xml`;

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  const circles = (await getCollection('circles')).sort(
    (a, b) => b.data.startsAt.getTime() - a.data.startsAt.getTime(),
  );

  // Náhledy ve stejném poměru, jaký používá Facebook a Open Graph (1200×630).
  const images = new Map<string, string>();
  for (const post of posts) {
    if (!post.data.image) continue;
    const optimized = await getImage({
      src: post.data.image,
      width: 1200,
      height: 630,
      fit: 'cover',
      format: 'jpeg',
    });
    images.set(post.id, `${base}${optimized.src}`);
  }

  const circleImages = new Map<string, string>();
  for (const circle of circles) {
    const cover = circle.data.gallery[0]?.src;
    if (!cover) continue;
    const optimized = await getImage({
      src: cover,
      width: 1200,
      height: 630,
      fit: 'cover',
      format: 'jpeg',
    });
    circleImages.set(circle.id, `${base}${optimized.src}`);
  }

  const blogItems: FeedItem[] = posts.map((post) => {
    const url = `${base}/blog/${post.id}/`;
    const image = images.get(post.id) ?? null;

    return {
      date: post.data.publishedAt,
      xml: [
        '    <item>',
        `      <title>${xmlEscape(post.data.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>`,
        `      <description>${xmlEscape(post.data.description)}</description>`,
        ...(post.data.author ? [`      <dc:creator>${xmlEscape(post.data.author)}</dc:creator>`] : []),
        ...(image
          ? [`      <enclosure url="${xmlEscape(image)}" type="image/jpeg" length="0" />`]
          : []),
        '    </item>',
      ].join('\n'),
    };
  });

  const circleItems: FeedItem[] = circles.map((circle) => {
    const place = resolvePlace(circle.data);
    const dateLabel = formatCircleDate(circle.data.startsAt);
    const topic = circle.data.topic?.trim();
    const url = `${base}/kruh/${circle.id}/`;
    const image = circleImages.get(circle.id) ?? null;

    const title = topic
      ? `Mužský kruh ${dateLabel}: ${topic}`
      : `Mužský kruh ${dateLabel} – ${place.name}`;
    const description =
      circle.data.description?.trim() ||
      `Setkání putovního mužského kruhu ${dateLabel}, ${place.name}.`;
    const endsAt =
      circle.data.endsAt ?? new Date(circle.data.startsAt.getTime() + 2.5 * 60 * 60 * 1000);
    const category = endsAt.getTime() >= Date.now() ? 'Nadcházející kruh' : 'Minulý kruh';

    return {
      date: circle.data.startsAt,
      xml: [
        '    <item>',
        `      <title>${xmlEscape(title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <pubDate>${circle.data.startsAt.toUTCString()}</pubDate>`,
        `      <description>${xmlEscape(description)}</description>`,
        `      <category>${category}</category>`,
        ...(image
          ? [`      <enclosure url="${xmlEscape(image)}" type="image/jpeg" length="0" />`]
          : []),
        '    </item>',
      ].join('\n'),
    };
  });

  const sortedItems = [...blogItems, ...circleItems].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  // Nejnovější položka kanálu; u nadcházejícího kruhu je to (záměrně) budoucí
  // datum — kanál se tak mezi dvěma buildy beze změny obsahu nemění.
  const lastBuildDate =
    sortedItems.length > 0 ? sortedItems[0].date.toUTCString() : new Date().toUTCString();

  const items = sortedItems.map((item) => item.xml).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Putovní mužský kruh – blog a kruhy</title>
    <link>${xmlEscape(`${base}/`)}</link>
    <description>Články z blogu a termíny putovního mužského kruhu na Blanensku a v Brně. Zamyšlení, zkušenosti a setkání u ohně.</description>
    <language>cs</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
