import { useMemo, useState, type CSSProperties } from "react";

/* A small, real demo: how sampling temperature reshapes an LLM's next-token
   distribution. Pure client-side softmax over fixed logits. No dependencies. */

const TOKENS = [
  { t: "the", logit: 3.1 },
  { t: "a", logit: 2.4 },
  { t: "agentic", logit: 1.9 },
  { t: "neural", logit: 1.2 },
  { t: "quietly", logit: 0.6 },
  { t: "banana", logit: -1.4 },
];

function softmax(logits: number[], temp: number) {
  const t = Math.max(temp, 0.01);
  const scaled = logits.map((l) => l / t);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export default function TemperatureLab() {
  const [temp, setTemp] = useState(0.7);
  const probs = useMemo(() => softmax(TOKENS.map((x) => x.logit), temp), [temp]);
  const maxP = Math.max(...probs);

  const label =
    temp < 0.4 ? "near-deterministic" : temp < 0.9 ? "balanced" : temp < 1.4 ? "creative" : "chaotic";

  return (
    <div className="tl">
      <p className="tl__prompt">
        Next word after <q>I build</q>
      </p>

      <div className="tl__bars">
        {TOKENS.map((tok, i) => {
          const p = probs[i];
          return (
            <div className="tl__row" key={tok.t}>
              <span className="tl__tok">{tok.t}</span>
              <div className="tl__track">
                <div
                  className={`tl__fill${p === maxP ? " is-top" : ""}`}
                  style={{ transform: `scaleX(${p.toFixed(4)})` }}
                />
              </div>
              <span className="tl__pct">{(p * 100).toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      <div className="tl__ctrl">
        <div className="tl__ctrl-head">
          <label htmlFor="temp">Temperature</label>
          <span className="tl__val">
            <b>{temp.toFixed(2)}</b> {label}
          </span>
        </div>
        <input
          id="temp"
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={temp}
          style={{ "--pct": `${(temp / 2) * 100}%` } as CSSProperties}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
        />
      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
.tl { display: flex; flex-direction: column; gap: 1.05rem; }
.tl__prompt { font-size: 0.8rem; color: var(--faint); }
.tl__prompt q { color: var(--ink); quotes: "\\201C" "\\2026\\201D"; }
.tl__bars { display: flex; flex-direction: column; gap: 0.5rem; }
.tl__row { display: grid; grid-template-columns: 5rem 1fr 3.2rem; align-items: center; gap: 0.75rem; }
.tl__tok { font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink); text-align: right; }
.tl__track { height: 10px; background: var(--surface-2); border-radius: 3px; overflow: hidden; }
.tl__fill {
  width: 100%; height: 100%;
  background: color-mix(in oklab, var(--ink) 55%, transparent);
  transform-origin: left center;
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
}
.tl__fill.is-top { background: var(--primary); }
.tl__pct { font-size: 0.78rem; color: var(--muted); text-align: right; font-variant-numeric: tabular-nums; }

.tl__ctrl { border-top: 1px solid var(--border); padding-top: 1rem; }
.tl__ctrl-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; font-size: 0.8rem; margin-bottom: 0.75rem; }
.tl__ctrl-head label { color: var(--muted); }
.tl__val { color: var(--faint); }
.tl__val b { color: var(--ink); font-weight: 600; margin-right: 0.25rem; font-variant-numeric: tabular-nums; }

.tl input[type="range"] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 99px; cursor: pointer;
  background: linear-gradient(to right, var(--ink) var(--pct), var(--border-strong) var(--pct));
}
.tl input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%;
  background: var(--bg); border: 2px solid var(--ink);
}
.tl input[type="range"]::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 50%; background: var(--bg); border: 2px solid var(--ink);
}
.tl input[type="range"]:focus-visible { outline: 2px solid var(--primary); outline-offset: 6px; }

@media (prefers-reduced-motion: reduce) { .tl__fill { transition: none; } }
@media (max-width: 480px) { .tl__row { grid-template-columns: 4.2rem 1fr 3rem; gap: 0.55rem; } }
`;
