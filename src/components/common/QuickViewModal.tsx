import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateToProduct 
  } = useStore();

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    navigateToProduct(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setQuickViewProduct(null)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-950 hover:bg-white shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Gallery side */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/60 shadow-xs mb-3">
              <img
                src={product.images[selectedImgIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      selectedImgIdx === idx ? 'border-slate-950' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-600 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-950 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-950">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-600 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  In Stock ({product.stock} available)
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Key specs pill */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-600">{key}:</span>
                    <span className="font-semibold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-3 border-t border-slate-100 mt-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag - ${(product.price * qty).toFixed(2)}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleViewFullDetails}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-950 flex items-center justify-center gap-1 transition"
              >
                <span>View Full Technical Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
