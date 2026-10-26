import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Copy, Check, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SpecialOfferBanner: React.FC = () => {
  const { setCurrentPage, applyCoupon, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SAVE20');
    setCopied(true);
    applyCoupon('SAVE20');
    showToast('Promo code SAVE20 copied & applied to your cart!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShopSale = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-linear-to-r from-amber-600 via-amber-700 to-amber-900 text-white relative overflow-hidden my-12 mx-4 sm:mx-6 lg:mx-8 rounded-3xl shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-black/30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left info & promo */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-amber-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Seasonal Drop</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Take 20% Off Orders Over $200
            </h2>

            <p className="text-sm text-amber-100 max-w-lg leading-relaxed">
              Upgrade your desk acoustics and titanium daily carry. Apply code at checkout or click below to activate instantly.
            </p>

            {/* Promo Code Box */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center bg-black/40 backdrop-blur-md rounded-2xl p-1.5 border border-amber-400/40">
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span className="font-mono font-black text-sm tracking-widest text-amber-300">
                    SAVE20
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Applied!' : 'Copy & Apply'}</span>
                </button>
              </div>

              <button
                onClick={handleShopSale}
                className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition shadow-md"
              >
                <span>Shop Featured Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Live Countdown Clock */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-slate-950/70 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl text-center w-full max-w-sm">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-4">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Offer Expires In</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <span className="block text-3xl font-black text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-wider font-semibold">
                    Hours
                  </span>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <span className="block text-3xl font-black text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-wider font-semibold">
                    Minutes
                  </span>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                  <span className="block text-3xl font-black text-white font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-wider font-semibold">
                    Seconds
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-amber-200/80 mt-4">
                Valid on all in-stock products across audio, workspace, and titanium wearables.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
