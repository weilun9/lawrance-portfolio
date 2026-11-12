// Single source of truth for every word on the site.
// Edit this file to update the portfolio; components only render it.

export const profile = {
  name: 'Lawrance Tan',
  fullName: 'Lawrance Tan Wei Lun',
  role: 'Graduate AI Engineer',
  focus: 'LLM Applications · AI Automation · RAG',
  location: 'Johor Bahru, Malaysia',
  email: 'lawrancetan0113@gmail.com',
  github: 'https://github.com/weilun9',
  githubHandle: 'github.com/weilun9',
  cvPath: '/Lawrance_Tan_CV.pdf',
  availability: 'Coursework completed · available for full-time or internship',

  // Hero copy
  greeting: ["Hey there, I'm Lawrance Tan,", 'Graduate AI Engineer — LLM apps, agents, RAG'],
  hook: 'I build AI a business can trust: it cites its sources, and it knows when to say no.',

  // The 30-second version — one line + three numbers an interviewer can repeat.
  tldr: 'Final-year CS & IT student at Massey University who ships AI that refuses to guess and hands risky decisions back to people.',
  stats: [
    { value: '10/10', label: 'out-of-scope questions refused by my RAG service' },
    { value: '91.4%', label: 'top-1 retrieval accuracy after hybrid search + reranking' },
    { value: '98.6%', label: 'accuracy of my LLM skill in a 142-item A/B study (baseline 90.1%)' },
  ],
}

export type Project = {
  id: string
  title: string
  tagline: string
  stack: string[]
  points: string[]
  metric?: { value: string; label: string }
  link?: string
  demo?: string
  // Featured projects get a full card; the rest are listed compactly under "More projects".
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'ai-erp',
    title: 'AI Butler ERP',
    tagline: 'A full retail ERP with an AI butler that can look things up but never acts alone.',
    stack: ['FastAPI', 'PostgreSQL', 'pgvector', 'React', 'MCP', 'DeepSeek'],
    points: [
      'Purchasing, sales, stock ledger with moving-average cost, payments with a knock-off engine, and an offline-capable POS till (PWA) for Malaysian retail.',
      'AI butler with 9 read-only tools that go through the same permission and field-hiding rules as the API; anything it drafts waits for a person to confirm.',
      'RAG knowledge base: measured 95% hit@6 for vector search vs 71% for keyword on a 21-question set; read-only MCP server for other AI clients.',
      'LHDN MyInvois e-invoicing (UBL), including monthly consolidated POS invoices — tested against a simulated LHDN, not the real sandbox yet.',
      '247 tests in CI; public demo with one-click login.',
    ],
    metric: { value: '247', label: 'tests in CI' },
    link: 'https://github.com/weilun9/ai-erp',
    demo: 'https://ai-butler-erp.vercel.app',
    featured: true,
  },
  {
    id: 'grounded-rag',
    title: 'Grounded RAG',
    tagline: 'Document Q&A that answers only with citations — or refuses.',
    stack: ['LangGraph', 'FastAPI', 'Ollama', 'Docker', 'GitHub Actions'],
    points: [
      'A post-generation citation check replaces any uncited answer with a refusal.',
      'Keyword + semantic search with a reranker: top-1 retrieval 85.7% → 91.4% on a 45-question benchmark.',
      'Runs on a local 9B model at zero API cost: 88.6% answer accuracy, 96.5% citations from the right document, 3.2 s median latency.',
      'Web UI, REST API, Docker image, CI with 27 unit tests plus automated retrieval evaluation.',
    ],
    metric: { value: '10/10', label: 'out-of-scope refused' },
    link: 'https://github.com/weilun9/grounded-rag',
    featured: true,
  },
  {
    id: 'agentic-challenge',
    title: 'Agentic Architect Challenge',
    tagline: 'Three agents built for an intern assessment — each one fails closed.',
    stack: ['LangGraph', 'Ollama', 'BM25', 'BeautifulSoup', 'pytest'],
    points: [
      'Support triage escalates data loss, outages, breaches and repeat contacts before any reply is drafted.',
      'Refund promises are blocked by three layers: cited policy retrieval, deterministic claim checks, then an LLM judge that fails closed.',
      'Found why a scrape-and-summarise script failed: the model saw only 19% of the page. Map-reduce fix reads all of it.',
      'Document agent with memory and a calculator tool: answer accuracy 10/11 → 11/11 after adding a number check; 85 offline tests in CI.',
    ],
    metric: { value: '11/11', label: 'agent eval answers' },
    link: 'https://github.com/weilun9/agentic-architect-challenge',
    featured: true,
  },
  {
    id: 'ar-agent',
    title: 'AR Collections Agent',
    tagline: 'Invoice follow-up automation with a human brake.',
    stack: ['Python', 'Claude', 'WhatsApp Cloud API', 'Gmail', 'Slack'],
    points: [
      'Ranks overdue invoices by risk and drafts reminders for WhatsApp and Gmail, with Slack alerts to finance (simulated data, dry-run by default).',
      'Pre-approved message templates only; a rule engine that can only tighten decisions; a 48-hour window for account managers to take over.',
      'The LLM only summarises case history — any summary with numbers not found in the source records is rejected.',
      'Read-only function-calling assistant for questions about cases; 74 tests.',
    ],
    metric: { value: '48 h', label: 'human takeover window' },
    link: 'https://github.com/weilun9/ar-collections-agent',
    featured: true,
  },
  {
    id: 'coding-agent',
    title: 'Autonomous Coding Agent',
    tagline: 'A Claude Agent SDK coding agent that asks before it publishes anything.',
    stack: ['Claude Agent SDK', 'Python', 'shlex', 'GitHub Actions'],
    points: [
      'Plans, builds, self-reviews and commits locally inside its own workspace, then waits for the next instruction.',
      'Permission gate on every tool call: 6-tool allow-list, workspace-only file paths, shell commands parsed (not substring-matched) into deny / ask / allow.',
      'On a 74-command test table the old substring gate got 44 right; the parsed gate gets all 74. It checks commands, not what scripts do — it is not a sandbox.',
    ],
    metric: { value: '74/74', label: 'gate test cases' },
    link: 'https://github.com/weilun9/autonomous-coding-agent',
    featured: true,
  },
  {
    id: 'steel-defect',
    title: 'Steel Defect Vision',
    tagline: 'Classical computer vision vs deep learning on one fixed test split.',
    stack: ['OpenCV', 'scikit-learn', 'TensorFlow', 'TFLite', 'Grad-CAM'],
    points: [
      'HOG + LBP + edge features with RandomForest reach 96.7% test accuracy on NEU-CLS (6 defect classes).',
      'MobileNetV2 transfer learning: 0 test errors in 4 seeded runs — reported honestly as a near-saturated dataset.',
      'TFLite export: 12.7 ms per image (fp32), 2.5 MB (int8); Grad-CAM peak lands on the defect 60.7% of the time vs 39.7% random.',
    ],
    metric: { value: '96.7%', label: 'classical CV accuracy' },
    link: 'https://github.com/weilun9/steel-defect-cv',
    featured: true,
  },
  {
    id: 'iot-aws',
    title: 'Serverless IoT Monitoring',
    tagline: 'Raspberry Pi to AWS telemetry, fully in CloudFormation.',
    stack: ['AWS IoT Core', 'Lambda', 'DynamoDB', 'Cognito', 'CloudFormation'],
    points: [
      'MQTT/TLS telemetry pipeline with a secured dashboard (OAuth 2.0 + PKCE) and remote device control.',
      'CloudWatch alarms and 27 tests that mock AWS.',
    ],
    metric: { value: '27', label: 'tests mocking AWS' },
  },
  {
    id: 'llm-eval',
    title: 'LLM Skill Evaluation',
    tagline: 'An A/B study, not a vibe check.',
    stack: ['Prompt engineering', 'LLM evaluation'],
    points: [
      'Benchmarked a custom LLM skill against a baseline on 142 graded items: 90.1% → 98.6% accuracy.',
      'Traced every remaining error and documented the limits of the test.',
    ],
    metric: { value: '98.6%', label: 'accuracy on 142 items' },
  },
  {
    id: 'northjet',
    title: 'NorthJet',
    tagline: 'Private-jet booking web app (Massey coursework).',
    stack: ['Next.js 14', 'TypeScript', 'MongoDB Atlas', 'Vercel'],
    points: [
      'Flight search, booking and cancellation across 5 routes; times stored in UTC and shown in local airport time, including the Chatham Islands UTC+12:45.',
    ],
    // Live demo not linked: its MongoDB Atlas connection is down (checked 2026-11-13).
    link: 'https://github.com/weilun9/northjet',
  },
]

