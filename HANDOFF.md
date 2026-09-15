# Handoff: Daniel Iyalekhue portfolio

Status doc for an agent picking this up cold. Last refreshed **2026-09-15** (after the
"remove the AI slop" redesign). This file = what exists and how it works. `PRODUCT.md` = why
(audience, register, principles). `DESIGN.md` = the visual system.

## What this is

Personal portfolio for **Daniel Iyalekhue**, AI / ML Engineer in Birmingham, UK. MSc Artificial
Intelligence at Birmingham City University (Sep 2025 to Sep 2026). Goal: **land a full-time role**.
Register: brand (the design is the product). Structural inspiration was https://www.aaezekiel.co/
(hero + tabs + floating dock), not a visual clone.

- **Live:** https://danieliyalekhue.com (apex 308 → www). Vercel, auto-deploys on push to `main`
  of GitHub `Danny2xx/portfolio` (SSH remote). DNS at Namecheap: A `@` → 76.76.21.21,
  CNAME `www` → cname.vercel-dns.com.
- **Facts come from his CV**, served at `public/cv/daniel-iyalekhue-cv.pdf`. GitHub `Danny2xx`,
  LinkedIn `daniel-iyalekhue-3a48121b8`, email `danieliyalekhue@gmail.com`.

## Run

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static → dist/ (7 routes). The Tokenizer chunk-size warning is expected.
```

Astro 5 · TypeScript · React 19 islands (only the two Lab demos) · Tailwind v4 is installed but
effectively unused (plain scoped CSS + `src/styles/global.css`). No backend, no env vars.
Nothing loads from third parties at runtime (fonts and icons are self-hosted). Keep it that way.

## Design system (summary; details in DESIGN.md)

- **Graphite ink on white, one signal colour (vermilion, OKLCH hue ~34).** Signal marks only what
  is live or actionable: link underlines, the active tab bar, focus rings, the availability light,
  the "Accepted" badge, competition notes. Everything else is chroma 0. Light default, dark toggle.
- **Type:** Hanken Grotesk for everything. Geist Mono ONLY for real code/data (token IDs, kbd, code).
- **Sections** are `.sec` blocks with a sentence-case `.sec__title` heading row and optional
  `.sec__aside`. **No tiny uppercase tracked eyebrows, no 01/02 numbering, no chip soup, no
  generated placeholder art, no glass blur.** These were the "AI slop" tells that got removed.
- **Links** use `.link` (ink text, signal underline). Buttons: `.btn .btn--solid` / `.btn--line`.
- **Copy:** no em dashes or AI cadence in visible text (Daniel flagged it). En dashes in date
  ranges are fine.
- Slop detector should stay clean: `node ~/.claude/skills/impeccable/scripts/detect.mjs --json src` → `[]`.

## Routes (7)

- `/`: `Nav` + `Hero` + `Tabs` (About · Projects · Lab · Contact) + `Footer` + `Dock`.
- `/about`: two-column doc layout. Journey · How I work · Ventures · Education · Tech stack.
- `/now`, `/uses`: data from `content.ts`.
- `/writing` + `/writing/[...slug]`: content collection `writing` (one post, `building-this-site`).
- `/work/[...slug]`: case studies, content collection `caseStudies` (one: `docsage`).

## Home tabs

- **About:** Experience (dated rows) → **Research** (`#research`, ICACIN 2026 paper with first-page
  thumbnail) → Recognition (3 wins with certificate + announcement links, then an "also" list of
  finalist placings) → Tools I reach for (`StackIcons`, grouped) → Recommendations → link to /about.
- **Projects:** featured project (any project with `shot`, currently AquaSense AI) → index rows
  grouped by `projectGroups` (AI and machine learning / Full-stack and platforms) → Websites
  (one wide, then a pair). Rows show Live site / Case study / Source only when those exist.
- **Lab:** Tokenizer (real cl100k_base via `gpt-tokenizer`) + TemperatureLab (softmax).
- **Contact:** big email link + Copy button, LinkedIn/GitHub/Résumé rows, "Where I'm most useful".

## Content model: `src/data/content.ts` (single source of truth)

Exports: `profile` (name, title, headline, status, location, email, `cvUrl`, links, `bio[]`) ·
`journey` · `experience: Job[]` · `publications: Publication[]` · `awards: Award[]` ·
`alsoRecognised` · `stack` · `projectGroups` · `projects: Project[]` · `websites: Website[]` ·
`labIntro` · `credentials` · `ventures` · `now` · `uses` · `currently` · `howIWork` ·
`testimonials: Testimonial[]` · `strengths`.

