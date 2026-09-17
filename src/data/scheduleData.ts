import { ScheduleBlock, WeekendBlock, Phase } from '../types';

export const WEEKDAY_BLOCKS: ScheduleBlock[] = [
  {
    id: 'wake-review',
    timeRange: '8:30 – 9:15 AM',
    title: 'Wake · Light review',
    description: "No deep problem-solving — your brain isn't warmed up. 30–40 min of passive review: flip through yesterday's DSA notes, re-read one LLD/HLD concept, or watch a short system-design breakdown over breakfast.",
    bulletPoints: [
      "Flip through yesterday's DSA notes or flashcards",
      "Re-read one key LLD or HLD architectural pattern",
      "Watch a bite-sized system design video breakdown over breakfast",
    ],
    category: 'wake-review',
    startMinutes: 8 * 60 + 30, // 510
    endMinutes: 9 * 60 + 15,   // 555
    guidance: "Protect mental energy. Do not open LeetCode hard problems or attempt heavy debugging right out of bed.",
    keyRule: "Zero heavy lifting; passive assimilation only.",
    tagColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      accent: '#f59e0b',
    },
  },
  {
    id: 'buffer-commute',
    timeRange: '9:15 – 10:45 AM',
    title: 'Buffer / commute / get ready',
    description: "Slack time before work. If you have extra runway, this is a second passive-review slot — never a heavy-lifting one.",
    bulletPoints: [
      "Freshen up, breakfast completion & transit",
      "Optional passive audio/podcast on tech architectures",
      "Clear mind and transition smoothly into professional day",
    ],
    category: 'buffer',
    startMinutes: 9 * 60 + 15,  // 555
    endMinutes: 10 * 60 + 45,  // 645
    guidance: "Unrushed morning buffer to prevent stress before the workday starts.",
    keyRule: "Never turn this into an intense study grind.",
    tagColor: {
      bg: 'bg-stone-50',
      text: 'text-stone-700',
      border: 'border-stone-200',
      accent: '#78716c',
    },
  },
  {
    id: 'job-hours',
    timeRange: '11:00 AM – 7:00 PM',
    title: 'Job',
    description: "Untouched. Interview prep does not compete with work hours.",
    bulletPoints: [
      "Full professional focus on your primary job deliverables",
      "Zero context-switching or secret interview studying",
      "Maintain high career performance and peace of mind",
    ],
    category: 'job',
    startMinutes: 11 * 60,      // 660
    endMinutes: 19 * 60,       // 1140
    guidance: "Clean separation guarantees sustained stamina over months without anxiety or compromised job security.",
    keyRule: "Untouched: Interview prep does not compete with work hours.",
    tagColor: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      accent: '#64748b',
    },
  },
  {
    id: 'decompress',
    timeRange: '7:00 – 7:30 PM',
    title: 'Decompress',
    description: "Commute / change / short walk. Don't go straight from laptop to desk again — you'll burn out by week 3.",
    bulletPoints: [
      "Shut down work machines completely",
      "Change into comfortable athletic / leisure clothes",
      "Hydrate and let work adrenaline subside naturally",
    ],
    category: 'decompress',
    startMinutes: 19 * 60,      // 1140
    endMinutes: 19 * 60 + 30,   // 1170
    guidance: "A mandatory airlock between daytime job pressure and evening activities.",
    keyRule: "Don't go straight from laptop to desk again — burnout prevention.",
    tagColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      accent: '#0d9488',
    },
  },
  {
    id: 'terrace-walk',
    timeRange: '7:30 – 8:10 PM',
    title: 'Terrace walk',
    description: "30–40 min brisk walk. Right after work, before dinner — easiest habit to keep since it needs zero setup.",
    bulletPoints: [
      "30–40 minutes continuous brisk walking",
      "Terrace or outdoors with fresh air and natural pace",
      "Zero equipment or gym logistics needed",
    ],
    category: 'walk',
    startMinutes: 19 * 60 + 30, // 1170
    endMinutes: 20 * 60 + 10,   // 1210
    guidance: "Builds cardiovascular stamina, burns calories, and physically resets your posture before dinner.",
    keyRule: "Easiest habit to maintain; needs zero setup.",
    tagColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      accent: '#059669',
    },
  },
  {
    id: 'dinner',
    timeRange: '8:10 – 8:50 PM',
    title: 'Dinner',
    description: "This is your main fat-loss lever now — a modest calorie deficit, protein-forward, lighter/no carbs late. Nothing heavy right before your study block.",
    bulletPoints: [
      "High protein (eggs, paneer, chicken/fish, lentils, tofu)",
      "Modest calorie deficit with lighter/no carbs late in the evening",
      "Avoid heavy sugar or lethargy-inducing fats right before study",
    ],
    category: 'dinner',
    startMinutes: 20 * 60 + 10, // 1210
    endMinutes: 20 * 60 + 50,   // 1250
    guidance: "Eating clean prevents the post-meal brain fog that ruins evening focus blocks.",
    keyRule: "Main fat-loss lever: modest deficit, protein-forward, avoid heavy carbs.",
    tagColor: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      accent: '#ea580c',
    },
  },
  {
    id: 'deep-work',
    timeRange: '8:50 – 10:50 PM',
    title: 'Deep work — main study block',
    description: "Your real prep happens here, when you're actually switched on. 2 hrs, split as 70 min DSA/LLD/HLD (rotating) + 40 min AI/agentic-systems interview prep + 10 min log what you covered.",
    bulletPoints: [
      "70 min: DSA / LLD / HLD (rotating daily priority)",
      "40 min: AI & Agentic-Systems interview prep (agents, tools, RAG)",
      "10 min: Quick reflection & logging what was mastered",
    ],
    category: 'deep-work',
    startMinutes: 20 * 60 + 50, // 1250
    endMinutes: 22 * 60 + 50,   // 1370
    guidance: "Two laser-focused hours with all notifications muted. High cognitive execution.",
    keyRule: "2-hour exact split: 70m core + 40m AI systems + 10m log.",
    tagColor: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      accent: '#4f46e5',
    },
  },
  {
    id: 'wind-down',
    timeRange: '11:00 – 11:30 PM',
    title: 'Wind down',
    description: "No screens with hard problems this late — light reading or nothing. Protect sleep; groggy mornings get worse if you cut this.",
    bulletPoints: [
      "Step away from coding terminals and algorithmic screens",
      "Dim room lighting; light book or offline relaxation",
      "Consistent bedtime to fuel tomorrow's 8:30 AM wake block",
    ],
    category: 'wind-down',
    startMinutes: 23 * 60,      // 1380
    endMinutes: 23 * 60 + 30,   // 1410
    guidance: "Restorative sleep is non-negotiable for memory consolidation and neural plasticity.",
    keyRule: "No screens with hard problems; protect restorative sleep.",
    tagColor: {
      bg: 'bg-violet-50',
      text: 'text-violet-800',
      border: 'border-violet-200',
      accent: '#7c3aed',
    },
  },
];

