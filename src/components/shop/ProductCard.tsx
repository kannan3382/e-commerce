import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    navigateToProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct 
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container with Badges & Action Overlays */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer">
        <img
          src={product.images[0]}
          alt={product.name}
          onClick={() => navigateToProduct(product.id)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges on top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-slate-950 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-sm">
              New Drop
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-slate-600 hover:text-slate-950 hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on hover bottom */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 backdrop-blur-xs transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Stock warning pill */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 z-10 bg-amber-500/90 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-sm backdrop-blur-xs">
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-white text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-700">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-600 font-normal text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => navigateToProduct(product.id)}
            className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-amber-800 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Pricing and Add to Cart */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-950">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-600 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold block">
              In Stock & Ready to Ship
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition shadow-xs flex items-center justify-center"
            title="Add to shopping bag"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
