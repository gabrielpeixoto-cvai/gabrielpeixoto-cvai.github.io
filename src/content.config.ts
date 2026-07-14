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
    translationHash: z.string().optional(),
    translationLocked: z.boolean().optional(),
  }),
});

const postLike = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  translationHash: z.string().optional(),
  translationLocked: z.boolean().optional(),
});

const eventLike = z.object({
  title: z.string(),
  date: z.coerce.date(),
  type: z.string().optional(),
  venue: z.string().optional(),
  location: z.string().optional(),
  excerpt: z.string().optional(),
  translationHash: z.string().optional(),
  translationLocked: z.boolean().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: postLike,
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: postLike,
});
const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: eventLike,
});
const teaching = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teaching' }),
  schema: eventLike,
});
const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    link: z.string().url().optional(),
    translationHash: z.string().optional(),
    translationLocked: z.boolean().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(
      z.object({
        name: z.string(),
        affiliation: z.string().optional(),
        url: z.string().url().optional(),
      }),
    ),
    venue: z.string().optional(),
    date: z.coerce.date(),
    teaserImage: z.string().optional(),
    teaserVideo: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .optional(),
    excerpt: z.string().optional(),
    bibtex: z.string().optional(),
    translationHash: z.string().optional(),
    translationLocked: z.boolean().optional(),
  }),
});

export const collections = { publications, blog, notes, talks, teaching, portfolio, projects };
