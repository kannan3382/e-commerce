import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Star, Zap, Volume2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, navigateToProduct, setFilterState } = useStore();

  const handleExploreShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreNewDrops = () => {
    setFilterState((prev) => ({ ...prev, sortBy: 'newest' }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Audio & Titanium Hardware</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-slate-400 font-normal">Fall 2026 Batch</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Hardware Crafted for{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-amber-200 to-amber-500">
                Pure Clarity
              </span>{' '}
              and Focus.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              From bio-cellulose studio acoustics to aerospace Grade 5 titanium biometric rings. Minimalist design engineered to disappear into your craft.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleExploreShop}
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleExploreNewDrops}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-2xl border border-slate-800 transition flex items-center justify-center gap-2"
              >
                <span>Discover New Drops</span>
              </button>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt="Customer"
                    className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt="Customer"
                    className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                    alt="Customer"
                    className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                  />
                </div>
                <div className="flex items-center gap-1 font-semibold text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5</span>
                </div>
                <span>(4,800+ Verified Reviews)</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2-Year Global Hardware Warranty</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Spotlight Interactive Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl overflow-hidden group">
              
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-amber-400 uppercase tracking-widest text-[11px] font-bold">
                  Flagship Acoustic
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-500/20">
                  Ready to Dispatch
                </span>
              </div>

              {/* Product Image */}
              <div 
                onClick={() => navigateToProduct('prod-1')}
                className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 cursor-pointer mb-4"
              >
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="AURA Pulse Pro Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Floating pill over image */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white">40mm Bio-Cellulose Drivers</span>
                </div>
              </div>

              {/* Card Meta & Price */}
              <div className="space-y-2">
                <h3 
                  onClick={() => navigateToProduct('prod-1')}
                  className="text-lg font-bold text-white hover:text-amber-400 transition cursor-pointer"
                >
                  AURA Pulse Pro Wireless Studio
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Spatial acoustic noise cancellation with bead-blasted aluminum and soft lambskin ear cushions.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">$349</span>
                    <span className="text-xs text-slate-500 line-through">$399</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      SAVE $50
                    </span>
                  </div>

                  <button
                    onClick={() => navigateToProduct('prod-1')}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <span>View Gear</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
