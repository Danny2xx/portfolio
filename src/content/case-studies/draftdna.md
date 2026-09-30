---
title: "DraftDNA: you can't cite what you didn't upload"
project: "DraftDNA"
summary: "An academic drafting workspace where the citation pool is closed by design, and every claim the sources don't support comes back as a list."
year: "2026"
stack: ["Next.js", "FastAPI", "ChromaDB", "OpenAI API", "python-docx", "ReportLab"]
repo: "https://github.com/Danny2xx/draft-dna"
draft: false
---

Ask a language model for a referenced essay and it will produce references. Some will be real. Some will be real papers credited with things they never said. A few will be neither.

For academic work that isn't a rough edge to be sanded down later, it's the entire problem. Every other feature is worthless if the citations can't be trusted.

## Closing the pool

The fix isn't a better prompt. It's making the failure structurally impossible: the model can only cite chunks that came back from the sources the writer uploaded, and retrieval is filtered per project so one assignment's reading list can never leak into another's.

There is nothing else in reach. It cannot invent a paper because it has no mechanism for referring to one that isn't in the index.

## What it hands back

The draft returns as structured JSON, not prose, which lets the app do three things a wall of text can't:

- **Tag every citation** high, medium or low confidence, because not every retrieved match is equally strong and pretending otherwise is how a weak source ends up looking authoritative.
- **List the unsupported claims** separately. This is the part I'd defend hardest: a sentence the sources don't back might still be true, and it might be the student's own argument. Deleting it silently would be wrong. Naming it tells them exactly what to go and support.
- **Format the references** in Harvard, APA 7 or IEEE, out to DOCX or PDF.

## Running it for free

There's a mock mode that drives the whole application end to end with no API key, so the interface can be built and demoed without burning tokens. Useful, and the reason for the warning below.

**A caveat that matters if you see this demoed.** Mock mode is the default, and in mock mode
the quality and authenticity panel is filled with random values. It is fine for developing the
interface and it is meaningless as a result. Any number on that panel that did not come from a
real run against real sources is a placeholder, and I would rather say that here than have
someone read it as an evaluation.

## Where it is now

One substantive commit, and the source embeddings use ChromaDB's default model rather than one picked for academic prose. That's the first thing worth benchmarking, because retrieval quality sets the ceiling on everything above it.

### The evaluation that is missing

The structural argument is strong: the model cannot cite a paper that is not in the index,
because it has no mechanism for referring to one. What is not established is how *useful* the
citations are when they are real.

The measurement is obvious and has not been done: run a set of real assignments through it and
record how many citations hold up as-is. "41 of 50 held up" would say more about this system
than any description of its architecture, including this one.
