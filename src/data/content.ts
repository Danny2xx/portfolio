/* ──────────────────────────────────────────────────────────────────────────
   SINGLE SOURCE OF TRUTH for all site content. Sourced from Daniel's CV
   (public/cv/daniel-iyalekhue-cv.pdf). Editing here updates the whole site.

   Inline markup in `profile.bio`, `journey` and notes: **bold** and
   [link text](https://url) are supported (see src/lib/inline.ts).
   ────────────────────────────────────────────────────────────────────────── */

export const profile = {
  name: "Daniel Iyalekhue",
  title: "AI / ML Engineer",
  headline: "I build AI that has to work after the demo.",
  status: "Open to full-time roles",
  location: "Birmingham, UK",
  email: "danieliyalekhue@gmail.com",
  cvUrl: "/cv/daniel-iyalekhue-cv.pdf" as string | null,
  links: {
    github: "https://github.com/Danny2xx",
    linkedin: "https://www.linkedin.com/in/daniel-iyalekhue-3a48121b8/",
  },
  bio: [
    "That means the whole path from raw data to a decision someone can act on: retrieval, evaluation, predictive models, and the APIs and interfaces around them.",
    "I'm finishing an MSc in Artificial Intelligence at Birmingham City University, where I co-authored [a paper on grounded enterprise agents](#research) accepted at ICACIN 2026. This summer I was the sole engineer on a crypto trading R&D prototype at Blockchain Advisors, and I build LLM reporting pipelines for [Carril Agency](https://www.carrilagency.com).",
  ],
};

/* ── My journey (the /about page) ────────────────────────────────────────── */
export const journey: string[] = [
  "I started in full-stack web development: client websites, Figma files turned into responsive interfaces, and the analytics and performance work that comes with shipping to real users.",
  "Then I moved toward data and AI. Data science work at 10Analytics and a mentored programme at Amdari, then applied AI/ML engineering at Carril Agency: LLM tools, RAG systems and NLP pipelines that turn live data into something useful.",
  "Now I'm finishing an MSc in Artificial Intelligence at Birmingham City University. With classmates and Beeswift, a Birmingham manufacturer, I co-authored a paper on evaluating grounded enterprise agents that was accepted at ICACIN 2026.",
  "Alongside the engineering I've co-founded four ventures, three of them operating businesses. That's where I learned to price, pitch and ship to a fixed deadline with limited resources.",
];

/* ── Experience ──────────────────────────────────────────────────────────── */
export type Job = {
  range: string;
  role: string;
  org: string;
  orgUrl?: string;
  place?: string;
  note: string;
};

export const experience: Job[] = [
  {
    range: "Jun – Aug 2026",
    role: "AI / Software Engineer Intern",
    org: "Blockchain Advisors Ltd",
    place: "Remote, UK",
    note: "Sole engineer on a multi-venue crypto trading bot R&D prototype. I owned the platform architecture, market data ingestion, strategy framework and backtester across a fixed ten-week delivery window.",
  },
  {
    range: "Sep 2024 – now",
    role: "AI / ML Engineer",
    org: "Carril Agency",
    orgUrl: "https://www.carrilagency.com",
    place: "Dubai, remote",
    note: "Built an AI reporting pipeline that pulls live Google Ads, Meta Ads and GA4 data through LangChain and the OpenAI API into a FastAPI backend. Also an NLP competitor-analysis tool (BERTopic, spaCy), a RAG content tool grounded in brand guidelines, and client sites including carrilagency.com and brau.ae.",
  },
  {
    range: "Aug 2025 – Feb 2026",
    role: "Data Science Intern",
    org: "Amdari",
    place: "Remote, UK",
    note: "Mentored ML projects on churn prediction, HR attrition and industrial predictive maintenance with XGBoost, Random Forest, SHAP and LSTMs, turning model output into business recommendations in Streamlit and Power BI.",
  },
  {
    range: "Feb – Aug 2025",
    role: "Data Scientist",
    org: "10Analytics",
    place: "Remote",
    note: "Python ML workflows with Pandas, NumPy and scikit-learn: cleaning, encoding, scaling and exploratory analysis on structured datasets, reported through visualisations and analytical reports.",
  },
];

