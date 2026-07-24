# Handoff — Daniel Iyalekhue Portfolio

Complete status doc for an agent picking this up cold (no prior conversation). Last refreshed
**2026-07-21**. This is the source of truth for *what exists and how it works*. Read `PRODUCT.md`
for *why* (strategy/register/principles). **`DESIGN.md` is STALE** — it describes an old dark
"instrument-panel" system that no longer exists; trust `src/styles/global.css` tokens instead.

## What this is

A personal portfolio for **Daniel Iyalekhue** — **Applied AI / ML Engineer**, MSc Artificial
Intelligence student at Birmingham City University (2024–2026), currently on a **software/AI
placement at Blockchain Technology Ltd**. Goal: **land a full-time role**. Register: **brand**
(design IS the product). Structural inspiration (NOT a visual clone) was https://www.aaezekiel.co/.

Real facts: Birmingham, UK. GitHub `Danny2xx`, LinkedIn `daniel-iyalekhue-3a48121b8`, email
`danieliyalekhue@gmail.com`. His CV drove the content (6 AI/ML projects, 3 shipped websites, roles
at Blockchain Technology Ltd / Carril Agency / Amdari, 2 degrees + certs).

## Design system (current)

- **Light theme default, dark on toggle.** (Old iterations were dark-first — gone.)
- **Fonts:** Hanken Grotesk (sans) + Geist Mono (mono), self-hosted via Fontsource.
  Installed-but-UNUSED: `geist`, `jetbrains-mono`, `mona-sans` (safe to remove). Used:
  `hanken-grotesk`, `geist-mono`, `opendyslexic` (a11y font toggle only).
- **Palette:** mostly-neutral (neutrals ~chroma 0), OKLCH. Restrained **indigo** primary,
  **gold** accent (verified badge / kind tags), green "open to work" dot. Tokens in
  `src/styles/global.css` (`:root` = light, `:root[data-theme="dark"]` = dark).
- **Minimalist, small type** (deliberate shrink pass — keep it tight).
- **Identity:** DI monogram logo (`Logo.astro`, inline SVG `currentColor`) in nav/footer/favicon.
  X-style scalloped verified badge (indigo) by the name. Avatar = `public/vector.png`.
