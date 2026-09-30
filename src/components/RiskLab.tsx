import { useMemo, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   The risk manager from the trading bot, running here.

   Every order from every strategy passes one gate: position size, total
   exposure, drawdown, daily loss, capital, and a global kill switch. Compose
   an order and watch which limit stops it.

   The checks and their order are the ones in the repo. The account state is
   an example, because there is no live account and there never was: the
   prototype is paper-only on synthetic data.
   ────────────────────────────────────────────────────────────────────────── */

type Order = { size: number; venue: string; gasGwei: number; edgeBps: number };

const ACCOUNT = {
  capital: 10000,
  openExposure: 5400,
  drawdownPct: 6.2,
  dayPnl: -310,
};

const LIMITS = {
  maxPositionPct: 10, // of capital, per order
  maxExposurePct: 70, // of capital, total
  maxDrawdownPct: 10,
  maxDailyLossPct: 5,
  minEdgeOverGasBps: 8,
};

type Check = { id: string; label: string; detail: string; pass: boolean; blocking: boolean };

function evaluate(o: Order, killed: boolean): Check[] {
  const posPct = (o.size / ACCOUNT.capital) * 100;
  const newExposure = ACCOUNT.openExposure + o.size;
  const expPct = (newExposure / ACCOUNT.capital) * 100;
  const lossPct = (Math.abs(Math.min(ACCOUNT.dayPnl, 0)) / ACCOUNT.capital) * 100;
  // gas is priced against the edge: a trade that cannot pay for itself is not a trade
  const gasCostBps = (o.gasGwei * 0.35);
  const netEdge = o.edgeBps - gasCostBps;

  return [
    {
      id: "kill",
      label: "Kill switch",
      detail: killed ? "engaged, nothing trades" : "clear",
      pass: !killed,
      blocking: true,
    },
    {
      id: "size",
      label: "Position size",
      detail: `${posPct.toFixed(1)}% of capital, limit ${LIMITS.maxPositionPct}%`,
      pass: posPct <= LIMITS.maxPositionPct,
      blocking: true,
    },
    {
      id: "exposure",
      label: "Total exposure",
      detail: `${expPct.toFixed(1)}% after this order, limit ${LIMITS.maxExposurePct}%`,
      pass: expPct <= LIMITS.maxExposurePct,
      blocking: true,
    },
    {
      id: "drawdown",
      label: "Drawdown",
      detail: `${ACCOUNT.drawdownPct.toFixed(1)}%, limit ${LIMITS.maxDrawdownPct}%`,
      pass: ACCOUNT.drawdownPct <= LIMITS.maxDrawdownPct,
      blocking: true,
    },
    {
      id: "daily",
      label: "Daily loss",
      detail: `${lossPct.toFixed(1)}% today, limit ${LIMITS.maxDailyLossPct}%`,
      pass: lossPct <= LIMITS.maxDailyLossPct,
      blocking: true,
    },
    {
      id: "gas",
      label: "Edge over gas",
      detail: `${netEdge.toFixed(1)} bps net, need ${LIMITS.minEdgeOverGasBps}`,
      pass: netEdge >= LIMITS.minEdgeOverGasBps,
      blocking: true,
    },
  ];
}

export default function RiskLab() {
  const [o, setO] = useState<Order>({ size: 600, venue: "Aerodrome", gasGwei: 18, edgeBps: 24 });
  const [killed, setKilled] = useState(false);

  const checks = useMemo(() => evaluate(o, killed), [o, killed]);
  const firstFail = checks.find((c) => !c.pass);
  const accepted = !firstFail;

  const field = (
    key: keyof Order,
    label: string,
    min: number,
    max: number,
    step: number,
    fmt: (v: number) => string,
  ) => (
    <label className="rl__f">
      <span className="rl__fl">
        {label}
        <b>{fmt(o[key] as number)}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={o[key] as number}
        onChange={(e) => setO({ ...o, [key]: Number(e.target.value) })}
        aria-label={label}
      />
    </label>
  );

  return (
    <div className="rl">
      <div className="rl__acct">
        <span>capital £{ACCOUNT.capital.toLocaleString("en-GB")}</span>
        <span>open £{ACCOUNT.openExposure.toLocaleString("en-GB")}</span>
        <span>today {ACCOUNT.dayPnl >= 0 ? "+" : "−"}£{Math.abs(ACCOUNT.dayPnl)}</span>
        <span>drawdown {ACCOUNT.drawdownPct}%</span>
      </div>

      <div className="rl__grid">
        {field("size", "Order size", 50, 3000, 50, (v) => "£" + v.toLocaleString("en-GB"))}
        {field("gasGwei", "Gas", 1, 90, 1, (v) => v + " gwei")}
        {field("edgeBps", "Expected edge", 0, 90, 1, (v) => v + " bps")}
      </div>

      <div className="rl__gate">
        {checks.map((c, i) => {
          const blocked = firstFail && i > checks.indexOf(firstFail);
          return (
            <div key={c.id} className={`rl__c ${blocked ? "is-skip" : c.pass ? "is-pass" : "is-fail"}`}>
              <span className="rl__i" aria-hidden="true">{blocked ? "·" : c.pass ? "✓" : "✕"}</span>
              <span className="rl__l">{c.label}</span>
              <span className="rl__d">{blocked ? "not reached" : c.detail}</span>
            </div>
          );
        })}
      </div>

      <div className={`rl__out ${accepted ? "is-yes" : "is-no"}`} aria-live="polite">
        <span className="rl__dec">{accepted ? "Order sent" : "Order rejected"}</span>
        <span className="rl__by">{accepted ? `${o.venue}, paper` : `stopped by ${firstFail!.label.toLowerCase()}`}</span>
      </div>

      <button type="button" className="rl__kill" aria-pressed={killed} onClick={() => setKilled((v) => !v)}>
        {killed ? "Release the kill switch" : "Pull the kill switch"}
      </button>

      <p className="rl__foot">
        The checks and their order are the ones in the repo. The account is an example: the
        prototype is paper-only on synthetic data, and no live capital ever ran through it.
      </p>

      <style>{css}</style>
    </div>
  );
}

const css = `
.rl { display: flex; flex-direction: column; gap: 0.8rem; }
.rl__acct { display: flex; flex-wrap: wrap; gap: 0.35rem 1rem; font-family: var(--type-mono); font-size: 0.72rem; color: var(--mid); font-variant-numeric: tabular-nums; }
.rl__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem 1rem; }
.rl__f { display: flex; flex-direction: column; gap: 0.3rem; }
.rl__fl { display: flex; justify-content: space-between; align-items: baseline; gap: 0.4rem; font-size: 0.76rem; color: var(--mid); }
.rl__fl b { font-family: var(--type-mono); font-size: 0.76rem; color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
.rl input[type="range"] { width: 100%; accent-color: var(--accent); height: 18px; }

.rl__gate { display: flex; flex-direction: column; }
.rl__c { display: grid; grid-template-columns: 1.1rem 8.2rem 1fr; gap: 0.5rem; align-items: baseline; padding: 0.26rem 0; font-size: 0.78rem; border-bottom: 1px solid var(--line); }
.rl__c:last-child { border-bottom: 0; }
.rl__i { font-family: var(--type-mono); }
.rl__l { color: var(--ink); }
.rl__d { font-family: var(--type-mono); font-size: 0.7rem; color: var(--mid); font-variant-numeric: tabular-nums; }
.rl__c.is-pass .rl__i { color: #3ecf8e; }
.rl__c.is-fail .rl__i { color: #e0684f; }
.rl__c.is-fail .rl__d { color: #e0684f; }
.rl__c.is-skip { opacity: 0.4; }

.rl__out { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding: 0.6rem 0.8rem; border-radius: 9px; border: 1px solid var(--line); }
.rl__out.is-yes { border-color: color-mix(in oklab, #3ecf8e 44%, transparent); background: color-mix(in oklab, #3ecf8e 8%, transparent); }
.rl__out.is-no { border-color: color-mix(in oklab, #e0684f 44%, transparent); background: color-mix(in oklab, #e0684f 8%, transparent); }
.rl__dec { font-size: 0.95rem; font-weight: 600; letter-spacing: -0.02em; }
.rl__by { font-family: var(--type-mono); font-size: 0.74rem; color: var(--mid); }

.rl__kill { align-self: flex-start; border: 1px solid var(--line); border-radius: 999px; background: none; color: var(--mid); font: inherit; font-size: 0.74rem; padding: 0.3rem 0.75rem; cursor: pointer; }
.rl__kill:hover { color: var(--ink); border-color: var(--line-strong); }
.rl__kill[aria-pressed="true"] { color: #e0684f; border-color: color-mix(in oklab, #e0684f 50%, transparent); }

.rl__foot { margin: 0; font-family: var(--type-mono); font-size: 0.66rem; line-height: 1.6; color: var(--mid); }

@media (max-width: 560px) {
  .rl__grid { grid-template-columns: 1fr; }
  .rl__c { grid-template-columns: 1rem 7rem 1fr; }
}
`;
