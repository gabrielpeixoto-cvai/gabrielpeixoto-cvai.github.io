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
  redirects: { '/': '/en/' },
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
