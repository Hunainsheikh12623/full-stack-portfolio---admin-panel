import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/public/Hero';
import { FeaturedProjects } from './components/public/FeaturedProjects';
import { ProjectDetailModal } from './components/public/ProjectDetailModal';
import { AboutExperience } from './components/public/AboutExperience';
import { SkillsSection } from './components/public/SkillsSection';
import { BlogSection } from './components/public/BlogSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { ContactSection } from './components/public/ContactSection';
import { ResumeModal } from './components/public/ResumeModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PortfolioData, Project } from './types';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<Omit<PortfolioData, 'messages' | 'mediaAssets'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('admin_token');
  });

  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Check URL path for /admin route
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setIsAdminView(true);
    }
  }, []);

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching public portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (data?.profile?.seoDefaults?.title) {
      document.title = data.profile.seoDefaults.title;
    }
  }, [data]);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('admin_token', token);
    setIsAdminView(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('admin_token');
    setIsAdminView(false);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-white animate-spin" />
        <p className="mono-sm text-white/60">INITIALIZING SYSTEMS LEDGER...</p>
      </div>
    );
  }

  // If user requested Admin Panel view
  if (isAdminView) {
    if (authToken) {
      return (
        <AdminDashboard
          authToken={authToken}
          onLogout={handleLogout}
          onRefreshPublicData={fetchPublicData}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setIsAdminView(false)}
      />
    );
  }

  // Public Portfolio View
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#e0e0e0] selection:bg-white selection:text-black">
      <Navbar
        profile={data.profile}
      />

      <main className="flex-1">
        <Hero
          profile={data.profile}
          onOpenResumeModal={() => setResumeModalOpen(true)}
        />

        <FeaturedProjects
          projects={data.projects}
          onSelectProject={(project) => setSelectedProjectModal(project)}
        />

        <AboutExperience
          profile={data.profile}
          experience={data.experience}
          education={data.education}
          onOpenResumeModal={() => setResumeModalOpen(true)}
        />

        <SkillsSection skills={data.skills} />

        <BlogSection blogPosts={data.blogPosts} />

        <TestimonialsSection testimonials={data.testimonials} />

        <ContactSection profile={data.profile} />
      </main>

      <Footer
        profile={data.profile}
      />

      {/* Case Study Modal */}
      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
      />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        profile={data.profile}
        experience={data.experience}
        education={data.education}
        skills={data.skills}
      />
    </div>
  );
}
