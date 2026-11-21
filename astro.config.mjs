import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://putovnykruh.cz',
  output: 'static',
  // Kruhy, jejichž soubor se přejmenoval podle skutečného data (dřív název neseděl).
  redirects: {
    '/kruh/2026-06-24': '/kruh/2026-07-09',
    '/kruh/2026-07-21-bilovice': '/kruh/2026-07-20-bilovice',
  },
  integrations: [sitemap(), mdx()],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
