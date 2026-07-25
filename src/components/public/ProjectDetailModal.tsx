import React from 'react';
import { X, ExternalLink, Github, Calendar, User, Building, Layers } from 'lucide-react';
import Markdown from 'react-markdown';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#080808] text-white rounded-xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between p-6 bg-[#0a0a0a] text-white border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-green-400 font-semibold">{project.category} · CASE STUDY</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Cover & Gallery Images */}
          <div className="space-y-4">
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {project.gallery && project.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {project.gallery.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full aspect-video object-cover rounded border border-white/10"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Project Metadata Ledger Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#050505] border border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 flex items-center">
                <User className="w-3 h-3 inline mr-1 text-green-400" /> ROLE
              </span>
              <p className="font-display text-sm font-medium text-white mt-1">{project.role}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 flex items-center">
                <Calendar className="w-3 h-3 inline mr-1 text-green-400" /> TIMELINE
              </span>
              <p className="font-display text-sm font-medium text-white mt-1">{project.startDate} – {project.endDate}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 flex items-center">
                <Building className="w-3 h-3 inline mr-1 text-green-400" /> CLIENT / CO
              </span>
              <p className="font-display text-sm font-medium text-white mt-1">{project.client}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 flex items-center">
                <Layers className="w-3 h-3 inline mr-1 text-green-400" /> STATUS
              </span>
              <p className="font-display text-sm font-medium text-green-400 capitalize mt-1">{project.status}</p>
            </div>
          </div>

          {/* Key Outcome Highlight */}
          {project.results && (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase tracking-widest font-mono text-green-400 block font-bold mb-1">MEASURABLE IMPACT / RESULT</span>
              <p className="font-display text-lg font-medium text-white">{project.results}</p>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-2">TECHNOLOGY STACK USED</span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] uppercase tracking-wider font-mono text-white/80 bg-white/5 px-3 py-1 rounded-sm border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Full Case Study Markdown Body */}
          <div className="pt-6 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-widest font-mono text-green-400 block mb-4">DETAILED TECHNICAL DOCUMENTATION</span>
            <div className="prose prose-invert max-w-none text-white/80 space-y-4 font-sans leading-relaxed">
              <Markdown>{project.description || project.summary}</Markdown>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-white text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
              >
                <span>OPEN LIVE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-white/10 text-white border border-white/10 hover:bg-white/20 font-sans font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>VIEW REPOSITORY</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-sm bg-white/10 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/20 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
