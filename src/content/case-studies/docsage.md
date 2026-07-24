---
title: "DocSage: a PDF system that cites its sources"
project: "DocSage"
summary: "A production PDF question-answering system. Upload a document, ask questions, and every answer is grounded in the source with inline citations."
year: "2025"
role: "Solo build"
stack: ["Next.js", "FastAPI", "ChromaDB", "SQLite", "sentence-transformers", "GPT-4o-mini", "SSE"]
demo: ""
repo: ""
draft: false
---

<!-- TODO (Daniel): confirm year/role above, add demo + repo links, and fill the TODO
     comments below with your real numbers and reasoning. Everything outside the comments is
     factual from the build; the comments mark where your voice/metrics make it a real case study. -->

## The problem

A language model handed a 90-page PDF will answer confidently and sometimes make things up. For anything that matters, a research paper, a contract, a report, you need two things a raw model doesn't give you: answers that come from the actual document, and a way to check them.

DocSage is my take on that. You upload a PDF, ask questions in a chat, and every answer points back to the exact place it came from.

## How it works

The system is a full-stack app: a Next.js front end and a FastAPI back end, with the retrieval pipeline running server-side.

1. **Ingest.** Text is extracted from the PDF and split into overlapping chunks.
2. **Embed locally.** Each chunk is embedded with `sentence-transformers`, on the server, with no external embedding API in the loop.
3. **Store.** The vectors go into ChromaDB for persistent storage; document metadata lives in SQLite.
4. **Retrieve.** A question is embedded the same way, and the closest chunks are pulled back as context.
5. **Answer.** The retrieved chunks and the question go to GPT-4o-mini, which answers only from that context and returns inline citations.
6. **Stream.** The answer streams back to the chat over Server-Sent Events, token by token.

## Decisions worth calling out

**Embeddings run locally, not through an API.** Chunks are embedded with a local sentence-transformers model rather than a hosted embedding endpoint.
<!-- TODO: your reasoning — cost per document? data privacy? working offline? Say it in a sentence. -->

**Answers are grounded, with citations.** The model is constrained to the retrieved context and returns citations inline, so any claim can be traced to a passage in the source. This is the whole point of the project.

**The hard part.**
<!-- TODO: the single most interesting problem you solved — chunking strategy, retrieval quality,
     aligning citations to the right span, handling large PDFs. Two or three sentences on what
     went wrong first and how you fixed it. This is the part interviewers remember. -->

## Results

Answers stay grounded in the uploaded document and carry citations for what they assert, and the pipeline persists across sessions so a document only needs indexing once.

<!-- TODO: real numbers. Anything from your evaluation scripts — retrieval accuracy / recall,
     answer latency, largest document handled, eval scores. Even rough figures land far harder
     than adjectives. -->

## Where I'd take it next

A few directions I'd build on: a reranking step over the retrieved chunks to lift answer quality, hybrid search (keyword plus vector) for queries where exact terms matter, and a formal evaluation loop with RAGAS to measure retrieval and faithfulness as the corpus grows.

<!-- TODO: swap in your own reflections here if these aren't the ones you'd pick. -->
