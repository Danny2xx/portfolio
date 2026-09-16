---
title: "AquaSense: thirty minutes of warning"
project: "AquaSense AI"
summary: "A wastewater compliance platform that forecasts pollutant levels half an hour ahead, and keeps the compliance verdict in the rules rather than in the model."
year: "2026"
role: "Hackathon team project"
stack: ["Next.js", "Express", "FastAPI", "scikit-learn", "XGBoost", "SQLite", "Recharts"]
repo: "https://github.com/Danny2xx/AQUASENSE-AI"
demo: "https://aquasense-lake.vercel.app/dashboard"
draft: false
---

A plant discharging wastewater has consent limits it must stay under. The usual way it learns it went over one is a lab result, days later, when the water is long gone and the penalty is already earned.

Half an hour of warning changes what an operator can do about it. That's the whole product.

<!-- TODO (Daniel): one line on what you owned here. The repo has four contributors and a
     recruiter who checks will ask. Better answered up front than avoided. -->

## What the plant sends

Five-minute readings: pH, COD, BOD, TSS, ammonia, temperature, flow. The demo replays 8,640 of them as a live stream, so the dashboard behaves like a plant running now rather than a chart of last month.

From those, lag and rolling features over a two-hour window feed two different jobs:

- **Forecasters**, one per indicator, each chosen by what actually won on validation: Random Forest for COD and BOD, XGBoost for TSS, Extra Trees for ammonia and pH.
- **A breach-risk classifier**, gradient boosting, answering a different question: not "what will the number be" but "how likely is a breach in this window".

## Why the rules stay rules

The model is never allowed to declare a breach. Current compliance status is decided by comparing readings against the consent limits, full stop.

That split matters more than any accuracy figure. A breach is a regulatory fact: it has to be traceable to a reading and a limit, not to a model's opinion. Prediction is confined to the part where being early is the entire value, and where being wrong costs an operator a wasted check rather than a false compliance record.

## The part that's easy to fake

Time series makes cheating effortless. Shuffle the rows, fill gaps using statistics from the whole dataset, and you get beautiful numbers that would evaporate in production.

So: train, validation and test split strictly in time order (6,022 / 1,291 / 1,291 readings), imputation fitted on training data only, audit fields kept out of the features, and four rolling walk-forward folds instead of one lucky split.

## What the numbers say

On validation the breach classifier reaches 0.917 precision and 0.917 recall, PR-AUC 0.914, ROC-AUC 0.986, at about 0.22 false alarms a day. One breach was flagged 25 minutes before it happened.

The forecasters beat a persistence baseline, which is the only comparison worth making over a 30-minute horizon: ammonia at 2.30 MAE against persistence at 3.18, R² 0.706. The soft sensors track lab values at R² 0.91 (COD), 0.88 (BOD) and 0.97 (TSS).

## What I'd need before trusting it

The data is simulated. The validation window holds 12 breaches, so those precision and recall figures rest on a handful of events, and the test split contains no breaches at all. Walk-forward also showed the model ranking shifting between folds, exactly what you'd expect at this sample size.

The pipeline, the leakage discipline and the alerting transfer to a real plant. The scores don't, until they've met one.
