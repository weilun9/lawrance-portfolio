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
}

export const projects: Project[] = [
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
      'Product spec written first, including what the agent must not do.',
    ],
    metric: { value: '48 h', label: 'human takeover window' },
    link: 'https://github.com/weilun9/ar-collections-agent',
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
    items: ['LLM applications', 'AI agents', 'RAG', 'LangChain', 'LangGraph', 'Prompt engineering', 'LLM evaluation', 'Claude Code', 'Ollama', 'OpenAI / Anthropic APIs', 'Hugging Face'],
  },
  {
    group: 'Back end & cloud',
    items: ['Python', 'FastAPI', 'REST APIs', 'SQL', 'MongoDB', 'Docker', 'AWS', 'GitHub Actions'],
  },
  {
    group: 'Integration & tools',
    items: ['WhatsApp Cloud API', 'Gmail', 'Slack', 'Google Sheets', 'Git', 'Linux', 'pytest', 'SQL Server', 'AutoCount'],
  },
  {
    group: 'Other languages',
    items: ['TypeScript / Next.js', 'C++', 'C# / ASP.NET MVC', 'Kotlin'],
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
