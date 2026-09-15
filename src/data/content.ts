/* ──────────────────────────────────────────────────────────────────────────
   SINGLE SOURCE OF TRUTH for all site content. Sourced from Daniel's CV.
   Editing here updates the whole site; no component changes needed.
   ────────────────────────────────────────────────────────────────────────── */

export const profile = {
  name: "Daniel Iyalekhue",
  title: "AI / Software Engineer",
  headline: "I build AI that has to work after the demo.",
  wordmark: "DANIEL",
  status: "Open to work",
  available: true,
  location: "Birmingham, UK",
  email: "danieliyalekhue@gmail.com",
  // TODO: drop your CV at public/cv.pdf, then set this to "/cv.pdf" to show the button
  cvUrl: null as string | null,
  links: {
    github: "https://github.com/Danny2xx",
    linkedin: "https://www.linkedin.com/in/daniel-iyalekhue-3a48121b8/",
  },
  // bio paragraphs — **double-asterisks** render as emphasized inline text
  bio: [
    "That means engineering the whole path from raw data to a useful decision: **retrieval, evaluation, predictive models, APIs and the interface around them**.",
  ],
};

/* ── About me / My Journey (narrative, shown atop the About tab) ──────────── */
export const journey: string[] = [
  "I started out in full-stack web development. Client websites, turning Figma files into responsive interfaces, and the analytics and performance work that comes with shipping to real users.",
  "Then I moved toward data and AI. A mentored data-science programme first, then applied AI/ML engineering: LLM tools, RAG systems, and NLP pipelines that turn live data into something useful.",
  "Now I'm finishing an MSc in Artificial Intelligence at Birmingham City University, focused on deep learning, NLP and explainable AI. What I care about is practical AI. Systems that are well engineered, easy to use, and tied to a real outcome.",
];

/* ── Experience ──────────────────────────────────────────────────────────── */
export type Job = { range: string; role: string; org: string; place?: string; note: string };

export const experience: Job[] = [
  {
    range: "2026 — NOW",
    role: "Software / AI Engineer (Placement)",
    org: "Blockchain Technology Ltd",
    place: "UK",
    note: "Engineering production software and AI features, with an emphasis on maintainable APIs, reliable integrations and shipping usable product increments.",
  },
  {
    range: "2024 — NOW",
    role: "AI / ML Engineer",
    org: "Carril Agency",
    place: "Dubai (Remote)",
    note: "Built an AI reporting-automation pipeline (LangChain + OpenAI over Google/Meta Ads & GA4) on a FastAPI backend, plus an NLP competitor-analysis tool (BERTopic, spaCy) and a RAG brand-content generator.",
  },
  {
    range: "2025",
    role: "Data Science Intern",
    org: "Amdari",
    place: "Remote, UK",
    note: "Built and evaluated ML pipelines (XGBoost, Random Forest, SHAP, LSTM) for churn, HR attrition and predictive maintenance, then turned the results into business recommendations with Streamlit and Power BI.",
  },
  {
    range: "2023 — 24", // TODO: confirm exact dates for the Web Developer role
    role: "Web Developer",
    org: "Carril Agency",
    place: "Dubai (Remote)",
    note: "Built and maintained client Webflow sites with custom JavaScript, GA4/Meta Pixel integrations and Core Web Vitals improvements; translated Figma designs into responsive experiences.",
  },
];

/* ── Awards / recognition ────────────────────────────────────────────────── */
export type Award = {
  place: string;
  event: string;
  detail?: string;
  year: string;
  href?: string;
  proof?: string;
};

