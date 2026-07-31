import express from 'express';
import { deleteStoredMedia, initStore, loginAdmin, saveStore, uploadMedia, verifyAdminToken } from './server/store.js';
import { PortfolioData, Project, BlogPost, Testimonial, Skill, Experience, Education, Message, MediaAsset } from './src/types.js';

/** Create a URL-safe slug from a title (or provided slug). */
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'item';
}

/** Normalize a comma-separated or array input into a clean string[]. */
function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Resolve project description from:
 * 1. explicit `description`
 * 2. pasted / uploaded README markdown (`readme` or `readmeContent`)
 * 3. base64 data-URL of a .md file (`readmeFile`)
 */
function resolveDescription(body: Record<string, unknown>): string {
  if (typeof body.description === 'string' && body.description.trim()) {
    return body.description;
  }
  if (typeof body.readme === 'string' && body.readme.trim()) {
    return body.readme;
  }
  if (typeof body.readmeContent === 'string' && body.readmeContent.trim()) {
    return body.readmeContent;
  }
  if (typeof body.readmeFile === 'string' && body.readmeFile.startsWith('data:')) {
    const match = body.readmeFile.match(/^data:[^;]*;base64,(.+)$/);
    if (match) {
      try {
        return Buffer.from(match[1], 'base64').toString('utf8');
      } catch {
        /* ignore decode errors */
      }
    }
  }
  return '';
}

