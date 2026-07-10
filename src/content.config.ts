import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    paperurl: z.string().url().optional(),
    citation: z.string(),
    excerpt: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});

export const collections = { publications };
