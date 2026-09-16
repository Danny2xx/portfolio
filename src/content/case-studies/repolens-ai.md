---
title: "RepoLens: the model finds things, it doesn't get a vote"
project: "RepoLens AI"
summary: "A local-first codebase audit that pairs standard analysers with a local LLM review, then scores with fixed arithmetic so the same repository always gets the same number."
year: "2026"
stack: ["Next.js", "FastAPI", "Ollama", "qwen2.5-coder", "Zod"]
draft: false
---

"Ask an LLM to review my codebase" gives you something that reads beautifully and can't be relied on. Run it twice, get two scores. Run it on work code and you've just uploaded your employer's source to somebody else's servers.

Both problems have the same shape: the model is being asked to do a job that needs to be repeatable and private, and it is neither.

## Why the LLM doesn't score

RepoLens splits the work. The model reviews code and proposes findings. A scoring function counts them: start at 100, subtract 12 for a high-severity issue, 6 for medium, 2 for low. That's it.

The consequence is the point. Two runs over the same repository produce the same number, so you can actually tell whether a codebase improved between Tuesday and Friday. And a confidently-worded hallucination costs a few points instead of rewriting the verdict, because the model was never holding the pen.

## What it runs

1. **Unzip safely.** A zip-slip check and a size limit, since "extract whatever the user uploads" is how files end up written outside the target directory.
2. **Detect the stack**, then run what fits: npm audit, ESLint, tsc, ruff, bandit, gitleaks, with a regex fallback for secrets when gitleaks isn't installed.
3. **Review the code**: chunks of up to 160 lines, capped at 120 chunks, sent to qwen2.5-coder in Ollama at low temperature, returning structured JSON.
4. **Merge and deduplicate**, so one issue found by two tools is one finding.
5. **Score and report**: Markdown that can go straight in a pull request, plus a dashboard.

Everything runs on the machine. That's not a privacy feature bolted on, it's the only version of this tool anyone can point at code they don't own.

## Two details that matter more than they look

**Missing tools degrade instead of failing.** If ruff isn't installed, the audit continues without it. An audit tool that demands a perfectly provisioned machine is an audit tool nobody runs twice.

**Zod schemas are shared between the API and the web app**, so a change to a finding's shape breaks the build rather than silently emptying a column in the dashboard.

## What a score of 76 doesn't mean

A saved run against a third-party repository came back with 41 issues and a security score of 0, which is useful precisely because nothing softened it.

But the weights are a judgement call, not a calibrated scale. The scores rank codebases consistently against each other and against their own history. A 76 has no meaning outside this tool, and the chunk cap means a very large repository is sampled rather than read exhaustively.

<!-- TODO (Daniel): the most interesting thing RepoLens caught on a real repo, in two sentences.
     Ideally something the static analysers alone would have missed, since that's the evidence
     the LLM layer earns its place. -->
