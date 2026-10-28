import React, { useState } from 'react';
import { Logo } from '../../components/Logo.tsx';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { auth, googleAuthProvider } from '../../lib/firebase.ts';
import { signInWithPopup } from 'firebase/auth';

interface AdminLoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('admin@srifabrics.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.token, data.admin);
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      onLoginSuccess(idToken, {
        name: result.user.displayName || 'Authorized Admin',
        email: result.user.email || '',
        role: 'admin',
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in error. Use email credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c050d] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-[#dfb15b]/40">
        <div className="bg-[#2a0610] p-6 text-center border-b border-[#dfb15b]/30">
          <div className="flex justify-center mb-2">
            <Logo variant="gold" size="lg" showTagline={true} />
          </div>
          <h2 className="font-serif text-lg font-bold text-[#f7eedf] tracking-wider uppercase mt-3">
            Administrative Portal
          </h2>
          <p className="text-[11px] text-[#dfb15b]">Secure B2B Fabric CMS & Sourcing Management</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
            <strong>Default Admin Credentials:</strong><br />
            Email: <code className="font-mono font-bold">admin@srifabrics.com</code><br />
            Password: <code className="font-mono font-bold">admin123456</code>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2.5 pl-9 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2.5 pl-9 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-bold uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'SIGN IN TO CMS'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#dfb15b]" />
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#faf7f2] px-2 text-stone-500 font-medium">Or</span>
            </div>
          </div>

          {/* Google Firebase OAuth button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google Admin</span>
          </button>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-stone-500 hover:text-[#4a1122] hover:underline"
            >
              ← Return to SRI Fabrics Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
