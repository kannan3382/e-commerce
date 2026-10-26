import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Minus, 
  Tag, 
  Check, 
  Truck,
  Sparkles 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    setCurrentPage,
    navigateToProduct
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 99;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const discountAmount = appliedCoupon 
    ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCartPage = () => {
    setIsCartOpen(false);
    setCurrentPage('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-950">
                Your Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-700">You unlocked Free Express Shipping!</strong>
                ) : (
                  <span>
                    Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-600">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  progressToFreeShipping >= 100 ? 'bg-emerald-500' : 'bg-slate-900'
                }`}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our curated collection of acoustic hardware and precision titanium wearables.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  Start Shopping
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition bg-white"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateToProduct(item.product.id);
                    }}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 
                        onClick={() => {
                          setIsCartOpen(false);
                          navigateToProduct(item.product.id);
                        }}
                        className="text-xs font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:underline"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.product.brand}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              {/* Promo input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <span className="flex items-center gap-1.5 text-amber-900 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    Coupon &ldquo;{appliedCoupon.code}&rdquo; applied ({appliedCoupon.discountPercent}% OFF)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (try SAVE20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-950 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium px-1">{couponError}</p>
                  )}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span>
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      'Calculated at checkout'
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-950">
                  <span>Estimated Total</span>
                  <span>${(cartSubtotal - discountAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGoToCartPage}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs rounded-xl transition"
                >
                  View Full Bag & Estimate Taxes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
