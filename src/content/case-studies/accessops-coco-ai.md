---
title: "AccessOps: teaching a captioning model when to ask for help"
project: "AccessOps COCO AI"
summary: "An image-captioning model that writes alt-text, improved stage by stage on MS COCO, with a confidence policy that routes the captions it can't be trusted on to a human."
year: "2026"
role: "MSc coursework"
stack: ["TensorFlow", "Keras", "MobileNetV2", "LSTM", "FastAPI", "React", "Vite"]
repo: "https://github.com/Danny2xx/accessops-coco-ai"
draft: false
---

A screen reader meets an image with no alt-text and says nothing useful. An automatic captioner fixes that, right up until it describes a photo of a dog as two men playing tennis, confidently, and nobody using the screen reader can tell.

That's the part I went after. Not "how good can the captions get", but "can the model tell which of its own captions are any good".

## The bet

If confidence correlates with quality, you don't need a great model. You need an honest one. Ship the captions it's sure about, send the rest to a person, and the system as a whole is trustworthy even when the model isn't.

Everything below is in service of testing that.

## Four training runs

The architecture is deliberately small: MobileNetV2 turns an image into 1,280 numbers, an LSTM turns those into a sentence, over a 30,000-word vocabulary capped at 30 tokens. Trained on 118,287 COCO images and 591,753 captions, tested on a held-out 2,500.

| Run | BLEU-4 |
|---|---|
| From scratch | 0.169 |
| Transfer learning | 0.219 |
| AdamW, greedy decoding | 0.231 |
| AdamW, beam search | **0.247** |
| Reinforcement learning (SCST) | 0.222 |

Each step is a real gain except the last one, which I'll come back to.

## What confidence bought

Sort the test captions by the model's own confidence and the picture changes:

- Every caption: **0.247**
- The most confident half: **0.281**
- The most confident fifth: **0.331**

The signal is real, so the routing policy works. Above 0.511 the caption ships; below it, a human sees it. That single threshold turns a mediocre captioner into a system an accessibility team can actually deploy, because its failures land in a review queue instead of on a page.

The threshold is read live and can be reloaded without redeploying, with a test covering the reload. Where the line sits is a policy decision, and policy shouldn't need an engineer.

## Three dead ends

I kept these in the report instead of quietly dropping them.

**Reinforcement learning made it worse.** Self-critical sequence training with a BLEU-4 reward landed at 0.222, below the 0.247 baseline it started from.

**Retrieval refinement did nothing.** Reusing similar training captions to polish an output moved BLEU-4 from 0.2222 to 0.2211. That's noise wearing a method's clothes.

**The attention ablation collapsed.** 0.0001. That number doesn't mean attention is a bad idea, it means my experiment was broken, and saying so is more useful than omitting the row.

<!-- TODO (Daniel): two or three sentences on WHY you think RL didn't help. Reward hacking?
     BLEU as a poor reward signal? Only one epoch? This is the question an interviewer will
     push on, and a real answer here is the strongest thing on the page. -->

## Where it breaks

The test set gives each image a single reference caption, which makes BLEU-4 harsher than the multi-reference numbers usually quoted for COCO. Read the gaps between stages, not the absolute values.

And the honest limit of the whole approach: confidence ranking tells you which captions are probably better. It doesn't tell you which ones are wrong in a way that matters, like naming the wrong number of people. That's still what the human in the loop is for.
