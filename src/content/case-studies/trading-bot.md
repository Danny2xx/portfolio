---
title: "A trading bot where the risk manager has the final say"
project: "Multi-venue trading bot"
summary: "A paper-trading R&D prototype on Base. Several strategies share one interface, and no order reaches a venue without passing position, exposure, drawdown and daily-loss limits."
year: "2026"
role: "Blockchain Advisors internship"
stack: ["Python", "web3.py", "CCXT", "FastAPI", "TimescaleDB", "Prometheus"]
draft: false
---

<!-- TODO (Daniel): this was a team repo. Add one line here saying exactly which parts you owned
     (the repo history shows most commits under another name), because an interviewer who checks
     will ask. Everything below describes the system, not who wrote which file. -->

## The problem

A trading bot is easy to write and hard to trust. The dangerous version works beautifully in a backtest, then meets real fees, real slippage and a bad hour, and discovers there was never anything stopping it from losing the account.

The brief here was research, not returns: build the thing properly, with the safety rails in code, and find out what the strategies actually do.

## How it works

1. **Market data.** Prices come from DEX Screener, direct on-chain pool reads or a synthetic feed, with exchange prices available through CCXT. Whatever the source, it is normalised into one shared market state, optionally stored in TimescaleDB.
2. **Strategies behind one interface.** A rule-based range strategy, a moving-average cross and a logistic-regression model all implement the same contract, so they can be swapped and compared on equal terms.
3. **Risk checks.** Every order passes position-size, exposure, drawdown, daily-loss and total-capital caps, with a global kill switch.
4. **Paper fills.** The backtester models fees and slippage rather than assuming perfect execution.
5. **The live gate.** Real execution sits behind a gate, signing its own transactions with web3.py. Swaps were exercised on the Base Sepolia testnet.
6. **Observability.** Model inference runs as its own FastAPI service, with Prometheus metrics behind a dashboard.

## Decisions worth calling out

**The risk manager is not configuration.** Limits are enforced in code on the path every order takes, and the kill switch has a test. A limit that lives only in a config file is a limit that stops existing the moment something reads the wrong file.

**Keys are encrypted at rest.** Per-user wallet keys are encrypted with Fernet rather than sitting in environment variables.

**A gas-aware guard.** On-chain, a trade whose expected edge is smaller than its gas cost is a loss dressed as a signal, so those are skipped before they're placed.

**Coverage is enforced.** CI fails under 80% test coverage, which for a system that can move money is the floor rather than an achievement.

## What the backtests showed

These runs are on **synthetic data, 400 ticks, fixed seed**. They compare strategies against each other under identical conditions. They are not evidence that anything is profitable.

| Strategy | Return | Trades | Sharpe | Max drawdown |
|---|---|---|---|---|
| Rule-based range | +8.68% | 12 | 2.22 | 1.73% |
| Moving-average cross | −15.44% | 25 | −2.51 | 17.09% |
| ML momentum (placeholder model) | −19.44% | 52 | −2.73 | 19.44% |
| Buy and hold | +0.16% | 1 | 0.13 | 11.05% |

The honest reading: the rule-based strategy's 12 trades and 100% win rate are far too few to mean anything, and the placeholder ML model traded most and lost most. Parameter sensitivity moved the range strategy between +7.5% and +10.6%, so it isn't knife-edge, but nothing here has met a real order book.

## Limits

No mainnet trades were placed. Everything above is paper trading or testnet, on generated data, which is the appropriate stage for a ten-week research prototype and the reason the risk layer was built before the strategies got interesting.
