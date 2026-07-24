import { useMemo, useState } from "react";

/* A small, real demo: how sampling temperature reshapes an LLM's next-token
   distribution. Pure client-side softmax over fixed logits. Interactive,
   illustrative, no dependencies. */

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
      <div className="tl__bars">
        {TOKENS.map((tok, i) => {
          const p = probs[i];
          return (
            <div className="tl__row" key={tok.t}>
              <span className="tl__tok mono">{tok.t}</span>
              <div className="tl__track">
                <div
                  className="tl__fill"
                  style={{
                    width: `${(p * 100).toFixed(1)}%`,
                    opacity: 0.45 + (p / maxP) * 0.55,
                  }}
                />
              </div>
              <span className="tl__pct mono">{(p * 100).toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      <div className="tl__ctrl">
        <div className="tl__ctrl-head">
          <label htmlFor="temp" className="mono">temperature</label>
          <span className="tl__val mono">{temp.toFixed(2)} · {label}</span>
        </div>
        <input
          id="temp"
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
        />
      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
.tl { display: flex; flex-direction: column; gap: 1.1rem; }
.tl__bars { display: flex; flex-direction: column; gap: 0.55rem; }
.tl__row { display: grid; grid-template-columns: 5.5rem 1fr 3.4rem; align-items: center; gap: 0.7rem; }
.tl__tok { font-size: 0.82rem; color: var(--ink); text-align: right; }
.tl__track { height: 14px; background: color-mix(in oklab, var(--bg) 55%, transparent); border: 1px solid var(--border); border-radius: 5px; overflow: hidden; }
.tl__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-hi));
  box-shadow: 0 0 12px var(--glow-primary);
  border-radius: 4px;
  transition: width 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.32s ease;
}
.tl__pct { font-size: 0.74rem; color: var(--muted); text-align: right; }

.tl__ctrl { border-top: 1px solid var(--border); padding-top: 1rem; }
.tl__ctrl-head { display: flex; justify-content: space-between; font-size: 0.74rem; letter-spacing: 0.04em; margin-bottom: 0.6rem; }
.tl__ctrl-head label { color: var(--faint); text-transform: uppercase; }
.tl__val { color: var(--accent); }

.tl input[type="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 99px;
  background: linear-gradient(90deg, var(--primary), var(--accent)); cursor: pointer; }
.tl input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%;
  background: var(--ink); border: 3px solid var(--bg); box-shadow: 0 0 0 1px var(--border-strong), 0 4px 10px -2px var(--glow-primary); }
.tl input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--ink);
  border: 3px solid var(--bg); box-shadow: 0 0 0 1px var(--border-strong); }
.tl input[type="range"]:focus-visible { outline: 2px solid var(--primary); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) { .tl__fill { transition: none; } }
@media (max-width: 480px) { .tl__row { grid-template-columns: 4.4rem 1fr 3rem; } }
`;
