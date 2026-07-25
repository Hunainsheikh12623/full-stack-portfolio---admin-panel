import React, { useState } from 'react';
import { Cpu, Server, Database, Layers, Code2, Network, Box } from 'lucide-react';
import { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Backend', 'Frontend', 'Cloud & DevOps', 'Databases', 'Architecture'];

  const filteredSkills = skills.filter(skill => 
    selectedCategory === 'All' || skill.category === selectedCategory
  );

  return (
    <section id="skills" className="py-20 bg-[#050505] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">INDEX 03 · TECHNICAL MATRIX</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
              Skills & Core Competencies
            </h2>
          </div>

          <p className="text-white/50 max-w-md text-base leading-relaxed">
            Evaluated proficiency across backend protocols, distributed databases, cloud orchestration, and systems design.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 bg-[#080808] rounded-lg border border-white/10 hover:border-white/30 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-white/10 text-white flex items-center justify-center font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-base text-white">{skill.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-white/40">{skill.category}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-green-400 font-bold uppercase tracking-widest">LVL {skill.proficiency}/5</span>
              </div>

              {/* Proficiency Level Bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
