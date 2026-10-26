import React from 'react';
import { ArrowRight, Headphones, Watch, Monitor, Camera, Coffee, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const FeaturedCategories: React.FC = () => {
  const { categories, setCurrentPage, setFilterState } = useStore();

  const handleSelectCategory = (catName: string) => {
    setFilterState((prev) => ({ ...prev, category: catName }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'Watch': return <Watch className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      default: return <Headphones className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              <span>Curated Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Explore by Category
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentPage('categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleSelectCategory(category.name)}
              className="group cursor-pointer bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/60 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 mb-3 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition" />
                <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-white/90 text-slate-900 shadow-xs backdrop-blur-xs">
                  {getCategoryIcon(category.iconName)}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 transition">
                  {category.name}
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {category.itemCount} Items
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
