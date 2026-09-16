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

## The problem

Most images on the web have no alt-text, and a screen reader user gets nothing. An automatic captioner sounds like the fix, until you look at what it produces: some captions are accurate, some are confidently wrong, and a wrong caption is worse than none because nobody can tell it's wrong.

So the interesting question wasn't "how good can the captions be?". It was "can the system tell which of its own captions are good?".

## How it works

The model is a standard encoder-decoder, kept deliberately small so it runs cheaply:

1. **Data.** MS COCO 2017: 118,287 training images with 591,753 captions. The 5,000-image validation set is split in half into validation and test, so the test set is 2,500 images.
2. **Encoder.** MobileNetV2 pretrained on ImageNet, producing 1,280-dimension image features.
3. **Decoder.** An LSTM over a 30,000-word vocabulary, capped at 30 tokens.
4. **Training stages.** A from-scratch baseline, then transfer learning with the encoder frozen and later fine-tuned, then AdamW at 5e-5 decoded with beam search.
5. **Routing.** Every caption carries a confidence score. Above the threshold it ships; below it, the caption goes to a human to check.
6. **Serving.** A FastAPI backend that pulls the model from the Hugging Face Hub at startup, with a React frontend.

## What the numbers did

BLEU-4 on the held-out test set, stage by stage:

| Stage | BLEU-4 |
|---|---|
| From scratch | 0.169 |
| Transfer learning | 0.219 |
| AdamW fine-tuning, greedy decoding | 0.231 |
| AdamW fine-tuning, beam search | **0.247** |
| Reinforcement learning (SCST) | 0.222 |

Then the part I care about more. Ranked by the model's own confidence, the top half of captions score 0.281, and the top fifth score 0.331. The confidence signal is real, which is what makes the routing policy work: the system can hand over exactly the cases it's weakest on instead of guessing uniformly.

## Three things that didn't work

I kept these in the report rather than quietly dropping them.

**Reinforcement learning made it worse.** Self-critical sequence training with a BLEU-4 reward scored 0.222 against the 0.247 baseline.

**Retrieval refinement did nothing.** Reusing similar training captions to refine an output moved BLEU-4 from 0.2222 to 0.2211, which is noise.

**The attention ablation collapsed.** It scored 0.0001, which says the experiment was broken rather than the idea.

<!-- TODO (Daniel): two or three sentences on WHY you think RL didn't help here. Reward hacking?
     Too few epochs? BLEU as a reward being a poor proxy? This is the answer an interviewer will
     dig into, and it's the strongest thing on the page if you have a real view. -->

## Decisions worth calling out

**The threshold is configuration, not code.** The routing threshold (0.511) is read live and can be reloaded without redeploying, with a test covering the reload. An accessibility team should be able to move the auto/human line as their tolerance changes.

**The model isn't in the image.** Artifacts download from the Hugging Face Hub at startup, so the container stays small and the model can be replaced without rebuilding it.

## Limits

The test set uses a single reference caption per image, which makes BLEU-4 harsher than the multi-reference numbers usually quoted for COCO. Treat the stage-to-stage differences as the signal here, not the absolute values.