export const awards: Award[] = [
  {
    place: "1st place",
    event: "AI @ BCU Day AI Hackathon",
    detail:
      "Apex Mind took first prize in a six-team challenge with 20 BCU students at STEAMhouse.",
    year: "19 JUN 2026",
    href:
      "https://www.linkedin.com/posts/faisal-saeed-2a6b20135_we-are-delighted-to-share-that-we-successfully-activity-7474840615675998209-rxoD",
    proof: "/awards/ai-at-bcu-day-first-prize.pdf",
  },
  {
    place: "Winner",
    event: "West Midlands @ UKREiiF Next-Gen Challenge",
    detail:
      "Our four-person team won the Birmingham Knowledge Quarter placemaking brief. I brought the AI, engineering and systems-thinking lens to user journeys, accessibility and data-informed decisions.",
    year: "21 MAY 2026",
    href:
      "https://www.linkedin.com/posts/daniel-iyalekhue-3a48121b8_ukreiif-ukreiif2026-nextgenchallenge-activity-7463899598743564288-QrA9",
    proof: "/awards/ukreiif-next-gen-winner.pdf",
  },
  {
    place: "2nd place",
    event: "Oracle APEX Hackathon · BCU Innovation Fest",
    detail:
      "Apex Mind placed second in a low-code, data-driven app challenge focused on Oracle APEX and AI-enabled enterprise solutions.",
    year: "22 MAY 2026",
    href: "https://innovationfest.co.uk/schedule/",
    proof: "/awards/oracle-apex-second-place.jpeg",
  },
];

/* ── Skill stack (grouped, curated — not a logo wall) ────────────────────── */
export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "Bash"] },
  { group: "LLMs & RAG", items: ["OpenAI API", "LangChain", "Ollama", "ChromaDB", "FAISS", "sentence-transformers", "RAGAS", "spaCy", "BERTopic"] },
  { group: "ML & data", items: ["scikit-learn", "XGBoost", "LightGBM", "PyTorch", "TensorFlow / Keras", "Pandas", "NumPy"] },
  { group: "Explainable AI", items: ["SHAP", "LIME", "Captum", "IBM AI Fairness 360", "Aequitas"] },
  { group: "Frontend", items: ["Next.js", "React", "Tailwind", "Recharts"] },
  { group: "Backend & MLOps", items: ["FastAPI", "Docker", "PostgreSQL", "Supabase", "GitHub Actions", "MLflow", "Vercel"] },
];

/* ── Work / projects ─────────────────────────────────────────────────────── */
export type Project = {
  name: string;
  kind: string;
  blurb: string;
  tags: string[];
  href?: string; // live demo (if deployed)
  repo?: string; // source
  shot?: string; // screenshot path e.g. "/shots/docsage.jpg" — replaces the graphic preview
};