/** Try to pull README.md from a public GitHub repo URL. */
async function fetchGithubReadme(repoUrl: string): Promise<string | null> {
  try {
    const match = repoUrl.match(/github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/|$)/i);
    if (!match) return null;
    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const res = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        'User-Agent': 'portfolio-admin'
      }
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim() || null;
  } catch {
    return null;
  }
}

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
      projects: portfolioData.projects.filter((p) => p.status === 'published').sort((a, b) => a.order - b.order),
      blogPosts: portfolioData.blogPosts
        .filter((b) => b.status === 'published')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
      testimonials: portfolioData.testimonials.filter((t) => t.status === 'visible').sort((a, b) => a.order - b.order),
      skills: portfolioData.skills.sort((a, b) => a.order - b.order),
      experience: portfolioData.experience.sort((a, b) => a.order - b.order),
      education: portfolioData.education.sort((a, b) => a.order - b.order)
    });
  });

  // Get project by slug
  app.get('/api/public/projects/:slug', (req, res) => {
    const project = portfolioData.projects.find((p) => p.slug === req.params.slug && p.status === 'published');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });

  // Get blog post by slug
  app.get('/api/public/blog/:slug', (req, res) => {
    const post = portfolioData.blogPosts.find((b) => b.slug === req.params.slug && b.status === 'published');
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
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || 'General Inquiry').trim(),
      message: String(message).trim(),
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

  // Get ALL data for admin panel (including draft items, messages, media assets)
  app.get('/api/admin/data', requireAdminAuth, (_req, res) => {
    res.json(portfolioData);
  });

  // Update profile and settings
  app.put('/api/admin/profile', requireAdminAuth, async (req, res) => {
    const update = { ...(req.body || {}) };
    // Never allow overwriting adminPassword via this route
    delete update.adminPassword;

    portfolioData.profile = {
      ...portfolioData.profile,
      ...update
    };
    await saveStore(portfolioData);
    res.json({ success: true, profile: portfolioData.profile });
  });

  // ---------- RESUME UPLOAD ----------
  // Dedicated endpoint: accepts Base64 data-URL (PDF/DOC) and stores it in Supabase Storage,
  // then updates profile.resumeUrl so the public site can link to it.
  app.post('/api/admin/resume', requireAdminAuth, async (req, res) => {
    try {
      const { fileName, fileUrl, fileType } = req.body;
      if (!fileUrl) {
        return res.status(400).json({ error: 'fileUrl (Base64 data-URL) is required.' });
      }

      const name = fileName || `resume-${Date.now()}.pdf`;
      const type = fileType || 'application/pdf';
      const publicUrl = await uploadMedia(name, fileUrl, type);

      portfolioData.profile.resumeUrl = publicUrl;

      // Also keep a copy in the media library for visibility
      const asset: MediaAsset = {
        id: `media-resume-${Date.now()}`,
        fileName: name,
        fileUrl: publicUrl,
        fileType: type,
        uploadedAt: new Date().toISOString()
      };
      portfolioData.mediaAssets.unshift(asset);

      await saveStore(portfolioData);
      res.status(201).json({
        success: true,
        resumeUrl: publicUrl,
        message: 'Resume uploaded and profile.resumeUrl updated.'
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Resume upload failed.' });
    }
  });

  // Clear / set resume URL without uploading a file (e.g. external link)
  app.put('/api/admin/resume', requireAdminAuth, async (req, res) => {
    const { resumeUrl } = req.body;
    if (typeof resumeUrl !== 'string') {
      return res.status(400).json({ error: 'resumeUrl string is required.' });
    }
    portfolioData.profile.resumeUrl = resumeUrl.trim();
    await saveStore(portfolioData);
    res.json({ success: true, resumeUrl: portfolioData.profile.resumeUrl });
  });

  // ---------- PROJECTS CRUD ----------
  // Create project. Accepts:
  // - repoUrl / githubUrl  → GitHub repository link
  // - liveUrl              → live demo URL
  // - description          → markdown body
  // - readme / readmeContent / readmeFile → used as description when description is empty
  // - fetchReadme: true    → if repoUrl is set, pull README.md from GitHub and use as description
  app.post('/api/admin/projects', requireAdminAuth, async (req, res) => {
    try {
      const body = req.body || {};
      const title = String(body.title || 'Untitled Project').trim();
      const repoUrl = String(body.repoUrl || body.githubUrl || body.github || '').trim();
      const liveUrl = String(body.liveUrl || body.demoUrl || '').trim();

      let description = resolveDescription(body);

      // Optionally auto-import README from GitHub
      if ((!description || body.fetchReadme === true) && repoUrl) {
        const readme = await fetchGithubReadme(repoUrl);
        if (readme) description = readme;
      }

      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title,
        slug: toSlug(body.slug || title),
        coverImage:
          body.coverImage ||
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
        gallery: Array.isArray(body.gallery) ? body.gallery : [],
        summary: String(body.summary || '').trim(),
        description,
        category: String(body.category || 'General').trim(),
        tags: asStringArray(body.tags),
        techStack: asStringArray(body.techStack),
        role: String(body.role || 'Software Engineer').trim(),
        startDate: String(body.startDate || new Date().toISOString().substring(0, 7)),
        endDate: String(body.endDate || 'Present'),
        client: String(body.client || 'Internal').trim(),
        liveUrl,
        repoUrl,
        results: String(body.results || '').trim(),
        status: body.status === 'draft' ? 'draft' : 'published',
        featured: body.featured ?? true,
        order: typeof body.order === 'number' ? body.order : portfolioData.projects.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      portfolioData.projects.unshift(newProject);
      await saveStore(portfolioData);
      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create project.' });
    }
  });

  app.put('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    try {
      const idx = portfolioData.projects.findIndex((p) => p.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Project not found' });

      const body = { ...(req.body || {}) };
      const existing = portfolioData.projects[idx];

      // Normalize aliases
      if (body.githubUrl && !body.repoUrl) body.repoUrl = body.githubUrl;
      if (body.github && !body.repoUrl) body.repoUrl = body.github;
      if (body.demoUrl && !body.liveUrl) body.liveUrl = body.demoUrl;

      // Description from readme fields if provided
      const fromReadme = resolveDescription(body);
      if (fromReadme && !body.description) {
        body.description = fromReadme;
      }

      // Optional GitHub README refresh
      const repoUrl = String(body.repoUrl ?? existing.repoUrl ?? '').trim();
      if (body.fetchReadme === true && repoUrl) {
        const readme = await fetchGithubReadme(repoUrl);
        if (readme) body.description = readme;
      }

      if (body.techStack !== undefined) body.techStack = asStringArray(body.techStack);
      if (body.tags !== undefined) body.tags = asStringArray(body.tags);
      if (body.slug) body.slug = toSlug(body.slug);
      if (body.title && !body.slug) body.slug = toSlug(body.title);

      portfolioData.projects[idx] = {
        ...existing,
        ...body,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString()
      };
      await saveStore(portfolioData);
      res.json(portfolioData.projects[idx]);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update project.' });
    }
  });

  app.delete('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    portfolioData.projects = portfolioData.projects.filter((p) => p.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // Helper: fetch README only (preview before save)
  app.post('/api/admin/projects/fetch-readme', requireAdminAuth, async (req, res) => {
    const repoUrl = String(req.body?.repoUrl || req.body?.githubUrl || '').trim();
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required.' });

    const readme = await fetchGithubReadme(repoUrl);
    if (!readme) {
      return res.status(404).json({
        error: 'Could not fetch README. Ensure the repo is public and has a README.md at the root.'
      });
    }
    res.json({ success: true, readme, length: readme.length });
  });

  // ---------- BLOG POSTS CRUD ----------
  app.post('/api/admin/blog', requireAdminAuth, async (req, res) => {
    const body = req.body || {};
    const title = String(body.title || 'Untitled Post').trim();
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title,
      slug: toSlug(body.slug || title),
      coverImage:
        body.coverImage ||
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
      excerpt: String(body.excerpt || '').trim(),
      body: String(body.body || '').trim(),
      tags: asStringArray(body.tags),
      status: body.status || 'draft',
      publishedAt: body.publishedAt || new Date().toISOString().substring(0, 10),
      readTime: body.readTime || '5 min read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    portfolioData.blogPosts.unshift(newPost);
    await saveStore(portfolioData);
    res.status(201).json(newPost);
  });

  app.put('/api/admin/blog/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.blogPosts.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Blog post not found' });

    const body = { ...(req.body || {}) };
    if (body.tags !== undefined) body.tags = asStringArray(body.tags);
    if (body.slug) body.slug = toSlug(body.slug);

    portfolioData.blogPosts[idx] = {
      ...portfolioData.blogPosts[idx],
      ...body,
      id: portfolioData.blogPosts[idx].id,
      createdAt: portfolioData.blogPosts[idx].createdAt,
      updatedAt: new Date().toISOString()
    };
    await saveStore(portfolioData);
    res.json(portfolioData.blogPosts[idx]);
  });

  app.delete('/api/admin/blog/:id', requireAdminAuth, async (req, res) => {
    portfolioData.blogPosts = portfolioData.blogPosts.filter((b) => b.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // ---------- TESTIMONIALS CRUD ----------
  app.post('/api/admin/testimonials', requireAdminAuth, async (req, res) => {
    const body = req.body || {};
    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      name: String(body.name || 'Client Name').trim(),
      role: String(body.role || 'Executive').trim(),
      company: String(body.company || 'Company Inc').trim(),
      photoUrl:
        body.photoUrl ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      quote: String(body.quote || 'Great experience working together.').trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      status: body.status === 'hidden' ? 'hidden' : 'visible',
      order: typeof body.order === 'number' ? body.order : portfolioData.testimonials.length + 1
    };

    portfolioData.testimonials.push(newTestimonial);
    await saveStore(portfolioData);
    res.status(201).json(newTestimonial);
  });

  app.put('/api/admin/testimonials/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.testimonials.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Testimonial not found' });

    portfolioData.testimonials[idx] = {
      ...portfolioData.testimonials[idx],
      ...req.body,
      id: portfolioData.testimonials[idx].id
    };
    await saveStore(portfolioData);
    res.json(portfolioData.testimonials[idx]);
  });

  app.delete('/api/admin/testimonials/:id', requireAdminAuth, async (req, res) => {
    portfolioData.testimonials = portfolioData.testimonials.filter((t) => t.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // ---------- SKILLS CRUD ----------
  app.post('/api/admin/skills', requireAdminAuth, async (req, res) => {
    const body = req.body || {};
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: String(body.name || 'New Technology').trim(),
      category: body.category || 'Frontend',
      proficiency: Math.min(5, Math.max(1, Number(body.proficiency) || 4)),
      icon: body.icon || 'code',
      order: typeof body.order === 'number' ? body.order : portfolioData.skills.length + 1
    };

    portfolioData.skills.push(newSkill);
    await saveStore(portfolioData);
    res.status(201).json(newSkill);
  });

  app.put('/api/admin/skills/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.skills.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Skill not found' });

    portfolioData.skills[idx] = { ...portfolioData.skills[idx], ...req.body, id: portfolioData.skills[idx].id };
    await saveStore(portfolioData);
    res.json(portfolioData.skills[idx]);
  });

  app.delete('/api/admin/skills/:id', requireAdminAuth, async (req, res) => {
    portfolioData.skills = portfolioData.skills.filter((s) => s.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // ---------- EXPERIENCE CRUD ----------
  app.post('/api/admin/experience', requireAdminAuth, async (req, res) => {
    const body = req.body || {};
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: String(body.company || 'Company Name').trim(),
      role: String(body.role || 'Role Title').trim(),
      startDate: String(body.startDate || '2024-01'),
      endDate: String(body.endDate || 'Present'),
      description: String(body.description || '').trim(),
      location: String(body.location || 'Remote').trim(),
      order: typeof body.order === 'number' ? body.order : portfolioData.experience.length + 1
    };

    portfolioData.experience.push(newExp);
    await saveStore(portfolioData);
    res.status(201).json(newExp);
  });

  app.put('/api/admin/experience/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.experience.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Experience record not found' });

    portfolioData.experience[idx] = {
      ...portfolioData.experience[idx],
      ...req.body,
      id: portfolioData.experience[idx].id
    };
    await saveStore(portfolioData);
    res.json(portfolioData.experience[idx]);
  });

  app.delete('/api/admin/experience/:id', requireAdminAuth, async (req, res) => {
    portfolioData.experience = portfolioData.experience.filter((e) => e.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // ---------- EDUCATION CRUD ----------
  app.post('/api/admin/education', requireAdminAuth, async (req, res) => {
    const body = req.body || {};
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: String(body.institution || 'University Name').trim(),
      degree: String(body.degree || 'Bachelor of Science').trim(),
      field: String(body.field || 'Computer Science').trim(),
      startDate: String(body.startDate || '2018'),
      endDate: String(body.endDate || '2022'),
      order: typeof body.order === 'number' ? body.order : portfolioData.education.length + 1
    };

    portfolioData.education.push(newEdu);
    await saveStore(portfolioData);
    res.status(201).json(newEdu);
  });

  app.put('/api/admin/education/:id', requireAdminAuth, async (req, res) => {
    const idx = portfolioData.education.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Education record not found' });

    portfolioData.education[idx] = {
      ...portfolioData.education[idx],
      ...req.body,
      id: portfolioData.education[idx].id
    };
    await saveStore(portfolioData);
    res.json(portfolioData.education[idx]);
  });

  app.delete('/api/admin/education/:id', requireAdminAuth, async (req, res) => {
    portfolioData.education = portfolioData.education.filter((e) => e.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // ---------- MESSAGES INBOX ----------
  app.put('/api/admin/messages/:id/read', requireAdminAuth, async (req, res) => {
    const msg = portfolioData.messages.find((m) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    msg.isRead = req.body.isRead ?? true;
    await saveStore(portfolioData);
    res.json(msg);
  });

  app.delete('/api/admin/messages/:id', requireAdminAuth, async (req, res) => {
    portfolioData.messages = portfolioData.messages.filter((m) => m.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  // ---------- MEDIA ASSETS ----------
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
    const asset = portfolioData.mediaAssets.find((m) => m.id === req.params.id);
    if (asset) await deleteStoredMedia(asset.fileUrl);
    portfolioData.mediaAssets = portfolioData.mediaAssets.filter((m) => m.id !== req.params.id);
    await saveStore(portfolioData);
    res.json({ success: true });
  });

  return app;
}