/* ── Research ────────────────────────────────────────────────────────────── */
export type Publication = {
  title: string;
  authors: string[];
  affiliations: string;
  venue: string;
  status: string;
  summary: string;
  pdf: string;
  thumb: string;
  pages: number;
};

export const publications: Publication[] = [
  {
    title:
      "Substrate or Architecture? A Factorial Evaluation Methodology for Attributing Reliability in Grounded Enterprise Agents",
    authors: ["Evelyn Edjere", "Daniel Iyalekhue", "Oliver Storr", "Ashley Durnall", "Iain Rice"],
    affiliations: "Birmingham City University and Beeswift Ltd",
    venue: "ICACIN 2026",
    status: "Accepted",
    summary:
      "When an enterprise agent gets an answer wrong, is the retrieval at fault or the records it reads? We built a way to separate the two, testing a graph-grounded hybrid retriever on audited versions of a UK manufacturer's records. Graph grounding lifted citation validity from 0.20 to 0.89, while cleaning the records grew the answerable share of questions from 63% to 82%.",
    pdf: "/papers/icacin-2026-substrate-or-architecture.pdf",
    thumb: "/papers/icacin-2026-page1.jpg",
    pages: 12,
  },
];

/* ── Recognition ─────────────────────────────────────────────────────────── */
export type Award = {
  place: string;
  event: string;
  detail?: string;
  date: string;
  href?: string;
  proof?: string;
};

export const awards: Award[] = [
  {
    place: "1st place",
    event: "AI Day Hackathon, Birmingham City University",
    detail:
      "Team ApexMind. A fully local, Wikipedia-grounded question answering system, built by four people in four hours and scored 82 out of 100.",
    date: "19 Jun 2026",
    href:
      "https://www.linkedin.com/posts/faisal-saeed-2a6b20135_we-are-delighted-to-share-that-we-successfully-activity-7474840615675998209-rxoD",
    proof: "/awards/ai-at-bcu-day-first-prize.pdf",
  },
  {
    place: "2nd place",
    event: "Oracle and Red Bull APEX Agent Hackathon",
    detail:
      "Team ApexMind, at BCU Innovation Fest. An agentic recommendation system that works within preferences, budget, dietary needs, location and other real-world constraints.",
    date: "22 May 2026",
    href: "https://innovationfest.co.uk/schedule/",
    proof: "/awards/oracle-apex-second-place.jpeg",
  },
  {
    place: "Winner",
    event: "UKREiiF West Midlands Next-Gen Challenge",
    detail:
      "The Innovation Spine, a proposal to reconnect Birmingham's Knowledge Quarter with data, AI and placemaking. I brought the AI, data, software and commercial analysis to a four-person, cross-disciplinary team.",
    date: "21 May 2026",
    href:
      "https://www.linkedin.com/posts/daniel-iyalekhue-3a48121b8_ukreiif-ukreiif2026-nextgenchallenge-activity-7463899598743564288-QrA9",
    proof: "/awards/ukreiif-next-gen-winner.pdf",
  },
];

export const alsoRecognised: { what: string; detail: string }[] = [
  { what: "Finalist, Unihack × BCU Innovation Fest", detail: "AquaSense AI, 2026" },
  { what: "Finalist, BCU STEAM Hatchery", detail: "Nuclii, one of eight ventures picked to pitch, 2026" },
  { what: "BCU Graduate+ Gold Award", detail: "Professional and employability skills" },
  { what: "Finalist, BCU Innovation Fest", detail: "Active n Me, 2021" },
];

