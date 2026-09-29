/* ──────────────────────────────────────────────────────────────────────────
   The retrieval corpus for "Ask this site".

   Every passage is built from `content.ts`, which is built from Daniel's CV and
   the code in each repo. Nothing here is written for the search box, so the
   answers can only ever repeat what the page already says.

   `id` must match the DOM id of the row it came from, because a citation
   scrolls to that row and lights it up. `rid()` is the single place both sides
   agree on.
   ────────────────────────────────────────────────────────────────────────── */
import {
  bio, whatIDo, builds, experience, credentials, projects, publications,
  awards, alsoRecognised, journey, howIWork, ventures, now, websites, stack,
  testimonials, profile,
} from "../data/content";
import { trigrams, cosine, mds2d } from "./vec";

export type Passage = {
  id: string;
  sec: string; // the section label, shown in a citation
  title: string;
  text: string;
  href?: string; // where the citation can take you, if it leads off-page
};

export const rid = (group: string, key: string | number) =>
  `p-${group}-${String(key).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

const p: Passage[] = [];

p.push({ id: rid("profile", "bio"), sec: "Profile", title: profile.name, text: `${bio} ${profile.title}. ${profile.status}. Based in ${profile.location}. Contact ${profile.email}.` });

whatIDo.forEach((text, i) => p.push({ id: rid("whatido", i), sec: "What I do", title: "What I do", text }));

builds.forEach((b) => p.push({
  id: rid("builds", b.slug), sec: "What I do", title: b.line,
  text: `${b.line}. Proven by ${b.proof}.`, href: `/work/${b.slug}`,
}));

experience.forEach((j) => p.push({
  id: rid("exp", j.org), sec: "Experience", title: `${j.role}, ${j.org}`,
  text: `${j.role} at ${j.org}, ${j.range}${j.place ? `, ${j.place}` : ""}. ${j.note}`,
}));

credentials.forEach((c) => p.push({
  id: rid("edu", c.line), sec: "Education", title: c.line, text: `${c.line}. ${c.detail}`,
}));

projects.forEach((pr) => {
  const facts = (pr.facts ?? []).map((f) => `${f.label}: ${f.value}`).join(". ");
  const steps = pr.pipeline.map((s) => [s.label, s.detail].filter(Boolean).join(", ")).join(". ");
  p.push({
    id: rid("work", pr.slug), sec: "Selected work", title: pr.name, href: `/work/${pr.slug}`,
    text: [
      pr.tagline, pr.blurb, `${pr.kind}.`, pr.role ? `${pr.role}.` : "",
      `Built with ${pr.stack.join(", ")}.`, steps, facts,
      (pr.highlights ?? []).join(" "), pr.caveat ?? "", pr.note ?? "",
      pr.href ? `Live at ${pr.href}.` : "", pr.repo ? `Source at ${pr.repo}.` : "",
    ].filter(Boolean).join(" "),
  });
});

publications.forEach((pub) => p.push({
  id: rid("research", pub.title), sec: "Research", title: pub.title, href: pub.pdf,
  text: `${pub.title}. ${pub.venue}, ${pub.status}. With ${pub.affiliations}. ${pub.summary ?? ""}`.trim(),
}));

awards.forEach((a) => p.push({
  id: rid("award", a.event), sec: "Recognition", title: `${a.place}, ${a.event}`,
  text: `${a.place}, ${a.event}, ${a.date}. ${a.detail ?? ""}`.trim(),
}));

alsoRecognised.forEach((a) => p.push({
  id: rid("also", a.what), sec: "Recognition", title: a.what, text: `${a.what}. ${a.detail}`,
}));

journey.forEach((text, i) => p.push({ id: rid("story", i), sec: "Story", title: "Story", text }));

howIWork.forEach((text, i) => p.push({ id: rid("how", i), sec: "How I work", title: text.split(".")[0], text }));

ventures.forEach((v) => p.push({ id: rid("venture", v.role), sec: "Ventures", title: v.role, text: `${v.role}. ${v.detail}` }));

now.items.forEach((n) => p.push({ id: rid("now", n.label), sec: "Right now", title: n.label, text: `${n.label}: ${n.text} As of ${now.updated}.` }));

websites.forEach((w) => p.push({
  id: rid("site", w.name), sec: "Websites", title: w.name, href: w.url,
  text: `${w.name}, ${w.kind}. Live at ${w.url}.`,
}));

stack.forEach((g) => p.push({
  id: rid("stack", g.group), sec: "Stack", title: g.group,
  text: `${g.group}: ${g.items.join(", ")}.`,
}));

testimonials.forEach((t) => p.push({
  id: rid("rec", t.name), sec: "Recommendations", title: t.name,
  text: `${t.name}, ${t.role}, says: ${t.quote.replace(/\s+/g, " ")}`,
}));

export const passages = p;

/* ── the map of the corpus ─────────────────────────────────────────────────
   Where each passage sits relative to the others, measured once at build time
   so the browser never pays for it. The Ask box draws this, and a point's
   position is a real measurement: passages about the same things land close
   together because their character trigrams overlap.                        */
const grams = p.map((x) => trigrams(`${x.title} ${x.text}`));
export const layout = mds2d(p.length, (i, j) => 1 - cosine(grams[i], grams[j]));
