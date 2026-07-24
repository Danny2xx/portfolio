import { useMemo, useState } from "react";
import { encode, decode } from "gpt-tokenizer";

/* Real cl100k_base BPE tokenizer (GPT-3.5/4), running entirely client-side.
   No API — the vocab ships with the bundle. Honest demo of how an LLM sees text. */

const DEFAULT = "Daniel builds AI systems that actually ship.";

// visible glyphs for whitespace so token boundaries read clearly
function display(piece: string) {
  return piece.replace(/\n/g, "↵\n").replace(/\t/g, "⇥");
}

export default function Tokenizer() {
  const [text, setText] = useState(DEFAULT);
  const [showIds, setShowIds] = useState(false);

  const tokens = useMemo(() => {
    if (!text) return [] as { id: number; piece: string }[];
    try {
      return encode(text).map((id) => ({ id, piece: decode([id]) }));
    } catch {
      return [];
    }
  }, [text]);

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const ratio = words ? (tokens.length / words).toFixed(2) : "0";

  return (
    <div className="tok">
      <div className="tok__bar">
        <span className="tok__model mono">
          <span className="tok__dot" aria-hidden="true" />cl100k_base
        </span>
        <span className="tok__note mono">runs in your browser · no API</span>
      </div>

      <textarea
        className="tok__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={2}
        aria-label="Text to tokenize"
        placeholder="Type anything…"
      />

      <div className="tok__viz" aria-hidden="true">
        {tokens.length === 0 && <span className="tok__empty">tokens appear here…</span>}
        {tokens.map((t, i) => (
          <span key={i} className={`tok__t c${i % 5}`} title={`#${t.id}`}>
            {showIds ? t.id : display(t.piece)}
          </span>
        ))}
      </div>

      <div className="tok__foot">
        <div className="tok__stats mono">
          <span><b>{tokens.length}</b> tokens</span>
          <span><b>{chars}</b> chars</span>
          <span><b>{ratio}</b> tok/word</span>
        </div>
        <button
          type="button"
          className="tok__toggle mono"
          aria-pressed={showIds}
          onClick={() => setShowIds((v) => !v)}
        >
          {showIds ? "show text" : "show IDs"}
        </button>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.tok { display: flex; flex-direction: column; gap: 0.85rem; }
.tok__bar { display: flex; align-items: center; justify-content: space-between; font-size: 0.68rem; }
.tok__model { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--ink); letter-spacing: 0.02em; }
.tok__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--good); box-shadow: 0 0 7px var(--good); }
.tok__note { color: var(--faint); letter-spacing: 0.02em; }

.tok__input {
  width: 100%; resize: vertical; min-height: 3.2rem;
  font-family: var(--font-sans); font-size: 0.95rem; line-height: 1.5;
  color: var(--ink); background: var(--bg);
  border: 1px solid var(--border); border-radius: 10px; padding: 0.7rem 0.85rem;
  outline: none; transition: border-color 0.18s ease;
}
.tok__input:focus { border-color: var(--primary); }
.tok__input::placeholder { color: var(--faint); }

.tok__viz {
  display: flex; flex-wrap: wrap; gap: 2px;
  padding: 0.7rem; min-height: 3.4rem;
  border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface);
  font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.7;
}
.tok__empty { color: var(--faint); font-family: var(--font-sans); align-self: center; }
.tok__t {
  white-space: pre-wrap; border-radius: 4px; padding: 1px 1px;
  color: var(--ink);
  transition: background 0.15s ease;
}
/* five theme-aware tints so adjacent tokens are distinguishable */
.tok__t.c0 { background: color-mix(in oklab, var(--primary) 16%, transparent); }
.tok__t.c1 { background: color-mix(in oklab, var(--accent) 20%, transparent); }
.tok__t.c2 { background: color-mix(in oklab, var(--good) 16%, transparent); }
.tok__t.c3 { background: color-mix(in oklab, var(--primary) 30%, transparent); }
.tok__t.c4 { background: color-mix(in oklab, oklch(0.6 0.15 330) 18%, transparent); }

.tok__foot { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.tok__stats { display: flex; gap: 1rem; font-size: 0.72rem; color: var(--muted); }
.tok__stats b { color: var(--ink); font-weight: 600; }
.tok__toggle {
  font-size: 0.72rem; color: var(--muted); cursor: pointer;
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 7px; padding: 0.32rem 0.6rem;
  transition: color 0.18s ease, border-color 0.18s ease;
}
.tok__toggle:hover { color: var(--ink); border-color: var(--primary); }

@media (prefers-reduced-motion: reduce) { .tok__t, .tok__input, .tok__toggle { transition: none; } }
`;
