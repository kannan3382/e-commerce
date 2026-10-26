import React from 'react';
import { ShieldCheck, Compass, Sparkles, Feather, Recycle, Heart, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Design & Acoustic Calibration</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Built for creators who refuse to settle for plastic.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Founded in San Francisco, AURA was born from a singular obsession: to build studio hardware, biometric timepieces, and desk instruments crafted from raw aerospace titanium, brass, and American walnut.
          </p>
        </div>

        {/* Feature Story Image */}
        <div className="relative aspect-21/9 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80"
            alt="Studio Workshop"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
            <p className="text-xs sm:text-sm text-slate-300 max-w-md italic">
              &ldquo;Good design is thorough down to the last detail. Nothing must be arbitrary or left to chance.&rdquo;
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Acoustic Purity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every driver is individually matched within 0.5dB tolerance. We use bio-cellulose diaphragms and acoustic dampening ports for fatigue-free listening.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Grade 5 Titanium</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our wearable chassis are milled from monolithic blocks of Grade 5 titanium, offering twice the strength of steel at half the weight.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Circular Lifecycles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modular screws and zero adhesive seals allow every internal component and battery to be serviced, repaired, and upgraded indefinitely.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Experience the difference in your everyday ritual.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Test any AURA instrument in your personal workspace with our 30-day risk-free return trial.
          </p>
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm transition"
          >
            <span>Explore the Hardware</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
