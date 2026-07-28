import React from 'react';
import { ArrowDownRight, Download, Mail, Terminal, FileText } from 'lucide-react';
import { Profile } from '../../types';

interface HeroProps {
  profile: Profile;
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenResumeModal }) => {
  return (
    <section className="bg-[#050505] text-[#e0e0e0] pt-12 md:pt-20 pb-16 md:pb-24 border-b border-white/10 relative overflow-hidden">
      {/* Background Subtle Tech Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Terminal className="w-3.5 h-3.5 text-white/80" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/70">SYSTEM ARCHITECTURE · 2026</span>
            </div>

            <h1 className="font-display font-medium text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]">
              {profile.name}
            </h1>

            <p className="font-serif font-normal text-xl sm:text-2xl text-white/90 max-w-2xl leading-snug">
              {profile.tagline}
            </p>

            <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
              {profile.bio}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-white/10"
              >
                <span>EXPLORE WORK</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-sans text-xs uppercase tracking-widest font-bold transition-all"
              >
                <Mail className="w-4 h-4 text-white/80" />
                <span>CONTACT ME</span>
              </a>

              <button
                onClick={onOpenResumeModal}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-white/10 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-green-400" />
                <span>RESUME (PDF · 220KB)</span>
              </button>
            </div>

            {/* Metric / Stat Callout Bar */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 max-w-xl">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-medium text-white">4+</p>
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">Core Projects</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-medium text-white">20+</p>
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">Technologies</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-medium text-green-400">Fast</p>
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">Learner</p>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Image from Admin Panel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-2 shadow-2xl">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
