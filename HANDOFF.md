# Handoff: Daniel Iyalekhue portfolio

Status doc for an agent picking this up cold. Last refreshed **2026-09-29**, after the rebuild
into a single-column feed and the Ask/motion pass on top of it. This file = what exists and how it works. `PRODUCT.md` = why (audience,
register). `DESIGN.md` = the visual system and the idea behind it.

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

Astro 5 · TypeScript · React 19 islands (Lab demos only) · Inter Variable + Geist Mono Variable
via Fontsource. No scroll library: motion is CSS. Tailwind v4 is wired to the design tokens
through `@theme inline` (see `DESIGN.md`), though the site's own CSS is hand-written.
No backend, no env vars, and **nothing loads from third parties at runtime**. Keep it that way.

## Structure (2026-09-29 rebuild)

One 600px column. The home page is a profile with two tabs; everything else is a sub-page in the
same system.

- `/` → `Profile` (head + a four-tab switcher + `Ask`) wrapping four panels, then `Footer`.
  `Settings` and `Dock` come from `Base`. There is no header and no hero.
  - **Profile** (default): What I do, Experience, Education, Recommendations — `FeedProfile`
  - **Work**: Selected work, Research, Recognition, Websites — `FeedWork`
  - **About**: Story, How I work, Ventures, Right now, Stack — `FeedAbout`
  - **Lab**: the two demos and the notes — `LabPanel`

  Thirteen sections in one scroll was the right content and the wrong shape: Daniel said twice
  that an employer would be bored before reading it. Splitting it four ways takes the landing
  page from 5215px to 2174px without dropping a line. **Don't merge them back.**
- `/work/<slug>` → generated from `projects` in `content.ts` (9 pages). What it is, how it works
  (numbered pipeline rows), measured facts + caveat, engineering decisions, stack chips, the case
  study if one matches by name, and a link to the next project.
- `/writing` + `/writing/<slug>` → content collection `writing`, same rows and prose styles.
- `/about`, `/now`, `/uses` → meta-refresh redirects to `/` (they used to be real pages, then
  pointed at `/#about`, which no longer exists).
- **Removed:** the tab system of two rebuilds ago, the ⌘K palette, `Header`, `Hero`, `Work`,
  `Experience`, `Research`, `About`, `Contact`, `Lab`, `Pipeline`, `Report`, `SectionHead`,
  `StackIcons`, `Logo`, and `src/scripts/motion.ts` with it.

## Design system

Read `DESIGN.md` first. The short version: a 600px column of rows under sticky mono uppercase
labels. Dark default with a light toggle, plain hex neutrals, no accent beyond a focus blue.
Inter for text, Geist Mono for labels and data. Body 14/20, row title 15, description 13, meta 12.
Rows, not cards. The measurements come from aaezekiel.co, read with `getComputedStyle`.

## Components

```
Base.astro        every page: pre-paint theme + a11y, SEO, skip link, Settings, slot, Dock.
Profile.astro     profile head (avatar, logo, name + tick, role, status, bio, mono link row),
                  the four-tab switcher and Ask. Owns the sliding pill (--n tabs, --k index),
                  the view-transition panel swap, roving arrow keys, the #profile/#work/#about
                  /#lab hashes, and window.__showPanel() for Ask. Panels arrive as slots.
FeedProfile/      the three content panels, all rows, all from content.ts. Every row carries
FeedWork/         id={rid(...)} from lib/passages.ts, because an Ask citation scrolls to that
FeedAbout.astro   id and lights it, switching tabs first if the row is on another panel.
Ask.astro         "Ask this site": the search box, the answer, the citations. Inlines the
                  corpus as JSON and calls lib/retrieve.ts. See DESIGN.md.
Stack.astro       40 tools in six groups with real simple-icons brand marks.
LabPanel.astro    the Lab panel: Tokenizer and TemperatureLab as client:visible islands, plus
                  Notes rows from the writing collection.
Dock.astro        floating bottom pill: top, email, GitHub, theme toggle. Owns
                  window.__toggleTheme. Tucks on scroll down; a 620ms settle timer always
                  brings it back, so it can never sit permanently on top of content.
Settings.astro    a11y dialog: 44px trigger, 48x28 switches, text size +/-, close button,
                  Escape, click-outside, focus returns to the trigger. Under 700px it is a
                  bottom sheet with a scrim, in thumb reach.
Footer.astro      live Birmingham clock and three icons, 12px mono.
Tokenizer.tsx     real cl100k_base BPE in-browser. TemperatureLab.tsx softmax demo.
```

