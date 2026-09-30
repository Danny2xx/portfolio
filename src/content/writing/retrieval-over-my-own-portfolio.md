---
title: "A retriever over my own portfolio, and the two bugs in it"
description: "Hybrid search running in the browser with no API and no model download, plus the stemmer mistake that silently broke half of it."
date: 2026-09-29
---

There is a search box at the top of this site. It is a miniature of the retriever in [DocSage](/work/docsage), pointed at the portfolio itself: 59 passages generated from the same file that renders the pages.

It does not call an API and it does not download a model. Here is what is actually in it, and the two things I got wrong.

## The architecture, scaled down

**BM25** over the passages, for the lexical arm. **Character trigrams with cosine similarity**, for the fuzzy arm, which catches near misses and typos that exact terms miss. **Reciprocal rank fusion** to combine them, which is the part worth copying: RRF merges two ranked lists using only the ranks, so the two arms never have to be calibrated against each other.

```
score(d) = Σ 1 / (k + rank_i(d))
```

That is the whole fusion step. No tuning of "how much should BM25 count versus vectors", because it never compares the scores.

The answer is **extractive**. It picks the best-matching sentence from each hit and cites it. Nothing is generated, so the box cannot invent a claim about me that the site does not already make. If nothing clears the score floor it says so and quotes nothing, which is the behaviour the whole thing is named after.

## Bug one: the stemmer disagreed with itself

Query terms and passage terms go through the same tokenizer, so they should always agree. Mine did not.

"measured" hit the `ed` rule and became `measur`. "measure" matched no rule and stayed `measure`. Two forms of the same word, two different tokens, no match. Same for "site" and "sites", "live" and "lives".

The fix is to normalise past the disagreement rather than to add more rules: after suffix stripping, drop a trailing `e`. Now both land on `measur`, "code" and "coded" both land on `cod`, and I do not care that `cod` is not a word, because nothing reads these.

## Bug two: hand-written stems in a hand-written map

Recruiters type "shipped"; the page says "deployed". So there is a query expansion map, applied to the query only, never to the corpus, so an answer can still only be what the site claims.

I wrote the keys as stems, by hand:

```js
retriev: ["rag", "bm25", "vector"],   // never fires
educ:    ["msc", "bsc", "degree"],    // never fires
hire:    ["open", "full-time"],       // never fires
```

The real tokens are `retrieval`, `education` and `hir`. Roughly half the map was dead, and there is no error when this happens. Ask "what did he study?" and you get nothing back, which looks like a content problem rather than a bug.

The fix is to stop writing stems at all. Write plain words, run both sides through the same `tokenize()` at load, and the two can never drift:

```js
const EXPAND = new Map();
for (const [word, list] of Object.entries(EXPAND_WORDS)) {
  EXPAND.set(tokenize(word)[0], list.flatMap(tokenize));
}
```

## What it costs

About 40KB of inlined JSON and 3KB of logic. The index builds once during idle time, so the first question costs about 5ms rather than 25ms. There is no server, so it works offline and cannot be rate-limited.

Plenty of problems that get reached for an embedding API do not need one. Fifty-nine passages is not a vector database problem.
