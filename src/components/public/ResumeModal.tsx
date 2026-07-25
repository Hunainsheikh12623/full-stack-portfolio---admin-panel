import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Profile, Experience, Education, Skill } from '../../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  profile,
  experience,
  education,
  skills
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate simple text CV export or redirect
    const element = document.createElement('a');
    const file = new Blob([
      `${profile.name.toUpperCase()} - RESUME\n`,
      `Title: ${profile.title}\n`,
      `Email: ${profile.email}\n`,
      `Location: ${profile.location}\n\n`,
      `EXPERIENCE:\n`,
      experience.map(e => `- ${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`).join('\n'),
      `\n\nSKILLS:\n`,
      skills.map(s => `- ${s.name} (${s.category})`).join('\n')
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#080808] text-white rounded-xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0a0a0a] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-400" />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-green-400 font-semibold">CURRICULUM VITAE PREVIEW</span>
              <h3 className="font-display font-medium text-xl text-white">{profile.name} — Resume</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 text-[#e0e0e0]">
          
          {/* Header block */}
          <div className="border-b border-white/10 pb-6 space-y-2">
            <h1 className="font-display font-bold text-3xl text-white tracking-tight">{profile.name}</h1>
            <p className="text-xs uppercase tracking-widest font-mono text-green-400 font-bold">{profile.title}</p>
            <p className="text-xs font-mono text-white/50">{profile.email} · {profile.location} · {profile.phone}</p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-widest font-mono text-green-400 font-bold">PROFESSIONAL EXPERIENCE</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-base text-white">{exp.role} — {exp.company}</span>
                    <span className="text-xs font-mono text-white/40">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-sm text-white/60">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-[10px] uppercase tracking-widest font-mono text-green-400 font-bold">EDUCATION</h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-base text-white">{edu.degree} in {edu.field}</p>
                  <p className="text-xs font-mono text-white/50">{edu.institution}</p>
                </div>
                <span className="text-xs font-mono text-white/40">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-[10px] uppercase tracking-widest font-mono text-green-400 font-bold">TECHNICAL SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="text-[10px] uppercase tracking-wider font-mono text-white/80 bg-white/5 px-3 py-1 rounded-sm border border-white/10">
                  {s.name}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between shrink-0">
          <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">FORMAT: TEXT / PDF COMPATIBLE</p>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-white text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
            >
              <Download className="w-4 h-4 text-black" />
              <span>DOWNLOAD RESUME FILE</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-sm bg-white/10 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/20 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