/* ── Skill stack (grouped, used on /about) ───────────────────────────────── */
export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "Java", "Bash"] },
  { group: "LLMs and RAG", items: ["OpenAI API", "LangChain", "Ollama", "ChromaDB", "FAISS", "sentence-transformers", "RAGAS", "spaCy", "BERTopic"] },
  { group: "ML and data", items: ["scikit-learn", "XGBoost", "LightGBM", "PyTorch", "TensorFlow / Keras", "Pandas", "NumPy"] },
  { group: "Explainable AI", items: ["SHAP", "LIME", "Captum", "IBM AI Fairness 360", "Aequitas"] },
  { group: "Computer vision", items: ["OpenCV", "YOLOv8", "ResNet", "EfficientNet", "Grad-CAM"] },
  { group: "Frontend", items: ["Next.js", "React", "Tailwind", "Recharts"] },
  { group: "Backend and MLOps", items: ["FastAPI", "Docker", "PostgreSQL", "Supabase", "Redis", "GitHub Actions", "MLflow", "Vercel"] },
];

/* ── Work / projects ─────────────────────────────────────────────────────── */
export type Project = {
  name: string;
  kind: string;
  blurb: string;
  stack: string[];
  group: "ai" | "platform";
  note?: string; // short proof line, e.g. a competition result
  href?: string; // live site
  repo?: string; // source
  shot?: string; // real screenshot; projects with one get the featured treatment
};

export const projectGroups: { id: Project["group"]; label: string }[] = [
  { id: "ai", label: "AI and machine learning" },
  { id: "platform", label: "Full-stack and platforms" },
];

export const projects: Project[] = [
  {
    name: "AquaSense AI",
    kind: "Forecasting and compliance monitoring",
    blurb:
      "A wastewater compliance platform that streams plant sensor data, forecasts key water-quality indicators 30 minutes ahead, predicts breach risk, and turns the result into graded alerts, reports, drought context and data-quality views.",
    stack: ["Next.js", "FastAPI", "scikit-learn", "Express", "SQLite", "Recharts"],
    group: "ai",
    note: "Finalist, Unihack × BCU Innovation Fest 2026",
    href: "https://aquasense-lake.vercel.app/dashboard",
    repo: "https://github.com/Danny2xx/AQUASENSE-AI",
    shot: "/shots/aquasense.png",
  },
  {
    name: "AccessOps COCO AI",
    kind: "Computer vision for accessibility",
    blurb:
      "An image-captioning model that writes alt-text. An end-to-end COCO pipeline from CNN+LSTM baselines through transfer learning and RL fine-tuning, with measured BLEU-4 gains at each stage and a policy that reroutes low-confidence captions to a human.",
    stack: ["TensorFlow", "CNN+LSTM", "COCO", "FastAPI", "Next.js"],
    group: "ai",
    repo: "https://github.com/Danny2xx/accessops-coco-ai",
  },
  {
    name: "DocSage",
    kind: "Document question answering",
    blurb:
      "A production PDF RAG system. Upload documents, chunk and embed them locally, then ask questions in a streaming chat where every answer carries citations back to the page it came from.",
    stack: ["FastAPI", "ChromaDB", "sentence-transformers", "GPT-4o-mini", "SSE"],
    group: "ai",
  },
  {
    name: "DraftDNA",
    kind: "Citation-aware writing assistant",
    blurb:
      "A writing workspace for academic work. It reads your samples, the brief, the rubric and your approved sources, then drafts structured, referenced work with source-only citations, confidence labels and DOCX or PDF export.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "ChromaDB", "GPT-4o"],
    group: "ai",
    repo: "https://github.com/Danny2xx/draft-dna",
  },
  {
    name: "Multi-venue trading bot",
    kind: "Sole engineer, Blockchain Advisors",
    blurb:
      "A modular DeFi trading platform: market data ingestion, one strategy contract for rule-based, technical and ML strategies, a backtester that models fills, fees and slippage, and execution behind a risk manager with drawdown limits and a global kill switch.",
    stack: ["Python", "TimescaleDB", "Redis", "CCXT", "web3.py", "Prometheus", "Grafana"],
    group: "ai",
  },
  {
    name: "Loan-approval bias audit",
    kind: "Responsible AI",
    blurb:
      "A loan-approval classifier audited for fairness across demographic groups with disparate impact and equal-opportunity difference, explained with SHAP, and written up with findings, limits and mitigations.",
    stack: ["Python", "scikit-learn", "XGBoost", "SHAP", "AI Fairness 360", "Aequitas"],
    group: "ai",
  },
  {
    name: "RepoLens AI",
    kind: "Local-first developer tool",
    blurb:
      "Drop in a codebase and it runs static analysis and a local-LLM code review through Ollama, then produces a readiness report with deterministic scoring, deduplicated issues and Markdown export.",
    stack: ["Next.js", "FastAPI", "Ollama", "qwen2.5-coder", "Recharts"],
    group: "ai",
  },
  {
    name: "OPS Platform",
    kind: "Manufacturing operations, B2B",
    blurb:
      "The foundation for an AI manufacturing-operations platform: a B2B dashboard, an RFQ workspace and a quote calculator on FastAPI and PostgreSQL, with SQLAlchemy models, Alembic migrations and seeded datasets.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "Docker"],
    group: "platform",
  },
  {
    name: "AURAFIND",
    kind: "Recommendation engine",
    blurb:
      "Fragrance discovery from plain-language requests. It turns what you ask for into structured preferences and ranks a catalogue with transparent scoring and a deterministic fallback, so it never invents a product the database doesn't hold.",
    stack: ["Next.js", "TypeScript", "Supabase", "OpenAI Responses API", "Vercel"],
    group: "platform",
  },
];

