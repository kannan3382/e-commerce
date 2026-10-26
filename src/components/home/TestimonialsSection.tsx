import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Aris Thorne',
      role: 'Audio Engineer & Sound Designer',
      comment: 'The bio-cellulose diaphragms on the AURA Pulse Pro deliver transient resolution I normally only hear on $1,500 planar magnetic studio setups. Utterly uncompromising quality.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      product: 'AURA Pulse Pro Wireless Studio',
      rating: 5,
    },
    {
      name: 'Maya Lin-Peterson',
      role: 'Industrial Architect',
      comment: 'Grade 5 titanium chassis on the Chronos watch is impeccably finished. The chamfered edges and sapphire display feel like pure Swiss horology, but with modern biometric precision.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      product: 'Chronos Sapphire Titanium Watch',
      rating: 5,
    },
    {
      name: 'Julian Sterling',
      role: 'Founder, Monolith Systems',
      comment: 'My desk has never looked or felt more purposeful. The solid walnut keyboard and monitor light bar eliminated eye fatigue during late-night coding sessions.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      product: 'Keychron Lumina Walnut Keyboard',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest">
            <Quote className="w-3.5 h-3.5" />
            <span>Voices of the Collective</span>
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Trusted by Designers, Engineers & Audiophiles
          </h2>
          <p className="text-sm text-slate-500">
            Real feedback from creators who depend on our instruments day in and day out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/70 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{t.name}</h4>
                    <span title="Verified Customer" className="inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{t.role}</p>
                  <p className="text-[10px] text-amber-700 font-semibold truncate mt-0.5">
                    Verified: {t.product}
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
