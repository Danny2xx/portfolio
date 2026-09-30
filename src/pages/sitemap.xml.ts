/* A sitemap without a dependency: fifteen pages, all known at build time. */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { projects } from "../data/content";

const SITE = "https://www.danieliyalekhue.com";

export const GET: APIRoute = async () => {
  const notes = await getCollection("writing", ({ data }) => !data.draft);

  const urls: { loc: string; priority: string; lastmod?: string }[] = [
    { loc: "/", priority: "1.0" },
    { loc: "/writing", priority: "0.6" },
    ...projects.map((p) => ({ loc: `/work/${p.slug}`, priority: "0.8" })),
    ...notes.map((n) => ({
      loc: `/writing/${n.id}`,
      priority: "0.5",
      lastmod: n.data.date.toISOString().slice(0, 10),
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${SITE}${u.loc}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "") +
          `<priority>${u.priority}</priority></url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