/* ── Websites I've shipped (live sites, with screenshots) ────────────────── */
export type Website = { name: string; kind: string; blurb: string; url: string; image: string; alt: string };

// TODO: confirm your role on hottake.
export const websites: Website[] = [
  {
    name: "Carril Agency",
    kind: "Agency site",
    blurb:
      "A branding, web and growth agency. I build and maintain the site, with custom JavaScript, GA4 and Meta Pixel integrations, and Core Web Vitals work.",
    url: "https://www.carrilagency.com",
    image: "/shots/carril.jpg",
    alt: "Carril Agency homepage with a dark navy launch-to-growth hero",
  },
  {
    name: "Nuclii",
    kind: "Co-founder and CTO",
    blurb: "A platform to discover, host and book real-world events, pop-ups and experiences.",
    url: "https://nuclii.co.uk",
    image: "/shots/nuclii.jpg",
    alt: "Nuclii homepage introducing its local events and pop-ups platform",
  },
  {
    name: "hottake",
    kind: "Markets product",
    blurb: "A markets product, being rebuilt for its next version.",
    url: "https://hottake.markets",
    image: "/shots/hottake.jpg",
    alt: "hottake markets holding page with the message The next take is loading",
  },
];

/* ── Lab: live, interactive demos ────────────────────────────────────────── */
export const labIntro =
  "Two small demos of how language models work. Both run in your browser, with no API calls.";

/* ── Education and certifications (the /about page) ──────────────────────── */
export const credentials: { line: string; detail: string }[] = [
  { line: "MSc Artificial Intelligence", detail: "Birmingham City University, Sep 2025 – Sep 2026" },
  { line: "BSc (Hons) Computer Science, 2:1", detail: "Birmingham City University, 2020 – 2023" },
  {
    line: "Certifications",
    detail:
      "IBM SkillsBuild: AI Fundamentals, Python for Data Science. Google Cloud: Responsible AI, Large Language Models. Kaggle: ML Explainability, Feature Engineering.",
  },
];

/* ── Ventures (the /about page) ──────────────────────────────────────────── */
export const ventures: { role: string; detail: string }[] = [
  {
    role: "Co-founder, Hillsville Farms, Hillsville Prime and 4Wheels.ng",
    detail:
      "Took each from concept to an operating business, including a dealership model that marketed partner-owned inventory and earned per transaction, so it never had to hold stock.",
  },
  {
    role: "Co-founder and CTO, Nuclii",
    detail:
      "Took the venture through the BCU STEAM Hatchery accelerator: customer validation, business modelling, financial planning, go-to-market and pitching.",
  },
  {
    role: "Relay, through BSEEN",
    detail:
      "A hyperlocal student delivery marketplace, worked through customer validation, pricing, trust and the marketplace model.",
  },
  {
    role: "Founder Institute Lagos",
    detail: "Virtual founder programme in customer discovery, validation, business models and go-to-market.",
  },
];

