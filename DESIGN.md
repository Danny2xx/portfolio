# Design

Visual system for Daniel Iyalekhue's portfolio. Register: **brand**. Rebuilt **2026-09-29** as a
dense single-column feed, then given the Ask box and the motion pass. Tokens live in `src/styles/global.css`; this file explains the intent so
changes stay on-system.

## The idea: one column, read like a document

The whole site is a 600px column. A profile head, a search box, four tabs, then sections of rows
under sticky mono labels. No hero, no card grid, no section headings competing with the content.

**Four tabs, not one scroll.** Everything in one column was honest and unreadable: a recruiter
landed on 5215px of prose. Profile / Work / About / Lab splits it into four ~2000px reads, and
the landing tab answers the only question they have in the first minute, which is whether this
person can do the job. Nothing was cut to get there; long prose folds instead.

Every earlier direction failed the same way: it decorated. A masked hero reveal, mixed-size cards,
a timeline rail and an evidence report all made the page *about the layout*. The rows do the
opposite: the smallest possible container for a fact, repeated, so the content carries the page.

Reference point: aaezekiel.co, measured directly rather than eyeballed. The numbers below came out
of `getComputedStyle` on that site, not from taste.

### The correction worth keeping

An earlier version of this file banned "uppercase tracked eyebrows" and "mono used as technical
costume". That was wrong, and it cost seven rejected redesigns. The mono uppercase section labels,
the narrow column and the floating dock are the signature of the site Daniel liked. They are the
system now. Ban decoration, not structure.

## Colour

Plain hex and rgba, dark by default. The theme switches on `:root[data-theme]`, not on a class, so
it is set pre-paint in `Base.astro` and never flashes.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#0f0f0f` | `#fbfbfa` | page |
| `--raise` | `#191919` | `#ffffff` | dock, settings panel, tab pill |
| `--card` | `rgba(255,255,255,.04)` | `rgba(0,0,0,.035)` | tiles, chips, wells |
| `--line` / `--line-strong` | `.08` / `.16` white | `.09` / `.2` black | hairlines |
| `--ink` | `#e2e2e2` | `#1b1b1a` | primary text |
| `--mid` | `rgba(255,255,255,.5)` | `rgba(0,0,0,.62)` | labels, descriptions, meta |
| `--dim` | `rgba(255,255,255,.32)` | `rgba(0,0,0,.45)` | separators, list markers |
| `--accent` | `#7aa2ff` | `#2f5fd0` | focus ring, switch on, hover title |

`--mid` is darker in light mode on purpose: `rgba(0,0,0,.5)` measured 3.1:1 and failed. The
current pair measures **5.34:1 dark / 6.17:1 light** for every secondary text style on every page.

There is no highlighter and no second accent. Colour appears in exactly two other places: the
verified tick beside the name, and the brand dots on the stack chips.

## Typography

- **Inter Variable** for everything except data. **Geist Mono Variable** for section labels, dates,
  metric values, step numbers and the footer clock.
- Body **14 / 20**. Name **18 / 21.6**, weight 600, `-0.36px`. Row title **15 / 20.25**, weight 500.
  Row description **13 / 18**. Mono labels **14px uppercase** at `--mid`. Dates and meta **12px**
  mono, tabular figures.
- Sentence case in prose. Uppercase **only** for mono labels.
- Every `font-size` and px `line-height` is `calc(Npx * var(--ts))`, which is what makes the
  text-size control in the a11y panel do anything. If you add a px size, wrap it the same way.

## Layout

- `.col` = `max-width: 600px`, `padding-inline: 20px`, centred. That is the entire grid.
- `.sec` sections open with a `.label` that is **`position: sticky`** and bleeds to the column edge
  with a `--bg` background, so the current section names itself while you scroll past its rows.
- `.row` is a 3-column grid: `28px` tile, flexible middle, `auto` meta. `.row--plain` drops the
  tile. Rows are separated by hairlines, not boxes, and the last one has no rule.
- Sub-pages (`/work/<slug>`, `/writing`, `/writing/<slug>`) reuse `.col`, `.sec`, `.label` and
  `.row` exactly, so a project page is the same object as the feed that links to it.

## Ask this site

The one thing on the page that is not a document. It is a miniature of the
retriever in DocSage, pointed at the portfolio itself:

1. **BM25** over 57 passages built from `content.ts` (`src/lib/passages.ts`).
2. A **character-trigram vector space**, cosine, which catches near misses and typos.
3. **Reciprocal rank fusion** of the two, so neither arm has to be calibrated against
   the other. Same trick as the paper.
