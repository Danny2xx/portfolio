---
title: "DocSage: a PDF system that cites its sources"
project: "DocSage"
summary: "A local-first PDF question-answering system. Upload a document, ask questions, and every answer is grounded in the source with inline citations and page numbers."
year: "2025"
stack: ["FastAPI", "ChromaDB", "SQLite", "sentence-transformers", "BM25", "Ollama", "SSE"]
draft: false
---

<!-- TODO (Daniel): confirm the year, add a role line if you want one, and fill the TODO
     comments below with your own reasoning and numbers. Everything outside the comments
     matches the code in the RAG PROJECT folder. -->

## The problem

A language model handed a 90-page PDF will answer confidently and sometimes make things up. For anything that matters, a research paper, a contract, a report, you need two things a raw model doesn't give you: answers that come from the actual document, and a way to check them.

DocSage is my take on that. You upload PDFs, ask questions in a chat, and every answer carries citations back to the source and page it came from.

## How it works

1. **Parse.** PyMuPDF extracts the text, pdfplumber pulls tables out intact, and pages with almost no text fall back to Tesseract OCR, so scanned documents still work.
2. **Chunk.** Text is split into 800-character chunks with 150 characters of overlap. Tables are kept whole, and document metadata gets its own chunk.
3. **Embed locally.** Chunks are embedded with `all-MiniLM-L6-v2` and stored in ChromaDB, with document records in SQLite.
4. **Retrieve two ways.** A question pulls the top 20 matches from vector search and the top 20 from BM25 keyword search, and the two lists are merged with reciprocal rank fusion.
5. **Rerank.** A MiniLM cross-encoder rescores the merged candidates and keeps the best five.
6. **Answer.** A local `llama3.2:3b` model running in Ollama answers from those passages at low temperature, citing them inline as [Source N] with page numbers, and the answer streams to the chat over Server-Sent Events.

## Decisions worth calling out

**Hybrid retrieval, not vectors alone.** Vector search finds paraphrases; BM25 finds exact terms like part numbers and names. Reciprocal rank fusion combines the two without having to calibrate their scores against each other, the same fusion idea used in the retriever from my ICACIN 2026 paper.

**Everything runs locally.** Embeddings, reranking and generation all run on the machine, with no document text sent to a hosted API.
<!-- TODO: your reasoning in a sentence. Privacy? Cost per document? Working offline? -->

**It refuses rather than guesses.** The prompt tells the model to say so when the answer isn't in the documents, instead of filling the gap.

**The hard part.**
<!-- TODO: the single most interesting problem you solved. Chunking, tables, OCR, getting
     citations onto the right page, retrieval quality? Two or three sentences on what went wrong
     first and how you fixed it. This is the part interviewers remember. -->

## Results

<!-- TODO: real numbers. scripts/evaluate.py measures latency; run it and add answer latency,
     the largest document you've indexed, or any retrieval checks. There are no saved results
     yet, so don't publish numbers until you've run it. -->

Answers stay grounded in the uploaded documents and carry citations with page numbers, and indexed documents persist across sessions.

## Where I'd take it next

A formal evaluation loop with RAGAS to measure retrieval quality and faithfulness as the document set grows, and saved benchmark runs so improvements can be shown rather than claimed.