// TODO: add live demo (href) and source (repo) URLs per project when available.
export const projects: Project[] = [
  {
    name: "AquaSense AI",
    kind: "Predictive ML · Environmental compliance",
    blurb:
      "A wastewater compliance platform that streams plant sensor data, forecasts key water-quality indicators 30 minutes ahead, predicts breach risk, and turns the result into alerts, reports, drought context and data-quality views.",
    tags: ["Next.js", "FastAPI", "scikit-learn", "Express", "SQLite", "Recharts"],
    href: "https://aquasense-lake.vercel.app/dashboard",
    repo: "https://github.com/Danny2xx/AQUASENSE-AI",
    shot: "/shots/aquasense.png",
  },
  {
    name: "AccessOps COCO AI",
    kind: "Computer Vision · Accessibility",
    blurb:
      "An image-captioning model that generates alt-text for accessibility. An end-to-end COCO pipeline from CNN+LSTM baselines through transfer learning and RL fine-tuning, with a human-reroute deployment policy and measured BLEU-4 gains at each stage.",
    tags: ["TensorFlow", "CNN+LSTM", "COCO", "FastAPI", "Next.js"],
    repo: "https://github.com/Danny2xx/accessops-coco-ai",
  },
  {
    name: "DocSage",
    kind: "Document AI · RAG",
    blurb:
      "A production PDF RAG system. Upload documents, chunk and embed them locally, then ask questions in a streaming chat with source-grounded citations and persistent vector storage.",
    tags: ["FastAPI", "ChromaDB", "sentence-transformers", "GPT-4o-mini", "SSE"],
  },
  {
    name: "DraftDNA",
    kind: "LLM + RAG",
    blurb:
      "An AI writing workspace for academic work. It reads your samples, the brief, the rubric and your approved sources, then produces structured, referenced drafts with citations, confidence labels and DOCX/PDF export.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "ChromaDB", "GPT-4o"],
    repo: "https://github.com/Danny2xx/draft-dna",
  },
  {
    name: "RepoLens AI",
    kind: "Developer Tools · Local-first",
    blurb:
      "Drop in a codebase ZIP and it scans the stack, runs static analysis and a local-LLM (Ollama) code review, then generates an employer-facing readiness report with deterministic scoring and Markdown export.",
    tags: ["Next.js", "FastAPI", "Ollama", "qwen2.5-coder", "Recharts"],
  },
  {
    name: "AURAFIND",
    kind: "Recommender System",
    blurb:
      "An AI fragrance-discovery app. It turns natural-language requests into structured preferences and ranks a 100-fragrance catalogue with transparent scoring, plus filters, a dupe finder and side-by-side comparison.",
    tags: ["Next.js", "Supabase", "OpenAI Responses API", "Vercel"],
  },
  {
    name: "OPS Platform",
    kind: "Applied AI · B2B",
    blurb:
      "The foundation for an AI manufacturing-operations platform. A B2B dashboard, an RFQ workspace and a quote calculator on a FastAPI and PostgreSQL backend, with SQLAlchemy models and Alembic migrations.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker"],
  },
  {
    name: "Loan-Approval Bias Audit",
    kind: "Explainable & Responsible AI",
    blurb:
      "A loan-approval classifier, audited for fairness across demographic groups using disparate impact and equal-opportunity difference. SHAP explanations, and a responsible-AI writeup of the findings, limits and mitigations.",
    tags: ["Python", "scikit-learn", "SHAP", "AI Fairness 360", "Streamlit"],
  },
];

/* ── Stuff I do (capabilities line, shown in the About tab) ──────────────── */
export const stuffIDo =
  "AI agents, RAG and document-intelligence systems, ML pipelines and evaluation, full-stack web apps, dashboards, data visualisation, and developer tools.";

/* ── Websites I've shipped (real live sites, with screenshots) ───────────── */
export type Website = { name: string; kind: string; blurb: string; url: string; image: string; alt: string };

// TODO: confirm your exact role/contribution on Nuclii and hottake.
export const websites: Website[] = [
  {
    name: "Carril Agency",
    kind: "Agency · web + AI",
    blurb:
      "A branding, web and growth agency for founders and marketing teams. I work across the web builds and AI automation.",
    url: "https://www.carrilagency.com",
    image: "/shots/carril.jpg",
    alt: "Carril Agency homepage with a dark navy launch-to-growth hero",
  },
  {
    name: "Nuclii",
    kind: "Events platform",
    blurb:
      "A platform to discover, host and book real-world events, pop-ups and experiences near you.",
    url: "https://nuclii.co.uk",
    image: "/shots/nuclii.jpg",
    alt: "Nuclii homepage introducing its local events and pop-ups platform",
  },
  {
    name: "hottake",
    kind: "Markets · in progress",
    blurb:
      "A markets product, currently being rebuilt for its next version.",
    url: "https://hottake.markets",
    image: "/shots/hottake.jpg",
    alt: "hottake markets holding page with the message The next take is loading",
  },
];

/* ── Lab — live, interactive engineering demos (the differentiator) ──────── */
export const labIntro =
  "Small, working demos rather than screenshots. Each one runs in your browser right now.";

/* ── Education / credentials ─────────────────────────────────────────────── */
export const credentials: { line: string; detail?: string }[] = [
  { line: "MSc Artificial Intelligence", detail: "Birmingham City University · 2024–2026" },
  { line: "BSc (Hons) Computer Science", detail: "Birmingham City University · 2020–2023" },
  { line: "Certifications in AI Fundamentals, Responsible AI, LLMs, ML Explainability", detail: "IBM SkillsBuild · Google Cloud · Kaggle" },
];

