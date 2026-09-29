/* ──────────────────────────────────────────────────────────────────────────
   The retriever behind "Ask this site".

   Same shape as the one in DocSage, scaled down to a page: a lexical arm
   (BM25) and a fuzzy arm (character trigrams, cosine), fused with reciprocal
   rank fusion so neither has to be calibrated against the other. The answer is
   extractive: it can only return sentences that are already in the corpus, so
   it cannot invent a claim about Daniel that the site does not make.
   ────────────────────────────────────────────────────────────────────────── */
import type { Passage } from "./passages";
import { trigrams, cosine } from "./vec";

export type Hit = { p: Passage; score: number; bm25Rank: number; vecRank: number };
export type Stage = { name: string; detail: string; ms: number };
export type Result = {
  hits: Hit[];
  answer: string;
  trace: Stage[];
  /** corpus indices the lexical arm matched, for the map of the corpus */
  lit: number[];
  /** corpus indices that survived fusion, in the order they are cited */
  won: number[];
};

const STOP = new Set([
  "a", "an", "the", "and", "or", "but", "if", "of", "at", "by", "for", "with", "about", "into",
  "to", "from", "in", "on", "is", "are", "was", "were", "be", "been", "being", "do", "does", "did",
  "has", "have", "had", "he", "him", "his", "she", "her", "they", "them", "it", "its", "you",
  "your", "i", "me", "my", "we", "us", "our", "that", "this", "these", "those", "there", "here",
  "what", "which", "who", "whom", "when", "where", "why", "how", "can", "could", "would", "should",
  "will", "shall", "may", "might", "must", "any", "all", "some", "no", "not", "so", "than", "then",
  "ever", "than", "as", "up", "out", "over", "just", "also", "too", "very", "s", "t",
]);

/** light stemmer: enough to tie "deployed"/"deploy" and "models"/"model" together */
function stem(w: string): string {
  if (w.length <= 3) return w;
  let base = w;
  for (const suf of ["ingly", "edly", "ing", "ies", "ied", "ed", "es", "ly", "s"]) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) {
      base = w.slice(0, w.length - suf.length);
      if (suf === "ies" || suf === "ied") base += "y";
      break;
    }
  }
  // drop a trailing e so measure/measured and ship/shipped meet in the middle
  if (base.length > 3 && base.endsWith("e")) base = base.slice(0, -1);
  if (base.length > 3 && /([bdgklmnprt])\1$/.test(base)) base = base.slice(0, -1);
  return base;
}

/* Query expansion. A recruiter asks "has he shipped anything?"; the page says
   "live", "deployed", "Vercel". These are the bridges, and only the query side
   is expanded, so the corpus stays exactly what the site says.

   Written in plain words and stemmed at load, because writing the stems by hand
   is how half of them silently stopped matching. */
const EXPAND_WORDS: Record<string, string[]> = {
  ship: ["deploy", "live", "production", "vercel", "launch", "release", "shipped"],
  shipped: ["deploy", "live", "production", "vercel", "launch"],
  production: ["deploy", "live", "vercel", "ship", "prod"],
  deploy: ["live", "vercel", "production", "ship", "docker", "cloud"],
  deployment: ["deploy", "live", "vercel", "docker"],
  live: ["deploy", "production", "vercel"],
  win: ["award", "place", "winner", "hackathon", "prize", "finalist", "recognition"],
  won: ["award", "place", "winner", "hackathon", "prize", "finalist", "recognition"],
  award: ["place", "winner", "hackathon", "prize", "finalist"],
  prize: ["award", "place", "winner", "hackathon"],
  fail: ["caveat", "untested", "not", "wrong", "miss", "bad", "didn"],
  failure: ["caveat", "untested", "wrong", "miss", "bad"],
  measure: ["metric", "evaluation", "score", "benchmark", "test", "result", "number"],
  measured: ["metric", "evaluation", "score", "benchmark", "result"],
  evaluation: ["measure", "metric", "score", "test", "ragas", "benchmark"],
  metric: ["measure", "score", "result", "number", "prometheus"],
  test: ["pytest", "coverage", "ci", "evaluation"],
  recommend: ["testimonial", "reference", "says", "vouch", "recommendation"],
  recommendation: ["testimonial", "reference", "says", "recommend"],
  reference: ["recommend", "testimonial"],
  job: ["role", "engineer", "intern", "work", "employment"],
  work: ["role", "engineer", "job", "project", "build"],
  experience: ["role", "job", "engineer", "intern", "work"],
  study: ["msc", "bsc", "university", "degree", "education"],
  studies: ["msc", "bsc", "university", "degree", "education"],
  education: ["msc", "bsc", "university", "degree", "certification"],
  degree: ["msc", "bsc", "university"],
  paper: ["publication", "icacin", "research", "author"],
  research: ["paper", "icacin", "publication"],
  rag: ["retrieval", "bm25", "chromadb", "embedding", "rerank", "vector", "faiss"],
  retrieval: ["rag", "bm25", "vector", "embedding", "rerank", "chromadb", "faiss"],
  retrieve: ["rag", "bm25", "vector", "embedding", "rerank"],
  llm: ["model", "gpt", "llama", "ollama", "openai", "language"],
  team: ["collaborate", "four", "people", "hackathon", "founder"],
  lead: ["led", "own", "role", "cto", "founder"],
  contact: ["email", "linkedin", "reach"],
  hire: ["open", "full-time", "role", "available"],
  hiring: ["open", "full-time", "role", "available"],
  available: ["open", "full-time", "role", "hire"],
  fairness: ["bias", "shap", "lime", "explainable"],
  bias: ["fair", "shap", "lime", "audit", "fairness"],
  explain: ["shap", "lime", "interpret", "captum", "grad-cam", "explainable"],
  explainable: ["shap", "lime", "interpret", "captum", "grad-cam"],
  devops: ["docker", "ci", "github", "prometheus", "compose", "caddy", "ops"],
  ops: ["docker", "ci", "github", "prometheus", "compose", "caddy", "deploy"],
  mlops: ["docker", "ci", "prometheus", "pipeline", "deploy", "evaluation"],
  ci: ["github", "actions", "pytest", "ruff", "mypy", "pre-commit"],
  cloud: ["vercel", "docker", "supabase", "deploy"],
  frontend: ["react", "next.js", "astro", "interface", "web"],
  backend: ["fastapi", "api", "postgresql", "sqlalchemy", "server"],
  vision: ["opencv", "yolov8", "image", "resnet", "mobilenetv2"],
  startup: ["venture", "founder", "co-founder", "business"],
  business: ["venture", "founder", "co-founder", "price", "pitch"],
  security: ["gitleaks", "secret", "pre-commit", "private"],
};

