/**
 * RSS kanál blogu na /rss.xml.
 *
 * Slouží čtenářům v RSS čtečkách a je to zdroj, ze kterého může automat
 * publikovat nové články na Facebook (viz .github/workflows/facebook.yml).
 * Když měníš obsah, drž se prosím pole `description` — je to perex článku.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

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

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://putovnykruh.cz')).toString().replace(/\/$/, '');
  const feedUrl = `${base}/rss.xml`;

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  // Náhled ve stejném poměru, jaký používá Facebook a Open Graph (1200×630).
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

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.id}/`;
      const image = images.get(post.id) ?? null;

      return [
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
      ].join('\n');
    })
    .join('\n');

  const lastBuildDate = posts.length > 0 ? posts[0].data.publishedAt.toUTCString() : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog – Putovní mužský kruh</title>
    <link>${xmlEscape(`${base}/blog/`)}</link>
    <description>Zamyšlení, zkušenosti a příběhy z putovního mužského kruhu na Blanensku a v Brně.</description>
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
