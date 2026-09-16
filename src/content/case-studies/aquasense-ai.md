---
title: "AquaSense: predicting a compliance breach before it happens"
project: "AquaSense AI"
summary: "A wastewater compliance platform that forecasts pollutant levels 30 minutes ahead and separates what the rules say from what the model predicts."
year: "2026"
role: "Hackathon team project"
stack: ["Next.js", "Express", "FastAPI", "scikit-learn", "XGBoost", "SQLite", "Recharts"]
repo: "https://github.com/Danny2xx/AQUASENSE-AI"
demo: "https://aquasense-lake.vercel.app/dashboard"
draft: false
---

## The problem

A plant discharging wastewater has consent limits it must stay under. The usual way you find out you breached one is afterwards, from a lab result. By then the discharge has happened and the penalty is already earned.

The useful system isn't one that tells you that you're over the limit. It's one that tells you that you're about to be, while there's still time to do something.

<!-- TODO (Daniel): one line on what you personally owned on this team, since the repo has four
     contributors. Recruiters will ask, and it's better answered up front. -->

## How it works

1. **The stream.** 8,640 five-minute sensor readings are replayed as a live feed, so the dashboard behaves like a plant running in real time.
2. **Features.** Lag and rolling features are built over a 120-minute buffer, which the pipeline needs at least 25 readings to fill.
3. **Forecasts.** Separate models per indicator, chosen by what won on validation: Random Forest for COD and BOD, XGBoost for TSS, Extra Trees for ammonia and pH, each predicting 30 minutes ahead.
4. **Breach risk.** A gradient-boosting classifier scores how likely a breach is in that window.
5. **The rules stay rules.** Current compliance status is decided by checking readings against the consent limits, not by the model.
6. **The output.** Graded alerts and reports stored in SQLite, plus drought context pulled from a public weather archive, on a Next.js dashboard.

## Decisions worth calling out

**Rules decide, models predict.** A model is allowed to say "this is heading for a breach". It is never allowed to say "this is a breach". That split keeps the compliance record defensible: anything reported as a breach can be traced to a consent limit and a reading, and the model's job is confined to the part where being early matters.

**The split is chronological, and the imputation is fitted on training data only.** Time series makes leakage easy: shuffle the rows, fill gaps using statistics from the whole set, and you get beautiful numbers that mean nothing. Train, validation and test are 6,022 / 1,291 / 1,291 readings in time order, and the audit fields are kept out of the features.

**Validated walk-forward, not just once.** Four rolling folds, alongside an incident holdout, because a single split on a stream this small will flatter whichever model got the easy window.

## Results

On validation, the breach classifier reaches 0.917 precision and 0.917 recall, a PR-AUC of 0.914 and a ROC-AUC of 0.986, at roughly 0.22 false alarms per day. One breach was flagged 25 minutes before it happened.

The forecasters hold up against a persistence baseline, which is the honest comparison for a short horizon: ammonia scores 2.30 MAE on test against 3.18 for persistence, with an R² of 0.706. The soft sensors track lab values closely, at R² 0.91 for COD, 0.88 for BOD and 0.97 for TSS.

## Limits

This runs on simulated plant data, and the numbers should be read with that in mind. The validation window contains only 12 breaches, so the classifier's precision and recall rest on a handful of events, and the test split contains no breach windows at all. Walk-forward also showed the ranking between candidate models moving between folds, which is what you'd expect at this sample size.

What that means in practice: the pipeline, the leakage discipline and the alerting are the transferable parts. The headline scores would need a real plant's data before anyone should trust them.
