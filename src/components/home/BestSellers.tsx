import React, { useState } from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';

export const BestSellers: React.FC = () => {
  const { products, setCurrentPage } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'audio' | 'workspace' | 'wearables'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return p.isBestSeller || p.isFeatured;
    if (activeTab === 'audio') return p.category.includes('Audio');
    if (activeTab === 'workspace') return p.category.includes('Workspace');
    if (activeTab === 'wearables') return p.category.includes('Wearables');
    return true;
  });

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Category Tab Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              <Flame className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Best Sellers & Studio Standards
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              All Featured
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'audio'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Audio & Acoustics
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'workspace'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Workspace Desk
            </button>
            <button
              onClick={() => setActiveTab('wearables')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'wearables'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Wearables
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-2xl font-bold text-xs shadow-xs transition"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
