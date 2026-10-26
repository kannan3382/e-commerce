import React from 'react';
import { ArrowRight, Headphones, Watch, Monitor, Camera, Coffee, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, setCurrentPage, setFilterState } = useStore();

  const handleSelectCategory = (catName: string) => {
    setFilterState((prev) => ({ ...prev, category: catName }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Headphones': return <Headphones className="w-6 h-6" />;
      case 'Watch': return <Watch className="w-6 h-6" />;
      case 'Monitor': return <Monitor className="w-6 h-6" />;
      case 'Camera': return <Camera className="w-6 h-6" />;
      case 'Coffee': return <Coffee className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Disciplines & Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Explore All Product Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Precision instruments organized by workflow and environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category.name).length;
            return (
              <div
                key={category.id}
                onClick={() => handleSelectCategory(category.name)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/95 text-slate-950 shadow-md backdrop-blur-xs">
                    {getIcon(category.iconName)}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      {count} Products Available
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-amber-800 transition">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                      {category.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-800">
                    <span>Browse Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
