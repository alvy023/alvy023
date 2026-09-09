import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    coverImage: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    links: z
      .object({
        repo: z.string().url().optional(),
        site: z.string().url().optional(),
        workflow: z.string().url().optional(),
      })
      .default({}),
  }),
});

export const collections = { projects };
