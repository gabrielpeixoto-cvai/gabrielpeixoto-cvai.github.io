import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gabrielpeixoto-cvai.github.io',
  // Root user/org page: no base path.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    // NOTE: keys mirror the exact historical Jekyll URLs — the publication permalinks have
    // NO trailing slash (a Jekyll front-matter override) while section pages DO. This mixed
    // style is deliberate; do not "normalize" it or the old citation links will 404.
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
      filter: (page) => !page.includes('/projects/sgm-preview-7a2f/'),
    }),
  ],
  build: { format: 'directory' },
});
