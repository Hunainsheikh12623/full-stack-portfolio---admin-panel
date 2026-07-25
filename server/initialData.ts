import { PortfolioData } from '../src/types.js';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: 'Alex Vance',
    title: 'Senior Systems & Full-Stack Engineer',
    tagline: 'Designing high-throughput distributed systems, modern web platforms, and fault-tolerant cloud architectures.',
    bio: 'With over 8 years of engineering experience, I specialize in building mission-critical backend microservices, real-time web applications, and developer platforms. I turn complex architectural challenges into clean, maintainable systems that scale seamlessly.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    resumeUrl: '/assets/resume.pdf',
    email: 'alex.vance.dev@gmail.com',
    phone: '+1 (555) 382-9102',
    location: 'San Francisco, CA / Remote',
    availabilityStatus: 'Open for Lead Roles & Strategic Contracts',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'X / Twitter', url: 'https://x.com', icon: 'twitter' },
      { platform: 'Email', url: 'mailto:alex.vance.dev@gmail.com', icon: 'mail' }
    ],
    seoDefaults: {
      title: 'Alex Vance | Senior Full-Stack Systems Engineer',
      description: 'Personal portfolio & systems engineering ledger of Alex Vance. High throughput systems, React, Node.js, and Cloud Infrastructure.',
      ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'
    },
    adminPassword: 'admin123'
  },
  projects: [
    {
      id: 'proj-1',
      title: 'Nexus Realtime Log Pipeline',
      slug: 'nexus-realtime-log-pipeline',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'High-throughput log ingestion system processing 100k+ events/sec with real-time stream aggregation.',
      description: '## Architectural Overview\nNexus is a fault-tolerant log streaming pipeline engineered to process millions of log events with sub-50ms query latency.\n\n### Key Technical Highlights\n- Built on an event-driven Go ingestion engine with zero-allocation JSON parsing.\n- Multi-tier caching strategy using Redis for hot queries and ClickHouse for historical analytics.\n- Live WebSocket dashboard for real-time traffic monitoring and alert routing.\n\n### Impact\nReduced infrastructure costs by **38%** while improving query throughput across 12 distributed clusters.',
      category: 'Backend Systems',
      tags: ['Distributed Systems', 'Go', 'Kafka', 'ClickHouse', 'React'],
      techStack: ['Go', 'Kafka', 'ClickHouse', 'TypeScript', 'TailwindCSS', 'Docker'],
      role: 'Lead Architect & Core Engineer',
      startDate: '2025-01',
      endDate: '2025-06',
      client: 'Veloce Data Corp',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Ingested 10B+ monthly log lines with 99.99% uptime',
      status: 'published',
      featured: true,
      order: 1,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z'
    },
    {
      id: 'proj-2',
      title: 'Aura Vector Gateway',
      slug: 'aura-vector-gateway',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'Distributed middleware proxy for semantic vector search and LLM context caching.',
      description: '## Project Summary\nAura serves as an intelligent proxy layer in front of vector databases (Qdrant & Pinecone), caching frequent semantic embedding lookups.\n\n### Key Features\n- Semantic cache layer using HNSW vector indexing.\n- Sub-10ms response times for repeat AI prompts.\n- Comprehensive telemetry dashboard for prompt inspection and rate limiting.',
      category: 'AI Infrastructure',
      tags: ['AI Middleware', 'TypeScript', 'Node.js', 'Vector DB', 'Redis'],
      techStack: ['Node.js', 'TypeScript', 'Express', 'Qdrant', 'Redis', 'React'],
      role: 'Creator & Maintainer',
      startDate: '2024-08',
      endDate: '2024-12',
      client: 'Open Source',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Cut OpenAI API costs by 45% for enterprise beta clients',
      status: 'published',
      featured: true,
      order: 2,
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-15T00:00:00Z'
    },
    {
      id: 'proj-3',
      title: 'Strata Cloud Orchestrator',
      slug: 'strata-cloud-orchestrator',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'Multi-cloud deployment canvas enabling engineers to visually map and provision Terraform stacks.',
      description: '## System Design\nStrata bridges visual design and IaC infrastructure code. Engineers draw service topologies and Strata automatically generates verified Terraform and Kubernetes manifests.\n\n### Features\n- Interactive canvas built with React Flow & WebGL.\n- Automated linting and security scanning for IAM roles.\n- One-click deployment preview via Webhooks.',
      category: 'Developer Tools',
      tags: ['Cloud', 'Terraform', 'React', 'TypeScript', 'Docker'],
      techStack: ['React', 'TypeScript', 'TailwindCSS', 'Go', 'Terraform API'],
      role: 'Principal Full Stack Engineer',
      startDate: '2024-01',
      endDate: '2024-07',
      client: 'CloudScale Inc',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Accelerated DevOps onboarding times by 60%',
      status: 'published',
      featured: true,
      order: 3,
      createdAt: '2024-07-20T00:00:00Z',
      updatedAt: '2024-07-20T00:00:00Z'
    }
  ],
  blogPosts: [
    {
      id: 'post-1',
      title: 'Architecting High-Availability Systems: Lessons from 100k EPS',
      slug: 'architecting-high-availability-systems',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
      excerpt: 'A deep dive into distributed consensus, backpressure handling, and graceful degradation during traffic spikes.',
      body: `Building systems that handle high throughput requires fundamental shifts in how we manage memory, IO, and network boundaries.

### 1. The Cost of Memory Allocation
At 100,000 events per second, even minor object instantiation inside hot loops causes severe Garbage Collection pause times. 

In Go and Node.js, adopting object pooling (\`sync.Pool\`) reduced overall P99 latency by over **60%**.

### 2. Backpressure and Circuit Breakers
Never let an upstream queue fail silently. When downstream persistent stores get overwhelmed, your ingestion edge must signal backpressure or shed non-critical load using token bucket algorithms.

### 3. Key Takeaways
- Design for failure from day one.
- Keep metrics actionable and correlated across request IDs.`,
      tags: ['Distributed Systems', 'Architecture', 'Performance'],
      status: 'published',
      publishedAt: '2026-03-12',
      readTime: '6 min read',
      createdAt: '2026-03-12T00:00:00Z',
      updatedAt: '2026-03-12T00:00:00Z'
    },
    {
      id: 'post-2',
      title: 'The Ledger Pattern: Crafting Honest & Auditable State Machines',
      slug: 'the-ledger-pattern-in-web-architecture',
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
      excerpt: 'Why append-only data stores eliminate race conditions and simplify debugging across complex web applications.',
      body: `Traditional CRUD applications overwrite row state directly in relational tables. While simple, direct updates destroy history and make distributed debugging nearly impossible.

### Event Sourcing & Append-Only Logs
By storing state changes as an immutable sequence of facts, we achieve:
1. Complete, unforgeable audit trail.
2. Time-travel debugging during incident response.
3. Natural event broadcasting to secondary search and analytics indexes.`,
      tags: ['Web Architecture', 'Database', 'Design Patterns'],
      status: 'published',
      publishedAt: '2026-01-28',
      readTime: '8 min read',
      createdAt: '2026-01-28T00:00:00Z',
      updatedAt: '2026-01-28T00:00:00Z'
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Sarah Lin',
      role: 'VP of Engineering',
      company: 'Veloce Data',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      quote: 'Alex is one of those rare engineers who can dive into complex low-level concurrency bugs in the morning and lead architectural discussions with executive stakeholders in the afternoon. Truly exceptional technical execution.',
      rating: 5,
      status: 'visible',
      order: 1
    },
    {
      id: 'test-2',
      name: 'David Miller',
      role: 'Principal Architect',
      company: 'CloudScale Inc',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      quote: 'Alex single-handedly redesigned our core orchestration engine, cutting our cloud deployment pipeline times by more than half. High code quality, thorough documentation, and zero operational drama.',
      rating: 5,
      status: 'visible',
      order: 2
    }
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript & JavaScript', category: 'Frontend', proficiency: 5, icon: 'code', order: 1 },
    { id: 'sk-2', name: 'React 19 & Next.js', category: 'Frontend', proficiency: 5, icon: 'layout', order: 2 },
    { id: 'sk-3', name: 'TailwindCSS v4', category: 'Frontend', proficiency: 5, icon: 'palette', order: 3 },
    { id: 'sk-4', name: 'Node.js & Express', category: 'Backend', proficiency: 5, icon: 'server', order: 4 },
    { id: 'sk-5', name: 'Go (Golang)', category: 'Backend', proficiency: 4, icon: 'cpu', order: 5 },
    { id: 'sk-6', name: 'PostgreSQL & ClickHouse', category: 'Databases', proficiency: 5, icon: 'database', order: 6 },
    { id: 'sk-7', name: 'Redis & Caching', category: 'Databases', proficiency: 5, icon: 'layers', order: 7 },
    { id: 'sk-8', name: 'Docker & Kubernetes', category: 'Cloud & DevOps', proficiency: 4, icon: 'box', order: 8 },
    { id: 'sk-9', name: 'Distributed Systems Design', category: 'Architecture', proficiency: 5, icon: 'network', order: 9 }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Veloce Data Corp',
      role: 'Lead Systems Engineer',
      startDate: '2024-03',
      endDate: 'Present',
      description: 'Leading the distributed storage and ingestion team. Architected event streaming pipeline serving 100k+ events/sec across multi-region Kubernetes clusters.',
      location: 'San Francisco, CA',
      order: 1
    },
    {
      id: 'exp-2',
      company: 'CloudScale Inc',
      role: 'Senior Full Stack Engineer',
      startDate: '2022-01',
      endDate: '2024-02',
      description: 'Developed developer-facing cloud management dashboard and automated IaC orchestration engines. Built real-time canvas tools and high-performance WebGL topology graphs.',
      location: 'San Francisco, CA',
      order: 2
    },
    {
      id: 'exp-3',
      company: 'Apex Systems',
      role: 'Software Engineer',
      startDate: '2019-06',
      endDate: '2021-12',
      description: 'Built RESTful microservices, internal dev tools, and React dashboards. Reduced database bottleneck latency by rewriting query layer in PostgreSQL.',
      location: 'Austin, TX',
      order: 3
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Stanford University',
      degree: 'Bachelor of Science (B.S.)',
      field: 'Computer Science (Systems & Distributed Software)',
      startDate: '2015',
      endDate: '2019',
      order: 1
    }
  ],
  messages: [
    {
      id: 'msg-1',
      name: 'Marcus Brody',
      email: 'm.brody@venturetech.com',
      subject: 'Inquiry regarding Lead Architect position',
      message: 'Hi Alex, loved your article on High Availability Systems. We are looking for a Lead Engineer to head our cloud infrastructure team at VentureTech. Would love to connect!',
      isRead: false,
      createdAt: '2026-07-24T14:32:00Z'
    }
  ],
  mediaAssets: [
    {
      id: 'media-1',
      fileName: 'system-architecture-diagram.png',
      fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      fileType: 'image/png',
      uploadedAt: '2026-07-01T10:00:00Z'
    }
  ]
};
