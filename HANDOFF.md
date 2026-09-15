# Handoff: Daniel Iyalekhue portfolio

Status doc for an agent picking this up cold. Last refreshed **2026-09-16**, after a full frontend
overhaul. This file = what exists and how it works. `PRODUCT.md` = why (audience, register).
`DESIGN.md` = the visual system and the idea behind it.

## What this is

Personal portfolio for **Daniel Iyalekhue**, AI / ML Engineer in Birmingham, UK. MSc Artificial
Intelligence at Birmingham City University (2025 to 2026). Goal: **land a full-time role**.

- **Live:** https://danieliyalekhue.com (apex 308 → www). Vercel, auto-deploys on push to `main`
  of GitHub `Danny2xx/portfolio` (SSH remote). DNS at Namecheap: A `@` → 76.76.21.21,
  CNAME `www` → cname.vercel-dns.com.
- **Facts** come from his CV (`public/cv/daniel-iyalekhue-cv.pdf`) and, for projects, from the code
  in each repo under `~/Documents`. See "Project claims" below: several CV lines are contradicted
  by the code, and the site follows the code.

## Run

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static → dist/ (15 pages). The Tokenizer chunk-size warning is expected.
```

Astro 5 · TypeScript · React 19 islands (Lab demos only) · Lenis for smooth scrolling ·
Archivo + Geist Mono via Fontsource. Tailwind v4 is installed but only its preflight is used.
No backend, no env vars, and **nothing loads from third parties at runtime**. Keep it that way.

## Structure (2026-09-16 overhaul)

One scrolling home, a page per project, nothing behind tabs.

- `/` → `Hero` · `Work` · `Experience` · `Research` · `About` · `Lab` · `Contact`, each an
  `id`-anchored `.section`. `Header` (thin, auto-hiding), `Footer` and `Dock` come from `Base`.
- `/work/<slug>` → generated from `projects` in `content.ts` (9 pages). Shows the pipeline, the
  engineering decisions, measured results, and a case study if one matches by project name.
- `/writing` + `/writing/<slug>` → content collection `writing`.
- `/about`, `/now`, `/uses` → meta-refresh redirects to `/#about` (they used to be real pages).
- **Removed:** the tab system, the ⌘K palette, `Nav.astro` (now `Header.astro`), `Notes.astro`.

## Design system

Read `DESIGN.md` first. The short version: **"Grounded"**, a site that cites its own claims.
Dark default with a light toggle, graphite neutrals, one highlighter colour (`--hl` for fills,
`--hl-text` for text and lines: they differ in light mode for contrast), Archivo's width axis for
display type, Geist Mono only for code and data.

## Components

```
Base.astro        every page: pre-paint theme + a11y + motion opt-in, SEO, Header/Footer/Dock.
Header.astro      thin fixed bar: logo, name, status, Résumé, a11y gear. Hides on scroll down.
Dock.astro        PRIMARY NAV. Floating bottom pill, section scroll-spy, highlighter pill that
                  slides via clip-path, theme toggle. Labels on desktop, icons under 760px.
Hero.astro        headline with masked line reveal + highlighter, and the citation system.
SectionHead.astro big display title left, short description right. Used by every section.
Work.astro        mixed-size featured cards (xl/lg/md) + compact index + websites strip.
Pipeline.astro    a project's architecture as a live trace; used on cards and project pages.
Experience.astro  timeline with a scroll-linked progress rail and dots that light as you pass.
Research.astro    the ICACIN paper (cover, authors, summary, comparison bars) + awards.
About.astro       story + Right now / How I work / Ventures / Education + recommendation + tools.
Lab.astro         the two React demos.
Contact.astro     closing headline, big email with copy button, links, live Birmingham clock.
Settings.astro    a11y panel (contrast, text size, dyslexia font, reduced motion).
StackIcons.astro  grouped tech logos (simple-icons).
Tokenizer.tsx     real cl100k_base BPE in-browser. TemperatureLab.tsx softmax demo.
```

