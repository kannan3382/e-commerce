import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, showToast } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    login(email, role, name || (mode === 'signup' ? name : undefined));
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleQuickCustomer = () => {
    login('alex@example.com', 'customer', 'Alex Morgan');
  };

  const handleQuickAdmin = () => {
    login('admin@aura.store', 'admin', 'Store Administrator');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setIsAuthModalOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">
            A
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            {mode === 'signin' ? 'Welcome Back to AURA' : 'Create an AURA Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'signin' 
              ? 'Sign in to access your orders, saved addresses, and wishlist' 
              : 'Join to receive member pricing, expedited delivery, and private releases'}
          </p>
        </div>

        {/* Quick Demo One-Click Access Banner */}
        <div className="px-6 sm:px-8 py-3 bg-amber-50/70 border-y border-amber-200/60 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            1-Click Demo Profiles (Instant Sign In):
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleQuickCustomer}
              className="flex-1 py-1.5 px-3 bg-white hover:bg-amber-100/60 text-slate-900 text-xs font-bold rounded-xl border border-amber-300 transition shadow-2xs text-left"
            >
              👤 Customer (Alex)
            </button>
            <button
              onClick={handleQuickAdmin}
              className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-2xs text-left flex items-center justify-between"
            >
              <span>🛡️ Admin Portal</span>
              <ShieldCheck className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Peterson"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to ' + (email || 'your email'), 'info')}
                  className="text-[11px] text-amber-700 font-semibold hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-slate-950"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div className="flex items-center gap-4 pt-1 text-xs">
            <span className="text-slate-500 font-semibold">Account Level:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="role"
                checked={role === 'customer'}
                onChange={() => setRole('customer')}
                className="accent-slate-950"
              />
              <span className="font-semibold text-slate-700">Customer</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="role"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
                className="accent-slate-950"
              />
              <span className="font-bold text-amber-700">Store Administrator</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-98 mt-2"
          >
            <span>{mode === 'signin' ? 'Sign In Securely' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Toggle between sign in and sign up */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <p>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-slate-950 hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-slate-950 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