## Key mechanics (don't break)

- **Content is visible without JS.** Motion is CSS only, inside a `prefers-reduced-motion`
  query. Nothing is hidden waiting for a script.
- **Sticky section labels** (`.label`) are the navigation. They bleed to the column edge with a
  `--bg` background so rows slide under them cleanly. Don't put them in a scroll container.
- **The text-size control only works because every px `font-size` and `line-height` is
  `calc(Npx * var(--ts))`.** Add a raw px size and that part of the page stops scaling.
- **Theme + a11y pre-paint** in `Base`; the toggle lives in `Dock` (`window.__toggleTheme`).
- **The dock always comes back.** The tuck-on-scroll-down has a settle timer for exactly this
  reason; an earlier version hid it for the whole of a downward scroll.
- **Design tokens are `--type-sans` / `--type-mono`.** Tailwind owns `--font-*`; reusing those
  names makes the variable reference itself and the font silently falls back.
- **Ask row ids come from `rid()` in `lib/passages.ts`, used by both sides.** Change how a row
  is keyed in a Feed panel without changing `passages.ts` and every citation stops scrolling
  anywhere. There is no runtime error when this breaks, so check it by clicking a citation.
- **Ask lives above the panels**, so it searches all four tabs. `light()` calls
  `window.__showPanel()` and waits 220ms for the swap before it scrolls.
- **Query expansion keys are plain words, stemmed at load.** Writing the stems by hand is how
  half of them silently stopped matching (`retriev` vs the real token `retrieval`).
- **The Ask corpus is generated from `content.ts` only.** Never write copy into
  `passages.ts`: the answers are extractive, so anything added there becomes something the
  site "says" about Daniel without appearing on the page.
- **Both email buttons copy rather than open a mail client**, and fall back to `mailto:` if
  the clipboard is refused. The `EMAIL ↗` link in the head is a plain `mailto:` either way,
  so there is always one that works.

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
`captureBeyondViewport`. Serve `dist/` with `npx serve dist` and **not** `serve -s`: SPA mode
rewrites every path to `index.html`, so sub-pages silently test the home page. Check 1280 and 390,
both themes, and measure rather than eyeball: tap-target rects, `scrollWidth - innerWidth`, and
computed colours run through a contrast ratio. Always `npm run build`.

Last measured (2026-09-29, production): no horizontal overflow at 1280 or 390 on `/`,
`/work/*` or `/writing`; secondary text at **5.34:1 dark / 6.17:1 light**; every interactive
target past 24px; text size scales 85% to 130% without overflow.

## Outstanding (needs Daniel)

1. **Ifeoluwa Olorunfemi's recommendation.** Commented slot in `testimonials`; real words only.
2. **Recommendation photos** can't be pulled from LinkedIn. Save to `public/people/<name>.jpg`
   and set `photo`.
3. **Trading bot authorship** and the **AIF360 / Aequitas** lines on his CV (see above).
4. **Employer name:** CV says "Blockchain Advisors Ltd"; an earlier chat said "Blockchain
   Technology Ltd".
5. **The public CV includes his phone number.**
6. **Paper PDF** is the camera-ready copy; confirm the publisher allows self-hosting.
7. **Case studies.** 8 of the 9 projects have one in `src/content/case-studies/` (OPS Platform
   doesn't: it's a scaffold and a write-up would be padding). They render at the bottom of the
   matching project page, matched by the `project` frontmatter field == the project's `name`.
   Each carries a few `<!-- TODO -->` prompts for the things only Daniel can answer (why RL
   failed on AccessOps, his role on the AquaSense team and the trading bot, what he'd do about
   the age bias finding, real DocSage latency). Everything outside those comments is from code.
8. hottake role unconfirmed.
9. **AccessOps backend (paused):** deploy `~/Documents/accessops-coco-ai/webapp/backend` to Cloud
   Run (`gcloud auth login` needed), then update that repo's `webapp/frontend/vercel.json` rewrite
   and add `href` to the project here.
10. Optional: an og:image for link previews.

## Conventions

- Token colours only; never hardcode a colour in a component.
- Never ship fake content: no invented metrics, no fabricated quotes, no placeholder people.
- No em dashes or AI cadence in visible copy.
- Commits end with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
