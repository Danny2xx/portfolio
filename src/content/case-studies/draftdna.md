---
title: "DraftDNA: an AI writing tool that can only cite what you gave it"
project: "DraftDNA"
summary: "An academic drafting workspace where citations are restricted to the sources you uploaded, and every claim the sources don't support is listed back to you."
year: "2026"
stack: ["Next.js", "FastAPI", "ChromaDB", "OpenAI API", "python-docx", "ReportLab"]
repo: "https://github.com/Danny2xx/draft-dna"
draft: false
---

## The problem

Ask a language model for a referenced essay and it will produce references. Some of them will be real. The failure is specific and well known: fluent text, plausible citations, sources that don't say what they're credited with saying.

For academic work that's not a rough edge, it's the whole problem. DraftDNA's answer is to make invented sources structurally impossible rather than discouraged.

## How it works

1. **Upload what the draft must obey.** Writing samples, the brief, the rubric and the approved sources, parsed from PDF, DOCX or plain text.
2. **Chunk and store.** Sources are split into 500-word chunks with 50 words of overlap and indexed in ChromaDB.
3. **Retrieve within the project.** Retrieval is filtered per project, so one assignment's sources can never leak into another's.
4. **Draft.** The model returns structured JSON: the prose, its citations, and a confidence label of high, medium or low for each one.
5. **Flag what isn't supported.** Claims the retrieved sources don't back are returned as an explicit `unsupported_claims` list rather than left in the prose.
6. **Export.** Reference lists in Harvard, APA 7 or IEEE, exported to DOCX or PDF.

## Decisions worth calling out

**The citation pool is closed.** The model can only cite chunks that came back from the user's own uploaded sources. It has nothing else to reach for, so the common failure mode is designed out instead of being caught afterwards.

**Unsupported claims are surfaced, not deleted.** A sentence the sources don't support might still be true, and it might be the student's own argument. Silently removing it would be wrong; listing it tells them exactly what to go and support.

**Confidence labels per citation.** Not every match is equally strong, and saying so is more useful than a uniform, confident-looking reference list.

**A mock mode that costs nothing.** The app runs end to end without an API key, which keeps development and demos free and means the interface can be worked on without burning tokens.

<!-- TODO (Daniel): the mock mode currently fills the quality and authenticity report with random
     values. That's fine for development, but if you demo it to anyone, make sure they know those
     numbers are placeholders, or gate that panel behind a real run. -->

## Limits

This is an early build with one substantive commit, and the source embeddings use ChromaDB's default model rather than one chosen for academic text, which is the first thing worth benchmarking.

<!-- TODO (Daniel): run a handful of real assignments through it and record what share of the
     citations you'd accept. Even "42 of 50 held up" would make this page much stronger. -->
