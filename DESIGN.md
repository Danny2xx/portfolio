# Design

Visual system for Daniel Iyalekhue's portfolio. Register: **brand**. Rebuilt 2026-09-15 to
remove the patterns that read as AI-generated. Tokens live in `src/styles/global.css`; this
file explains the intent so changes stay on-system.

**Reference:** a Braun calculator. Graphite and white, with exactly one coloured key. The
page is quiet so the one live colour means something.

## Colour

OKLCH. Neutrals are chroma 0 (no warm or cool tint). Strategy: **restrained, one signal**.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `oklch(1 0 0)` | `oklch(0.155 0 0)` | page |
| `--surface` / `--surface-2` | `0.977` / `0.955` | `0.195` / `0.235` | wells, hover, demo stages |
| `--border` / `--border-strong` | `0.915` / `0.84` | `0.285` / `0.38` | hairlines |
| `--ink` | `oklch(0.2 0 0)` | `oklch(0.955 0 0)` | headings, primary text |
| `--muted` | `oklch(0.44 0 0)` | `oklch(0.76 0 0)` | body copy |
| `--faint` | `oklch(0.53 0 0)` | `oklch(0.64 0 0)` | dates, meta (still ≥4.5:1) |
| `--primary` | `oklch(0.6 0.2 34)` | `oklch(0.7 0.18 38)` | **signal** fills, underlines, indicators |
| `--primary-hi` | `oklch(0.5 0.18 34)` | `oklch(0.78 0.15 42)` | signal used **as text** |

Signal is allowed on: link underlines, the active tab bar, focus rings, the availability light,
status badges ("Accepted"), proof notes on projects, the top bar in the temperature demo, text
selection. Nowhere else. No gradients, no glows. The dock is always dark (`--dock-*`).

## Typography

- **Hanken Grotesk** carries everything, with hierarchy from size and weight.
- **Geist Mono** only where the text is literally code or data: token IDs, tokens, kbd, `code`.
  Never for dates, labels, tags, links or titles.
- Scale: body `0.875rem`; meta `0.78–0.8rem`; list titles `0.92–0.95rem` / 600; section titles
  `1.05rem` / 600; hero statement `clamp(1.8rem, …, 2.55rem)` / 600 / `-0.034em`.
- Sentence case everywhere. No uppercase tracked labels. Tabular numerals are on globally.

## Layout

- Single centred feed, `--feed-max: 46rem`.
- Home content is `.sec` blocks separated by hairlines, each opening with a heading row
  (`.sec__title` left, optional `.sec__aside` right). Not eyebrows, not numbers.
- Résumé-style data uses a two-column grid (8.25rem label or date column + content) that stacks
  under ~560px: experience, recognition, stack groups, /about blocks, /now, /uses.
- Projects: one featured project with a real screenshot, then an index of rows grouped by type.
  Websites: one wide screenshot, then a pair. **No generated placeholder art**. A project without
  a real screenshot is a text row.
- Containers (bordered boxes) only for the interactive Lab demos.

## Components and patterns

- `.link`: ink text + half-strength signal underline; underline thickens on hover.
- `.btn--solid` (ink fill) for the primary action, `.btn--line` for the secondary one. 8px radius.
- Research entry: first-page thumbnail + status badge + title + authors (Daniel in ink/600) +
  plain-language summary + "Read the paper".
- Recommendation: first paragraph as a large lead quote, the rest muted, attribution with photo
  or initials and a LinkedIn link.
- Dock: floating dark pill, magnify on hover, owns the theme toggle.

## Motion

Ease-out expo (`--ease-out`). Hero entrance staggers identity → statement → bio → actions.
Sections reveal once as blocks (content is visible without JS). Tab underline scales in. Slow
2% zoom on screenshot hover. Availability light has a slow halo. Every animation has a
reduced-motion path, and the a11y panel can force reduced motion.

## Banned here

Uppercase tracked eyebrows · 01/02 section numbers · identical card grids · chip/tag pills as
decoration · generated SVG art standing in for screenshots · gradient fills or text · glass blur ·
glowing dots · a second accent colour · mono as "technical" costume · em dashes in visible copy.
