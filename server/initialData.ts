import { PortfolioData } from '../src/types.js';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: 'Hunain Sheikh',
    title: 'Computer Systems Engineer & Backend Developer',
    tagline: 'Passionate about building robust backend systems, REST APIs, and modern web software.',
    bio: 'I am a dedicated Computer Systems Engineering student at MUET Jamshoro. I focus on building practical software solutions, exploring modern backend technologies (Java, Spring Boot, Go), and studying System Design and SaaS development architectures.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    resumeUrl: '/assets/resume.pdf',
    email: 'hunainsheikh5656@gmail.com',
    phone: '+92 316 8255241',
    location: 'Sindh, Pakistan / Remote',
    availabilityStatus: 'Open for Software Engineering Internships & Entry-Level Roles',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'Email', url: 'mailto:hunainsheikh5656@gmail.com', icon: 'mail' }
    ],
    seoDefaults: {
      title: 'Hunain Sheikh | Computer Systems Engineer & Backend Developer',
      description: 'Personal portfolio of Hunain Sheikh. Specialized in Java, Go, Spring Boot, REST APIs, and Full-Stack development.',
      ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'
    },
    adminPassword: 'admin123'
  },
  projects: [
    {
      id: 'proj-1',
      title: 'Student Management System',
      slug: 'student-management-system',
      coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'A desktop student records manager built using Java and Maven, with local Excel storage.',
      description: '## Architectural Overview\nThe Student Management System is designed to showcase clean code principles using a layered architecture.\n\n### Key Features\n- **Layered Architecture**: Designed using the Repository pattern to decouple data access from business logic.\n- **Excel Integration**: Leveraged Apache POI to parse and write student records directly to Excel worksheets.\n- **CRUD Functionality**: Fully implemented operations to create, read, update, and delete student data.\n- **OOP Principles**: Applied core object-oriented concepts like encapsulation, inheritance, and polymorphism.',
      category: 'Desktop / Backend',
      tags: ['Java', 'Maven', 'Apache POI', 'OOP'],
      techStack: ['Java', 'Maven', 'Apache POI', 'OOP'],
      role: 'Core Developer',
      startDate: '2025-01',
      endDate: '2025-03',
      client: 'Academic Project',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Successfully built a local CLI records manager storing data in spreadsheets.',
      status: 'published',
      featured: true,
      order: 1,
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-03-01T00:00:00Z'
    },
    {
      id: 'proj-2',
      title: 'Portfolio Management System',
      slug: 'portfolio-management-system',
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'A full-stack portfolio manager driven by a Spring Boot REST API backend.',
      description: '## System Design\nThis project showcases a modern full-stack web flow where a client-side interface interacts with a Java-powered REST service.\n\n### Key Features\n- **RESTful Endpoints**: Designed clean, descriptive JSON endpoints for managing portfolio content.\n- **Lightweight DB**: Used H2 in-memory Database for local testing and swift query execution.\n- **API Integration**: Linked the backend REST APIs with a responsive user interface for end-to-end data flow.',
      category: 'Backend Systems',
      tags: ['Spring Boot', 'Java', 'H2 Database', 'REST APIs'],
      techStack: ['Spring Boot', 'Java', 'H2 Database', 'REST APIs', 'React'],
      role: 'Full-Stack Developer',
      startDate: '2025-04',
      endDate: '2025-06',
      client: 'Personal Project',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Created fully testable REST endpoints facilitating dynamic web portfolio updates.',
      status: 'published',
      featured: true,
      order: 2,
      createdAt: '2025-06-15T00:00:00Z',
      updatedAt: '2025-06-15T00:00:00Z'
    },
    {
      id: 'proj-3',
      title: 'WhatsApp Order Management System (SaaS Concept)',
      slug: 'whatsapp-order-management-saas',
      coverImage: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'A comprehensive SaaS product design and PRD mapping order flows for micro-businesses.',
      description: '## SaaS Concept & Planning\nSmall businesses frequently sell goods directly through chat. This system is designed as a software-as-a-service to organize those orders.\n\n### Project Highlights\n- **Requirement Engineering**: Created detailed Product Requirement Documents (PRDs) detailing user journeys.\n- **Component Planning**: Outlined modules for order management, customer registry, catalog inventory, analytics dashboard, and automated PDF invoice generation.',
      category: 'Product Design / SaaS',
      tags: ['SaaS', 'PRD', 'System Design', 'Product Planning'],
      techStack: ['System Design', 'Product Management', 'SaaS Architecture'],
      role: 'Product Architect',
      startDate: '2025-07',
      endDate: '2025-08',
      client: 'SaaS Concept Study',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Completed developer-ready PRD and comprehensive systems layout.',
      status: 'published',
      featured: true,
      order: 3,
      createdAt: '2025-08-20T00:00:00Z',
      updatedAt: '2025-08-20T00:00:00Z'
    },
    {
      id: 'proj-4',
      title: 'Personal Portfolio Website',
      slug: 'personal-portfolio-website',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'
      ],
      summary: 'Responsive personal portfolio website showcasing developer skills, projects, and work history.',
      description: '## Frontend Engineering\nDeveloped a premium, highly responsive personal website to host resume details, blog entries, and project highlights.\n\n### Key Highlights\n- **Responsive Design**: Designed with a mobile-first approach ensuring layout integrity across all screens.\n- **Modern UX**: Emphasized smooth transitions, readable typography, and polished dark-mode aesthetics.',
      category: 'Frontend Development',
      tags: ['React', 'JavaScript', 'Tailwind CSS', 'CSS'],
      techStack: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS'],
      role: 'Frontend Engineer',
      startDate: '2026-07',
      endDate: '2026-07',
      client: 'Personal Project',
      liveUrl: 'https://github.com',
      repoUrl: 'https://github.com',
      results: 'Successfully built and launched a personal developer portfolio.',
      status: 'published',
      featured: true,
      order: 4,
      createdAt: '2026-07-20T00:00:00Z',
      updatedAt: '2026-07-20T00:00:00Z'
    }
  ],
  blogPosts: [
    {
      id: 'post-1',
      title: 'Deep Dive into Spring Boot REST APIs for Beginners',
      slug: 'deep-dive-into-spring-boot-rest-apis',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
      excerpt: 'My journey building a Portfolio Management system and structuring clean CRUD API endpoints in Java.',
      body: `Building backend systems requires structured APIs. In this post, I write about constructing REST endpoints with Spring Boot, managing H2 in-memory databases, and connecting them to frontends.

### 1. REST Endpoint Structure
Using Spring Web, it's straightforward to define controllers that parse JSON requests. Ensuring we return correct HTTP status codes (201 for Created, 200 for OK, 404 for Not Found) is crucial for standard API clients.

### 2. In-Memory Persistence
Using H2 makes rapid local testing painless. Combined with Spring Data JPA, schema creation and database queries require minimal configuration, allowing you to focus on logic first.`,
      tags: ['Spring Boot', 'Java', 'REST APIs', 'Backend'],
      status: 'published',
      publishedAt: '2026-06-15',
      readTime: '5 min read',
      createdAt: '2026-06-15T00:00:00Z',
      updatedAt: '2026-06-15T00:00:00Z'
    },
    {
      id: 'post-2',
      title: 'Transitioning from Java to Go: A Student\'s Perspective',
      slug: 'transitioning-from-java-to-go',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
      excerpt: 'Exploring Go concurrency, simple syntax, and how it compares to standard Java OOP patterns.',
      body: `I started my backend journey in Java, but recently I've been exploring Go (Golang). Here are my initial findings regarding goroutines, pointers, structs, and why Go makes building microservices a breeze.

### Concurrency and Speed
While Java has strong thread support and enterprise backing, Go was designed from the ground up for concurrent operations with lightweight Goroutines.

### Simplicity of Go
Go does not have class-based inheritance, which simplifies object mapping. Using structs and composition allows you to build modular code without deep hierarchy structures.`,
      tags: ['Go', 'Golang', 'Java', 'Learning'],
      status: 'published',
      publishedAt: '2026-07-20',
      readTime: '6 min read',
      createdAt: '2026-07-20T00:00:00Z',
      updatedAt: '2026-07-20T00:00:00Z'
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Project Advisor',
      role: 'Department of Computer Systems',
      company: 'MUET Jamshoro',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      quote: 'Hunain shows great initiative as a Computer Systems Engineering student. He is eager to learn, takes feedback constructively, and builds clean software.',
      rating: 5,
      status: 'visible',
      order: 1
    },
    {
      id: 'test-2',
      name: 'Tech Mentor',
      role: 'Senior Developer Mentor',
      company: 'Developer Community',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      quote: 'Working with Hunain on software concepts has been a pleasure. His problem-solving mindset and adaptability are exceptional for a student.',
      rating: 5,
      status: 'visible',
      order: 2
    }
  ],
  skills: [
    { id: 'sk-1', name: 'Java', category: 'Backend', proficiency: 4, icon: 'code', order: 1 },
    { id: 'sk-2', name: 'Go (Golang)', category: 'Backend', proficiency: 3, icon: 'cpu', order: 2 },
    { id: 'sk-3', name: 'C++', category: 'Backend', proficiency: 3, icon: 'code', order: 3 },
    { id: 'sk-4', name: 'Spring Boot', category: 'Backend', proficiency: 4, icon: 'server', order: 4 },
    { id: 'sk-5', name: 'REST APIs & API Development', category: 'Backend', proficiency: 4, icon: 'activity', order: 5 },
    { id: 'sk-6', name: 'JavaScript', category: 'Frontend', proficiency: 4, icon: 'terminal', order: 6 },
    { id: 'sk-7', name: 'React & Next.js', category: 'Frontend', proficiency: 4, icon: 'layout', order: 7 },
    { id: 'sk-8', name: 'Vue.js', category: 'Frontend', proficiency: 3, icon: 'code', order: 8 },
    { id: 'sk-9', name: 'Tailwind CSS & Bootstrap', category: 'Frontend', proficiency: 5, icon: 'palette', order: 9 },
    { id: 'sk-10', name: 'HTML & CSS', category: 'Frontend', proficiency: 5, icon: 'layout', order: 10 },
    { id: 'sk-11', name: 'PostgreSQL & MySQL', category: 'Databases', proficiency: 4, icon: 'database', order: 11 },
    { id: 'sk-12', name: 'SQLite & H2 Database', category: 'Databases', proficiency: 4, icon: 'database', order: 12 },
    { id: 'sk-13', name: 'Neon PostgreSQL', category: 'Databases', proficiency: 4, icon: 'database', order: 13 },
    { id: 'sk-14', name: 'Git & GitHub', category: 'Cloud & DevOps', proficiency: 4, icon: 'git-branch', order: 14 },
    { id: 'sk-15', name: 'Linux (Ubuntu)', category: 'Cloud & DevOps', proficiency: 3, icon: 'terminal', order: 15 },
    { id: 'sk-16', name: 'Docker (Beginner)', category: 'Cloud & DevOps', proficiency: 2, icon: 'box', order: 16 },
    { id: 'sk-17', name: 'Object-Oriented Programming', category: 'Architecture', proficiency: 4, icon: 'layers', order: 17 },
    { id: 'sk-18', name: 'Data Structures & Algorithms', category: 'Architecture', proficiency: 4, icon: 'git-merge', order: 18 },
    { id: 'sk-19', name: 'MVC & Layered Architecture', category: 'Architecture', proficiency: 4, icon: 'package', order: 19 },
    { id: 'sk-20', name: 'System Design (Learning)', category: 'Architecture', proficiency: 3, icon: 'network', order: 20 }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Mehran University of Engineering & Technology (MUET)',
      role: 'Computer Systems Engineering Student',
      startDate: '2022',
      endDate: 'Present',
      description: 'Focusing on Computer Systems Engineering fundamentals. Building desktop applications in Java, backend services with Spring Boot, and mastering modern software architecture, database design, and cloud systems.',
      location: 'Jamshoro, Sindh, Pakistan',
      order: 1
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Mehran University of Engineering & Technology (MUET)',
      degree: 'Bachelor of Engineering (BE)',
      field: 'Computer Systems Engineering',
      startDate: '2022',
      endDate: '2026',
      order: 1
    }
  ],
  messages: [],
  mediaAssets: []
};
