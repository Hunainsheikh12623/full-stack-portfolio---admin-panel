export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  resumeUrl: string;
  email: string;
  phone: string;
  location: string;
  availabilityStatus: string;
  socialLinks: Array<{ platform: string; url: string; icon: string }>;
  seoDefaults: {
    title: string;
    description: string;
    ogImage: string;
  };
  adminPassword?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  gallery: string[];
  summary: string;
  description: string;
  category: string;
  tags: string[];
  techStack: string[];
  role: string;
  startDate: string;
  endDate: string;
  client: string;
  liveUrl: string;
  repoUrl: string;
  results: string;
  status: 'published' | 'draft';
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  body: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  publishedAt: string;
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  photoUrl: string;
  quote: string;
  rating: number;
  status: 'visible' | 'hidden';
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Cloud & DevOps' | 'Databases' | 'Architecture';
  proficiency: number; // 1 to 5
  icon: string;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  messages: Message[];
  mediaAssets: MediaAsset[];
}