- **Copy is de-AI'd:** NO em-dashes (`—`), no "not just X / actually / genuinely" filler. Keep
  it that way. Date ranges use ` — ` intentionally (that's a range, fine).

## Stack + run

Astro 5 · Tailwind v4 (`@tailwindcss/vite`, lightly used) · TypeScript · React 19 (islands ONLY
for the two Lab demos). `gsap` installed but unused. No backend/API keys/env vars. "No external
requests" is a deliberate rule (see the `/writing` post). **No git repo yet. Not deployed.**

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static → dist/  (7 routes)
```

Visual verification: Google Chrome is at `/Applications/Google Chrome.app`. Prior work was
screenshot-verified via headless Chrome + the DevTools Protocol (`--headless=new
--remote-debugging-port=9222`, drive over the WS from a Node script). Useful for checking UI.

## Routes (7)

- `/` — home feed: `Nav` + `Hero` + `Tabs`(About/Projects/Lab/Contact) + `Footer` + `Dock`.
- `/about` — deeper page: My Journey · Currently · Tech Stack (grouped) · Education & Certs ·
  How I work. (Testimonials were MOVED to the home About tab; not here anymore.)
- `/now` — now-page (`now` in content.ts).
- `/uses` — tools/stack (`uses` in content.ts).
- `/writing` + `/writing/[...slug]` — blog (content collection `writing`).
- `/work/[...slug]` — **case studies** (content collection `caseStudies`). One live: `docsage`.

Discoverability: footer colophon (`Now · Uses · Writing · About`, + `Résumé` when cvUrl set) and
the **⌘K command palette**.

## Content model — `src/data/content.ts` (single source of truth for copy)

Exports (types in caps): `profile` (name, title, wordmark, status, location, email,
**`cvUrl: null`**, links{github,linkedin,x}, bio[]) · `journey` (string[]) · **`experience`**
(`Job[]` — 4 entries, most-recent first; top one = Blockchain Technology Ltd placement) ·
**`awards`** (`Award[]`) · `stack` (grouped chips) · **`projects`** (`Project[]` — 6 AI/ML;
optional `href`/`repo`/**`shot`**) · **`websites`** (`Website[]` — 3 live sites w/ screenshots) ·
`stuffIDo` · `labIntro` · `now` · `uses` · `currently` · `howIWork` · **`testimonials`**
(`Testimonial[]` — 1 REAL, has `href`) · `credentials` · `strengths`.

Types: `Job{range,role,org,place?,note}` · `Award{place,event,detail?,year,href?}` ·
`Project{name,kind,blurb,tags[],href?,repo?,shot?}` · `Website{name,kind,blurb,url,image}` ·
`Testimonial{quote,name,role,href?}`. Everything marked `// TODO` is a placeholder.

## Content collections — `src/content.config.ts`

- **`writing`** — `.md` in `src/content/writing/`. Schema: title, description, date, draft.
  Seed: `building-this-site.md` (a draft in Daniel's voice; he should review).
- **`caseStudies`** — `.md` in `src/content/case-studies/`. Schema: title, project, summary,
  year, role?, stack[], demo?, repo?, **video?, poster?**, draft. Seed: `docsage.md` — factual
  from CV, with hidden `<!-- TODO -->` comments marking what only Daniel can add (the hard-part
  story, real metrics, why-local-embeddings). It IS publishable as-is.

## Components

```
Base.astro         every page: pre-paint theme+a11y inline script, scroll-reveal IO, SEO meta,
                   renders <CommandPalette/> globally, view-transition setup.
Nav.astro          fixed top: DI Logo (left) + Settings gear (right). No wordmark text, no theme toggle.
Logo.astro         DI monogram SVG (currentColor, unique mask id per instance).
Settings.astro     a11y control panel (gear popover): high-contrast, text-size ±, dyslexia font,
                   reduce-motion. Persists to localStorage (a11y-* keys).
Hero.astro         avatar (vector.png) + name + X-style verified badge + title + bio + status.
                   Orchestrated entrance (staggered [data-reveal] + avatar scale-in).
Tabs.astro         home tabs About/Projects/Lab/Contact (mechanics below).
About.astro        "About" tab = Experience + Awards + Stuff I Do + StackIcons + Testimonials
                   + "More about me →". (Awards + Testimonials live HERE now.)
StackIcons.astro   tech logo grid (simple-icons). Mono→brand-colour on hover / scroll-bloom on touch.
Work.astro         "Projects" tab = 6 project cards (real screenshot if project.shot set, else a
                   generative signal-trace graphic) + "all on GitHub →" + a "Websites" subsection
                   (real screenshots of 3 live sites, Visit-site hover). Cards show "case study →"
                   when a caseStudies entry's `project` matches the project name.
Lab.astro          "Lab" tab = two live React-island demos.
Tokenizer.tsx      REAL cl100k_base BPE (gpt-tokenizer), in-browser, no API. Featured demo.
TemperatureLab.tsx softmax / sampling-temperature visualiser.
Contact.astro      "Contact" tab: magnetic email CTA + GitHub/LinkedIn + conditional CV button + Strengths.
Footer.astro       live-clock sign-off + socials (+ Résumé icon when cvUrl) + colophon nav + copyright.
Dock.astro         floating dark dock: Top · About(/about) · ⌘K · Email(accent) · GitHub · Theme.
                   OWNS theme-toggle logic (window.__toggleTheme) + macOS-style magnify.
CommandPalette.astro  global ⌘K palette (navigate / actions / connect).
Notes.astro        UNUSED leftover — safe to delete.
```

Pages: `index.astro`, `about.astro`, `now.astro`, `uses.astro`, `writing/index.astro`,
`writing/[...slug].astro`, `work/[...slug].astro`. Public assets: `favicon.svg`, `logo.svg`,
`vector.png`, `shots/{carril,nuclii,hottake}.jpg` (site screenshots).

## Key mechanics (don't break)

**Theme + a11y, pre-paint (no flash).** Inline script in `Base.astro` reads localStorage before
paint: `theme` (dark only if saved "dark", else light) + a11y prefs (`a11y-contrast/font/motion`
→ `data-*`, `a11y-textscale` → `--ts`). Theme-toggle logic lives in `Dock.astro`
(`.dock-theme` + `window.__toggleTheme`); ⌘K "toggle theme" also calls `window.__toggleTheme`.
No `ThemeToggle.astro` (deleted).

**Tabs.** Slots `about/projects/lab/contact`. Hero persists; tab swaps the panel below.
Progressive enhancement: ALL panels ship visible; inline script adds `html.tabs-js` and CSS hides
inactive ones. **Never add `hidden` to panels in markup** (breaks no-JS/crawlers). Hash
deep-links (`/#projects`) + `hashchange` so dock/footer links switch tabs. ARIA tab roles +
Arrow/Home/End. Newly-shown panels force-reveal their `[data-reveal]` (were display:none).

**Motion.** Cross-page **view transitions** = CSS-only MPA (`@view-transition{navigation:auto}` +
`view-transition-name` on `.nav`/`.dock`). **Scroll reveal** = `.reveal-ready` + IO `.is-in`
(content visible by default). **Dock magnify** + **magnetic email CTA** gated on `hover:hover` &
not reduced-motion. Every animation has a reduced-motion path.

**Project media (ready, unused).** `projects[].shot` = "/shots/x.jpg" swaps a card's graphic for a
real screenshot (fallback = generative trace). Case-study `video` + `poster` frontmatter renders an
inline lazy `<video>`. Self-hosted mp4 keeps the "no external requests" promise. No assets yet.

## Outstanding (needs Daniel's input)

1. **Deploy his project apps** — IN-FLIGHT topic. He wants the GitHub AI projects live so cards get
   real "visit" links. These are SEPARATE repos on his accounts/keys (can't deploy from here — guide
   only). Plan given: Tier 1 easy = **AURAFIND → Vercel**, **Bias-Audit → Streamlit Cloud**; Tier 2 =
   DocSage/DraftDNA/OPS (Next.js→Vercel, FastAPI→Render/Railway, Postgres→Supabase/Neon, Chroma→disk
   or Qdrant/Pinecone); Tier 3 skip = **RepoLens** (local Ollama, keep as video). WARN him to set an
   OpenAI spend cap + rate limiting before sharing any live link. Once a URL exists, set `projects[].href`.
2. **DocSage case study prompts** — fill the hidden `<!-- TODO -->` in `docsage.md` (metrics, the
   hard part, why local embeddings) + confirm year + add demo/repo links. Offer to write in his voice.
3. **Awards** — `awards` has 2 placeholder entries (UKRI Hackathon winner, Oracle Hackathon 2nd,
   2026). Confirm EXACT event names, dates, links, and what he built.
4. **Testimonials** — 1 real live (Olumide Olaomo). Ifeoluwa Olorunfemi (RWE) is HELD in a code
   comment — **never fabricate a named person's quote**; add only real text.
5. **CV** — drop `public/cv.pdf`, set `profile.cvUrl = "/cv.pdf"` → reveals Résumé links + Contact button.
6. **Confirm:** Blockchain placement start year + role note (both placeholder); his role on
   Nuclii/hottake; Web Developer dates (guessed).
7. **Not deployed / no git.** Portfolio is static Astro → Vercel/Netlify/Cloudflare. `git init` not run.
8. Optional: screenshots for project cards (`shot`), more Lab explainers (embedding explorer —
   precompute at build to keep no-network), OG/share image, regenerate `DESIGN.md`, delete dead
   `Notes.astro` + unused font deps.

## Conventions

- OKLCH colour, tokens only (never hardcode colours in components).
- No em-dashes / AI-cadence in copy. Never ship fake content (placeholder people, invented metrics).
- `.label` mono section markers are a deliberate consistent system — keep them uniform.
- Mono is earned (code/metrics/demos), not decorative.
- Verify UI changes visually (headless Chrome available) and `npm run build` before calling done.
```
