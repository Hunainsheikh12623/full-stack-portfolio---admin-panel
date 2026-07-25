import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FolderKanban, BookOpen, Quote, Briefcase, GraduationCap,
  Code2, Mail, Image as ImageIcon, Settings, LogOut, Plus, Trash2, Edit,
  Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Star, Upload, ExternalLink, KeyRound
} from 'lucide-react';
import { PortfolioData, Project, BlogPost, Testimonial, Skill, Experience, Education, Message, MediaAsset } from '../../types';

interface AdminDashboardProps {
  authToken: string;
  onLogout: () => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ authToken, onLogout, onRefreshPublicData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'projects' | 'blog' | 'testimonials' | 'experience' | 'skills' | 'messages' | 'media'>('overview');
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Modals state
  const [projectModal, setProjectModal] = useState<{ open: boolean; item: Partial<Project> | null }>({ open: false, item: null });
  const [blogModal, setBlogModal] = useState<{ open: boolean; item: Partial<BlogPost> | null }>({ open: false, item: null });
  const [testimonialModal, setTestimonialModal] = useState<{ open: boolean; item: Partial<Testimonial> | null }>({ open: false, item: null });
  const [skillModal, setSkillModal] = useState<{ open: boolean; item: Partial<Skill> | null }>({ open: false, item: null });
  const [expModal, setExpModal] = useState<{ open: boolean; item: Partial<Experience> | null }>({ open: false, item: null });
  const [eduModal, setEduModal] = useState<{ open: boolean; item: Partial<Education> | null }>({ open: false, item: null });

