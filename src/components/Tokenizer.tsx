import { useMemo, useState } from "react";
import { encode, decode } from "gpt-tokenizer";

/* Real cl100k_base BPE tokenizer (GPT-3.5/4), running entirely client-side.
   No API: the vocab ships with the bundle. An honest look at how an LLM sees text. */

const DEFAULT = "Tokenizers split unbelievably long words into smaller pieces.";

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
        {tokens.length === 0 && <span className="tok__empty">Tokens appear here</span>}
        {tokens.map((t, i) => (
          <span key={i} className={`tok__t c${i % 4}`} title={`#${t.id}`}>
            {showIds ? t.id : display(t.piece)}
          </span>
        ))}
      </div>

      <div className="tok__foot">
        <div className="tok__stats" aria-live="polite">
          <span><b>{tokens.length}</b> tokens</span>
          <span><b>{chars}</b> characters</span>
          <span><b>{ratio}</b> per word</span>
        </div>
        <button
          type="button"
          className="tok__toggle"
          aria-pressed={showIds}
          onClick={() => setShowIds((v) => !v)}
        >
          {showIds ? "Show text" : "Show token IDs"}
        </button>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.tok { display: flex; flex-direction: column; gap: 0.75rem; }

.tok__input {
  width: 100%; resize: vertical; min-height: 3.2rem;
  font-family: var(--font-sans); font-size: 0.95rem; line-height: 1.5;
  color: var(--ink); background: var(--bg);
  border: 1px solid var(--border-strong); border-radius: 8px; padding: 0.65rem 0.8rem;
  outline: none; transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.tok__input:focus { border-color: var(--ink); box-shadow: 0 0 0 3px var(--glow-primary); }
.tok__input::placeholder { color: var(--faint); }

.tok__viz {
  display: flex; flex-wrap: wrap; gap: 2px;
  padding: 0.7rem; min-height: 3.4rem;
  border-radius: 8px; background: var(--surface);
  font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.75;
}
.tok__empty { color: var(--faint); font-family: var(--font-sans); align-self: center; }
.tok__t { white-space: pre-wrap; border-radius: 3px; padding: 0 1px; color: var(--ink); }
/* four alternating tints so neighbouring tokens always differ */
.tok__t.c0 { background: color-mix(in oklab, var(--primary) 17%, transparent); }
.tok__t.c1 { background: color-mix(in oklab, var(--ink) 9%, transparent); }
.tok__t.c2 { background: color-mix(in oklab, var(--primary) 32%, transparent); }
.tok__t.c3 { background: color-mix(in oklab, var(--ink) 17%, transparent); }

.tok__foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem 1rem; }
.tok__stats { display: flex; flex-wrap: wrap; gap: 0.2rem 1rem; font-size: 0.8rem; color: var(--faint); }
.tok__stats b { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.tok__toggle {
  font: inherit; font-size: 0.8rem; color: var(--muted); cursor: pointer;
  background: none; border: 0; padding: 0;
  text-decoration: underline; text-decoration-color: var(--border-strong); text-underline-offset: 0.22em;
  transition: color 0.18s ease, text-decoration-color 0.18s ease;
}
.tok__toggle:hover { color: var(--ink); text-decoration-color: var(--primary); }

@media (prefers-reduced-motion: reduce) { .tok__input, .tok__toggle { transition: none; } }
`;