export const experience = {
  role: 'Purchasing & Inventory Data Assistant',
  company: 'Yuen Sheng Trading · Masai, Johor',
  period: 'Part-time · Ongoing',
  points: [
    'Process supplier invoices and credit notes for 6+ suppliers (incl. Gardenia, Lam Soon, Nabati) into SmartAcc DynaMod on SQL Server, linked to AutoCount.',
    "Worked out and documented DynaMod's Excel import rules — barcode mapping, SST rounding, credit-note knock-off — turning ad-hoc entry into a repeatable process.",
    'In progress: an AI-assisted entry tool (Python, Claude vision) that turns invoice photos into import files with quantity, Sub Total and SST checks and duplicate protection.',
  ],
}

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'AI & LLM',
    items: ['LLM applications', 'AI agents', 'RAG', 'LangChain', 'LangGraph', 'MCP', 'Claude Agent SDK', 'Prompt engineering', 'LLM evaluation', 'Claude Code', 'Ollama', 'OpenAI / Anthropic / DeepSeek APIs', 'Hugging Face'],
  },
  {
    group: 'Machine learning & vision',
    items: ['TensorFlow / Keras', 'TFLite', 'scikit-learn', 'OpenCV', 'Grad-CAM'],
  },
  {
    group: 'Back end & cloud',
    items: ['Python', 'FastAPI', 'REST APIs', 'PostgreSQL', 'pgvector', 'SQLAlchemy', 'MongoDB', 'Docker', 'AWS', 'Vercel', 'GitHub Actions'],
  },
  {
    group: 'Integration & tools',
    items: ['WhatsApp Cloud API', 'Gmail', 'Slack', 'Google Sheets', 'Git', 'Linux', 'pytest', 'SQL Server', 'AutoCount'],
  },
  {
    group: 'Other languages',
    items: ['TypeScript / React / Next.js', 'C++', 'C# / ASP.NET MVC', 'Kotlin'],
  },
]

export const education = [
  {
    title: 'Bachelor of Information Sciences (CS & IT)',
    school: 'Massey University, NZ · delivered at PSB Academy, Singapore',
    period: 'Expected Mar 2027',
    detail: 'GPA 7.6/9.0 (≈ 3.76/4.0) · Massey "Excelling" recognition every semester · A+ in Software QA & Testing and OOP',
  },
  {
    title: 'Diploma in InfoComm Technology',
    school: 'PSB Academy, Singapore',
    period: 'Apr 2024 – Dec 2024',
    detail: '',
  },
]

export const languages = ['English (fluent)', 'Mandarin (native)', 'Malay (fluent)']