/* stem both sides once, so a key can never drift from what tokenize() produces */
const EXPAND: Map<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const [word, list] of Object.entries(EXPAND_WORDS)) {
    const key = tokenize(word)[0];
    if (!key) continue;
    const vals = list.flatMap((v) => tokenize(v));
    m.set(key, [...new Set([...(m.get(key) ?? []), ...vals])]);
  }
  return m;
})();

function expand(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) for (const e of EXPAND.get(t) ?? []) out.add(e);
  return [...out];
}

export function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*/g) ?? [])
    .map((w) => w.replace(/^[.+#-]+|[.+#-]+$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

/* the index is built once per page, on the first query */
type Index = {
  docs: { tokens: string[]; tf: Map<string, number>; len: number; tri: Map<string, number> }[];
  df: Map<string, number>;
  avgLen: number;
};
const cache = new WeakMap<object, Index>();

function build(corpus: Passage[]): Index {
  const docs = corpus.map((p) => {
    const tokens = tokenize(`${p.title} ${p.sec} ${p.text}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { tokens, tf, len: tokens.length, tri: trigrams(`${p.title} ${p.text}`) };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = docs.reduce((a, d) => a + d.len, 0) / Math.max(docs.length, 1);
  return { docs, df, avgLen };
}

const K1 = 1.5;
const B = 0.75;

function bm25(qTokens: string[], ix: Index): number[] {
  const N = ix.docs.length;
  return ix.docs.map((d) => {
    let s = 0;
    for (const q of qTokens) {
      const f = d.tf.get(q);
      if (!f) continue;
      const n = ix.df.get(q) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (d.len / ix.avgLen))));
    }
    return s;
  });
}

function ranks(scores: number[]): number[] {
  const order = scores.map((s, i) => [s, i] as const).sort((a, b) => b[0] - a[0]);
  const r = new Array(scores.length).fill(Infinity);
  order.forEach(([s, i], pos) => { if (s > 0) r[i] = pos + 1; });
  return r;
}

const RRF_K = 60;
/* Relative, not absolute: keep what is close to the best hit, and require the
   lexical arm to have actually matched. An absolute RRF floor rejects real
   answers, because a passage ranked third still scores near the ceiling. */
const KEEP = 0.90;   // share of the top score a hit has to reach
const LEX_MAX = 24;  // and it has to place this high on the lexical arm

/** split into sentences, keeping them whole enough to read on their own */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24);
}

/** pick the sentence in a passage that best answers the query */
function bestSentence(p: Passage, qSet: Set<string>): { text: string; overlap: number } {
  const ss = sentences(p.text);
  if (ss.length === 0) return { text: p.text.trim(), overlap: 0 };
  let best = ss[0];
  let bestScore = -Infinity;
  let bestHit = 0;
  ss.forEach((s, i) => {
    const toks = tokenize(s);
    if (toks.length === 0) return;
    let hit = 0;
    const seen = new Set<string>();
    for (const t of toks) {
      if (qSet.has(t) && !seen.has(t)) { hit++; seen.add(t); }
    }
    // coverage of the query, a nudge for earlier sentences, a penalty for very long ones
    const score = hit * 2 + (hit / toks.length) * 3 - i * 0.15 - Math.max(0, toks.length - 40) * 0.02;
    if (score > bestScore) { bestScore = score; best = s; bestHit = hit; }
  });
  return { text: best, overlap: bestHit };
}

/** how many passages share any term with the query, for the live counter */
export function countMatches(query: string, corpus: Passage[]): number {
  const ix = indexOf(corpus);
  const q = expand(tokenize(query));
  if (q.length === 0) return 0;
  let n = 0;
  for (const d of ix.docs) if (q.some((t) => d.tf.has(t))) n++;
  return n;
}

function indexOf(corpus: Passage[]): Index {
  let ix = cache.get(corpus as unknown as object);
  if (!ix) { ix = build(corpus); cache.set(corpus as unknown as object, ix); }
  return ix;
}

export function search(query: string, corpus: Passage[], topK = 3): Result {
  const t0 = performance.now();
  const ix = indexOf(corpus);

  const asked = tokenize(query);
  if (asked.length === 0) return { hits: [], answer: "", trace: [], lit: [], won: [] };
  const qTokens = expand(asked);
  const trace: Stage[] = [
    { name: "tokenise", detail: `${asked.length} term${asked.length === 1 ? "" : "s"} → ${qTokens.length} expanded`, ms: performance.now() - t0 },
  ];

  let t = performance.now();
  const lexScores = bm25(qTokens, ix);
  const lexRanks = ranks(lexScores);
  const lit: number[] = [];
  lexScores.forEach((v, i) => { if (v > 0) lit.push(i); });
  trace.push({
    name: "bm25",
    detail: `${ix.docs.length} passages · ${lexScores.filter((v) => v > 0).length} matched`,
    ms: performance.now() - t,
  });

  t = performance.now();
  const qTri = trigrams(query);
  const vecScores = ix.docs.map((d) => cosine(qTri, d.tri));
  const vecRanks = ranks(vecScores);
  trace.push({
    name: "trigram",
    detail: `cosine · top ${vecScores.filter((v) => v > 0.02).length} above 0.02`,
    ms: performance.now() - t,
  });

  const fused = corpus.map((p, i) => {
    const a = lexRanks[i] === Infinity ? 0 : 1 / (RRF_K + lexRanks[i]);
    const b = vecRanks[i] === Infinity ? 0 : 1 / (RRF_K + vecRanks[i]);
    return { p, score: a + b, bm25Rank: lexRanks[i], vecRank: vecRanks[i] };
  });

  // a trigram match alone is not evidence: it will happily match any long passage
  t = performance.now();
  const lexical = fused.filter((f) => f.bm25Rank !== Infinity && f.bm25Rank <= LEX_MAX);
  if (lexical.length === 0) {
    trace.push({ name: "rrf", detail: "nothing cleared the floor", ms: performance.now() - t });
    return { hits: [], answer: "", trace, lit, won: [] };
  }
  lexical.sort((a, b) => b.score - a.score || a.bm25Rank - b.bm25Rank);

  const best = lexical[0].score;
  const qualified = lexical.filter((f) => f.score >= best * KEEP);

  // at most two passages from one section, so an answer isn't three lines of one row
  const hits: Hit[] = [];
  const perSection = new Map<string, number>();
  for (const f of qualified) {
    if (hits.length >= topK) break;
    const n = perSection.get(f.p.sec) ?? 0;
    if (n >= 2) continue;
    perSection.set(f.p.sec, n + 1);
    hits.push(f);
  }
  trace.push({ name: "rrf", detail: `fused · ${qualified.length} cleared · ${hits.length} kept`, ms: performance.now() - t });
  if (hits.length === 0) return { hits: [], answer: "", trace, lit, won: [] };

  t = performance.now();
  const qSet = new Set(qTokens);
  const picked = hits
    .map((h) => ({ h, s: bestSentence(h.p, qSet) }))
    .filter((x, i) => i === 0 || x.s.overlap > 0);

  const parts = picked.map((x, i) => {
    let text = x.s.text.replace(/\s+/g, " ").trim();
    if (!/[.!?]$/.test(text)) text += ".";
    return `${escapeHtml(text)}<button class="cite" type="button" data-cite="${escapeAttr(x.h.p.id)}" aria-label="Show source ${i + 1}">${i + 1}</button>`;
  });

  trace.push({ name: "extract", detail: `${picked.length} sentence${picked.length === 1 ? "" : "s"}, verbatim`, ms: performance.now() - t });
  const byId = new Map(corpus.map((c, i) => [c.id, i]));
  return {
    hits: picked.map((x) => x.h),
    answer: `<p>${parts.join(" ")}</p>`,
    trace,
    lit,
    won: picked.map((x) => byId.get(x.h.p.id)!).filter((i) => i !== undefined),
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}
function escapeAttr(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}
