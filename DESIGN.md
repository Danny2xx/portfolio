# Design

Visual system for Daniel Iyalekhue's portfolio. Register: **brand**. Aesthetic lane:
**"Instrument panel"** — the precise, luminous feeling of high-end measurement equipment
(oscilloscope, modular synth, flight instrument). Deliberately not SaaS-purple-on-white,
not terminal-green-on-black. Cool luminous signal + warm counterpoint on a near-black
panel. The medium is the proof: live, glowing demos against exact, restrained chrome.

## Color

OKLCH throughout. Dark is the default theme; a real light theme mirrors it.
Strategy: **Committed** — the near-black panel carries the brand; indigo is the signal,
amber is the warm counterpoint. Both used deliberately, neither decorative.

### Dark (default)

```css
--bg:        oklch(0.165 0.012 275);  /* near-black panel, whisper of indigo */
--surface:   oklch(0.205 0.014 275);  /* cards, panels, raised sections */
--surface-2: oklch(0.245 0.015 275);  /* hover / inset wells */
--border:    oklch(0.30 0.014 275);   /* hairlines, 1px */
--ink:       oklch(0.97 0.004 275);   /* body text — ≥12:1 on bg */
--muted:     oklch(0.74 0.012 275);   /* secondary text — ≥5:1 on bg */
--primary:   oklch(0.64 0.17 275);    /* indigo signal — links, focus, accents */
--primary-hi:oklch(0.72 0.16 275);    /* hover / brighter signal */
--accent:    oklch(0.80 0.14 72);     /* warm amber — status dots, highlights */
--on-primary:oklch(0.99 0 0);         /* white text on indigo fills (Helmholtz) */
--on-accent: oklch(0.18 0.02 72);     /* near-black text on pale amber fills */
```

### Light (toggle)

```css
--bg:        oklch(1.000 0 0);        /* pure white — no hidden warmth */
--surface:   oklch(0.975 0.004 275);
--surface-2: oklch(0.955 0.006 275);
--border:    oklch(0.90 0.008 275);
--ink:       oklch(0.22 0.014 275);   /* ≥12:1 on white */
--muted:     oklch(0.46 0.014 275);   /* ≥4.6:1 on white */
--primary:   oklch(0.52 0.18 275);    /* indigo, darkened for white-bg contrast */
--primary-hi:oklch(0.46 0.18 275);
--accent:    oklch(0.62 0.15 64);     /* amber, darkened to hold on white */
--on-primary:oklch(0.99 0 0);
--on-accent: oklch(0.99 0 0);
```

Contrast: body ink ≥7:1 both themes; muted ≥4.5:1; primary-vs-accent separated in hue
(275 vs ~70) and lightness. White text on indigo fills; dark text on pale amber (dark),
white text on darkened amber (light).

## Typography

Voice words: **rigorous · alive · unpretentious**. Two families on a contrast axis
(grotesque + monospace), both engineer-native, neither on the reflex-reject list. Mono is
*earned* here — real code, metrics, live demos — never costume.

- **Display + body — Mona Sans** (variable, GitHub's grotesque). Headings in 600–800 with
  tight tracking; body in 400–500. One family carries hierarchy via weight/size contrast.
- **Mono — JetBrains Mono.** Surgical: section indices, metric values, code, demo I/O,
  inline `tokens`, timestamps, the "● live" status text.

Scale: fluid `clamp()`, ratio ≥1.25. Hero display clamp max ≤ 6rem. Letter-spacing on
display ≥ -0.03em. `text-wrap: balance` on h1–h3, `pretty` on prose. Body line length
65–75ch. Dark theme line-height +0.06 vs light.

## Motion

GSAP for orchestration; CSS for state transitions. Ease-out exponential (expo/quart), no
bounce. One considered first-load reveal (hero choreography), purposeful section reveals
that fit their content (not one uniform fade), and tactile micro-interactions on
controls. The live demos ARE the motion centerpiece. Every animation has a
`prefers-reduced-motion: reduce` path (crossfade/instant). Reveals enhance
already-visible content — never gate visibility on a transition.

## Layout

12-col fluid grid, generous `clamp()` gutters that breathe on large viewports.
Asymmetric where it earns emphasis. Hairline borders (1px `--border`) define the
"instrument" structure rather than heavy shadows. Sections vary in rhythm: tight metric
clusters, generous narrative breaks. Cards only where they're the right affordance (work
items, demos); never nested. Breakpoint-free grids via
`repeat(auto-fit, minmax(280px, 1fr))`. Visible focus rings in `--primary`.

## Components

- **Nav** — fixed, hairline-bottom, mono wordmark + section links + theme toggle.
- **Hero** — name, title, bio; a live "● running" status chip; the embedded AI demo as
  the hero's right/lower companion (the proof, up top).
- **Experience** — typed timeline, mono dates, role · company · impact. Not cards.
- **Work** — 2–4 case-study cards, hairline-bordered, hover-lift, real impact numbers.
- **Skills** — grouped, deliberate (languages / AI / infra), no skill-bars, no logo wall.
- **Live demos** — React islands; luminous, framed like instrument readouts.
- **Footer** — contact, social, the human sign-off, theme toggle, copyright.

## Imagery

Engineer's imagery = the live demos themselves, custom SVG/canvas instrument motifs
(grid lines, signal traces, readouts), and real project screenshots. No stock people. No
colored-div placeholders standing in for real screenshots.
```
