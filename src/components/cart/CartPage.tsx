import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    setCurrentPage, 
    navigateToProduct,
    showToast 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [shippingOption, setShippingOption] = useState<'standard' | 'express' | 'overnight'>('standard');

  const FREE_SHIPPING_THRESHOLD = 99;
  const isFreeStandard = cartSubtotal >= FREE_SHIPPING_THRESHOLD;

  const shippingCost = 
    shippingOption === 'overnight' ? 29 :
    shippingOption === 'express' ? 18 :
    isFreeStandard ? 0 : 9.99;

  const discountAmount = appliedCoupon 
    ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const estimatedTax = Number(((cartSubtotal - discountAmount) * 0.0825).toFixed(2));
  const estimatedTotal = Number((cartSubtotal - discountAmount + shippingCost + estimatedTax).toFixed(2));

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

  const handleProceedToCheckout = () => {
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-slate-400 shadow-sm border border-slate-200">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Your shopping bag is completely empty
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Discover our flagship studio headphones, precision titanium timepieces, and ergonomic walnut keyboards.
          </p>
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-sm transition"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Review your selected hardware before proceeding to secure payment.
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

        {/* 2-column layout: Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onClick={() => navigateToProduct(item.product.id)}
                    className="w-24 h-24 rounded-2xl object-cover bg-slate-100 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {item.product.brand}
                    </span>
                    <h3 
                      onClick={() => navigateToProduct(item.product.id)}
                      className="text-sm font-bold text-slate-900 cursor-pointer hover:underline line-clamp-1"
                    >
                      {item.product.name}
                    </h3>
                    {item.selectedColor && (
                      <p className="text-xs text-slate-500">Finish: {item.selectedColor}</p>
                    )}
                    <p className="text-xs font-semibold text-slate-700">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg hover:bg-white text-slate-600 flex items-center justify-center font-bold text-sm"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 rounded-lg hover:bg-white text-slate-600 flex items-center justify-center font-bold text-sm disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-slate-950 w-20 text-right">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 transition"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 sticky top-28">
              <h2 className="text-base font-bold text-slate-950 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-bold text-amber-950">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-amber-700">{appliedCoupon.discountPercent}% OFF</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-950"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                  )}
                </form>
              )}

              {/* Shipping Speed Option */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase text-slate-700">Shipping Method</label>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption === 'standard'}
                        onChange={() => setShippingOption('standard')}
                        className="accent-slate-950"
                      />
                      <span>Standard Ground (3-5 days)</span>
                    </div>
                    <span className="font-bold">
                      {isFreeStandard ? <span className="text-emerald-600">FREE</span> : '$9.99'}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption === 'express'}
                        onChange={() => setShippingOption('express')}
                        className="accent-slate-950"
                      />
                      <span>UPS 2-Day Air</span>
                    </div>
                    <span className="font-bold">$18.00</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption === 'overnight'}
                        onChange={() => setShippingOption('overnight')}
                        className="accent-slate-950"
                      />
                      <span>FedEx Priority Overnight</span>
                    </div>
                    <span className="font-bold">$29.00</span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900">
                    {shippingCost === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Sales Tax (8.25%)</span>
                  <span className="font-bold text-slate-900">${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-950">
                  <span>Estimated Total</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-bit encrypted checkout via Stripe & Razorpay</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>30-day risk-free return guarantee</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
