/* ──────────────────────────────────────────────────────────────────────────
   SINGLE SOURCE OF TRUTH for all site content.

   Facts come from Daniel's CV (public/cv/daniel-iyalekhue-cv.pdf) and, for
   projects, from the code in each repo. Project metrics are copied from the
   repos' own report files; never round them up or add ones that don't exist.

   Inline markup in `journey`: **bold** and [link](https://url) (src/lib/inline.ts).
   Hero copy: [[source-id]] inserts a numbered citation to `heroSources`.
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
};

/* ── Hero: what he builds, with the system that proves each one ──────────── */
export const heroLede =
  "I build the unglamorous half of AI products. The retrieval that finds the right page, the evaluation that proves it works, the API that serves it, and the screen someone actually uses.";

export const heroSub =
  "Mostly Python and TypeScript, mostly end to end. Currently finishing an MSc in Artificial Intelligence and looking for a full-time role.";

export const heroBuilds: { what: string; proof: string; href: string }[] = [
  { what: "Answers that cite the page they came from", proof: "DocSage", href: "/work/docsage" },
  { what: "Models that hand over when they're unsure", proof: "AccessOps", href: "/work/accessops-coco-ai" },
  { what: "Forecasts that flag a breach half an hour early", proof: "AquaSense AI", href: "/work/aquasense-ai" },
  { what: "Trading systems where the risk limits live in code", proof: "Multi-venue bot", href: "/work/trading-bot" },
];

/* ── My journey (About) ──────────────────────────────────────────────────── */
export const journey: string[] = [
  "I started in full-stack web development: client websites, Figma files turned into responsive interfaces, and the analytics and performance work that comes with shipping to real users.",
  "Then I moved toward data and AI. Data science at 10Analytics, a mentored programme at Amdari, then applied AI/ML engineering at Carril Agency: LLM tools, RAG systems and NLP pipelines that turn live data into something useful.",
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
  current?: boolean;
  note: string;
};

export const experience: Job[] = [
  {
    range: "Jun – Aug 2026",
    role: "AI / Software Engineer Intern",
    org: "Blockchain Advisors Ltd",
    place: "Remote, UK",
    note: "R&D engineering on a multi-venue crypto trading bot prototype: platform architecture, market data ingestion, the strategy framework and the backtester, delivered in a fixed ten-week window.",
  },
  {
    range: "Sep 2024 – now",
    role: "AI / ML Engineer",
    org: "Carril Agency",
    orgUrl: "https://www.carrilagency.com",
    place: "Dubai, remote",
    current: true,
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
export type Finding = {
  label: string;
  note: string;
  bars: { name: string; value: number; display: string; strong?: boolean }[];
};

export type Publication = {
  title: string;
  authors: string[];
  affiliations: string;
  venue: string;
  status: string;
  summary: string;
  findings: Finding[];
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
      "When an enterprise agent gets an answer wrong, is the retrieval at fault or the records it reads? We built an evaluation that separates the two, testing a graph-grounded hybrid retriever on audited versions of a UK manufacturer's records. Retrieval design and record quality turned out to improve reliability independently.",
    findings: [
      {
        label: "Citation validity",
        note: "Correct answers that cite the record they describe, averaged across data states",
        bars: [
          { name: "Dense retrieval", value: 0.201, display: "0.20" },
          { name: "Graph-grounded hybrid", value: 0.892, display: "0.89", strong: true },
        ],
      },
      {
        label: "Answerable questions",
        note: "Share of 60 test questions with a defensible answer in the records",
        bars: [
          { name: "Raw records", value: 38 / 60, display: "63%" },
          { name: "Remediated records", value: 49 / 60, display: "82%", strong: true },
        ],
      },
    ],
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

/* ── Full skill list (About) ─────────────────────────────────────────────── */
export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "Java", "Bash"] },
  { group: "LLMs and RAG", items: ["OpenAI API", "LangChain", "Ollama", "ChromaDB", "FAISS", "sentence-transformers", "BM25", "RAGAS", "spaCy", "BERTopic"] },
  { group: "ML and data", items: ["scikit-learn", "XGBoost", "LightGBM", "PyTorch", "TensorFlow / Keras", "Pandas", "NumPy"] },
  { group: "Explainable AI", items: ["SHAP", "LIME", "Captum", "Integrated Gradients"] },
  { group: "Computer vision", items: ["OpenCV", "YOLOv8", "MobileNetV2", "ResNet", "Grad-CAM"] },
  { group: "Product and infra", items: ["Next.js", "React", "FastAPI", "PostgreSQL", "Supabase", "Docker", "GitHub Actions", "Vercel"] },
];

