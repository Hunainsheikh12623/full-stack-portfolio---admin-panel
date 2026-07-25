import express from 'express';
import { deleteStoredMedia, initStore, loginAdmin, saveStore, uploadMedia, verifyAdminToken } from './server/store.js';
import { PortfolioData, Project, BlogPost, Testimonial, Skill, Experience, Education, Message, MediaAsset } from './src/types.js';

export async function createApp() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));

  // Initialize the Supabase-backed portfolio data cache.
  let portfolioData: PortfolioData = await initStore();

  // Helper auth check for Admin API routes
  const requireAdminAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
    }
    const token = authHeader.split(' ')[1];
    if (!(await verifyAdminToken(token))) {
      return res.status(401).json({ error: 'Invalid or expired admin session token.' });
    }
    next();
  };

  // ==================== PUBLIC API ENDPOINTS ==================== //

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Get public site data (only published/visible content)
  app.get('/api/public/data', (_req, res) => {
    const publicProfile = { ...portfolioData.profile };
    delete publicProfile.adminPassword;

    res.json({
      profile: publicProfile,
      projects: portfolioData.projects.filter(p => p.status === 'published').sort((a, b) => a.order - b.order),
      blogPosts: portfolioData.blogPosts.filter(b => b.status === 'published').sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
      testimonials: portfolioData.testimonials.filter(t => t.status === 'visible').sort((a, b) => a.order - b.order),
      skills: portfolioData.skills.sort((a, b) => a.order - b.order),
      experience: portfolioData.experience.sort((a, b) => a.order - b.order),
      education: portfolioData.education.sort((a, b) => a.order - b.order)
    });
  });

  // Get project by slug
  app.get('/api/public/projects/:slug', (req, res) => {
    const project = portfolioData.projects.find(p => p.slug === req.params.slug && p.status === 'published');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });

  // Get blog post by slug
  app.get('/api/public/blog/:slug', (req, res) => {
    const post = portfolioData.blogPosts.find(b => b.slug === req.params.slug && b.status === 'published');
    if (!post) return res.status(404).json({ error: 'Blog post not found' });
    res.json(post);
  });

  // Submit contact message from public site
  app.post('/api/public/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    portfolioData.messages.unshift(newMessage);
    await saveStore(portfolioData);

    res.status(201).json({ success: true, message: 'Message received successfully!', messageId: newMessage.id });
  });

  // ==================== ADMIN AUTH & CRUD ENDPOINTS ==================== //

  // Admin login endpoint
  app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    try {
      const token = await loginAdmin(email, password);
      return res.json({ success: true, token, message: 'Admin authentication successful.' });
    } catch (error) {
      return res.status(401).json({ error: error instanceof Error ? error.message : 'Incorrect email or password.' });
    }
  });

  // Verify admin token status
  app.get('/api/admin/verify', requireAdminAuth, (_req, res) => {
    res.json({ authenticated: true });
  });

  // Get ALL data for admin panel (including draft items, messages, media assets, credentials)
  app.get('/api/admin/data', requireAdminAuth, (_req, res) => {
    res.json(portfolioData);
  });

  // Update profile and settings
  app.put('/api/admin/profile', requireAdminAuth, async (req, res) => {
    const update = req.body;
    portfolioData.profile = {
      ...portfolioData.profile,
      ...update
    };
    await saveStore(portfolioData);
    res.json({ success: true, profile: portfolioData.profile });
  });

  // PROJECTS CRUD
  app.post('/api/admin/projects', requireAdminAuth, async (req, res) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: req.body.title || 'Untitled Project',
      slug: (req.body.slug || req.body.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      gallery: req.body.gallery || [],
      summary: req.body.summary || '',
      description: req.body.description || '',
      category: req.body.category || 'General',
      tags: req.body.tags || [],
      techStack: req.body.techStack || [],
      role: req.body.role || 'Software Engineer',
      startDate: req.body.startDate || new Date().toISOString().substring(0, 7),
      endDate: req.body.endDate || 'Present',
      client: req.body.client || 'Internal',
      liveUrl: req.body.liveUrl || '',
      repoUrl: req.body.repoUrl || '',
      results: req.body.results || '',
      status: req.body.status || 'published',
      featured: req.body.featured ?? true,
      order: portfolioData.projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    portfolioData.projects.unshift(newProject);
    await saveStore(portfolioData);
    res.status(201).json(newProject);
  });

  app.put('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    portfolioData.projects[idx] = {
      ...portfolioData.projects[idx],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await saveStore(portfolioData);
    res.json(portfolioData.projects[idx]);
  });

  app.delete('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    portfolioData.projects = portfolioData.projects.filter(p => p.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // BLOG POSTS CRUD
  app.post('/api/admin/blog', requireAdminAuth, async (req, res) => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: req.body.title || 'Untitled Post',
      slug: (req.body.slug || req.body.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
      excerpt: req.body.excerpt || '',
      body: req.body.body || '',
      tags: req.body.tags || [],
      status: req.body.status || 'draft',
      publishedAt: req.body.publishedAt || new Date().toISOString().substring(0, 10),
      readTime: req.body.readTime || '5 min read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    portfolioData.blogPosts.unshift(newPost);
    await saveStore(portfolioData);
    res.status(201).json(newPost);
  });

  app.put('/api/admin/blog/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.blogPosts.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Blog post not found' });

    portfolioData.blogPosts[idx] = {
      ...portfolioData.blogPosts[idx],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await saveStore(portfolioData);
    res.json(portfolioData.blogPosts[idx]);
  });

  app.delete('/api/admin/blog/:id', requireAdminAuth, async (req, res) => {
    portfolioData.blogPosts = portfolioData.blogPosts.filter(b => b.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // TESTIMONIALS CRUD
  app.post('/api/admin/testimonials', requireAdminAuth, async (req, res) => {
    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      name: req.body.name || 'Client Name',
      role: req.body.role || 'Executive',
      company: req.body.company || 'Company Inc',
      photoUrl: req.body.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      quote: req.body.quote || 'Great experience working together.',
      rating: req.body.rating || 5,
      status: req.body.status || 'visible',
      order: portfolioData.testimonials.length + 1
    };

    portfolioData.testimonials.push(newTestimonial);
    await saveStore(portfolioData);
    res.status(201).json(newTestimonial);
  });

  app.put('/api/admin/testimonials/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.testimonials.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });

    portfolioData.testimonials[idx] = {
      ...portfolioData.testimonials[idx],
      ...req.body
    };
    await saveStore(portfolioData);
    res.json(portfolioData.testimonials[idx]);
  });

  app.delete('/api/admin/testimonials/:id', requireAdminAuth, async (req, res) => {
    portfolioData.testimonials = portfolioData.testimonials.filter(t => t.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // SKILLS CRUD
  app.post('/api/admin/skills', requireAdminAuth, async (req, res) => {
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: req.body.name || 'New Technology',
      category: req.body.category || 'Frontend',
      proficiency: req.body.proficiency || 4,
      icon: req.body.icon || 'code',
      order: portfolioData.skills.length + 1
    };

    portfolioData.skills.push(newSkill);
    await saveStore(portfolioData);
    res.status(201).json(newSkill);
  });

  app.put('/api/admin/skills/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.skills.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Skill not found' });

    portfolioData.skills[idx] = { ...portfolioData.skills[idx], ...req.body };
    await saveStore(portfolioData);
    res.json(portfolioData.skills[idx]);
  });

  app.delete('/api/admin/skills/:id', requireAdminAuth, async (req, res) => {
    portfolioData.skills = portfolioData.skills.filter(s => s.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // EXPERIENCE CRUD
  app.post('/api/admin/experience', requireAdminAuth, async (req, res) => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: req.body.company || 'Company Name',
      role: req.body.role || 'Role Title',
      startDate: req.body.startDate || '2024-01',
      endDate: req.body.endDate || 'Present',
      description: req.body.description || '',
      location: req.body.location || 'Remote',
      order: portfolioData.experience.length + 1
    };

    portfolioData.experience.push(newExp);
    await saveStore(portfolioData);
    res.status(201).json(newExp);
  });

  app.put('/api/admin/experience/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.experience.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Experience record not found' });

    portfolioData.experience[idx] = { ...portfolioData.experience[idx], ...req.body };
    await saveStore(portfolioData);
    res.json(portfolioData.experience[idx]);
  });

  app.delete('/api/admin/experience/:id', requireAdminAuth, async (req, res) => {
    portfolioData.experience = portfolioData.experience.filter(e => e.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // EDUCATION CRUD
  app.post('/api/admin/education', requireAdminAuth, async (req, res) => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: req.body.institution || 'University Name',
      degree: req.body.degree || 'Bachelor of Science',
      field: req.body.field || 'Computer Science',
      startDate: req.body.startDate || '2018',
      endDate: req.body.endDate || '2022',
      order: portfolioData.education.length + 1
    };

    portfolioData.education.push(newEdu);
    await saveStore(portfolioData);
    res.status(201).json(newEdu);
  });

  app.put('/api/admin/education/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.education.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Education record not found' });

    portfolioData.education[idx] = { ...portfolioData.education[idx], ...req.body };
    await saveStore(portfolioData);
    res.json(portfolioData.education[idx]);
  });

  app.delete('/api/admin/education/:id', requireAdminAuth, async (req, res) => {
    portfolioData.education = portfolioData.education.filter(e => e.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // MESSAGES INBOX CRUD
  app.put('/api/admin/messages/:id/read', requireAdminAuth, async (req, res) => {
    const msg = portfolioData.messages.find(m => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    msg.isRead = req.body.isRead ?? true;
    await saveStore(portfolioData);
    res.json(msg);
  });

  app.delete('/api/admin/messages/:id', requireAdminAuth, async (req, res) => {
    portfolioData.messages = portfolioData.messages.filter(m => m.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // MEDIA ASSETS UPLOAD / LIBRARY CRUD
  app.post('/api/admin/media', requireAdminAuth, async (req, res) => {
    const { fileName, fileUrl, fileType } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ error: 'fileUrl is required' });
    }

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      fileName: fileName || `upload-${Date.now()}`,
      fileUrl: await uploadMedia(fileName || `upload-${Date.now()}`, fileUrl, fileType || 'image/png'),
      fileType: fileType || 'image/png',
      uploadedAt: new Date().toISOString()
    };

    portfolioData.mediaAssets.unshift(newAsset);
    await saveStore(portfolioData);
    res.status(201).json(newAsset);
  });

  app.delete('/api/admin/media/:id', requireAdminAuth, async (req, res) => {
    const asset = portfolioData.mediaAssets.find(m => m.id === req.params.id);
    if (asset) await deleteStoredMedia(asset.fileUrl);
    portfolioData.mediaAssets = portfolioData.mediaAssets.filter(m => m.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  return app;
}
