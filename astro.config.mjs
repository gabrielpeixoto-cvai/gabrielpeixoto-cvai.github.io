import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gabrielpeixoto-cvai.github.io',
  // Root user/org page: no base path.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'pt-br'],
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    '/': '/en/',
    // Old Jekyll publication permalinks → new Astro publication pages (load-bearing for citations).
    '/publication/2017-10-17-sibgrapi2017-pose-recognition-gabriel': '/en/publications/2017-10-17-sibgrapi-pose-recognition/',
    '/publication/2021-11-22-wvc2021-handarch-gabriel': '/en/publications/2021-11-22-wvc-handarch/',
    // Old Jekyll section landing pages → their English Astro equivalents.
    '/publications/': '/en/publications/',
    '/talks/': '/en/talks/',
    '/teaching/': '/en/teaching/',
    '/portfolio/': '/en/portfolio/',
    '/cv/': '/en/cv/',
    '/year-archive/': '/en/blog/',
    '/markdown/': '/en/',
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ja: 'ja', 'pt-br': 'pt-BR' },
      },
    }),
  ],
  build: { format: 'directory' },
});
