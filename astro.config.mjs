import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://putovnykruh.cz',
  output: 'static',
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
