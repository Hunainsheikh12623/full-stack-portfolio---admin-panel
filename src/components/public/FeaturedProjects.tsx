import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, Search, Layers, Filter } from 'lucide-react';
import { Project } from '../../types';

interface FeaturedProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-[#050505] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">INDEX 01 · FEATURED WORK</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
              Project Portfolio & Case Studies
            </h2>
          </div>

          <p className="text-white/50 max-w-md text-base leading-relaxed">
            Production systems engineered for scale, high throughput, and low latency. Click any item for detailed architecture.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 mr-2 flex items-center space-x-1">
              <Filter className="w-3 h-3 inline" />
              <span>CATEGORY:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs uppercase tracking-widest font-mono transition-all rounded-sm ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search tech stack or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#080808] border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        {/* Projects List (Ledger Index Rail Layout) */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#080808] rounded-xl border border-white/10">
            <p className="font-display text-lg text-white/60">No projects matched your search query.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-3 text-xs font-mono text-white underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredProjects.map((project, index) => {
              const indexFormatted = String(project.order || index + 1).padStart(2, '0');
              return (
                <article
                  key={project.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 md:p-8 bg-[#080808] rounded-xl border border-white/10 hover:border-white/30 transition-all shadow-sm group"
                >
                  {/* Ledger Rail Number */}
                  <div className="lg:col-span-1 hidden lg:block">
                    <span className="text-sm font-mono text-white/80 font-bold block">{indexFormatted}</span>
                    <span className="text-[10px] uppercase font-mono text-white/40">{project.startDate}</span>
                  </div>

                  {/* Project Image */}
                  <div 
                    onClick={() => onSelectProject(project)}
                    className="lg:col-span-5 relative overflow-hidden rounded-lg bg-black/40 cursor-pointer aspect-video border border-white/10"
                  >
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    {project.featured && (
                      <span className="absolute top-3 left-3 bg-white text-black font-mono font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-xs shadow-sm">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="lg:col-span-6 space-y-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs font-mono text-white/80 lg:hidden">{indexFormatted} · </span>
                        <span className="text-[10px] uppercase tracking-wider font-mono text-white/70 bg-white/5 px-2.5 py-0.5 rounded-sm border border-white/10">
                          {project.category}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">{project.startDate} — {project.endDate}</span>
                      </div>

                      <h3 
                        onClick={() => onSelectProject(project)}
                        className="font-display font-medium text-2xl sm:text-3xl text-white hover:text-white/80 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>{project.title}</span>
                        <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>

                      <p className="text-white/60 text-sm sm:text-base mt-2 leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>

                      {/* Results callout */}
                      {project.results && (
                        <div className="mt-3 p-3 rounded-md bg-white/5 border border-white/10 flex items-start space-x-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          <p className="text-xs font-mono text-green-400 font-medium leading-tight uppercase tracking-wide">
                            OUTCOME: {project.results}
                          </p>
                        </div>
                      )}

                      {/* Tech stack badges */}
                      <div className="pt-4 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] uppercase tracking-wider font-mono text-white/70 bg-white/5 px-2.5 py-1 rounded-sm border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Links */}
                    <div className="pt-6 flex items-center space-x-4 border-t border-white/10">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="px-4 py-2 rounded-sm bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        VIEW CASE STUDY
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-xs font-mono text-white/60 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>LIVE DEMO</span>
                        </a>
                      )}

                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-xs font-mono text-white/60 hover:text-white"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>SOURCE</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
