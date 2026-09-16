---
title: "RepoLens: letting an LLM find issues but never set the score"
project: "RepoLens AI"
summary: "A local-first codebase audit that combines standard analysers with a local LLM review, then scores deterministically so the same repository always gets the same result."
year: "2026"
stack: ["Next.js", "FastAPI", "Ollama", "qwen2.5-coder", "Zod"]
draft: false
---

## The problem

"Ask an LLM to review my codebase" produces something that reads well and can't be relied on. Run it twice and the score moves. Run it on a codebase you can't share and you've just uploaded your employer's source to someone else's servers.

RepoLens takes the useful half of that idea and puts guardrails around it: the model helps find issues, and something deterministic decides what they're worth.

## How it works

1. **Upload.** A codebase ZIP, extracted with a zip-slip check and a size limit, because "unzip whatever the user sends" is how you get files written outside the target directory.
2. **Detect the stack.** A file scan works out what the project is before deciding what to run against it.
3. **Run the real analysers.** npm audit, ESLint, tsc, ruff, bandit and gitleaks, with a regex fallback for secrets when gitleaks isn't available.
4. **LLM review.** Code is chunked (up to 160 lines per chunk, capped at 120 chunks) and reviewed by qwen2.5-coder running locally in Ollama at low temperature, returning structured JSON.
5. **Merge and deduplicate.** The same issue found by two tools becomes one finding.
6. **Score, deterministically.** Start at 100 and subtract 12, 6 or 2 per high, medium or low finding. Then a Markdown report and a dashboard.

## Decisions worth calling out

**The LLM proposes, the score engine disposes.** The model never emits a number. It contributes findings, which are then counted by fixed arithmetic. That's what makes two runs of the same repository comparable, and it means a confidently-worded hallucination costs a few points rather than rewriting the verdict.

**Everything runs locally.** Ollama means the code being audited never leaves the machine, which is the only version of this tool someone can point at work code.

**Missing tools degrade, they don't fail.** If ruff or gitleaks isn't installed, the audit continues without that signal instead of collapsing. An audit tool that only runs on a perfectly provisioned machine doesn't get run.

**One schema, both sides.** Zod schemas are shared between the API and the web app, so a change to a finding's shape breaks the build rather than the dashboard.

## What it produces

Scores per dimension, a deduplicated issue list, and a Markdown report that can go in a pull request. A saved run against a third-party repository returned 41 issues and a security score of 0, which is the kind of result that's useful precisely because nothing softened it.

There are 44 tests across the API.

<!-- TODO (Daniel): the most interesting finding RepoLens caught on a real repo, in two sentences.
     Ideally something the static analysers alone would have missed. That's the proof the LLM
     layer earns its place. -->

## Limits

The chunk cap means very large repositories are sampled rather than exhaustively reviewed, and the scoring weights are a judgement call rather than a calibrated scale: they rank codebases consistently, but a score of 76 has no meaning beyond this tool.
