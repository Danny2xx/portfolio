---
title: "OPS Platform: the boring half, built first"
project: "OPS Platform"
summary: "Phase one of a manufacturing operations platform for a UK precision engineering business: a normalised schema, exact money, and a quoting API. The AI it is eventually for is deliberately not here yet."
year: "2026"
stack: ["Next.js", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "Docker"]
draft: false
---

A precision engineering shop quotes work by hand. An estimator reads a request, prices the material, guesses the labour, adds something for overhead, adds a margin, and emails a number back. Do that a hundred times a month and nobody can tell you your win rate, which customers you are cheapest for, or what you actually made on the jobs you won.

The pitch for a platform like this is always the AI: predict the price, flag the risky jobs, learn from what you won. That part is genuinely useful and it is genuinely second. A model that predicts quotes needs a table of quotes with a consistent definition of what a quote is, and most shops don't have one.

So phase one is the boring half, and that is the whole point of it.

## Money is not a float

Every monetary column is `Numeric(10, 2)` in Postgres and `Decimal` in Python, and the quote endpoint rounds explicitly at each step:

```python
TWOPLACES = Decimal("0.01")

def money(value: Decimal) -> Decimal:
    return value.quantize(TWOPLACES, rounding=ROUND_HALF_UP)

overhead_cost = money(direct_cost * (payload.overhead_pct / Decimal("100")))
subtotal_cost = money(direct_cost + overhead_cost)
total_price   = money(subtotal_cost * (Decimal("1") + (payload.margin_pct / Decimal("100"))))
```

Not a stylistic preference. A binary float cannot represent 0.10 exactly, so pennies drift, and they drift in a system whose entire output is a price you send to a customer. The rounding is specified at every step rather than at the end, so the stored subtotal and the stored total are consistent with each other and a quote can be recalculated from its own row and come out identical.

The quote row keeps each component separately — material, labour, overhead, subtotal, margin percentage, total — instead of just the final figure. That is what makes the later analysis possible: you cannot ask "are we losing on labour-heavy jobs" if all you stored was the number you emailed.

## The schema is the product

Five models: customer, material, labour rate, RFQ, quote. Foreign keys between them, enums for status, a revision number on quotes so a re-quote is a new revision rather than an overwrite, and `valid_until` because a price has an expiry date.

Alembic owns the migrations, so the schema has a history rather than being whatever shape the last developer left the database in. A loader script seeds it from CSVs, which means anyone can bring the system up with realistic data in one command instead of clicking through an empty dashboard.

The dashboard endpoint is the first thing that pays this back. Win rate, pipeline value and accepted value are single aggregate queries against that schema:

```python
win_rate_pct = Decimal(accepted_count) / Decimal(responded_count) * Decimal("100")
```

Those three numbers are exactly what the shop cannot currently answer, and they fall out of having stored quotes properly. No model required.

## What is not built

The README calls the RFQ workspace, the quote calculator and the quote history "scaffolds", and that is accurate. The Next.js pages render against the API and the shapes are right, but they are a shell, not a finished product.

There are no tests. For a system that does arithmetic on money, that is the first thing I would fix, and it is the honest reason this project sits at the bottom of the work list rather than the top.

And the AI in "AI manufacturing platform" does not exist yet. There is no price prediction, no risk flagging, no document extraction. Phase one exists so that when those arrive they have a table of consistently-priced quotes to learn from instead of a spreadsheet.

<!-- TODO (Daniel): is this still live with the client, or parked? And if it went further than
     this repo shows, say so here, because the code is all a reader can see. -->

## Why it is on this site at all

Because the part of engineering that decides whether a system survives contact with a business is usually the part with no demo. Getting the money type right and the schema normalised is not going to impress anyone in a screenshot. It is the reason the interesting version is possible later.
