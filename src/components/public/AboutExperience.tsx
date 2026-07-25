import React from 'react';
import { Briefcase, GraduationCap, MapPin, Download } from 'lucide-react';
import { Experience, Education, Profile } from '../../types';

interface AboutExperienceProps {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  onOpenResumeModal: () => void;
}

export const AboutExperience: React.FC<AboutExperienceProps> = ({
  profile,
  experience,
  education,
  onOpenResumeModal
}) => {
  return (
    <section id="about" className="py-20 bg-[#050505] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">INDEX 02 · CAREER RECORD</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
              Experience & Academic Record
            </h2>
          </div>

          <button
            onClick={onOpenResumeModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>DOWNLOAD CURRICULUM VITAE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Bio Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="aspect-square w-32 rounded-lg overflow-hidden border border-white/10 bg-[#080808]">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-1">LOCATION & BASE</span>
              <p className="font-display text-lg font-medium text-white flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-green-400" />
                {profile.location}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-1">SUMMARY STATEMENT</span>
              <p className="text-white/60 text-base leading-relaxed font-sans">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Experience Ledger List */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Experience Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-white/10">
                <Briefcase className="w-4 h-4 text-green-400" />
                <h3 className="font-display font-medium text-xl text-white">Professional History</h3>
              </div>

              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-8 border-b border-white/10 last:border-b-0">
                    <div className="sm:col-span-4">
                      <span className="text-xs font-mono text-white/80 font-bold block">{exp.startDate} — {exp.endDate}</span>
                      <span className="text-[10px] uppercase font-mono text-white/40 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1 text-white/60" />
                        {exp.location}
                      </span>
                    </div>

                    <div className="sm:col-span-8 space-y-2">
                      <h4 className="font-display font-medium text-xl text-white">{exp.role}</h4>
                      <p className="text-xs uppercase tracking-widest font-mono text-green-400 font-semibold">{exp.company}</p>
                      <p className="text-white/60 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-white/10">
                <GraduationCap className="w-4 h-4 text-white/80" />
                <h3 className="font-display font-medium text-xl text-white">Education & Qualifications</h3>
              </div>

              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-6 border-b border-white/10 last:border-b-0">
                    <div className="sm:col-span-4">
                      <span className="text-xs font-mono text-white/80 font-bold block">{edu.startDate} — {edu.endDate}</span>
                    </div>

                    <div className="sm:col-span-8 space-y-1">
                      <h4 className="font-display font-medium text-lg text-white">{edu.degree} in {edu.field}</h4>
                      <p className="text-xs font-mono text-white/50">{edu.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
