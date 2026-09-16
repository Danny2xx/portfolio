---
title: "DocSage: every answer points at a page"
project: "DocSage"
summary: "A local-first PDF question-answering system with hybrid retrieval, cross-encoder reranking, and citations back to the page the answer came from."
year: "2025"
stack: ["FastAPI", "ChromaDB", "SQLite", "sentence-transformers", "BM25", "Ollama", "SSE"]
draft: false
---

Hand a language model a 90-page PDF and it will answer anything you ask, immediately, in a confident voice, whether or not the document says so.

For a contract, a paper or a compliance report, "sounds right" is worthless. You need the sentence and you need to know which page it came from, so you can go and check.

## What goes wrong with one retriever

Vector search finds paraphrases. Ask about "termination" and it surfaces the clause about ending the agreement, which keyword search would have missed.

It is also the reason people distrust these systems, because it cheerfully misses exact strings. Search for a part number, a standard like EN 388, or a surname, and the nearest-neighbour match is often a passage that's merely *about* the same topic. BM25 nails those and misses the paraphrases.

So DocSage runs both and merges them with reciprocal rank fusion: a passage ranked well by either method gets promoted, and no calibration between two incomparable score scales is needed. It's the same fusion idea as the retriever in the ICACIN 2026 paper I co-authored, which is where I'd argue about it at more length.

A cross-encoder then rescores the merged candidates and keeps the best five. Fusion decides what's worth a second look; the reranker decides what actually goes to the model.

## The pipeline

1. **Parse.** PyMuPDF for text, pdfplumber to pull tables out intact, Tesseract OCR for pages that come back nearly empty, so scanned documents still answer.
2. **Chunk.** 800 characters with 150 of overlap. Tables stay whole, because a table cut in half is worse than no table, and document metadata gets a chunk of its own.
3. **Embed.** all-MiniLM-L6-v2 into ChromaDB, with document records in SQLite.
4. **Retrieve.** Top 20 by vector, top 20 by BM25, fused, reranked to 5.
5. **Answer.** llama3.2:3b in Ollama at temperature 0.1, streaming over SSE, citing each claim as [Source N] with its page.

Nothing leaves the machine: embeddings, reranking and generation all run locally.

<!-- TODO (Daniel): one line on why local matters to you here. Cost per document? Confidential
     files? Working on a train? Pick the real reason. -->

## Why it refuses

The prompt tells the model to say the documents don't cover it rather than fill the gap. A system that answers everything is indistinguishable from one that's guessing, and the refusals are what make the answers worth anything.

## What isn't measured yet

There are no saved evaluation results. `scripts/evaluate.py` measures latency but nothing has been recorded, so there's no honest number to put on this page yet.

<!-- TODO (Daniel): run it, and add three figures: median answer latency, the largest document
     you've indexed, and how many of 20 test questions it refused correctly. That last one is the
     number that proves the paragraph above. -->

Two loose ends worth fixing while you're in there: `rank_bm25` and `pdfplumber` are imported but missing from `requirements.txt`, so a clean install won't run.
