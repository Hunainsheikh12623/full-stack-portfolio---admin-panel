import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 text-[#e0e0e0]">
      <div className="w-full max-w-md bg-[#080808] border border-white/10 p-8 rounded-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 text-green-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 font-semibold">PRIVATE ACCESS</span>
          <h2 className="font-display font-medium text-2xl text-white tracking-tight">Admin Authentication</h2>
          <p className="text-white/50 text-xs font-mono">Sign in to manage portfolio content & inbox</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-white/60 block mb-2">ADMIN EMAIL</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-white/60 block mb-2">ADMIN PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>VERIFYING...</span>
            ) : (
              <>
                <span>AUTHENTICATE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">SECURED BY SUPABASE AUTH</span>
          <button
            onClick={onCancel}
            className="text-[10px] uppercase tracking-widest font-mono text-white/60 hover:text-white underline"
          >
            Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};
