import React from 'react';
import { Profile } from '../types';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  profile: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-[#e0e0e0] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <span className="font-display font-bold text-xl text-white">{profile.name}</span>
            <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/50 mt-1">{profile.title} · PORTFOLIO MANAGEMENT SYSTEM</p>
          </div>

          <div className="flex items-center">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs font-mono">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-widest">SOPHISTICATED DARK ARCHITECTURE</p>
        </div>
      </div>
    </footer>
  );
};