/* ── /now page ───────────────────────────────────────────────────────────── */
export const now = {
  updated: "September 2026", // bump when you refresh this
  items: [
    {
      label: "Finishing",
      text: "My MSc in Artificial Intelligence at Birmingham City University.",
    },
    {
      label: "Working",
      text: "AI / ML engineering at Carril Agency, on LLM reporting pipelines and NLP tooling over live marketing data.",
    },
    {
      label: "Learning",
      text: "Agent evaluation, retrieval quality with RAGAS, and how to make LLM systems explainable.",
    },
    {
      label: "Open to",
      text: "Full-time AI / ML or software engineering roles, in the UK or remote.",
    },
  ],
};

/* ── /uses page ──────────────────────────────────────────────────────────── */
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
    group: "AI and ML",
    items: [
      { name: "OpenAI API" },
      { name: "LangChain", note: "orchestration" },
      { name: "Ollama", note: "local, open-weight models" },
      { name: "ChromaDB and FAISS", note: "vector search" },
      { name: "PyTorch" },
      { name: "scikit-learn" },
      { name: "RAGAS", note: "evaluation" },
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
    group: "Backend and infra",
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
    group: "Data and viz",
    items: [
      { name: "Pandas and NumPy" },
      { name: "Plotly and Matplotlib" },
      { name: "Streamlit" },
      { name: "Power BI" },
    ],
  },
];

/* ── "Currently" + "How I work" (the /about page) ────────────────────────── */
export const currently =
  "Finishing my MSc in Artificial Intelligence, building LLM reporting pipelines at Carril Agency, and looking for a full-time AI / ML engineering role.";

export const howIWork: string[] = [
  "Ship the whole thing. Model, evaluation, interface, deployment.",
  "Make it explainable. If I can't say why it works, it isn't done.",
  "Measure before I claim anything. Evals over vibes.",
  "Design for the person using it, not the demo.",
];

/* ── Recommendations (real, attributed words only; never write one for someone) ─
   `photo`: LinkedIn photos can't be pulled automatically (login wall, expiring
   URLs, and this site loads nothing from third parties). Save the person's photo
   with their OK to public/people/<name>.jpg (square, ~160px) and set it here.
   Without a photo, their initials are shown. */
export type Testimonial = {
  quote: string; // paragraphs separated by a blank line
  name: string;
  role: string;
  linkedin?: string;
  photo?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: `I've had the chance to see Daniel approach challenges with both creativity and consistency, and it's been impressive to watch.

Daniel is a focused, creative, and dependable person to work with. He has a strong technical mindset and is always looking for better ways to solve problems and improve ideas. What stands out most is his ability to combine creativity with practical execution, especially across technology, web development, AI, and digital projects. I'd highly recommend Daniel to anyone looking for someone hardworking, thoughtful, and easy to collaborate with.`,
    name: "Olumide Olaomo",
    role: "Hillsville Farms",
    linkedin: "https://www.linkedin.com/in/olumide-olaomo-127483255/",
  },
  // Ifeoluwa Olorunfemi: add once they send their recommendation. Paste their exact words:
  // {
  //   quote: `...`,
  //   name: "Ifeoluwa Olorunfemi",
  //   role: "RWE",
  //   linkedin: "https://www.linkedin.com/in/ifeoluwaolorunfemi/",
  //   photo: "/people/ifeoluwa-olorunfemi.jpg",
  // },
];

/* ── Where I'm most useful (the Contact tab) ─────────────────────────────── */
export const strengths = [
  "Normalising unrelated data sources into one schema an application can rely on.",
  "Retrieval, evaluation, explainability and monitoring for ML and LLM systems.",
  "Translating model behaviour into decisions non-technical stakeholders can act on.",
  "Moving between engineering and commercial conversations, having pitched, priced and run ventures as well as built them.",
];
