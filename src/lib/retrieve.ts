/* ──────────────────────────────────────────────────────────────────────────
   The retriever behind "Ask this site".

   Same shape as the one in DocSage, scaled down to a page: a lexical arm
   (BM25) and a fuzzy arm (character trigrams, cosine), fused with reciprocal
   rank fusion so neither has to be calibrated against the other. The answer is
   extractive: it can only return sentences that are already in the corpus, so
   it cannot invent a claim about Daniel that the site does not make.
   ────────────────────────────────────────────────────────────────────────── */
import type { Passage } from "./passages";

export type Hit = { p: Passage; score: number; bm25Rank: number; vecRank: number };

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
   is expanded, so the corpus stays exactly what the site says. */
const EXPAND: Record<string, string[]> = {
  ship: ["deploy", "live", "production", "vercel", "launch", "releas"],
  product: ["deploy", "live", "vercel", "ship"],
  deploy: ["live", "vercel", "production", "ship"],
  live: ["deploy", "production", "vercel"],
  win: ["award", "place", "winner", "hackathon", "prize", "finalist", "recogni"],
  won: ["award", "place", "winner", "hackathon", "prize", "finalist", "recogni"],
  award: ["place", "winner", "hackathon", "prize", "finalist"],
  fail: ["caveat", "untested", "not", "improv", "wrong", "miss", "bad"],
  failur: ["caveat", "untested", "improv", "wrong", "miss"],
  measur: ["metric", "eval", "score", "benchmark", "test", "result", "number"],
  eval: ["measur", "metric", "score", "test", "ragas", "benchmark"],
  metric: ["measur", "score", "result", "number"],
  recommend: ["testimoni", "reference", "say", "vouch"],
  reference: ["recommend", "testimoni"],
  job: ["role", "engineer", "intern", "work", "employ"],
  work: ["role", "engineer", "job", "project", "build"],
  experienc: ["role", "job", "engineer", "intern", "work"],
  studi: ["msc", "bsc", "university", "degre", "educ"],
  educ: ["msc", "bsc", "university", "degre"],
  degre: ["msc", "bsc", "university"],
  paper: ["publicat", "icacin", "research", "author"],
  research: ["paper", "icacin", "publicat"],
  rag: ["retriev", "bm25", "chromadb", "embed", "rerank", "vector"],
  retriev: ["rag", "bm25", "vector", "embed", "rerank", "chromadb", "faiss"],
  llm: ["model", "gpt", "llama", "ollama", "openai", "languag"],
  team: ["collabor", "four", "peopl", "hackathon", "co-found"],
  lead: ["led", "own", "role", "cto", "found"],
  contact: ["email", "linkedin", "reach"],
  hire: ["open", "full-tim", "role", "avail"],
  avail: ["open", "full-tim", "role", "hire"],
  fairnes: ["bias", "shap", "lime", "explain"],
  bias: ["fair", "shap", "lime", "audit"],
  explain: ["shap", "lime", "interpret", "captum", "grad-cam"],
  cloud: ["vercel", "docker", "gcp", "run", "deploy", "supabas"],
  frontend: ["react", "next.j", "astro", "interfac", "ui", "web"],
  backend: ["fastapi", "api", "postgresql", "server"],
  vision: ["opencv", "yolov8", "imag", "resnet", "mobilenetv2"],
  startup: ["ventur", "found", "co-found", "busines"],
  busines: ["ventur", "found", "co-found", "price", "pitch"],
};

function expand(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) for (const e of EXPAND[t] ?? []) out.add(e);
  return [...out];
}

export function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*/g) ?? [])
    .map((w) => w.replace(/^[.+#-]+|[.+#-]+$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

function trigrams(s: string): Map<string, number> {
  const t = " " + s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() + " ";
  const m = new Map<string, number>();
  for (let i = 0; i + 3 <= t.length; i++) {
    const g = t.slice(i, i + 3);
    m.set(g, (m.get(g) ?? 0) + 1);
  }
  return m;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const o = large.get(k);
    if (o) dot += v * o;
  }
  if (dot === 0) return 0;
  let na = 0, nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  return dot / Math.sqrt(na * nb);
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

export function search(query: string, corpus: Passage[], topK = 3): { hits: Hit[]; answer: string } {
  let ix = cache.get(corpus as unknown as object);
  if (!ix) { ix = build(corpus); cache.set(corpus as unknown as object, ix); }

  const asked = tokenize(query);
  if (asked.length === 0) return { hits: [], answer: "" };
  const qTokens = expand(asked);

  const lexRanks = ranks(bm25(qTokens, ix));
  const qTri = trigrams(query);
  const vecRanks = ranks(ix.docs.map((d) => cosine(qTri, d.tri)));

  const fused = corpus.map((p, i) => {
    const a = lexRanks[i] === Infinity ? 0 : 1 / (RRF_K + lexRanks[i]);
    const b = vecRanks[i] === Infinity ? 0 : 1 / (RRF_K + vecRanks[i]);
    return { p, score: a + b, bm25Rank: lexRanks[i], vecRank: vecRanks[i] };
  });

  // a trigram match alone is not evidence: it will happily match any long passage
  const lexical = fused.filter((f) => f.bm25Rank !== Infinity && f.bm25Rank <= LEX_MAX);
  if (lexical.length === 0) return { hits: [], answer: "" };
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
  if (hits.length === 0) return { hits: [], answer: "" };

  const qSet = new Set(qTokens);
  const picked = hits
    .map((h) => ({ h, s: bestSentence(h.p, qSet) }))
    .filter((x, i) => i === 0 || x.s.overlap > 0);

  const parts = picked.map((x, i) => {
    let text = x.s.text.replace(/\s+/g, " ").trim();
    if (!/[.!?]$/.test(text)) text += ".";
    return `${escapeHtml(text)}<button class="cite" type="button" data-cite="${escapeAttr(x.h.p.id)}" aria-label="Show source ${i + 1}">${i + 1}</button>`;
  });

  return { hits: picked.map((x) => x.h), answer: `<p>${parts.join(" ")}</p>` };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}
function escapeAttr(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}