export const WEEKEND_BLOCKS: WeekendBlock[] = [
  {
    id: 'weekend-morning',
    timeTitle: 'Morning (whenever you wake, no alarm pressure)',
    title: 'Longer walk — 45–60 min',
    description: 'Longer walk on the terrace or outside. Wake naturally without alarm pressure to recover sleep debt from the week.',
    activities: [
      '45–60 minute extended relaxed walk in fresh outdoor air',
      'Listen to tech talks, podcasts, or enjoy quiet contemplation',
      'Hydrate and enjoy an unhurried, healthy breakfast',
    ],
    keyRule: 'No alarm pressure. Let circadian rhythm recover.',
    iconName: 'Sun',
    category: 'walk',
  },
  {
    id: 'weekend-deep',
    timeTitle: 'Late morning / early afternoon',
    title: '3–4 hr Deep Block',
    description: 'High-leverage interview simulations: mock interviews, timed LeetCode sets, full LLD/HLD design exercises, or a full AI-system-design case.',
    activities: [
      'Timed LeetCode contest or 2-problem mock assessment (75 min)',
      'Full Low-Level / High-Level architecture end-to-end design doc',
      'AI & Agentic-system case study (e.g. multi-agent orchestration, tool routing, memory)',
      'Review mistakes and extract pattern takeaways',
    ],
    keyRule: 'Simulate real interview conditions with timed constraints.',
    iconName: 'BrainCircuit',
    category: 'deep-block',
  },
  {
    id: 'weekend-evening',
    timeTitle: 'Evening',
    title: "Light review + Planning next week's focus",
    description: "Consolidate the week's notes and plan upcoming targets. One full evening off per weekend — non-negotiable.",
    activities: [
      "Review the week's study logs and tag topics needing second-pass review",
      "Define 5 specific DSA problem archetypes and 2 system design topics for next week",
      "One full evening off per weekend: social time, movies, hobbies — non-negotiable rest",
    ],
    keyRule: 'One full evening off per weekend — non-negotiable.',
    iconName: 'Compass',
    category: 'review-off',
  },
];

