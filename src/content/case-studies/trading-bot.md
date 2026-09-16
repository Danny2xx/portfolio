---
title: "A trading bot built back to front"
project: "Multi-venue trading bot"
summary: "A paper-trading R&D prototype on Base. The risk manager and the kill switch were built before the strategies got interesting, which is the only order that works."
year: "2026"
role: "Blockchain Advisors internship"
stack: ["Python", "web3.py", "CCXT", "FastAPI", "TimescaleDB", "Prometheus"]
draft: false
---

<!-- TODO (Daniel): this was a team repo and most commits are under another name. One line here
     saying which parts you owned. Everything below describes the system, not its authorship. -->

Most trading bots are written in the exciting order: strategy first, risk controls bolted on once real money is involved. That order is how accounts die, because the safety layer arrives after the habits have formed around not having one.

This one was built the other way round.

## Where the limits live

Every order, from every strategy, passes through one risk manager: position size, total exposure, drawdown, daily loss, total capital, plus a global kill switch with a test covering it.

Not in a config file, in the code path. A limit that lives only in configuration stops existing the moment something loads the wrong file, and on-chain there is no support line to call afterwards.

Around that:

- **Keys encrypted at rest** with Fernet, per user, rather than sitting in environment variables.
- **A gas-aware guard** that skips trades whose expected edge is smaller than the gas to execute them. On-chain, that trade is a loss wearing a signal's clothes.
- **Startup reconciliation**, because a bot that restarts with a stale idea of its own positions is worse than one that's switched off.
- **CI failing under 80% coverage**, which for software that can move money is a floor, not an accomplishment.

## One contract, three strategies

A rule-based range strategy, a moving-average cross and a logistic-regression model all implement the same interface, so they can be swapped and compared on identical conditions. Market data arrives from DEX Screener, on-chain pool reads or a synthetic feed and is normalised into one shape before any strategy sees it.

Execution runs on Base through Aerodrome with a Uniswap v3 fallback, behind a live gate, signing with web3.py. Swaps were exercised on the Sepolia testnet. No mainnet trades were placed.

## What the backtests actually showed

On **synthetic data, 400 ticks, one fixed seed**:

| Strategy | Return | Trades | Sharpe | Max drawdown |
|---|---|---|---|---|
| Rule-based range | +8.68% | 12 | 2.22 | 1.73% |
| Moving-average cross | −15.44% | 25 | −2.51 | 17.09% |
| ML momentum (placeholder) | −19.44% | 52 | −2.73 | 19.44% |
| Buy and hold | +0.16% | 1 | 0.13 | 11.05% |

Here's the honest reading, and it's the reason the table is on the page at all: **+8.68% over 12 trades with a 100% win rate is not a strategy, it's an anecdote.** Twelve trades on generated data is far too small a sample to conclude anything, and a 100% win rate is a warning sign rather than a selling point. What the table does establish is that the harness works, that fees and slippage are modelled, and that the placeholder ML model traded the most and lost the most, which is exactly what a placeholder should be allowed to do before anyone trusts it.

Parameter sensitivity moved the range strategy between +7.5% and +10.6%, so it isn't balanced on a knife edge. That's the most that can be said.

## What I'd fix first

Real market data instead of synthetic, and enough trades for the numbers to mean something. Until then the interesting output of this project isn't a return figure, it's the risk layer, and the fact that it was there first.