`src/scripts/motion.ts` owns smooth scrolling, reveal-on-enter and scroll progress.
`src/lib/inline.ts` renders `**bold**` and `[text](href)` in prose fields.

## Key mechanics (don't break)

- **Content is visible without JS.** `Base` adds `.motion` pre-paint only when motion is allowed,
  and strips it after 3s if `motion.ts` never runs. Reveals only *enhance* visible content.
- **Citations:** `[[source-id]]` in `heroIntro` becomes a numbered chip tied to `heroSources`.
  Hover/focus lights the pair and draws an SVG wire; on touch it jumps to the source and flashes.
- **Theme + a11y pre-paint** in `Base`; the toggle lives in `Dock` (`window.__toggleTheme`).
- **View transitions:** project titles carry `view-transition-name: title-<slug>` on both the card
  and the project page, so the title morphs across navigation. Header and dock persist.

## Project claims (important)

A repo audit found the old copy overstated things. The site now follows the code:

- **DocSage** runs local Ollama `llama3.2:3b` (not GPT-4o-mini), with hybrid BM25 + vector
  retrieval, RRF and a cross-encoder reranker.
- **Credit-scoring bias audit** uses SHAP + LIME and hand-computed fairness metrics. **No AI
  Fairness 360 or Aequitas exists in any repo**, though the CV lists them.
- **DraftDNA** uses `gpt-4.1`; mock mode is the default.
- **AccessOps** frontend is React + Vite (not Next.js). RL fine-tuning did **not** improve BLEU-4.
- **Trading bot:** most commits in the org repo are by another developer. The site says
  "R&D engineering on", never "sole engineer". The CV says sole engineer. **Ask Daniel.**
- **AquaSense** is a team hackathon repo; the site says "Hackathon team project".

Metrics in `projects[].facts` are copied from each repo's own report files. Don't add numbers
that aren't in a repo, and keep `caveat` where the data is simulated.

## Assets (`public/`)

`cv/daniel-iyalekhue-cv.pdf` · `papers/icacin-2026-substrate-or-architecture.pdf` +
`papers/icacin-2026-page1.jpg` (cover rendered from page 1 with PDFKit) · `awards/*` ·
`shots/{aquasense,carril,nuclii,hottake}` · `vector.png` · `favicon.svg`. Loose personal files in
the repo root are gitignored and must not be published.

## Verifying UI

Headless Chrome (`--headless=new --remote-debugging-port=9222`) driven over the DevTools
WebSocket. Resize the viewport to the document height for full-page shots rather than using
`captureBeyondViewport`. **Screenshot with motion both off and on**: the reduced-motion path hides
animation bugs, and headless background tabs don't advance CSS transitions. Always
`npm run build`, and keep `node ~/.claude/skills/impeccable/scripts/detect.mjs --json src` at `[]`.

## Outstanding (needs Daniel)

1. **Ifeoluwa Olorunfemi's recommendation.** Commented slot in `testimonials`; real words only.
2. **Recommendation photos** can't be pulled from LinkedIn. Save to `public/people/<name>.jpg`
   and set `photo`.
3. **Trading bot authorship** and the **AIF360 / Aequitas** lines on his CV (see above).
4. **Employer name:** CV says "Blockchain Advisors Ltd"; an earlier chat said "Blockchain
   Technology Ltd".
5. **The public CV includes his phone number.**
6. **Paper PDF** is the camera-ready copy; confirm the publisher allows self-hosting.
7. DocSage case study still has `<!-- TODO -->` prompts (his reasoning, real latency numbers).
8. hottake role unconfirmed.
9. **AccessOps backend (paused):** deploy `~/Documents/accessops-coco-ai/webapp/backend` to Cloud
   Run (`gcloud auth login` needed), then update that repo's `webapp/frontend/vercel.json` rewrite
   and add `href` to the project here.
10. Optional: an og:image for link previews.

## Conventions

- OKLCH tokens only; never hardcode colours in components.
- Never ship fake content: no invented metrics, no fabricated quotes, no placeholder people.
- No em dashes or AI cadence in visible copy.
- Commits end with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
