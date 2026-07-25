import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { Profile } from '../../types';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/public/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#050505] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="pb-8 mb-12 border-b border-white/10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">INDEX 06 · INITIATE CONTACT</span>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight mt-2">
            Let's Build Systems Together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-white/60 text-base leading-relaxed">
              Open for full-time engineering leadership, principal consulting, and advisory engagements. Send an inquiry or email me directly.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#080808] border border-white/10 flex items-center space-x-3">
                <Mail className="w-5 h-5 text-white/80" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block">DIRECT EMAIL</span>
                  <a href={`mailto:${profile.email}`} className="font-display font-medium text-white hover:text-white/80 transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>

              {profile.phone && (
                <div className="p-4 rounded-lg bg-[#080808] border border-white/10 flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block">PHONE / SIGNAL</span>
                    <span className="font-display font-medium text-white">{profile.phone}</span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-[#080808] border border-white/10 flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-white/80" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block">PRIMARY LOCATION</span>
                  <span className="font-display font-medium text-white">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 block mb-3">SOCIAL & PROFESSIONAL LINKS</span>
              <div className="flex flex-wrap gap-3">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/10 transition-all"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#080808] p-6 sm:p-8 rounded-xl border border-white/10">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
                <h3 className="font-display font-medium text-2xl text-white">Inquiry Received Successfully</h3>
                <p className="text-white/60 max-w-md mx-auto text-sm">
                  Thank you for reaching out. Your message has been logged in my admin inbox and I will respond promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-sm bg-white text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-neutral-200"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-mono text-white/60 block mb-2">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Lin"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-mono text-white/60 block mb-2">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-mono text-white/60 block mb-2">SUBJECT</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Leadership Hiring"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-mono text-white/60 block mb-2">MESSAGE *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your project, timeline, or engineering role details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-400 bg-red-500/10 p-3 rounded-sm border border-red-500/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-white/10 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>LOGGING MESSAGE...</span>
                  ) : (
                    <>
                      <span>TRANSMIT MESSAGE</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