/* ── Projects ────────────────────────────────────────────────────────────────
   `featured` puts a project in the large grid ("xl" | "lg" | "md"); the rest
   appear in the "More projects" index. Every project gets /work/<slug>.      */
export type Step = { label: string; detail?: string };
export type Project = {
  slug: string;
  name: string;
  kind: string;
  role?: string;
  tagline: string;
  blurb: string;
  pipeline: Step[];
  highlights?: string[];
  facts?: { label: string; value: string }[];
  caveat?: string;
  stack: string[];
  note?: string;
  href?: string;
  repo?: string;
  shot?: string;
  featured?: "xl" | "lg" | "md";
};

export const projects: Project[] = [
  {
    slug: "aquasense-ai",
    name: "AquaSense AI",
    kind: "Wastewater compliance forecasting",
    role: "Hackathon team project",
    tagline: "Forecasts pollutant levels 30 minutes ahead and flags breach risk before it happens.",
    blurb:
      "A compliance monitor for a food-processing plant's wastewater. It replays 5-minute sensor readings as a live stream, forecasts COD, BOD, TSS, ammonia and pH 30 minutes ahead, predicts breach risk, and turns the result into alerts, reports, drought context and data-quality views.",
    pipeline: [
      { label: "Sensor stream", detail: "8,640 simulated 5-minute readings replayed live" },
      { label: "Feature pipeline", detail: "Lag and rolling features over a 120-minute buffer" },
      { label: "Forecasts", detail: "RandomForest, XGBoost and ExtraTrees, 30 minutes ahead" },
      { label: "Breach risk", detail: "HistGradientBoosting classifier" },
      { label: "Compliance rules", detail: "Consent limits decide the current breach status" },
      { label: "Dashboard", detail: "Next.js, Recharts and Leaflet, alerts in SQLite" },
    ],
    facts: [
      { label: "Breach classifier ROC-AUC, validation", value: "0.986" },
      { label: "Ammonia forecast MAE against a persistence baseline, test", value: "2.30 vs 3.18" },
      { label: "Soft-sensor R² against lab values, COD / BOD / TSS", value: "0.91 / 0.88 / 0.97" },
    ],
    caveat:
      "Built on simulated plant data. The validation set holds 12 breach windows and the test split holds none, so the classifier scores are an early signal rather than a field result.",
    highlights: [
      "A chronological train, validation and test split, with imputation fitted on training data only, so nothing from the future leaks into the model.",
      "Walk-forward validation across four folds, alongside an incident holdout.",
      "Rules decide whether a reading is a breach; the model's job is to predict the risk ahead of time.",
    ],
    stack: ["Next.js", "Express", "FastAPI", "scikit-learn", "XGBoost", "SQLite", "Recharts"],
    note: "Finalist, Unihack × BCU Innovation Fest 2026",
    href: "https://aquasense-lake.vercel.app/dashboard",
    repo: "https://github.com/Danny2xx/AQUASENSE-AI",
    shot: "/shots/aquasense.png",
    featured: "xl",
  },
  {
    slug: "accessops-coco-ai",
    name: "AccessOps COCO AI",
    kind: "Image captioning for accessibility",
    role: "MSc coursework",
    tagline: "Writes alt-text for images, and sends the captions it's unsure about to a person.",
    blurb:
      "A CNN+LSTM captioning model trained on MS COCO 2017 and improved stage by stage, from a scratch baseline through transfer learning to AdamW fine-tuning with beam search. A confidence policy decides which captions go straight out and which go to human review.",
    pipeline: [
      { label: "COCO 2017", detail: "118,287 training images, 591,753 captions" },
      { label: "Image encoder", detail: "MobileNetV2, 1,280-dimension features" },
      { label: "Caption decoder", detail: "LSTM, 30,000-word vocabulary" },
      { label: "Fine-tuning", detail: "Transfer learning, AdamW, beam search" },
      { label: "Confidence gate", detail: "Threshold 0.511 routes to auto or human review" },
      { label: "Serving", detail: "FastAPI backend, React frontend" },
    ],
    facts: [
      { label: "BLEU-4: scratch, transfer learning, AdamW with beam search", value: "0.169 → 0.219 → 0.247" },
      { label: "BLEU-4 on the 20% most confident captions", value: "0.331" },
      { label: "Reinforcement-learning fine-tuning (SCST)", value: "0.222, no gain" },
    ],
    highlights: [
      "Negative results are reported, not hidden: reinforcement learning, retrieval refinement and an attention ablation all failed to beat the best model.",
      "Confidence routing turns an average model into a useful one: the most confident fifth of captions scores far higher than the rest.",
      "The routing threshold is read live and can be reloaded without redeploying, and model artifacts load from the Hugging Face Hub at startup.",
    ],
    stack: ["TensorFlow", "Keras", "MobileNetV2", "LSTM", "FastAPI", "React", "Vite"],
    repo: "https://github.com/Danny2xx/accessops-coco-ai",
    featured: "lg",
  },
  {
    slug: "docsage",
    name: "DocSage",
    kind: "Document question answering",
    tagline: "Ask questions of your PDFs and get answers that cite the page they came from.",
    blurb:
      "A local-first PDF question-answering system. It parses text, tables and scanned pages, retrieves with a hybrid of vector search and BM25, reranks with a cross-encoder, and streams an answer from a local model with inline citations and page numbers.",
    pipeline: [
      { label: "Parsing", detail: "PyMuPDF text, pdfplumber tables, Tesseract OCR" },
      { label: "Chunking", detail: "800 characters, 150 overlap, tables kept whole" },
      { label: "Embeddings", detail: "all-MiniLM-L6-v2 into ChromaDB" },
      { label: "Hybrid retrieval", detail: "Vector and BM25, fused with reciprocal rank fusion" },
      { label: "Reranking", detail: "MiniLM cross-encoder keeps the best 5" },
      { label: "Answer", detail: "Ollama llama3.2:3b, streamed over SSE" },
    ],
    highlights: [
      "Hybrid retrieval with reciprocal rank fusion, the same fusion idea used in the retriever from my ICACIN paper.",
      "Scanned pages fall back to OCR, so image-only PDFs still answer.",
      "Everything runs locally, and the prompt refuses when the answer isn't in the documents.",
    ],
    stack: ["FastAPI", "ChromaDB", "SQLite", "sentence-transformers", "BM25", "Ollama", "SSE"],
    featured: "md",
  },
  {
    slug: "draftdna",
    name: "DraftDNA",
    kind: "Citation-aware writing assistant",
    tagline: "Drafts academic work that only cites the sources you approved.",
    blurb:
      "It learns a writer's style from samples, reads the brief, rubric and approved sources, and drafts sections whose citations are tagged by confidence, alongside a list of claims the sources don't support. Reference lists in Harvard, APA 7 or IEEE, with DOCX and PDF export.",
    pipeline: [
      { label: "Uploads", detail: "Samples, brief, rubric and sources parsed" },
      { label: "Chunking", detail: "500 words, 50 overlap" },
      { label: "Source store", detail: "ChromaDB, filtered per project" },
      { label: "Drafting", detail: "OpenAI gpt-4.1, structured JSON" },
      { label: "Checks", detail: "Confidence labels and unsupported claims" },
      { label: "Export", detail: "Harvard, APA 7 or IEEE, as DOCX or PDF" },
    ],
    highlights: [
      "Citations are restricted to the uploaded sources, and claims those sources don't support are listed back to the writer.",
      "A mock AI mode runs the whole app with no API cost, which keeps development and demos free.",
      "JWT authentication and Alembic migrations from the first commit.",
    ],
    stack: ["Next.js", "FastAPI", "ChromaDB", "OpenAI API", "python-docx", "ReportLab"],
    repo: "https://github.com/Danny2xx/draft-dna",
    featured: "md",
  },
  {
    slug: "trading-bot",
    name: "Multi-venue trading bot",
    kind: "DeFi trading R&D",
    role: "Blockchain Advisors internship",
    tagline: "A paper-trading bot on Base where every order passes a risk manager with a kill switch.",
    blurb:
      "An R&D trading bot for WETH/USDC and cbBTC/USDC on Base, routing through Aerodrome with a Uniswap v3 fallback. Rule-based, moving-average and ML strategies share one interface, every order passes risk checks, fills are simulated with fees and slippage, and swaps were tested on the Base Sepolia testnet.",
    pipeline: [
      { label: "Market data", detail: "DEX Screener, on-chain pool reads, CCXT" },
      { label: "Market state", detail: "One shared shape, optional TimescaleDB" },
      { label: "Strategies", detail: "Range, moving-average cross, logistic regression" },
      { label: "Risk manager", detail: "Position, exposure, drawdown and daily-loss caps" },
      { label: "Paper fills", detail: "Fees and slippage modelled" },
      { label: "Live gate", detail: "web3.py signing, testnet only" },
    ],
    highlights: [
      "Risk limits are enforced in code rather than in config, with a tested kill switch.",
      "Per-user wallet keys are encrypted with Fernet, and a gas-aware guard skips trades that wouldn't pay for themselves.",
      "Model inference runs as its own FastAPI service with Prometheus metrics, and CI enforces over 80% test coverage.",
    ],
    stack: ["Python", "web3.py", "CCXT", "FastAPI", "TimescaleDB", "Prometheus"],
    featured: "lg",
  },
  {
    slug: "repolens-ai",
    name: "RepoLens AI",
    kind: "Local-first code audit",
    tagline: "Audits a codebase with static analysis and a local LLM, without letting the LLM set the score.",
    blurb:
      "Upload a codebase ZIP and it detects the stack, runs npm audit, ESLint, tsc, ruff, bandit and gitleaks, sends code chunks to a local qwen2.5-coder model for review, then merges and deduplicates findings into deterministic readiness scores and a Markdown report.",
    pipeline: [
      { label: "Safe extraction", detail: "Zip-slip check and upload size limit" },
      { label: "Stack detection", detail: "File scan across languages and frameworks" },
      { label: "Static analysis", detail: "npm audit, ESLint, tsc, ruff, bandit, gitleaks" },
      { label: "LLM review", detail: "Ollama qwen2.5-coder:7b, JSON output" },
      { label: "Scoring", detail: "Deterministic: 100 minus 12, 6 or 2 per issue" },
      { label: "Report", detail: "Markdown export and a Next.js dashboard" },
    ],
    highlights: [
      "The LLM finds issues but never sets scores, so the same codebase always gets the same result.",
      "Missing analysis tools degrade gracefully instead of failing the audit.",
      "44 API tests, and Zod schemas shared between the web app and the API.",
    ],
    stack: ["Next.js", "FastAPI", "Ollama", "qwen2.5-coder", "Zod"],
  },
  {
    slug: "credit-bias-audit",
    name: "Credit-scoring bias audit",
    kind: "Explainable AI in fintech",
    role: "MSc coursework",
    tagline: "An XGBoost credit model explained with SHAP and LIME, then checked for bias across age, sex and nationality.",
    blurb:
      "A credit-risk classifier on the UCI German Credit dataset, explained globally and per applicant with SHAP and LIME, then audited for disparate impact, error rates and risk scores across age, sex and foreign-worker groups.",
    pipeline: [
      { label: "German Credit data", detail: "1,000 applicants, 20 features" },
      { label: "Balancing", detail: "Stratified split, SMOTE on training data only" },
      { label: "Model", detail: "XGBoost against logistic regression, tree and forest" },
      { label: "Explanations", detail: "SHAP, plus a plain-English rejection letter" },
      { label: "Stability", detail: "LIME across five random seeds" },
      { label: "Fairness", detail: "Disparate impact and error rates by group" },
    ],
    facts: [
      { label: "XGBoost AUC", value: "0.764" },
      { label: "Disparate impact, applicants aged 18–25", value: "0.72, fails the 80% rule" },
      { label: "False positive rate, ages 18–25 against 36–50", value: "33.3% vs 12.8%" },
    ],
    highlights: [
      "SMOTE is applied after the split, so synthetic samples never leak into evaluation.",
      "SHAP showed the model leaning on sex and marital status, the fifth most influential of 20 features.",
      "LIME's instability was measured rather than assumed, and small-group results carry explicit caveats.",
    ],
    stack: ["Python", "XGBoost", "scikit-learn", "SHAP", "LIME", "imbalanced-learn"],
  },
  {
    slug: "aurafind",
    name: "AURAFIND",
    kind: "Recommendation engine",
    tagline: "Describe a scent in plain words and get ranked matches, with the reasons shown.",
    blurb:
      "Plain-language requests become structured preferences, then a catalogue is scored out of 100 on budget, notes, style, occasion, season and performance, and grouped into best overall, budget, premium and hidden-gem picks, each with its reasons.",
    pipeline: [
      { label: "Request", detail: "A description in plain language" },
      { label: "Preferences", detail: "gpt-4.1-mini with a JSON schema, or a rule-based fallback" },
      { label: "Catalogue", detail: "Supabase, or a local 100-fragrance file" },
      { label: "Scoring", detail: "Out of 100, with a visible breakdown" },
      { label: "Picks", detail: "Best overall, budget, premium, hidden gem" },
    ],
    highlights: [
      "The LLM only parses the request; it never picks products, so it can't recommend one that doesn't exist.",
      "Works with no API keys at all, through the fallback parser and the local catalogue.",
      "Every recommendation shows how its score was made.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "OpenAI Responses API"],
  },
  {
    slug: "ops-platform",
    name: "OPS Platform",
    kind: "Manufacturing operations, B2B",
    tagline: "The data and quoting foundation for a UK precision-engineering operations platform.",
    blurb:
      "Phase one of a planned AI manufacturing platform: a normalised PostgreSQL schema seeded with customers, materials, labour rates, RFQs and quotes, a FastAPI API, a quote calculator with exact decimal money handling, and a Next.js B2B dashboard.",
    pipeline: [
      { label: "Seed data", detail: "CSV loaders into PostgreSQL" },
      { label: "Schema", detail: "SQLAlchemy models, Alembic migrations" },
      { label: "API", detail: "FastAPI routes for the dashboard, RFQs and quotes" },
      { label: "Quoting", detail: "Cost plus overhead plus margin, decimal rounding" },
      { label: "Dashboard", detail: "Next.js KPI cards and RFQ workspace" },
    ],
    highlights: [
      "Money is calculated with Decimal rounding end to end, never floats.",
      "A normalised schema with foreign keys and enums, ready for the AI features planned next.",
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "Docker"],
  },
];

/* ── Websites I've shipped ───────────────────────────────────────────────── */
export type Website = { name: string; kind: string; url: string; image: string; alt: string };

// TODO: confirm your role on hottake.
export const websites: Website[] = [
  {
    name: "Carril Agency",
    kind: "Build and maintenance",
    url: "https://www.carrilagency.com",
    image: "/shots/carril.jpg",
    alt: "Carril Agency homepage with a dark navy launch-to-growth hero",
  },
  {
    name: "Nuclii",
    kind: "Co-founder and CTO",
    url: "https://nuclii.co.uk",
    image: "/shots/nuclii.jpg",
    alt: "Nuclii homepage introducing its local events and pop-ups platform",
  },
  {
    name: "hottake",
    kind: "Markets product",
    url: "https://hottake.markets",
    image: "/shots/hottake.jpg",
    alt: "hottake markets holding page with the message The next take is loading",
  },
];

/* ── Lab ─────────────────────────────────────────────────────────────────── */
export const labIntro =
  "Two small demos of how language models work. Both run in your browser, with no API calls.";

/* ── Education (About) ───────────────────────────────────────────────────── */
export const credentials: { line: string; detail: string }[] = [
  { line: "MSc Artificial Intelligence", detail: "Birmingham City University, 2025 – 2026" },
  { line: "BSc (Hons) Computer Science, 2:1", detail: "Birmingham City University, 2020 – 2023" },
  {
    line: "Certifications",
    detail: "IBM SkillsBuild, Google Cloud Skills Boost and Kaggle: AI fundamentals, responsible AI, LLMs, explainability.",
  },
];

/* ── Ventures (About) ────────────────────────────────────────────────────── */
export const ventures: { role: string; detail: string }[] = [
  {
    role: "Co-founder, Hillsville Farms, Hillsville Prime and 4Wheels.ng",
    detail:
      "Took each from concept to an operating business, including a dealership model that marketed partner-owned inventory, so it never had to hold stock.",
  },
  {
    role: "Co-founder and CTO, Nuclii",
    detail: "Took the venture through the BCU STEAM Hatchery accelerator, from customer validation to pitching.",
  },
  {
    role: "Relay, through BSEEN",
    detail: "A hyperlocal student delivery marketplace, worked through validation, pricing and trust.",
  },
];

/* ── Right now (About) ───────────────────────────────────────────────────── */
export const now = {
  updated: "September 2026",
  // Keep these additive: the hero already covers the MSc and the job search.
  items: [
    { label: "Shipping", text: "LLM reporting pipelines at Carril, over live ad and analytics data." },
    { label: "Learning", text: "Agent evaluation, and measuring retrieval quality with RAGAS." },
    { label: "Writing", text: "Occasional notes on what I'm building." },
  ],
};

export const currently =
  "Engineer, researcher and co-founder. The short version of how I got here, and how I work.";

export const howIWork: string[] = [
  "Ship the whole thing. Model, evaluation, interface, deployment.",
  "Make it explainable. If I can't say why it works, it isn't done.",
  "Measure before I claim anything. Evals over vibes.",
  "Report what didn't work. A failed experiment is still a result.",
];

/* ── Recommendations (real, attributed words only; never write one for someone) ─
   `photo`: LinkedIn photos can't be pulled automatically (login wall, expiring
   URLs, and this site loads nothing from third parties). Save the person's photo
   with their OK to public/people/<name>.jpg (square, ~160px) and set it here. */
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
