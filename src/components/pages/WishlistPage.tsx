import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, navigateToProduct, setCurrentPage } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <span>Saved Wishlist</span>
              <span className="text-sm font-bold text-slate-500">({wishlistProducts.length})</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Curate your favorite acoustic equipment and titanium wearables.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Content */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-950">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our catalog of audio monitors and precision titanium accessories and click the heart icon to save items.
            </p>
            <button
              onClick={() => setCurrentPage('shop')}
              className="px-6 py-3 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition shadow-xs"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((p) => (
              <div 
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div 
                  onClick={() => navigateToProduct(p.id)}
                  className="aspect-square bg-slate-100 relative cursor-pointer overflow-hidden group"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {p.brand}
                    </span>
                    <h3
                      onClick={() => navigateToProduct(p.id)}
                      className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:underline cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-black text-sm text-slate-950">${p.price.toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${p.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(p, 1)}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