- `bio` and `journey` strings support `**bold**` and `[text](href)` via `src/lib/inline.ts`.
  `#research`-style hrefs work from any tab (see Tabs mechanics).
- `Project{name, kind, blurb, stack[], group, note?, href?, repo?, shot?}`. Adding `shot`
  promotes a project to the featured layout.
- `Testimonial{quote, name, role, linkedin?, photo?}`. Paragraphs split on blank lines; the first
  renders as the large lead. Without `photo`, initials show.

## Key mechanics (don't break)

- **Theme + a11y pre-paint** (inline script in `Base.astro`): `theme` (dark only if saved) and
  `a11y-contrast/font/motion/textscale` → `data-*` attrs / `--ts`. Theme toggle logic lives in
  `Dock.astro` (`window.__toggleTheme`); ⌘K palette calls it too.
- **Tabs** (`Tabs.astro`): progressive enhancement. All panels ship visible; the inline script
  adds `html.tabs-js` and hides inactive ones. **Never add `hidden` to panels in markup.** Hash
  routing handles tab ids (`#projects`) AND any element id inside a panel (`#research` switches
  to About, then scrolls). Works on first load, on `hashchange`, and on in-page link clicks.
  Tabs wrap each slot in `.feed`, so tab components must not add their own `.feed`.
- **Motion:** CSS-only MPA view transitions; reveal = `.reveal-ready` + IntersectionObserver
  `.is-in` (content visible without JS); hero entrance is staggered; tab underline scales in;
  dock magnify. Every animation has a reduced-motion path.

## Assets (`public/`)

`cv/daniel-iyalekhue-cv.pdf` · `papers/icacin-2026-substrate-or-architecture.pdf` +
`papers/icacin-2026-page1.jpg` (320px thumb rendered from the PDF with PDFKit) ·
`awards/*` (certificates) · `shots/{aquasense.png, carril.jpg, nuclii.jpg, hottake.jpg}` ·
`vector.png` (avatar) · `favicon.svg`, `logo.svg`. Loose personal files in the repo root are
gitignored (`/*.pdf`, `/*.png`, `/*.jpeg`) and must not be published.

## Verifying UI

Headless Chrome is at `/Applications/Google Chrome.app`. Launch with `--headless=new
--remote-debugging-port=9222` and drive it over the DevTools WebSocket from a Node script
(set viewport, navigate, `Page.captureScreenshot`). For full-page shots, resize the viewport to
the document height rather than using `captureBeyondViewport` (that tiled the page). Headless
background targets don't advance CSS transitions, so a mid-transition colour in a screenshot
is not necessarily a bug. `npm run build` before calling anything done.

## Outstanding (needs Daniel)

1. **Ifeoluwa Olorunfemi (RWE) recommendation.** Commented slot in `testimonials`. Add only
   their real words. Never write a quote for a named person.
2. **Recommendation photos.** LinkedIn photos can't be pulled automatically (login wall, expiring
   URLs, no third-party loads). With permission, save to `public/people/<name>.jpg` (square,
   ~160px) and set `photo`.
3. **Employer name:** CV says "Blockchain Advisors Ltd" (Jun to Aug 2026); an earlier chat said
   "Blockchain Technology Ltd". Site follows the CV. Confirm.
4. **Public CV includes his phone number.** Swap the PDF if he'd rather not publish it.
5. **Paper PDF:** camera-ready copy hosted on the site. Confirm the publisher allows it; once
   proceedings are out, consider linking the DOI instead or as well.
6. DocSage case study: hidden `<!-- TODO -->` prompts (metrics, the hard part) in `docsage.md`.
7. hottake: his role is unconfirmed (`websites` TODO).
8. **AccessOps backend (paused):** Railway backend is gone, so accessops-coco-ai.vercel.app can't
   caption. Plan: Google Cloud Run. gcloud SDK is at `~/google-cloud-sdk`. Daniel must run
   `~/google-cloud-sdk/bin/gcloud auth login`, then create a project with billing, deploy
   `~/Documents/accessops-coco-ai/webapp/backend` (Dockerfile ready, honours `$PORT`), update
   `webapp/frontend/vercel.json` rewrite (currently points at a non-existent HF Space), commit
   that repo, and add `href` to the AccessOps project here.
9. Optional: og:image for link previews; remove unused deps (`@fontsource-variable/geist`,
   `jetbrains-mono`, `mona-sans`, `gsap`).

## Conventions

- OKLCH tokens only; never hardcode colours in components (screenshot frames/shadows excepted).
- Never ship fake content: placeholder people, invented metrics, fabricated quotes.
- Commits end with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