  // Load all admin data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [authToken]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
    onRefreshPublicData();
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 text-green-400 animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase">LOADING ADMIN LEDGER DATA...</span>
        </div>
      </div>
    );
  }

  // ==================== API HANDLERS ==================== //

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(data.profile)
      });
      if (res.ok) {
        showToast('Profile and settings updated successfully!');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  // Projects CRUD
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectModal.item) return;
    const isEdit = !!projectModal.item.id;
    const url = isEdit ? `/api/admin/projects/${projectModal.item.id}` : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(projectModal.item)
      });
      if (res.ok) {
        setProjectModal({ open: false, item: null });
        showToast(isEdit ? 'Project updated!' : 'New project created!');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to save project.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        showToast('Project deleted.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  // Blog Posts CRUD
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogModal.item) return;
    const isEdit = !!blogModal.item.id;
    const url = isEdit ? `/api/admin/blog/${blogModal.item.id}` : '/api/admin/blog';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(blogModal.item)
      });
      if (res.ok) {
        setBlogModal({ open: false, item: null });
        showToast(isEdit ? 'Blog post updated!' : 'New post created!');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to save post.');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        showToast('Blog post deleted.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  // Testimonials CRUD
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialModal.item) return;
    const isEdit = !!testimonialModal.item.id;
    const url = isEdit ? `/api/admin/testimonials/${testimonialModal.item.id}` : '/api/admin/testimonials';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(testimonialModal.item)
      });
      if (res.ok) {
        setTestimonialModal({ open: false, item: null });
        showToast('Testimonial saved!');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to save testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete testimonial?')) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      showToast('Testimonial deleted.');
      fetchAdminData();
    } catch (err) {
      alert('Error deleting testimonial.');
    }
  };

  // Skills CRUD
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillModal.item) return;
    const isEdit = !!skillModal.item.id;
    const url = isEdit ? `/api/admin/skills/${skillModal.item.id}` : '/api/admin/skills';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(skillModal.item)
      });
      if (res.ok) {
        setSkillModal({ open: false, item: null });
        showToast('Skill saved!');
        fetchAdminData();
      }
    } catch (err) {
      alert('Error saving skill.');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete skill?')) return;
    await fetch(`/api/admin/skills/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    showToast('Skill deleted.');
    fetchAdminData();
  };

  // Experience CRUD
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expModal.item) return;
    const isEdit = !!expModal.item.id;
    const url = isEdit ? `/api/admin/experience/${expModal.item.id}` : '/api/admin/experience';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(expModal.item)
      });
      if (res.ok) {
        setExpModal({ open: false, item: null });
        showToast('Experience updated!');
        fetchAdminData();
      }
    } catch (err) {
      alert('Error saving experience.');
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Delete experience record?')) return;
    await fetch(`/api/admin/experience/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    showToast('Experience deleted.');
    fetchAdminData();
  };

  // Education CRUD
  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduModal.item) return;
    const isEdit = !!eduModal.item.id;
    const url = isEdit ? `/api/admin/education/${eduModal.item.id}` : '/api/admin/education';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(eduModal.item)
      });
      setEduModal({ open: false, item: null });
      showToast('Education updated!');
      fetchAdminData();
    } catch (err) {
      alert('Error saving education.');
    }
  };

  const handleDeleteEdu = async (id: string) => {
    if (!confirm('Delete education record?')) return;
    await fetch(`/api/admin/education/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    showToast('Education record deleted.');
    fetchAdminData();
  };

  // Messages Inbox
  const handleToggleMessageRead = async (id: string, currentReadState: boolean) => {
    await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ isRead: !currentReadState })
    });
    fetchAdminData();
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete message?')) return;
    await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    showToast('Message deleted.');
    fetchAdminData();
  };

  // Media Asset Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: dataUrl,
          fileType: file.type
        })
      });
      showToast('Media file uploaded!');
      fetchAdminData();
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete media asset?')) return;
    await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    showToast('Media asset removed.');
    fetchAdminData();
  };

  const unreadCount = data.messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col md:flex-row">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#080808] text-white px-5 py-3 rounded-md shadow-2xl flex items-center space-x-2 border border-white/20 animate-fadeIn font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#080808] border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#3B5BFF] text-white font-bold font-display flex items-center justify-center">
              A
            </div>
            <div>
              <h2 className="font-display font-medium text-base text-white">ADMIN LEDGER</h2>
              <p className="mono-xs text-white/50">FULL CRUD CONTROL</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'profile', label: 'Profile & Settings', icon: Settings },
              { id: 'projects', label: 'Projects', icon: FolderKanban, badge: data.projects.length },
              { id: 'blog', label: 'Blog Posts', icon: BookOpen, badge: data.blogPosts.length },
              { id: 'testimonials', label: 'Testimonials', icon: Quote, badge: data.testimonials.length },
              { id: 'experience', label: 'Experience & Edu', icon: Briefcase },
              { id: 'skills', label: 'Skills Matrix', icon: Code2, badge: data.skills.length },
              { id: 'messages', label: 'Inbox', icon: Mail, badge: unreadCount, highlight: unreadCount > 0 },
              { id: 'media', label: 'Media Library', icon: ImageIcon, badge: data.mediaAssets.length },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-colors ${
                    isActive
                      ? 'bg-[#3B5BFF] text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.highlight ? 'bg-[#FF7A45] text-white' : 'bg-white/10 text-white/80'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-red-400 font-mono text-xs transition-colors border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>EXIT ADMIN PANEL</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace Area */}
      <main className="flex-1 bg-[#F7F5F0] text-[#10131A] p-6 md:p-10 overflow-y-auto">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <span className="mono-xs text-[#3B5BFF]">SYSTEM OVERVIEW</span>
              <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#10131A] mt-1">
                Portfolio Performance & Data Summary
              </h1>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#D8D4C9] shadow-sm">
                <span className="mono-xs text-[#4A4F5A] block">TOTAL PROJECTS</span>
                <p className="font-display text-3xl font-bold text-[#10131A] mt-2">{data.projects.length}</p>
                <span className="mono-xs text-[#3B5BFF]">{data.projects.filter(p => p.status === 'published').length} Published</span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D8D4C9] shadow-sm">
                <span className="mono-xs text-[#4A4F5A] block">BLOG ARTICLES</span>
                <p className="font-display text-3xl font-bold text-[#10131A] mt-2">{data.blogPosts.length}</p>
                <span className="mono-xs text-[#FF7A45]">{data.blogPosts.filter(b => b.status === 'published').length} Published</span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D8D4C9] shadow-sm">
                <span className="mono-xs text-[#4A4F5A] block">UNREAD INBOX</span>
                <p className="font-display text-3xl font-bold text-[#3B5BFF] mt-2">{unreadCount}</p>
                <span className="mono-xs text-[#4A4F5A]">{data.messages.length} Total Messages</span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D8D4C9] shadow-sm">
                <span className="mono-xs text-[#4A4F5A] block">TESTIMONIALS</span>
                <p className="font-display text-3xl font-bold text-[#10131A] mt-2">{data.testimonials.length}</p>
                <span className="mono-xs text-[#3B5BFF]">{data.testimonials.filter(t => t.status === 'visible').length} Visible</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white rounded-2xl border border-[#D8D4C9] space-y-4">
              <span className="mono-xs text-[#3B5BFF] font-bold">QUICK CONTENT ACTIONS</span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setProjectModal({ open: true, item: { status: 'published', featured: true, tags: [], techStack: [], gallery: [] } }); }}
                  className="px-4 py-2 bg-[#3B5BFF] text-white rounded-xl mono-xs hover:bg-[#324ddb] flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>NEW PROJECT</span>
                </button>

                <button
                  onClick={() => { setBlogModal({ open: true, item: { status: 'published', tags: [], readTime: '5 min read' } }); }}
                  className="px-4 py-2 bg-[#10131A] text-white rounded-xl mono-xs hover:bg-[#4A4F5A] flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-[#FF7A45]" />
                  <span>NEW BLOG POST</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className="px-4 py-2 bg-[#F7F5F0] text-[#10131A] border border-[#D8D4C9] rounded-xl mono-xs hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4 text-[#3B5BFF]" />
                  <span>VIEW INBOX ({unreadCount} UNREAD)</span>
                </button>
              </div>
            </div>

            {/* Recent Messages Preview */}
            <div className="p-6 bg-white rounded-2xl border border-[#D8D4C9] space-y-4">
              <div className="flex items-center justify-between">
                <span className="mono-xs text-[#3B5BFF] font-bold">RECENT INBOX MESSAGES</span>
                <button onClick={() => setActiveTab('messages')} className="mono-xs text-[#3B5BFF] hover:underline">
                  View All
                </button>
              </div>

              {data.messages.length === 0 ? (
                <p className="mono-xs text-[#4A4F5A]">No messages received yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="p-4 rounded-xl bg-[#F7F5F0] border border-[#D8D4C9] flex items-center justify-between">
                      <div>
                        <p className="font-display font-medium text-sm text-[#10131A]">{msg.name} ({msg.email})</p>
                        <p className="text-xs text-[#4A4F5A] line-clamp-1">{msg.subject}: {msg.message}</p>
                      </div>
                      <span className="mono-xs text-[#4A4F5A]">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <span className="mono-xs text-[#3B5BFF]">MODULE 01</span>
              <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                Profile & Site Settings
              </h1>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 bg-white rounded-2xl border border-[#D8D4C9] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={data.profile.name}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl font-display font-medium text-sm focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>

                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">PROFESSIONAL TITLE *</label>
                  <input
                    type="text"
                    required
                    value={data.profile.title}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, title: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl font-display font-medium text-sm focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="mono-xs text-[#4A4F5A] block mb-2">HERO TAGLINE</label>
                <input
                  type="text"
                  value={data.profile.tagline}
                  onChange={(e) => setData({ ...data, profile: { ...data.profile, tagline: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-sm focus:outline-none focus:border-[#3B5BFF]"
                />
              </div>

              <div>
                <label className="mono-xs text-[#4A4F5A] block mb-2">BIOGRAPHY / SUMMARY</label>
                <textarea
                  rows={4}
                  value={data.profile.bio}
                  onChange={(e) => setData({ ...data, profile: { ...data.profile, bio: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-sm focus:outline-none focus:border-[#3B5BFF] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">PROFILE PHOTO URL</label>
                  <input
                    type="text"
                    value={data.profile.photoUrl}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, photoUrl: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-xs font-mono focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>

                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">AVAILABILITY STATUS BADGE</label>
                  <input
                    type="text"
                    value={data.profile.availabilityStatus}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, availabilityStatus: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-sm focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">CONTACT EMAIL</label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-sm focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>

                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">PHONE</label>
                  <input
                    type="text"
                    value={data.profile.phone}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-sm focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>

                <div>
                  <label className="mono-xs text-[#4A4F5A] block mb-2">LOCATION</label>
                  <input
                    type="text"
                    value={data.profile.location}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, location: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F0] border border-[#D8D4C9] rounded-xl text-sm focus:outline-none focus:border-[#3B5BFF]"
                  />
                </div>
              </div>

              {/* Admin access is managed by Supabase Auth, not portfolio content. */}
              <div className="pt-6 border-t border-[#D8D4C9] space-y-4">
                <span className="mono-xs text-[#FF7A45] font-bold block flex items-center space-x-1">
                  <KeyRound className="w-3.5 h-3.5 inline mr-1" /> ADMIN ACCESS
                </span>
                <div className="max-w-md">
                  <p className="text-sm text-[#4A4F5A]">Admin accounts and passwords are managed securely in Supabase Authentication.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D8D4C9] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3B5BFF] hover:bg-[#324ddb] text-white font-mono text-xs font-semibold rounded-full shadow-md"
                >
                  SAVE PROFILE & SETTINGS
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECTS CRUD */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="mono-xs text-[#3B5BFF]">MODULE 02</span>
                <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                  Manage Projects & Case Studies
                </h1>
              </div>

              <button
                onClick={() => setProjectModal({ open: true, item: { status: 'published', featured: true, tags: [], techStack: [], gallery: [] } })}
                className="px-5 py-2.5 bg-[#3B5BFF] hover:bg-[#324ddb] text-white mono-xs font-semibold rounded-full flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW PROJECT</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-2xl border border-[#D8D4C9] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F5F0] border-b border-[#D8D4C9] mono-xs text-[#4A4F5A]">
                    <th className="p-4">TITLE</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">FEATURED</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D4C9]/60 text-sm">
                  {data.projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-display font-medium text-[#10131A]">{proj.title}</p>
                        <p className="mono-xs text-[#4A4F5A]">{proj.role} ({proj.startDate})</p>
                      </td>
                      <td className="p-4 mono-xs text-[#4A4F5A]">{proj.category}</td>
                      <td className="p-4">
                        <span className={`mono-xs px-2.5 py-1 rounded-full ${
                          proj.status === 'published' ? 'bg-[#3B5BFF]/10 text-[#3B5BFF]' : 'bg-[#FF7A45]/10 text-[#FF7A45]'
                        }`}>
                          {proj.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 mono-xs">
                        {proj.featured ? <span className="text-[#3B5BFF]">YES</span> : <span className="text-[#4A4F5A]">NO</span>}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setProjectModal({ open: true, item: proj })}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#3B5BFF] hover:text-white transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BLOG POSTS CRUD */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="mono-xs text-[#3B5BFF]">MODULE 03</span>
                <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                  Manage Technical Blog Articles
                </h1>
              </div>

              <button
                onClick={() => setBlogModal({ open: true, item: { status: 'published', tags: [], readTime: '5 min read' } })}
                className="px-5 py-2.5 bg-[#3B5BFF] hover:bg-[#324ddb] text-white mono-xs font-semibold rounded-full flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>WRITE ARTICLE</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#D8D4C9] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F5F0] border-b border-[#D8D4C9] mono-xs text-[#4A4F5A]">
                    <th className="p-4">TITLE</th>
                    <th className="p-4">PUBLISHED DATE</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D4C9]/60 text-sm">
                  {data.blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-display font-medium text-[#10131A]">{post.title}</p>
                        <p className="mono-xs text-[#4A4F5A]">{post.readTime}</p>
                      </td>
                      <td className="p-4 mono-xs text-[#4A4F5A]">{post.publishedAt}</td>
                      <td className="p-4">
                        <span className={`mono-xs px-2.5 py-1 rounded-full ${
                          post.status === 'published' ? 'bg-[#3B5BFF]/10 text-[#3B5BFF]' : 'bg-[#FF7A45]/10 text-[#FF7A45]'
                        }`}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setBlogModal({ open: true, item: post })}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#3B5BFF] hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: TESTIMONIALS CRUD */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="mono-xs text-[#3B5BFF]">MODULE 04</span>
                <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                  Manage Peer Endorsements
                </h1>
              </div>

              <button
                onClick={() => setTestimonialModal({ open: true, item: { rating: 5, status: 'visible' } })}
                className="px-5 py-2.5 bg-[#3B5BFF] hover:bg-[#324ddb] text-white mono-xs font-semibold rounded-full flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>ADD TESTIMONIAL</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.testimonials.map((t) => (
                <div key={t.id} className="p-6 bg-white rounded-2xl border border-[#D8D4C9] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={t.photoUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <h4 className="font-display font-medium text-base">{t.name}</h4>
                        <p className="mono-xs text-[#3B5BFF]">{t.role}, {t.company}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => setTestimonialModal({ open: true, item: t })} className="p-1 hover:text-[#3B5BFF]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm italic text-[#4A4F5A]">"{t.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EXPERIENCE & EDUCATION CRUD */}
        {activeTab === 'experience' && (
          <div className="space-y-10">
            <div>
              <span className="mono-xs text-[#3B5BFF]">MODULE 05</span>
              <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                Work Experience & Academic Qualifications
              </h1>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-medium text-xl">Work History</h3>
                <button
                  onClick={() => setExpModal({ open: true, item: { startDate: '2024-01', endDate: 'Present' } })}
                  className="px-4 py-2 bg-[#10131A] text-white mono-xs rounded-full"
                >
                  + Add Role
                </button>
              </div>

              <div className="space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className="p-5 bg-white rounded-xl border border-[#D8D4C9] flex items-start justify-between">
                    <div>
                      <span className="mono-xs text-[#3B5BFF]">{e.startDate} – {e.endDate}</span>
                      <h4 className="font-display font-semibold text-lg">{e.role} at {e.company}</h4>
                      <p className="text-sm text-[#4A4F5A] mt-1">{e.description}</p>
                    </div>
                    <div className="flex space-x-2 shrink-0 ml-4">
                      <button onClick={() => setExpModal({ open: true, item: e })} className="p-1.5 bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExp(e.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4 pt-6 border-t border-[#D8D4C9]">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-medium text-xl">Education & Degrees</h3>
                <button
                  onClick={() => setEduModal({ open: true, item: { startDate: '2018', endDate: '2022' } })}
                  className="px-4 py-2 bg-[#10131A] text-white mono-xs rounded-full"
                >
                  + Add Qualification
                </button>
              </div>

              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white rounded-xl border border-[#D8D4C9] flex items-start justify-between">
                    <div>
                      <span className="mono-xs text-[#3B5BFF]">{edu.startDate} – {edu.endDate}</span>
                      <h4 className="font-display font-semibold text-lg">{edu.degree} in {edu.field}</h4>
                      <p className="mono-xs text-[#4A4F5A]">{edu.institution}</p>
                    </div>
                    <div className="flex space-x-2 shrink-0 ml-4">
                      <button onClick={() => setEduModal({ open: true, item: edu })} className="p-1.5 bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteEdu(edu.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SKILLS CRUD */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="mono-xs text-[#3B5BFF]">MODULE 06</span>
                <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                  Skills & Technical Competencies
                </h1>
              </div>

              <button
                onClick={() => setSkillModal({ open: true, item: { category: 'Backend', proficiency: 5 } })}
                className="px-5 py-2.5 bg-[#3B5BFF] text-white mono-xs rounded-full"
              >
                + ADD SKILL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.skills.map((s) => (
                <div key={s.id} className="p-4 bg-white rounded-xl border border-[#D8D4C9] flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-medium text-base">{s.name}</h4>
                    <span className="mono-xs text-[#3B5BFF]">{s.category} · LVL {s.proficiency}/5</span>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => setSkillModal({ open: true, item: s })} className="p-1 hover:text-[#3B5BFF]">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteSkill(s.id)} className="p-1 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div>
              <span className="mono-xs text-[#3B5BFF]">MODULE 07</span>
              <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                Contact Messages Inbox ({data.messages.length})
              </h1>
            </div>

            <div className="space-y-4">
              {data.messages.length === 0 ? (
                <div className="p-8 bg-white rounded-xl text-center border border-[#D8D4C9]">
                  <p className="mono-xs text-[#4A4F5A]">Inbox is completely clean!</p>
                </div>
              ) : (
                data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      msg.isRead ? 'bg-white border-[#D8D4C9]' : 'bg-[#3B5BFF]/5 border-[#3B5BFF]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-display font-semibold text-lg">{msg.name}</h4>
                          <span className="mono-xs text-[#3B5BFF]">({msg.email})</span>
                        </div>
                        <p className="mono-xs text-[#4A4F5A] mt-0.5">SUBJECT: {msg.subject}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleMessageRead(msg.id, msg.isRead)}
                          className="px-3 py-1 rounded-full text-xs font-mono border"
                        >
                          {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>

                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="px-3 py-1 bg-[#3B5BFF] text-white rounded-full text-xs font-mono"
                        >
                          Reply
                        </a>

                        <button onClick={() => handleDeleteMessage(msg.id)} className="p-1 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-[#F7F5F0] border border-[#D8D4C9] text-sm text-[#10131A]">
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 9: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="mono-xs text-[#3B5BFF]">MODULE 08</span>
                <h1 className="font-display font-medium text-3xl text-[#10131A] mt-1">
                  Media & Asset Library
                </h1>
              </div>

              <label className="px-5 py-2.5 bg-[#3B5BFF] hover:bg-[#324ddb] text-white mono-xs font-semibold rounded-full cursor-pointer flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>UPLOAD FILE</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.mediaAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-2xl border border-[#D8D4C9] overflow-hidden p-3 space-y-2">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img src={asset.fileUrl} alt={asset.fileName} className="w-full h-full object-cover" />
                  </div>
                  <p className="mono-xs text-[#10131A] truncate">{asset.fileName}</p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(asset.fileUrl);
                        showToast('Asset URL copied to clipboard!');
                      }}
                      className="mono-xs text-[#3B5BFF] hover:underline"
                    >
                      Copy URL
                    </button>
                    <button onClick={() => handleDeleteMedia(asset.id)} className="text-red-500 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ==================== MODALS FOR EDITING ==================== */}

      {/* Project Modal */}
      {projectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveProject} className="bg-white text-[#10131A] p-6 sm:p-8 rounded-2xl max-w-2xl w-full space-y-4 my-auto">
            <h3 className="font-display font-medium text-2xl">{projectModal.item?.id ? 'Edit Project' : 'Create New Project'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Project Title *"
                value={projectModal.item?.title || ''}
                onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, title: e.target.value } })}
                className="p-2.5 border rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="Category (e.g. Backend Systems)"
                value={projectModal.item?.category || ''}
                onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, category: e.target.value } })}
                className="p-2.5 border rounded-xl text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Cover Image URL *"
              value={projectModal.item?.coverImage || ''}
              onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, coverImage: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm font-mono"
            />
            <textarea
              rows={2}
              placeholder="Short Summary *"
              value={projectModal.item?.summary || ''}
              onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, summary: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <textarea
              rows={5}
              placeholder="Detailed Technical Description (Markdown supported) *"
              value={projectModal.item?.description || ''}
              onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, description: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm font-mono"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tech Stack (comma separated)"
                value={projectModal.item?.techStack?.join(', ') || ''}
                onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, techStack: e.target.value.split(',').map(s => s.trim()) } })}
                className="p-2.5 border rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="Measurable Outcome / Result"
                value={projectModal.item?.results || ''}
                onChange={(e) => setProjectModal({ ...projectModal, item: { ...projectModal.item, results: e.target.value } })}
                className="p-2.5 border rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" onClick={() => setProjectModal({ open: false, item: null })} className="px-4 py-2 border rounded-full text-xs font-mono">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#3B5BFF] text-white rounded-full text-xs font-mono">Save Project</button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Modal */}
      {blogModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveBlog} className="bg-white text-[#10131A] p-6 sm:p-8 rounded-2xl max-w-2xl w-full space-y-4 my-auto">
            <h3 className="font-display font-medium text-2xl">{blogModal.item?.id ? 'Edit Article' : 'Write New Article'}</h3>
            <input
              type="text"
              required
              placeholder="Article Title *"
              value={blogModal.item?.title || ''}
              onChange={(e) => setBlogModal({ ...blogModal, item: { ...blogModal.item, title: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={blogModal.item?.coverImage || ''}
              onChange={(e) => setBlogModal({ ...blogModal, item: { ...blogModal.item, coverImage: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm font-mono"
            />
            <textarea
              rows={2}
              placeholder="Article Excerpt *"
              value={blogModal.item?.excerpt || ''}
              onChange={(e) => setBlogModal({ ...blogModal, item: { ...blogModal.item, excerpt: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <textarea
              rows={6}
              placeholder="Article Body (Markdown supported) *"
              value={blogModal.item?.body || ''}
              onChange={(e) => setBlogModal({ ...blogModal, item: { ...blogModal.item, body: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm font-mono"
            />
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" onClick={() => setBlogModal({ open: false, item: null })} className="px-4 py-2 border rounded-full text-xs font-mono">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#3B5BFF] text-white rounded-full text-xs font-mono">Save Article</button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonial Modal */}
      {testimonialModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveTestimonial} className="bg-white text-[#10131A] p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-display font-medium text-xl">Edit Testimonial</h3>
            <input
              type="text"
              required
              placeholder="Person Name *"
              value={testimonialModal.item?.name || ''}
              onChange={(e) => setTestimonialModal({ ...testimonialModal, item: { ...testimonialModal.item, name: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <input
              type="text"
              placeholder="Role (e.g. VP of Engineering)"
              value={testimonialModal.item?.role || ''}
              onChange={(e) => setTestimonialModal({ ...testimonialModal, item: { ...testimonialModal.item, role: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={testimonialModal.item?.company || ''}
              onChange={(e) => setTestimonialModal({ ...testimonialModal, item: { ...testimonialModal.item, company: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <textarea
              rows={3}
              placeholder="Quote *"
              value={testimonialModal.item?.quote || ''}
              onChange={(e) => setTestimonialModal({ ...testimonialModal, item: { ...testimonialModal.item, quote: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setTestimonialModal({ open: false, item: null })} className="px-3 py-1.5 border rounded-full text-xs">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-[#3B5BFF] text-white rounded-full text-xs">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Skill Modal */}
      {skillModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <form onSubmit={handleSaveSkill} className="bg-white text-[#10131A] p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-display font-medium text-xl">Edit Skill</h3>
            <input
              type="text"
              required
              placeholder="Skill Name (e.g. Go)"
              value={skillModal.item?.name || ''}
              onChange={(e) => setSkillModal({ ...skillModal, item: { ...skillModal.item, name: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <select
              value={skillModal.item?.category || 'Backend'}
              onChange={(e) => setSkillModal({ ...skillModal, item: { ...skillModal.item, category: e.target.value as any } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Databases">Databases</option>
              <option value="Architecture">Architecture</option>
            </select>
            <div>
              <label className="mono-xs text-[#4A4F5A] block mb-1">PROFICIENCY (1 to 5): {skillModal.item?.proficiency || 5}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={skillModal.item?.proficiency || 5}
                onChange={(e) => setSkillModal({ ...skillModal, item: { ...skillModal.item, proficiency: parseInt(e.target.value) } })}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setSkillModal({ open: false, item: null })} className="px-3 py-1.5 border rounded-full text-xs">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-[#3B5BFF] text-white rounded-full text-xs">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Experience Modal */}
      {expModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <form onSubmit={handleSaveExp} className="bg-white text-[#10131A] p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-display font-medium text-xl">Edit Experience</h3>
            <input
              type="text"
              required
              placeholder="Company *"
              value={expModal.item?.company || ''}
              onChange={(e) => setExpModal({ ...expModal, item: { ...expModal.item, company: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <input
              type="text"
              required
              placeholder="Role Title *"
              value={expModal.item?.role || ''}
              onChange={(e) => setExpModal({ ...expModal, item: { ...expModal.item, role: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Start Date (e.g. 2024-01)"
                value={expModal.item?.startDate || ''}
                onChange={(e) => setExpModal({ ...expModal, item: { ...expModal.item, startDate: e.target.value } })}
                className="p-2.5 border rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="End Date (e.g. Present)"
                value={expModal.item?.endDate || ''}
                onChange={(e) => setExpModal({ ...expModal, item: { ...expModal.item, endDate: e.target.value } })}
                className="p-2.5 border rounded-xl text-sm"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Description *"
              value={expModal.item?.description || ''}
              onChange={(e) => setExpModal({ ...expModal, item: { ...expModal.item, description: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setExpModal({ open: false, item: null })} className="px-3 py-1.5 border rounded-full text-xs">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-[#3B5BFF] text-white rounded-full text-xs">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Education Modal */}
      {eduModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <form onSubmit={handleSaveEdu} className="bg-white text-[#10131A] p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-display font-medium text-xl">Edit Qualification</h3>
            <input
              type="text"
              required
              placeholder="Institution / University *"
              value={eduModal.item?.institution || ''}
              onChange={(e) => setEduModal({ ...eduModal, item: { ...eduModal.item, institution: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <input
              type="text"
              placeholder="Degree (e.g. B.S.)"
              value={eduModal.item?.degree || ''}
              onChange={(e) => setEduModal({ ...eduModal, item: { ...eduModal.item, degree: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <input
              type="text"
              placeholder="Field of Study (e.g. Computer Science)"
              value={eduModal.item?.field || ''}
              onChange={(e) => setEduModal({ ...eduModal, item: { ...eduModal.item, field: e.target.value } })}
              className="w-full p-2.5 border rounded-xl text-sm"
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEduModal({ open: false, item: null })} className="px-3 py-1.5 border rounded-full text-xs">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-[#3B5BFF] text-white rounded-full text-xs">Save</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
