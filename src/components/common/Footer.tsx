import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Mail, 
  ArrowRight, 
  CheckCircle2,
  Heart,
  Instagram,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PageRoute } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentPage, showToast, setDevGuideOpen } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the AURA Insiders circle! Check your inbox for your 15% welcome code.', 'success');
    setEmail('');
  };

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Value Propositions / Trust Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-14 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all domestic orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Day Risk-Free Trial</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free refunds & prepaid returns</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2-Year Precision Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive hardware protection</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Expert Concierge</h4>
              <p className="text-xs text-slate-400 mt-0.5">Live audio & hardware specialists</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold text-lg">
                A
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                AURA
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Designed for the modern workspace and intentional living. We engineer industrial-grade acoustic gear, titanium wearables, and ergonomic studio equipment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Collections</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-white transition">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories')} className="hover:text-white transition">
                  Audio & Acoustics
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories')} className="hover:text-white transition">
                  Wearables & Titanium
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories')} className="hover:text-white transition">
                  Workspace Ergonomics
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories')} className="hover:text-white transition">
                  Optics & Photography
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => navigateTo('profile')} className="hover:text-white transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('profile')} className="hover:text-white transition">
                  Warranty Registration
                </button>
              </li>
              <li>
                <button onClick={() => setDevGuideOpen(true)} className="text-amber-400 hover:text-amber-300 font-medium transition">
                  Full-Stack Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Stay Informed</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for exclusive batch releases, engineering deep-dives, and private seasonal discounts.
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Welcome email sent.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AURA Modern Commerce Inc. All rights reserved. Crafted with precision.</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
              SSL 256-Bit Secure
            </span>
            <span className="font-mono text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
              Stripe Verified
            </span>
            <span className="font-mono text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
              Razorpay Ready
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
