import React from 'react';
import { Star, Quote, Building2 } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-[#050505] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">INDEX 05 · PEER ENDORSEMENTS</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight">
              Testimonials & Leadership Feedback
            </h2>
          </div>

          <p className="text-white/50 max-w-md text-base leading-relaxed">
            Recommendations from engineering executives, principal architects, and tech leaders I've collaborated with.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 bg-[#080808] rounded-xl border border-white/10 shadow-sm space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Quote className="w-8 h-8 text-white/40" />
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                    ))}
                  </div>
                </div>

                <p className="text-white/80 text-base sm:text-lg leading-relaxed italic font-sans">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-display font-medium text-base text-white">{item.name}</h4>
                  <p className="text-[10px] uppercase tracking-wider font-mono text-green-400 flex items-center mt-0.5">
                    <Building2 className="w-3 h-3 mr-1 inline" />
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
