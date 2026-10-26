import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  Check, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { 
    selectedProductId, 
    getProductById, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setCurrentPage, 
    navigateToProduct,
    getReviewsForProduct,
    addReview,
    currentUser,
    setIsAuthModalOpen,
    showToast
  } = useStore();

  const product = getProductById(selectedProductId || '') || products[0];
  const reviews = getReviewsForProduct(product.id);
  const isFavorited = isInWishlist(product.id);

  // States
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping' | 'reviews'>('overview');
  const [selectedFinish, setSelectedFinish] = useState('Matte Obsidian');

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');

  // Calculate savings
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedFinish);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'success');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      showToast('Please provide both a title and comment for your review.', 'error');
      return;
    }

    addReview({
      productId: product.id,
      userName: reviewerName || 'Verified Buyer',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
      helpfulCount: 0,
    });

    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <button 
            onClick={() => setCurrentPage('home')}
            className="hover:text-slate-900 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button 
            onClick={() => setCurrentPage('shop')}
            className="hover:text-slate-900 transition"
          >
            Shop All
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600 font-medium">{product.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </button>

        {/* Main Product Showcase: 2-column layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner group">
              <img
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Wishlist floating toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition shadow-md ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-500'
                    : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.isBestSeller && (
                  <span className="bg-slate-950 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-md tracking-wider">
                    Studio Standard
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImgIndex === idx
                        ? 'border-slate-950 shadow-md ring-2 ring-slate-950/20'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Options, & Cart */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Brand and category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-amber-700">
                  {product.brand} • {product.category}
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Jump */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-900 ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => {
                    setActiveTab('reviews');
                    const revSection = document.getElementById('details-tabs');
                    revSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-950 underline"
                >
                  {reviews.length} Verified Reviews
                </button>
              </div>

              {/* Pricing */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-950">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    In Stock ({product.stock} units left — Ships next business day)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                    Out of stock — Backorder available
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {product.shortDescription || product.description}
              </p>

              {/* Finish / Color Variant Selector */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Finish: <span className="font-semibold text-slate-950">{selectedFinish}</span>
                </label>
                <div className="flex gap-2">
                  {['Matte Obsidian', 'Brushed Titanium', 'Natural Walnut'].map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        selectedFinish === finish
                          ? 'border-slate-950 bg-slate-950 text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quantity
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1 w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center font-bold text-base"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center font-bold text-base disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons: Add to Bag + Buy Now */}
            <div className="pt-6 space-y-3 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Checkout</span>
                </button>
              </div>

              {/* Reassurance strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-slate-500 text-center">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-slate-700" />
                  <span>30-Day Money Back</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <span>2-Year Warranty</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Tabs: Overview, Specs, Shipping, Reviews */}
        <div id="details-tabs" className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Design' },
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Verified Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-sm font-bold border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-8">
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl leading-relaxed text-sm text-slate-700">
                <h3 className="text-lg font-bold text-slate-950">Engineering Philosophy</h3>
                <p>{product.description}</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-xs uppercase text-slate-900 mb-2">Key Highlights</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li>Industrial grade materials tuned for acoustic dampening and ergonomic comfort</li>
                    <li>Designed to perform in demanding professional recording and mastering environments</li>
                    <li>Environmentally responsible packaging with 100% recycled fibers</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-3 font-bold text-slate-700 w-1/3">{key}</td>
                        <td className="py-3 text-slate-900">{val}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3 font-bold text-slate-700">SKU Identifier</td>
                      <td className="py-3 font-mono text-slate-600">{product.slug}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-700">In The Box</td>
                      <td className="py-3 text-slate-900">
                        Hardware device, braided high-speed USB-C charging cable, hard-shell magnetic travel case, quickstart manual, certificate of acoustic calibration.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <h3 className="text-base font-bold text-slate-950">Domestic & International Fulfillment</h3>
                <p>
                  All orders are dispatched within 24 hours from our climate-controlled fulfillment hub in California. Domestic shipments arrive within 2-4 business days via UPS Priority.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Standard Delivery</h4>
                    <p className="text-xs text-slate-500">Free for orders over $99. $9.99 flat rate for orders under $99.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">30-Day Hassle-Free Returns</h4>
                    <p className="text-xs text-slate-500">Try in your studio for 30 days. Prepaid return label included with every order.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Header & Write CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-slate-950">{product.rating.toFixed(1)}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Based on {reviews.length} authentic verified purchaser reviews
                    </p>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {/* Write Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">Share your experience with {product.name}</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Your Name</label>
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Review Headline</label>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Astonishing soundstage and build quality"
                          className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">Detailed Feedback</label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe your acoustic setup, fit, battery life, or build impressions..."
                        className="mt-1 w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-900"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">No reviews written yet. Be the first to review!</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="pb-6 border-b border-slate-100 last:border-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                              alt={r.userName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-slate-900">{r.userName}</span>
                            {r.verifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{r.date}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black text-slate-950 tracking-tight mb-6">
              You Might Also Like in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