4. **Query expansion** on the query side only, because a recruiter types "shipped" and the
   page says "deployed". The corpus is never expanded, so an answer can only be what the
   site already claims.
5. An **extractive** answer: the best-matching sentence from each hit, never generated.
6. **Citations** that scroll to the row they came from and light it for 2.6s.

If nothing clears the relative score floor it says so and quotes nothing. That refusal is
the feature, not a fallback: the whole point of his research is a system that knows when it
has no grounds to answer.

No API, no model download, no network. About 40KB of inlined JSON and 3KB of logic, and it
answers in under 3ms after the first query builds the index.

## Signature components

- **Profile head** (`Profile.astro`): avatar, name with a verified tick, role, two-line bio, and a
  mono `EMAIL / LINKEDIN / GITHUB / CV` row. Everything a recruiter needs is above the fold.
- **The four tabs** (`Profile.astro`): a pill that slides under the active tab (`--n` tabs, `--k`
  index), with the panel swap running through `document.startViewTransition` when the browser has
  it. Arrow keys move between tabs; `#work`, `#about` and `#lab` open one directly. A citation
  from Ask switches tab before it scrolls.
- **Sticky labels**: the one piece of chrome that earns its place. They give a 3000px page a
  table of contents without a nav.
- **Rows** (`Feed.astro`): experience, education, work, research, recognition, websites. A row is a
  tile, a title, a description and a meta value. Work rows are links; the `.go` arrow slides 2px on
  hover.
- **Dock** (`Dock.astro`): logo home, top, copy email, GitHub, CV, theme. Tucks away on scroll
  down and always returns after a 620ms settle timer, so it can never end up permanently
  hiding content. It also stays put while any panel is open.
- **Stack** (`Stack.astro`): all 40 tools in six groups, with real brand marks from
  simple-icons where one exists and a mono monogram where none does. Marks are grey until
  hovered, then take their brand colour; on touch they bloom as the group scrolls in.
  Dark brand colours fall back to `--ink` so they do not vanish on a `#0f0f0f` page.
- **Lab** (`LabPanel.astro`): the two React islands, `client:visible`. Real `cl100k_base` BPE in the
  browser and a softmax temperature demo. They are the only JavaScript that matters on the page.

## Motion

No scroll library. Everything is CSS, inside `@media (prefers-reduced-motion: no-preference)`:

- `.rise` — 0.62s translate + blur entrance on the profile head, staggered by `--d`.
- Section rows — 0.5s, staggered `calc(var(--sd) + var(--i) * 34ms)`, so a section deals itself out.
- `.is-swapping .row` — 0.42s, 26ms stagger, when the Profile / Lab panels swap.
- `::view-transition-old/new(panel)` — 0.18s out, 0.3s in, for the tab morph.

**Every icon that changes state says so.** The settings trigger rotates its sliders out and an
X in. The theme toggle spins sun to moon, and the new theme is revealed by a circle wiping out
from the button through `::view-transition-new(root)` rather than cutting. Both email buttons
swap to a green tick for 1.8s when the address is copied. Sticky labels draw an underline as you
enter their section. Rows lift their title and rotate their tile on hover. Switches squash as the
dot travels. The "open to work" dot breathes.

Easing is one curve: `--ease: cubic-bezier(.16, 1, .3, 1)`. `:root[data-motion="reduced"]` forces
every duration to `0.001ms`, and the content is fully visible without JS regardless.

## Tailwind

Tailwind v4 is installed and wired through `@tailwindcss/vite`. `global.css` maps the design tokens
into `@theme inline`, so `text-ink`, `bg-raise`, `border-line`, `font-mono` and friends resolve to
this system rather than to Tailwind's defaults, and `@custom-variant dark` points Tailwind's `dark:`
at `[data-theme="dark"]`. The site's own CSS is hand-written because the design depends on exact
measured values; utilities are there for whoever edits next.

The design tokens are named `--type-sans` / `--type-mono`, **not** `--font-sans` / `--font-mono`.
Tailwind owns the `--font-*` namespace, and using the same names makes the variable reference
itself.

## Banned here

Generated answers of any kind · hero sections · card grids · decorative section headings · generated art standing in for
screenshots · gradients · glass blur · a second accent colour · scroll-jacking · counters that
animate numbers · em dashes in visible copy · any claim without the code to back it.
