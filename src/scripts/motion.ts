// Site-wide motion: smooth wheel scrolling, reveal-on-enter, scroll progress.
// Content is visible by default; Base.astro adds `.motion` only when motion is allowed.
import Lenis from "lenis";

declare global {
  interface Window {
    __motion?: boolean;
    __lenis?: Lenis;
  }
}

const root = document.documentElement;
const motion = root.classList.contains("motion");
window.__motion = true;

/* ── Smooth scrolling (fine pointers only; touch keeps native momentum) ─── */
if (motion && window.matchMedia("(pointer: fine)").matches) {
  const lenis = new Lenis({ lerp: 0.11 });
  window.__lenis = lenis;
  const raf = (t: number) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // same-page anchors glide instead of jumping
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const id = decodeURIComponent(url.hash.slice(1));
    const target = id === "top" ? 0 : document.getElementById(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement | number, { offset: target === 0 ? 0 : -72, duration: 1.25 });
    history.pushState(null, "", url.hash);
  });
}

/* ── Reveal on enter ─────────────────────────────────────────────────────── */
document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) =>
  Array.from(group.children).forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i))),
);
document.querySelectorAll<HTMLElement>("[data-split]").forEach((group) =>
  group.querySelectorAll<HTMLElement>(".mask > span").forEach((line, i) => line.style.setProperty("--i", String(i))),
);

const revealables = document.querySelectorAll<HTMLElement>(
  "[data-reveal], [data-stagger], [data-split], .hl-mark:not([data-manual])",
);
if (motion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-in"));
}

/* ── Scroll progress: [data-progress] gets --p (0..1); [data-mark] children
   get .is-passed once they cross the reading line. ─────────────────────── */
const tracks = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
if (tracks.length) {
  let queued = false;
  const update = () => {
    queued = false;
    const line = window.innerHeight * 0.62;
    for (const track of tracks) {
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      track.style.setProperty("--p", p.toFixed(4));
      track.querySelectorAll<HTMLElement>("[data-mark]").forEach((m) =>
        m.classList.toggle("is-passed", m.getBoundingClientRect().top + 12 < line),
      );
    }
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
}
