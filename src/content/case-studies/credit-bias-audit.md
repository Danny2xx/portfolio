---
title: "Auditing a credit model that quietly used sex and age"
project: "Credit-scoring bias audit"
summary: "A credit-risk classifier explained with SHAP and LIME, then audited group by group. It passed on accuracy and failed the 80% rule for young applicants."
year: "2026"
role: "MSc coursework"
stack: ["Python", "XGBoost", "scikit-learn", "SHAP", "LIME", "imbalanced-learn"]
draft: false
---

## The problem

A credit model that is accurate overall can still be unfair to a group inside the data, and nothing in the accuracy score will tell you. The only way to know is to go looking, group by group, with the model's own explanations in hand.

This audit does that on the UCI German Credit dataset: 1,000 applicants, 20 features, labelled good or bad credit risk.

## How it works

1. **Prepare.** The dataset's category codes are decoded into readable values, then encoded for the model.
2. **Split, then balance.** A stratified 800/200 split, with SMOTE applied to the training set only, bringing it to 560 of each class.
3. **Model.** XGBoost, 200 trees at depth 4, compared against logistic regression, a decision tree and a random forest.
4. **Explain globally.** SHAP over the whole test set, to see which features carry the decision.
5. **Explain individually.** A SHAP waterfall per applicant, turned into a plain-English rejection letter.
6. **Audit.** Rejection rates, disparate impact, false positive and false negative rates and mean risk score, computed per group.

## Decisions worth calling out

**SMOTE after the split, never before.** Oversampling before splitting copies synthetic neighbours of test rows into training, and the model then scores well on data it has effectively seen. Doing it after the split costs you a nicer number and buys you a real one.

**LIME's instability was measured, not assumed.** Local explanations were generated across five random seeds to see whether they stayed consistent. An explanation that changes every time you ask it isn't an explanation, and it matters if you're putting one in front of a rejected applicant.

**Fairness metrics computed by hand.** Disparate impact, error rates by group and mean risk scores were implemented directly rather than pulled from a fairness library, which meant deciding explicitly what each one measures.

## What the audit found

The model performs reasonably: 73.0% accuracy and 0.764 AUC, against 74.0% and 0.732 for the random forest and 65.5% and 0.656 for logistic regression.

Then the group view:

- **Applicants aged 18 to 25** have a disparate impact of 0.72, which fails the 80% rule.
- Their **false positive rate is 33.3%**, against 12.8% for applicants aged 36 to 50. Young applicants are far likelier to be wrongly flagged as bad credit.
- **SHAP ranks personal status and sex fifth** of 20 features. The model leans on it, even though nobody asked it to.
- Mean predicted risk is **57.8% for divorced male applicants** and 36.7% for female applicants, against 30.8% for single male applicants.

## Limits

Some groups are tiny: the divorced-male group has 9 members and the non-foreign-worker group has 6. A disparate impact ratio computed over 9 people is a prompt to collect more data, not a finding to act on, and the audit says so wherever it applies.

<!-- TODO (Daniel): what you'd do about the age finding if this were a real lender. Drop the
     feature? Reweight? Set a group-specific threshold? Accept it and monitor? There's no clean
     answer, and having a considered one is the point of the module. -->
