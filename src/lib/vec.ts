/* ──────────────────────────────────────────────────────────────────────────
   The vector side of the retriever, shared by the search and by the map of
   the corpus that the Ask box draws.

   `mds2d` is classical multidimensional scaling: it takes the matrix of
   pairwise distances between passages and finds the 2D arrangement that
   distorts those distances least. The positions on screen are therefore real
   measurements, not a decorative scatter.
   ────────────────────────────────────────────────────────────────────────── */

export function trigrams(s: string): Map<string, number> {
  const t = " " + s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() + " ";
  const m = new Map<string, number>();
  for (let i = 0; i + 3 <= t.length; i++) {
    const g = t.slice(i, i + 3);
    m.set(g, (m.get(g) ?? 0) + 1);
  }
  return m;
}

export function cosine(a: Map<string, number>, b: Map<string, number>): number {
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

/** top eigenvector of a symmetric matrix, by power iteration */
function principal(B: number[][], iters = 240): { vec: number[]; val: number } {
  const n = B.length;
  // deterministic start, so the layout is identical on every build
  let v = Array.from({ length: n }, (_, i) => Math.sin(i * 12.9898) || 1);
  let norm = Math.hypot(...v);
  v = v.map((x) => x / norm);
  let val = 0;
  for (let it = 0; it < iters; it++) {
    const w = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const row = B[i];
      for (let j = 0; j < n; j++) s += row[j] * v[j];
      w[i] = s;
    }
    norm = Math.hypot(...w);
    if (norm < 1e-12) return { vec: v, val: 0 };
    for (let i = 0; i < n; i++) w[i] /= norm;
    val = norm;
    v = w;
  }
  return { vec: v, val };
}

/**
 * Classical MDS to two dimensions.
 * `dist(i, j)` must be a symmetric distance, zero on the diagonal.
 * Returns coordinates normalised into 0..1 on both axes.
 */
export function mds2d(n: number, dist: (i: number, j: number) => number): [number, number][] {
  if (n === 0) return [];
  if (n === 1) return [[0.5, 0.5]];

  // squared distances, double-centred: B = -0.5 * J D² J
  const D2: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = dist(i, j);
      D2[i][j] = D2[j][i] = d * d;
    }
  }
  const rowMean = D2.map((r) => r.reduce((a, b) => a + b, 0) / n);
  const grand = rowMean.reduce((a, b) => a + b, 0) / n;
  const B: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => -0.5 * (D2[i][j] - rowMean[i] - rowMean[j] + grand)),
  );

  const first = principal(B);
  // deflate, then take the next component: B' = B - λ v vᵀ
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) B[i][j] -= first.val * first.vec[i] * first.vec[j];
  }
  const second = principal(B);

  const sx = Math.sqrt(Math.max(first.val, 0));
  const sy = Math.sqrt(Math.max(second.val, 0));
  const pts: [number, number][] = first.vec.map((v, i) => [v * sx, second.vec[i] * sy]);

  // normalise into the unit square, leaving a little air at the edges
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const span = (a: number[]) => {
    const lo = Math.min(...a), hi = Math.max(...a);
    return hi - lo < 1e-9 ? [lo - 0.5, hi + 0.5] : [lo, hi];
  };
  const [x0, x1] = span(xs);
  const [y0, y1] = span(ys);
  return pts.map(([x, y]) => [
    0.04 + 0.92 * ((x - x0) / (x1 - x0)),
    0.06 + 0.88 * ((y - y0) / (y1 - y0)),
  ]);
}
