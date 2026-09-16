---
title: "AURAFIND: the model reads the request, the code picks the product"
project: "AURAFIND"
summary: "Fragrance recommendations from plain language, where the LLM only turns a request into structured preferences and a transparent scoring function does the choosing."
year: "2026"
stack: ["Next.js", "TypeScript", "Supabase", "OpenAI Responses API"]
draft: false
---

## The problem

Let a language model recommend products directly and it will eventually recommend one that doesn't exist, or confidently describe a real product wrongly. In a shop, that's a refund and a lost customer.

The split that fixes it: use the model for the thing it's genuinely good at, understanding what someone meant, and let ordinary code handle the thing that has to be correct.

## How it works

1. **The request.** Someone describes what they want in their own words: an occasion, a budget, notes they like, notes they hate.
2. **Parse to structure.** The OpenAI Responses API returns preferences against a fixed JSON schema. With no API key, a rule-based fallback parser does the same job less precisely.
3. **Fetch the catalogue.** From Supabase, or from a local 100-fragrance file.
4. **Score in code.** Each fragrance is scored out of 100: budget 25, notes 25, style 20, and occasion, season and performance 10 each. Disliked notes remove a candidate outright.
5. **Group and explain.** Results come back as best overall, budget, premium and hidden gem, each with the reasons behind its score.

## Decisions worth calling out

**The model never picks a product.** It converts language into preferences and stops. Recommendations come from scoring real catalogue rows, so the system cannot suggest a fragrance that isn't in the database, and it cannot invent a price or a note list.

**The scoring is inspectable.** Fixed weights mean a recommendation can be explained: this scored well on notes and badly on budget. A vector similarity score would rank just as fast and explain nothing.

**It works with no credentials.** The fallback parser and local catalogue mean the app runs with no API key and no database, which makes it genuinely demoable and forces the non-AI path to stay correct.

**Dislikes are a filter, not a penalty.** Someone who says "no oud" means it. That's a hard exclusion rather than points deducted, because a high score elsewhere shouldn't be able to outvote it.

## Limits

The catalogue is 100 fragrances assembled for the build, and the weights were chosen by hand rather than fitted to anything.

<!-- TODO (Daniel): if you ever put this in front of people, log which of the four picks they click.
     Even 30 sessions would tell you whether the weights are sensible, and "tuned the weights from
     real click data" is a much better sentence than the one above. -->