export const ROTATING_STUDY_TRACKS = [
  {
    id: 'dsa',
    name: 'DSA Rotation',
    splitMinutes: 70,
    subtitle: 'Data Structures & Algorithms',
    topics: [
      'Arrays, Hash Maps & Two Pointers',
      'Sliding Window & Monotonic Queue',
      'Trees, BSTs & Binary Tree Inversion',
      'Graph Traversal (DFS/BFS, Topological Sort)',
      'Dynamic Programming (1D, 2D, Knapsack patterns)',
      'Intervals, Heaps & Trie structures',
    ],
  },
  {
    id: 'lld',
    name: 'LLD Rotation',
    splitMinutes: 70,
    subtitle: 'Low-Level & Object-Oriented Design',
    topics: [
      'SOLID Principles & Clean Architecture',
      'Design Patterns: Factory, Strategy, Observer, Decorator',
      'Concurrency & Thread-Safe Resource Pools',
      'Parking Lot / Elevator / Movie Booking System',
      'Rate Limiter / In-Memory Cache (LRU/LFU)',
      'Notification Dispatcher / Event Bus',
    ],
  },
  {
    id: 'hld',
    name: 'HLD Rotation',
    splitMinutes: 70,
    subtitle: 'High-Level Distributed Systems',
    topics: [
      'Scalability & Load Balancing (L4 vs L7)',
      'Database Partitioning, Sharding & Replication',
      'Caching Strategies (Write-through, Write-back, CDC)',
      'Message Queues & Event-Driven Architecture (Kafka)',
      'URL Shortener / Key-Value Store / Web Crawler',
      'Payment Gateway / Ride-Sharing Dispatch',
    ],
  },
];

export const AI_PREP_TRACK = {
  splitMinutes: 40,
  name: 'AI & Agentic-Systems Prep',
  subtitle: 'Modern AI Engineering & System Architecture',
  topics: [
    'LLM Fundamentals: Context windows, Tokenization, Sampling params',
    'Agentic Frameworks: ReAct, Plan-and-Solve, Reflection loops',
    'Tool-Use & Function Calling: Parameter schemas, Error handling & fallbacks',
    'RAG Architectures: Hybrid search, Reranking, Chunking & Chunk metadata',
    'Agent Memory & State: Ephemeral scratchpads vs Vector/Graph persistence',
    'Multi-Agent Workflows: Supervisor-worker, Sequential, Swarm models',
    'Evaluations & Guardrails: Toxicity filters, Hallucination detection, Benchmarking',
    'Latency & Cost Optimization: Semantic caching, Speculative decoding, Model tiering',
  ],
};

