import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Search, 
  Star, 
  ArrowUpDown, 
  Grid3X3, 
  LayoutList, 
  RotateCcw,
  Check,
  PackageX
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    categories, 
    filterState, 
    setFilterState, 
    resetFilters,
    addToCart,
    navigateToProduct,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Available brands derived from products
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(products.map((p) => p.brand)));
    return brands.sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesCat && !matchesTags) return false;
      }

      // Category
      if (filterState.category !== 'all' && product.category !== filterState.category) {
        return false;
      }

      // Brand
      if (filterState.brand !== 'all' && product.brand !== filterState.brand) {
        return false;
      }

      // Price Range
      if (product.price < filterState.minPrice || product.price > filterState.maxPrice) {
        return false;
      }

      // Rating
      if (filterState.minRating > 0 && product.rating < filterState.minRating) {
        return false;
      }

      // Stock
      if (filterState.inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterState.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filterState]);

  // Check if any filters are active
  const hasActiveFilters = 
    filterState.searchQuery !== '' ||
    filterState.category !== 'all' ||
    filterState.brand !== 'all' ||
    filterState.minPrice > 0 ||
    filterState.maxPrice < 2000 ||
    filterState.minRating > 0 ||
    filterState.inStockOnly;

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Breadcrumb & Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">
            Shop All Hardware & Acoustics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse our full catalog of audiophile headphones, titanium wearables, and desk ergonomics.
          </p>
        </div>

        {/* Top Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            <span className="text-xs font-semibold text-slate-600">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 hidden sm:inline">Sort:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-950"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Active Filters:
            </span>

            {filterState.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-amber-900 font-medium">
                Search: &ldquo;{filterState.searchQuery}&rdquo;
                <button onClick={() => setFilterState((p) => ({ ...p, searchQuery: '' }))}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}

            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-amber-900 font-medium">
                Category: {filterState.category}
                <button onClick={() => setFilterState((p) => ({ ...p, category: 'all' }))}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}

            {filterState.brand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-amber-900 font-medium">
                Brand: {filterState.brand}
                <button onClick={() => setFilterState((p) => ({ ...p, brand: 'all' }))}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}

            {(filterState.minPrice > 0 || filterState.maxPrice < 2000) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-amber-900 font-medium">
                Price: ${filterState.minPrice} – ${filterState.maxPrice}
                <button onClick={() => setFilterState((p) => ({ ...p, minPrice: 0, maxPrice: 2000 }))}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}

            {filterState.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-amber-900 font-medium">
                Rating: {filterState.minRating}+ Stars
                <button onClick={() => setFilterState((p) => ({ ...p, minRating: 0 }))}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}

            {filterState.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-amber-900 font-medium">
                In Stock Only
                <button onClick={() => setFilterState((p) => ({ ...p, inStockOnly: false }))}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter Catalog
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-950"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilterState((p) => ({ ...p, category: 'all' }))}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                      filterState.category === 'all'
                        ? 'bg-slate-950 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] opacity-70">({products.length})</span>
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.name).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFilterState((p) => ({ ...p, category: cat.name }))}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                          filterState.category === cat.name
                            ? 'bg-slate-950 text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Max Price
                  </label>
                  <span className="text-xs font-extrabold text-slate-950">
                    ${filterState.maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={filterState.maxPrice}
                  onChange={(e) =>
                    setFilterState((p) => ({ ...p, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-slate-950 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>$50</span>
                  <span>$2,000</span>
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Brand
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => setFilterState((p) => ({ ...p, brand: 'all' }))}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterState.brand === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Brands
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setFilterState((p) => ({ ...p, brand }))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        filterState.brand === brand
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Minimum Rating
                </label>
                <div className="space-y-1">
                  {[
                    { label: 'Any Rating', val: 0 },
                    { label: '4.8★ & Above', val: 4.8 },
                    { label: '4.5★ & Above', val: 4.5 },
                    { label: '4.0★ & Above', val: 4.0 },
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() => setFilterState((p) => ({ ...p, minRating: r.val }))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                        filterState.minRating === r.val
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{r.label}</span>
                      {filterState.minRating === r.val && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Switch */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={filterState.inStockOnly}
                    onChange={(e) =>
                      setFilterState((p) => ({ ...p, inStockOnly: e.target.checked }))
                    }
                    className="w-4 h-4 accent-slate-950 rounded cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">No products match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try widening your price range, searching for another keyword, or resetting active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* List View layout */
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:shadow-lg transition flex flex-col sm:flex-row gap-5 items-center"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => navigateToProduct(product.id)}
                      className="w-36 h-36 rounded-xl object-cover bg-slate-100 cursor-pointer shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                        <span className="font-bold text-amber-700 uppercase tracking-wider text-[11px]">
                          {product.brand}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{product.category}</span>
                        <div className="flex items-center gap-1 font-semibold text-slate-700 ml-2">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => navigateToProduct(product.id)}
                        className="font-bold text-base text-slate-950 cursor-pointer hover:underline"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                        <span className="text-lg font-black text-slate-950">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => navigateToProduct(product.id)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition text-center"
                      >
                        View Specs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="font-bold text-sm text-slate-900">Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Mobile filter contents */}
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700">Category</label>
                  <select
                    value={filterState.category}
                    onChange={(e) => setFilterState((p) => ({ ...p, category: e.target.value }))}
                    className="mt-1 w-full p-2 bg-slate-100 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-700">Brand</label>
                  <select
                    value={filterState.brand}
                    onChange={(e) => setFilterState((p) => ({ ...p, brand: e.target.value }))}
                    className="mt-1 w-full p-2 bg-slate-100 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Brands</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Max Price</span>
                    <span>${filterState.maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={filterState.maxPrice}
                    onChange={(e) => setFilterState((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                    className="w-full mt-2 accent-slate-950"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-slate-950 text-white font-bold text-xs rounded-xl"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
