import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Writing / notes. Drop a new .md file in src/content/writing/ and it appears.
const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

// Case studies. A deep write-up per project: src/content/case-studies/<slug>.md
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    project: z.string(), // display name of the project (matches a projects[] entry)
    summary: z.string(),
    year: z.string(),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    demo: z.string().optional(),
    repo: z.string().optional(),
    video: z.string().optional(), // self-hosted demo clip, e.g. "/demos/docsage.mp4"
    poster: z.string().optional(), // still frame for the video, e.g. "/demos/docsage.jpg"
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { writing, caseStudies };