export const PHASES_ROADMAP: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Foundations & Core DSA + System Design Primitives',
    startDate: 'Sept 17, 2026',
    endDate: 'Oct 22, 2026',
    startISO: '2026-09-17',
    endISO: '2026-10-22',
    focusDSA: [
      'Two Pointers, Sliding Window, Fast/Slow Pointers',
      'Binary Search edge cases & sorted matrices',
      'Recursion, Backtracking & Tree Traversals',
    ],
    focusDesign: [
      'OOP Principles & Clean Class Interfaces',
      'Creational & Structural Design Patterns (Factory, Strategy)',
      'Basic High-Level client-server topologies & caching',
    ],
    focusAI: [
      'LLM APIs, prompt mechanics & structured output guarantees',
      'Function calling & parameter serialization fundamentals',
    ],
    milestoneGoal: 'Establish rock-solid daily 8:50 PM study habit + solve 40 fundamental DSA problems.',
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Advanced Data Structures & LLD Patterns + LLM / Agent Fundamentals',
    startDate: 'Oct 23, 2026',
    endDate: 'Nov 26, 2026',
    startISO: '2026-10-23',
    endISO: '2026-11-26',
    focusDSA: [
      'Graphs (BFS/DFS, Dijkstra, Topo Sort, Union Find)',
      '1D & 2D Dynamic Programming (Subsequences, Grid Paths)',
      'Monotonic Stack & Deque interview patterns',
    ],
    focusDesign: [
      'Behavioral Patterns: Observer, Command, State pattern',
      'Thread-safe In-Memory Cache (LRU) with concurrency controls',
      'HLD: Database replication, indexing & horizontal sharding',
    ],
    focusAI: [
      'Agentic reasoning loops (ReAct pattern implementation)',
      'Tool execution loops with retry & validation mechanisms',
      'Retrieval-Augmented Generation (RAG) vector pipelines',
    ],
    milestoneGoal: 'Master Graph & DP archetypes; complete 3 full LLD designs & basic custom agent loop.',
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Distributed HLD Architectures & Production Agentic Systems',
    startDate: 'Nov 27, 2026',
    endDate: 'Dec 31, 2026',
    startISO: '2026-11-27',
    endISO: '2026-12-31',
    focusDSA: [
      'Hard Graph & DP variants (Tree DP, Bitmask DP)',
      'Interval Scheduling & Advanced Trie lookups',
      'Medium/Hard speed drill sets under 20 mins',
    ],
    focusDesign: [
      'Distributed Rate Limiter (Token bucket, Leaky bucket, Redis cluster)',
      'Message Queues & Eventual Consistency (Kafka, Outbox pattern)',
      'Scalable Video Streaming / Distributed File Storage',
    ],
    focusAI: [
      'Multi-Agent orchestration (Hierarchical Supervisor, Router)',
      'Long-term Memory (Vector + Knowledge Graph hybrids)',
      'Cost, rate limits & semantic caching strategies',
    ],
    milestoneGoal: 'Design 5 standard HLD systems end-to-end; architect production-grade agentic pipeline.',
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Full-Scale Mock Interviews, Timed Speedruns & Deep AI Case Studies',
    startDate: 'Jan 1, 2027',
    endDate: 'Feb 15, 2027',
    startISO: '2027-01-01',
    endISO: '2027-02-15',
    focusDSA: [
      'Weekend Timed 4-problem mock contests',
      'Verbalizing thought process out loud while coding',
      'Dry running code with edge cases before submitting',
    ],
    focusDesign: [
      'Complete 45-minute whiteboarding simulations (HLD & LLD)',
      'Handling live trade-offs (Latency vs Consistency, Cost vs Complexity)',
      'Live bottleneck diagnosis and fault tolerance scenarios',
    ],
    focusAI: [
      'AI System Design interviews: Enterprise RAG, Autonomous Code Assistant',
      'Live debugging of agent hallucination & runaway execution',
      'System evaluation frameworks & benchmark metrics',
    ],
    milestoneGoal: 'Pass 10 timed mock interviews across DSA, System Design, and AI Architecture.',
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Polishing, Behavioral & High-Yield Re-review',
    startDate: 'Feb 16, 2027',
    endDate: 'Mar 27, 2027',
    startISO: '2027-02-16',
    endISO: '2027-03-27',
    focusDSA: [
      'Rapid-fire review of personal error log & tricky edge cases',
      'Top 50 high-frequency company interview problems',
      'No new obscure topics — reinforce mastered intuition',
    ],
    focusDesign: [
      'Fast 15-minute system design outlines on common templates',
      'Behavioral STAR stories mapping technical leadership & conflicts',
      'Refined communication: crisp requirements scoping & assumptions',
    ],
    focusAI: [
      'Cutting-edge trends: Speculative decoding, Tool verification, MCP',
      'Executive summary of architectural trade-offs for interviewers',
    ],
    milestoneGoal: 'Peak mental readiness, zero burnout, high technical fluency & calm execution by Mar 27.',
  },
];
