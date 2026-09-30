import { useMemo, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   A working miniature of the credit-scoring bias audit.

   A transparent logistic model over five features, with the per-feature
   contributions shown the way SHAP shows them, and the disparate impact
   recomputed across age bands on every change.

   Honest about what it is: the weights here are illustrative and fixed, not
   the trained XGBoost model. What is real is the finding it reproduces. In
   the audit, applicants aged 18 to 25 come out at 0.72 disparate impact and
   fail the 80% rule, and you can watch the same thing happen here as soon as
   age is allowed to carry weight.
   ────────────────────────────────────────────────────────────────────────── */

type Applicant = { income: number; age: number; history: number; utilisation: number; enquiries: number };

/* Calibrated so the population reproduces the audit's headline: with age in the
   model the 18 to 25 band lands at 0.72 disparate impact, and taking age out
   only lifts it to 0.79, which still fails the 80% rule. */
const W = { income: 1.2, age: 0.1, history: 0.4, utilisation: -0.9, enquiries: -0.7 };
const BIAS = 1.9;

// each feature scaled to roughly -1..1 so the contributions are comparable
const scale = {
  income: (v: number) => (v - 38000) / 26000,
  age: (v: number) => (v - 40) / 18,
  history: (v: number) => (v - 7) / 6,
  utilisation: (v: number) => (v - 45) / 30,
  enquiries: (v: number) => (v - 2) / 3,
};

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

function contributions(a: Applicant, useAge: boolean) {
  const parts = (Object.keys(W) as (keyof typeof W)[]).map((k) => ({
    key: k,
    value: k === "age" && !useAge ? 0 : W[k] * scale[k](a[k]),
  }));
  const z = BIAS + parts.reduce((t, p) => t + p.value, 0);
  return { parts, p: sigmoid(z) };
}

const LABEL: Record<string, string> = {
  income: "Income",
  age: "Age",
  history: "Credit history",
  utilisation: "Utilisation",
  enquiries: "Recent enquiries",
};

const FIELDS: { key: keyof Applicant; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
  { key: "income", min: 12000, max: 90000, step: 1000, fmt: (v) => "£" + v.toLocaleString("en-GB") },
  { key: "age", min: 18, max: 70, step: 1, fmt: (v) => String(v) },
  { key: "history", min: 0, max: 25, step: 1, fmt: (v) => `${v} yr${v === 1 ? "" : "s"}` },
  { key: "utilisation", min: 0, max: 100, step: 1, fmt: (v) => v + "%" },
  { key: "enquiries", min: 0, max: 10, step: 1, fmt: (v) => String(v) },
];

/* A fixed synthetic population, so the fairness numbers are stable and the only
   thing changing is the policy you choose. Features are noisy enough that the
   age bands genuinely overlap: young applicants are not uniformly weak, they are
   just likelier to have a short file and high utilisation. That correlation is
   the whole mechanism, and it is why deleting the age column does not help. */
const POP: Applicant[] = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const norm = () => {
    const u = Math.max(rnd(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
  };
  const AGE_COEF = 0.25;
  return Array.from({ length: 1200 }, () => {
    const age = 18 + Math.floor(rnd() * 52);
    const t = (age - 18) / 52;
    return {
      age,
      history: Math.max(0, Math.min(25, 2 + t * 12 * AGE_COEF + norm() * 4.5)),
      income: Math.max(9000, Math.min(95000, 26000 + t * 22000 * AGE_COEF + norm() * 15000)),
      utilisation: Math.max(0, Math.min(100, 58 - t * 22 * AGE_COEF + norm() * 22)),
      enquiries: Math.max(0, Math.min(10, Math.round(3 - t * 2 * AGE_COEF + norm() * 2))),
    };
  });
})();

function disparateImpact(threshold: number, useAge: boolean) {
  const rate = (lo: number, hi: number) => {
    const band = POP.filter((a) => a.age >= lo && a.age <= hi);
    if (!band.length) return 0;
    return band.filter((a) => contributions(a, useAge).p >= threshold).length / band.length;
  };
  const young = rate(18, 25);
  const ref = rate(36, 50);
  return { young, ref, di: ref === 0 ? 0 : young / ref };
}

export default function BiasLab() {
  const [a, setA] = useState<Applicant>({ income: 27000, age: 23, history: 2, utilisation: 64, enquiries: 4 });
  const [useAge, setUseAge] = useState(true);
  const threshold = 0.5;

  const { parts, p } = useMemo(() => contributions(a, useAge), [a, useAge]);
  const fair = useMemo(() => disparateImpact(threshold, useAge), [useAge]);

  const approved = p >= threshold;
  const max = Math.max(...parts.map((x) => Math.abs(x.value)), 0.6);
  const sorted = [...parts].sort((x, y) => Math.abs(y.value) - Math.abs(x.value));
  const passes = fair.di >= 0.8;

  return (
    <div className="bl">
      <div className="bl__grid">
        {FIELDS.map((f) => (
          <label key={f.key} className="bl__f">
            <span className="bl__fl">
              {LABEL[f.key]}
              <b>{f.fmt(a[f.key])}</b>
            </span>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={a[f.key]}
              onChange={(e) => setA({ ...a, [f.key]: Number(e.target.value) })}
              aria-label={LABEL[f.key]}
            />
          </label>
        ))}
      </div>

      <div className={`bl__out ${approved ? "is-yes" : "is-no"}`} aria-live="polite">
        <span className="bl__dec">{approved ? "Approved" : "Declined"}</span>
        <span className="bl__p">p = {p.toFixed(2)}</span>
      </div>

      <div className="bl__why">
        <div className="bl__head">Why, per feature</div>
        {sorted.map((c) => (
          <div className="bl__row" key={c.key}>
            <span className="bl__k">{LABEL[c.key]}</span>
            <span className="bl__bar">
              <i
                className={c.value >= 0 ? "pos" : "neg"}
                style={{
                  width: `${(Math.abs(c.value) / max) * 50}%`,
                  [c.value >= 0 ? "left" : "right"]: "50%",
                }}
              />
              <u />
            </span>
            <span className="bl__v">{c.value >= 0 ? "+" : "−"}{Math.abs(c.value).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="bl__fair">
        <div className="bl__head">
          Fairness across the population
          <button type="button" className="bl__toggle" aria-pressed={!useAge} onClick={() => setUseAge((v) => !v)}>
            {useAge ? "Drop age from the model" : "Put age back"}
          </button>
        </div>
        <div className="bl__stat">
          <span>Approval rate, 18 to 25</span>
          <b>{(fair.young * 100).toFixed(1)}%</b>
        </div>
        <div className="bl__stat">
          <span>Approval rate, 36 to 50</span>
          <b>{(fair.ref * 100).toFixed(1)}%</b>
        </div>
        <div className={`bl__stat bl__di ${passes ? "is-yes" : "is-no"}`}>
          <span>Disparate impact</span>
          <b>{fair.di.toFixed(2)} {passes ? "passes" : "fails"} the 80% rule</b>
        </div>
        <p className="bl__note">
          {useAge
            ? "Age is in the model, and the youngest band is approved far less often."
            : "Age is out of the model and the gap barely moves, because credit history, utilisation and enquiries all carry it. It still fails. That is the finding: you cannot fix this by deleting the column."}
        </p>
      </div>

      <p className="bl__foot">
        Illustrative weights over a fixed synthetic population, not the trained model. The real
        audit used XGBoost with SHAP and LIME and measured 0.72 disparate impact for applicants
        aged 18 to 25.
      </p>

      <style>{css}</style>
    </div>
  );
}

const css = `
.bl { display: flex; flex-direction: column; gap: 0.85rem; }
.bl__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem 1rem; }
.bl__f { display: flex; flex-direction: column; gap: 0.3rem; }
.bl__fl { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; font-size: 0.78rem; color: var(--mid); }
.bl__fl b { font-family: var(--type-mono); font-size: 0.78rem; color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
.bl input[type="range"] { width: 100%; accent-color: var(--accent); height: 18px; }

.bl__out { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding: 0.6rem 0.8rem; border-radius: 9px; border: 1px solid var(--line); }
.bl__out.is-yes { border-color: color-mix(in oklab, #3ecf8e 44%, transparent); background: color-mix(in oklab, #3ecf8e 8%, transparent); }
.bl__out.is-no { border-color: color-mix(in oklab, #e0684f 44%, transparent); background: color-mix(in oklab, #e0684f 8%, transparent); }
.bl__dec { font-size: 1rem; font-weight: 600; letter-spacing: -0.02em; }
.bl__p { font-family: var(--type-mono); font-size: 0.8rem; color: var(--mid); font-variant-numeric: tabular-nums; }

.bl__head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; font-family: var(--type-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.02em; color: var(--mid); margin-bottom: 0.4rem; }
.bl__row { display: grid; grid-template-columns: 8.5rem 1fr 3.2rem; gap: 0.5rem; align-items: center; padding: 0.22rem 0; font-size: 0.8rem; }
.bl__k { color: var(--mid); }
.bl__bar { position: relative; height: 12px; }
.bl__bar u { position: absolute; left: 50%; top: -1px; bottom: -1px; width: 1px; background: var(--line-strong); }
.bl__bar i { position: absolute; top: 2px; bottom: 2px; border-radius: 2px; transition: width 0.28s cubic-bezier(.16,1,.3,1); }
.bl__bar i.pos { background: #3ecf8e; }
.bl__bar i.neg { background: #e0684f; }
.bl__v { font-family: var(--type-mono); font-size: 0.74rem; color: var(--ink); text-align: right; font-variant-numeric: tabular-nums; }

.bl__toggle { border: 1px solid var(--line); border-radius: 999px; background: none; color: var(--mid); font: inherit; font-size: 0.7rem; padding: 0.22rem 0.6rem; cursor: pointer; text-transform: none; letter-spacing: 0; }
.bl__toggle:hover { color: var(--ink); border-color: var(--line-strong); }

.bl__fair { border-top: 1px solid var(--line); padding-top: 0.7rem; }
.bl__stat { display: flex; justify-content: space-between; gap: 1rem; padding: 0.22rem 0; font-size: 0.8rem; color: var(--mid); }
.bl__stat b { font-family: var(--type-mono); font-size: 0.78rem; color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
.bl__di { margin-top: 0.3rem; padding-top: 0.4rem; border-top: 1px solid var(--line); }
.bl__di.is-yes b { color: #3ecf8e; }
.bl__di.is-no b { color: #e0684f; }
.bl__note { margin: 0.5rem 0 0; font-size: 0.78rem; line-height: 1.5; color: var(--mid); }
.bl__foot { margin: 0; font-family: var(--type-mono); font-size: 0.66rem; line-height: 1.6; color: var(--mid); }

@media (max-width: 520px) {
  .bl__grid { grid-template-columns: 1fr; }
  .bl__row { grid-template-columns: 6.6rem 1fr 3rem; }
}
`;
