# Design

Visual system for Daniel Iyalekhue's portfolio. Register: **brand**. Rebuilt 2026-09-16 as a
full frontend overhaul. Tokens live in `src/styles/global.css`; this file explains the intent so
changes stay on-system.

## The idea: "Grounded"

Daniel's research is about AI answers that cite their evidence, so the site behaves the same way:
nothing is asserted without the thing that backs it. Key phrases are marked with a highlighter, as
if someone read the page and marked what matters.

**The hero says what he builds, not what he won.** Four lines of craft ("answers that cite the page
they came from", "models that hand over when they're unsure"), each linking to the system that
proves it. Awards and the paper live in Research and recognition, where they belong. If you find
yourself leading with credentials again, that's the mistake to undo.

Reference points: a marked-up printed document, and the single coloured key on a Braun calculator.

## Colour

OKLCH. Dark is the default, light mirrors it. Neutrals carry a whisper of the highlighter hue
(chroma ≤ 0.008) so the greys never look blue.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` / `--bg-raise` | `0.155` / `0.18` | `0.985` / `1` | page, raised panels |
| `--surface` / `--surface-2` | `0.2` / `0.245` | `0.962` / `0.935` | wells, tracks |
| `--line` / `--line-strong` | `0.285` / `0.38` | `0.89` / `0.78` | hairlines |
| `--ink` / `--muted` / `--faint` | `0.965` / `0.78` / `0.64` | `0.17` / `0.4` / `0.5` | text ramp |
| `--hl` | `oklch(0.91 0.19 118)` | `oklch(0.93 0.19 116)` | highlighter **fill** |
| `--hl-text` | same as `--hl` | `oklch(0.47 0.12 125)` | the hue as **text or lines** |
| `--on-hl` | `oklch(0.19 0.04 118)` | same | text on a highlighter fill |

**Use `--hl` for fills and `--hl-text` for anything that is text, a line or a dot.** In light mode
lime text on white fails contrast, which is why the two tokens differ there.

Highlighter is allowed on: marked phrases, citation chips, the active dock pill, the availability
light, status badges, the timeline progress rail, the strong bar in a comparison, and links'
underlines. Nothing else. No gradients, no glows.

## Typography

- **Archivo Variable** carries everything, using its **width axis** (62–125%) as well as weight.
  Display type sits at `font-stretch: 112%` and weight 700; body stays at 100%.
- **Geist Mono** only where the text is code or data: pipeline step labels, token IDs, metric
  values, citation numbers.
- Body 0.9375rem / 1.62. Display headings `clamp()` up to 6rem, letter-spacing −0.035em.
- Sentence case everywhere. No uppercase tracked labels.

## Layout

- 12-column grid inside `.wrap` (max 78rem). Sections are `.section`, separated by a hairline.
- Section headers (`SectionHead.astro`) put a big display title on the left and a short
  description on the right, so every section starts the same way and reads at a glance.
- One scrolling home: Hero → Work → Experience → Research → About → Lab → Contact. **Each project
  has its own page** at `/work/<slug>`; nothing is hidden behind tabs.
- Work uses mixed card sizes (`xl` / `lg` / `md`) plus a compact index of the rest, so the grid
  never reads as repeated identical cards.

## Signature components

- **Built-things rail** (`Hero.astro`): four capability lines from `heroBuilds`, each with the
  project that proves it and a link to its page. Hover slides the line and draws a highlighter
  underline. This is the hero's evidence, in place of a credentials list.
- **Kinetic type**: the headline animates along Archivo's width axis (86% to 112%) as it lands,
  so the hero arrives rather than appearing.
- **Pipeline** (`Pipeline.astro`): a project's architecture as a live trace. Steps light in order
  while on screen, with a rail that fills. Fully lit and static when motion is off. This is the
  honest alternative to decorative placeholder art for projects with no screenshot.
- **Highlighter** (`.hl-mark`): sweeps a phrase from 0 to 100% width as it enters the viewport.
- **Dock** (`Dock.astro`): the primary navigation, floating bottom-centre. Text labels on desktop,
  icons under 760px, with a highlighter pill that slides via `clip-path` to the section in view.
- **Header** (`Header.astro`): thin, hides on scroll down, returns on scroll up.

## Motion

Lenis smooth scrolling (fine pointers only), reveal-on-enter, and scroll-linked progress, all in
`src/scripts/motion.ts`. The hero choreographs: identity, then headline lines rising behind masks,
then the highlighter sweep, then intro and sources.

**Content is visible without JS.** Base adds `.motion` pre-paint only when motion is allowed, and
removes it after 3s if the motion script never runs. Every animation has a reduced-motion path,
and the a11y panel can force motion off.

## Banned here

Uppercase tracked eyebrows · numbered section scaffolding · identical card grids · decorative chip
rows · generated art standing in for screenshots · gradient fills or text · glass blur · a second
accent colour · mono used as "technical" costume · em dashes in visible copy.
