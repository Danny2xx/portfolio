---
title: "The credit model was 73% accurate and quietly used sex"
project: "Credit-scoring bias audit"
summary: "A credit-risk classifier explained with SHAP and LIME, then audited group by group. It passed on accuracy and failed the 80% rule for young applicants."
year: "2026"
role: "MSc coursework"
stack: ["Python", "XGBoost", "scikit-learn", "SHAP", "LIME", "imbalanced-learn"]
draft: false
---

Accuracy is a single number covering a thousand different people. It can be 73% while the model is systematically harder on a group inside the data, and nothing in that number will ever tell you.

So this project takes a perfectly ordinary credit model, one nobody would look at twice, and goes looking.

## What the model learned

UCI German Credit: 1,000 applicants, 20 features, labelled good or bad risk. XGBoost at 200 trees, depth 4, against the usual comparisons.

| Model | Accuracy | AUC |
|---|---|---|
| XGBoost | 73.0% | **0.764** |
| Random forest | 74.0% | 0.732 |
| Logistic regression | 65.5% | 0.656 |

Two details that decide whether the rest of the audit means anything: the split is stratified and done **before** SMOTE, so synthetic neighbours of test rows never end up in training, and the class balancing runs on the training set alone (560 of each).

Get that order wrong and you get a better-looking model and a worthless audit.

## Asking the model why

SHAP over the full test set for the global view, then per-applicant explanations turned into a plain-English rejection letter, because "declined" with no reason is the part that actually harms someone.

Then LIME, run five times with different seeds on the same applicant, to check whether the local explanation holds still. An explanation that changes every time you ask isn't an explanation, and if it's going in front of a rejected applicant you need to know that before they do.

## What it found

The model leans on **personal status and sex**: fifth most influential of 20 features, by SHAP. Nobody asked it to. It found the correlation in the data and used it.

By group:

- **Applicants aged 18 to 25**: disparate impact **0.72**, failing the 80% rule.
- Their **false positive rate is 33.3%**, against 12.8% for applicants aged 36 to 50. Young applicants get wrongly flagged as bad credit nearly three times as often.
- Mean predicted risk: **57.8%** for divorced male applicants, 36.7% for female applicants, 30.8% for single male applicants.

## The small-numbers problem

The divorced-male group has 9 people in it. The non-foreign-worker group has 6. A disparate impact ratio over 9 people is a reason to go and collect more data, not a finding to act on, and every one of those figures carries that caveat in the notebook.

The age finding is the one that survives scrutiny: the group is large enough, and the error-rate gap points the same way as the ratio.

### What to do about it

There is no clean answer, which is the point of measuring it rather than assuming it away.

**Dropping the age feature does not work.** Credit history, utilisation and enquiry count are
all proxies for it, and a gradient-boosted tree reassembles the signal from them. There is a
working demonstration of this in the Lab on this site: take age out and disparate impact moves
from 0.72 to 0.79, which still fails.

**Group-specific thresholds** would close the gap directly, and in most jurisdictions using a
protected attribute in the decision rule is exactly what you are not allowed to do. The
mechanism that fixes the metric is the mechanism the law prohibits.

**Reweighting or a fairness constraint in the objective** trades overall accuracy for a smaller
gap. That is a real trade and it belongs to whoever owns the risk appetite, not to whoever
trained the model.

**Accept and monitor** is a legitimate answer if the gap is justified by default rates and the
monitoring is real. It is also the answer everyone reaches for because it requires no work,
which is why the measurement has to be routine rather than a one-off audit.

My position: quantify it, publish it internally, and make the threshold decision explicitly at
the level where someone is accountable for it. The failure mode I have seen described most
often is not a lender choosing wrongly, it is nobody choosing at all.
