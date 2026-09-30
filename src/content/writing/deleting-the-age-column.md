---
title: "Deleting the age column doesn't fix the bias"
description: "A credit model that never sees age can still reject young applicants at a different rate, because everything else it sees is a proxy for it."
date: 2026-08-22
---

The obvious fix for a model that discriminates on a protected attribute is to stop showing it the attribute. Drop the column, retrain, done.

It does not work, and it is worth understanding exactly why, because the reasoning generalises well beyond credit.

## What the audit found

I trained an XGBoost classifier on credit applications, explained it with SHAP globally and LIME locally, then measured fairness across age, sex and nationality rather than assuming it.

Applicants aged 18 to 25 came out at **0.72 disparate impact**. The four-fifths rule, the standard the EEOC uses, says a selection rate below 80% of the best-performing group is evidence of adverse impact. 0.72 fails it. Their false positive rate was 33.3% against 12.8% for applicants aged 36 to 50.

## Why removing the feature doesn't help

Age is not one column. It is smeared across every other column in the file.

A 22-year-old has a short credit history because they have not had time to build one. Higher utilisation, because their limits are lower. More recent enquiries, because people early in their financial lives open more accounts. None of those are age. All of them are *correlated with* age, and a gradient-boosted tree is extremely good at reassembling a signal from its correlates.

So the model without the age column is not fairer. It is the same model, slightly less honest, because now you cannot see the mechanism in the feature importances.

There is a working version of this on the [Lab tab](/#lab) of this site. Move the sliders, then press "drop age from the model". The disparate impact moves from 0.72 to 0.79. It still fails.

## What actually helps

Three things, none of which are deleting a column.

**Measure it.** You cannot manage a fairness problem you have not quantified, and the quantity has to be per-group selection rates, not aggregate accuracy. A model can be 92% accurate and reject a protected group at twice the rate.

**Explain it per decision.** SHAP on a single applicant tells you which features pushed that decision, which is what a regulator will ask for and what the applicant deserves. Global feature importance is not an explanation of anything that happened to a person.

**Decide what the threshold is for.** A single cutoff optimises one thing. Group-aware thresholds, reject-option classification and fairness constraints in the objective all exist, they all have costs, and choosing between them is a policy decision rather than a modelling one. Which is the real point: the fix is not in the model.

## The part I would still change

The audit reports the finding and stops. It does not implement a remediation and re-measure, and that is the honest gap. Reporting that a system is unfair is the first half of the work.
