import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  profile: Profile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Work', href: '#projects' },
    { label: 'About & Exp', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Writings', href: '#blog' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold font-display group-hover:bg-neutral-200 transition-colors rounded-sm">
            {profile.name ? profile.name.charAt(0) : 'P'}
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold text-base leading-tight tracking-tight text-white group-hover:text-white/80 transition-colors">
              {profile.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/50">PORTFOLIO SYSTEM</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest font-semibold text-white/60 hover:text-white transition-colors hover:underline underline-offset-8 decoration-white/40 decoration-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Status Badge */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider font-medium text-white/80">{profile.availabilityStatus}</span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0a0a] px-4 py-6 space-y-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-white/80">{profile.availabilityStatus}</span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest font-semibold text-white/70 hover:text-white py-1.5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
