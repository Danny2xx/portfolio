---
title: "The View Transition that cost 66ms"
description: "I profiled a dropped frame instead of guessing at it, and the culprit was the API I'd added to make things feel smooth."
date: 2026-09-28
---

This site has four tabs. Switching between them dropped a frame on a mid-range phone, and the fix was not where I would have bet.

## Measure first, and measure the right thing

The tab swap had three plausible costs: a View Transition, a staggered row animation, and `content-visibility` on off-screen sections. Any of them could have been it.

So I disabled them one at a time, on a 4x CPU-throttled phone at 390px, and recorded the worst frame across each swap:

| | worst frame |
|---|---|
| everything on | 66.3ms |
| no row stagger | 50.2ms |
| no content-visibility | 50.5ms |
| **no View Transition** | **18.0ms** |

That is not a contribution, it is the whole thing. Removing the transition took a dropped frame down to a clean one at 60fps, and the other two changed almost nothing.

## Why it was expensive

`document.startViewTransition` works by screenshotting the old state and the new state, then animating between the two images. That is genuinely clever for a shared-element morph, where you want a thing in one layout to fly to its position in another.

My panels are about 2100px tall. So every tab click was asking a phone to rasterise two full-page-height bitmaps, to produce a crossfade.

A crossfade is two CSS keyframes.

```css
.is-swapping { animation: panel-in 0.3s var(--ease) backwards; }
@keyframes panel-in { from { opacity: 0; transform: translateY(6px); } }
```

Same result, no snapshots, 18ms.

## The second bug, which was hiding behind the first

Fixing that left one tab still slow: the one with the interactive demos. That turned out to be a separate mistake entirely.

```ts
import { encode, decode } from "gpt-tokenizer";
```

A top-level import, so the 2MB `cl100k_base` vocabulary landed in the island's own bundle and had to be parsed before the panel could paint. Moving it into a dynamic import inside an effect, with a loading state until it lands, took the chunk from **1991KB to 4KB**.

## What I took from it

Two things I had added to make the site feel better were making it worse, and I only found them by measuring rather than reasoning. The View Transitions API is excellent for what it is for. A crossfade is not what it is for.

The general version: an expensive technique used for a cheap effect is still expensive. Ask what the browser is physically being asked to do, not what the API is called.
