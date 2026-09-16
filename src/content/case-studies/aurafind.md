---
title: "AURAFIND: the model reads, the code decides"
project: "AURAFIND"
summary: "Fragrance recommendations from plain language, where the LLM only turns a request into structured preferences and a transparent scoring function picks the products."
year: "2026"
stack: ["Next.js", "TypeScript", "Supabase", "OpenAI Responses API"]
draft: false
---

"Something warm for evenings, under £80, but I can't stand oud."

A language model understands that sentence far better than any set of dropdowns. Let it choose the bottle, though, and sooner or later it recommends one that doesn't exist, at a price it invented, with notes it made up. In a shop that's a refund and a customer who doesn't come back.

## Two jobs, one of them risky

So the model does exactly one job: turn that sentence into structured preferences against a fixed JSON schema. Budget, notes wanted, notes refused, occasion, season.

It never sees the catalogue and never picks a product. Selection happens in ordinary code over real rows, which means the system physically cannot recommend a fragrance that isn't in the database.

## How a bottle gets ranked

Each candidate is scored out of 100:

| Criterion | Weight |
|---|---|
| Budget fit | 25 |
| Notes matched | 25 |
| Style | 20 |
| Occasion | 10 |
| Season | 10 |
| Longevity and projection | 10 |

Disliked notes aren't a deduction, they're an exclusion. Someone who says "no oud" means it, and no amount of scoring well elsewhere should be able to outvote that.

Results come back grouped as best overall, budget, premium and hidden gem, each showing the reasons behind its score. That's only possible because the weights are fixed and legible: a vector similarity score would rank just as fast and explain nothing, and "explain nothing" is not an option when you're asking someone to spend £80.

## Why it runs without an API key

With no credentials, a rule-based fallback parser handles the request and a local 100-fragrance file stands in for the database. The app still works.

Partly that makes it genuinely demoable. Mostly it keeps the non-AI path honest: if the fallback rots, you find out immediately, instead of discovering during an outage that the "graceful degradation" never worked.

## What would make it better

The weights were chosen by hand and the catalogue is 100 fragrances assembled for the build. Both are fine for a prototype and neither is evidence of anything.

<!-- TODO (Daniel): if this ever goes in front of people, log which of the four picks gets clicked.
     Thirty sessions would tell you whether the weights are sensible, and "tuned the weights from
     real click data" is a much better sentence than anything above. -->