/* ── /now page — what I'm focused on right now ───────────────────────────── */
export const now = {
  updated: "July 2026", // TODO: bump when you refresh this
  items: [
    {
      label: "Building",
      text: "My MSc dissertation, an applied AI system for real-world business and operations. Plus this site.",
    },
    {
      label: "Learning",
      text: "Agent evaluation, retrieval quality with RAGAS, and how to make LLM systems explainable.",
    },
    {
      label: "Working",
      text: "Part-time AI/ML engineering at Carril Agency, on LLM reporting pipelines and NLP tooling over live marketing data.",
    },
    {
      label: "Open to",
      text: "Full-time Applied AI / ML Engineer roles, UK-based or remote, from mid-2026.",
    },
  ],
};

/* ── /uses page — the tools I actually work in ───────────────────────────── */
export const uses: { group: string; items: { name: string; note?: string }[] }[] = [
  {
    group: "Languages",
    items: [
      { name: "Python", note: "ML, data, backends" },
      { name: "TypeScript", note: "everything web" },
      { name: "SQL" },
      { name: "Bash" },
    ],
  },
  {
    group: "AI / ML",
    items: [
      { name: "OpenAI API" },
      { name: "LangChain", note: "orchestration" },
      { name: "Ollama", note: "local / open-weight models" },
      { name: "ChromaDB / FAISS", note: "vector search" },
      { name: "PyTorch" },
      { name: "scikit-learn" },
      { name: "RAGAS", note: "eval" },
    ],
  },
  {
    group: "Web",
    items: [
      { name: "Next.js" },
      { name: "React" },
      { name: "Astro", note: "this site" },
      { name: "Tailwind" },
    ],
  },
  {
    group: "Backend & infra",
    items: [
      { name: "FastAPI" },
      { name: "PostgreSQL" },
      { name: "Supabase" },
      { name: "Docker" },
      { name: "GitHub Actions" },
      { name: "Vercel" },
    ],
  },
  {
    group: "Data & viz",
    items: [
      { name: "Pandas / NumPy" },
      { name: "Plotly / Matplotlib" },
      { name: "Streamlit" },
      { name: "Power BI" },
    ],
  },
];

/* ── "Currently" + "How I work" (shown on the deeper /about page) ────────── */
export const currently =
  "Finishing my MSc in Artificial Intelligence (2026) and building practical AI systems: agents, RAG and document intelligence. Open to work.";

export const howIWork: string[] = [
  "Ship the whole thing. Model, evaluation, interface, deployment.",
  "Make it explainable. If I can't say why it works, it isn't done.",
  "Measure before I claim anything. Evals over vibes.",
  "Design for the person using it, not the demo.",
];

/* ── Testimonials (real recommendations only — never fabricate a named quote) ─ */
export type Testimonial = { quote: string; name: string; role: string; href?: string };

export const testimonials: Testimonial[] = [
  {
    quote: `I've had the chance to see Daniel approach challenges with both creativity and consistency, and it's been impressive to watch.

Daniel is a focused, creative, and dependable person to work with. He has a strong technical mindset and is always looking for better ways to solve problems and improve ideas. What stands out most is his ability to combine creativity with practical execution, especially across technology, web development, AI, and digital projects. I'd highly recommend Daniel to anyone looking for someone hardworking, thoughtful, and easy to collaborate with.`,
    name: "Olumide Olaomo",
    role: "Hillsville Farms",
    href: "https://www.linkedin.com/in/olumide-olaomo-127483255/",
  },
  // Ifeoluwa Olorunfemi (RWE, https://www.linkedin.com/in/ifeoluwaolorunfemi/) — add
  // ONLY when Daniel provides the real quote. Do not fabricate a named person's words.
];

/* ── Key strengths (short, used on the Contact/closing panel) ────────────── */
export const strengths = [
  "End-to-end ML system design",
  "LLM engineering & RAG pipelines",
  "Explainable & trustworthy AI",
  "Model deployment & containerisation",
  "Business-focused problem framing",
  "Communicating AI to non-technical stakeholders",
];
