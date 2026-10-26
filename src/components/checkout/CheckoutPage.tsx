import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  Lock, 
  ArrowLeft, 
  QrCode, 
  Sparkles, 
  Building,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Address } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    placeOrder, 
    currentUser, 
    setCurrentPage, 
    showToast 
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const defaultAddr = currentUser?.addresses.find((a) => a.isDefault) || currentUser?.addresses[0];
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>(defaultAddr?.id || 'new');
  
  const [addressForm, setAddressForm] = useState<Address>({
    id: 'addr-checkout',
    fullName: currentUser?.name || 'Alex Morgan',
    addressLine1: defaultAddr?.addressLine1 || '742 Evergreen Terrace',
    addressLine2: defaultAddr?.addressLine2 || 'Suite 4B',
    city: defaultAddr?.city || 'San Francisco',
    state: defaultAddr?.state || 'CA',
    postalCode: defaultAddr?.postalCode || '94107',
    country: 'United States',
    phone: defaultAddr?.phone || '+1 (555) 234-5678',
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'stripe' | 'razorpay' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(currentUser?.name || 'Alex Morgan');

  // Pricing calculations
  const discountAmount = appliedCoupon 
    ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const isFreeStandard = cartSubtotal >= 99;
  const shippingCost = 
    shippingMethod === 'overnight' ? 29 :
    shippingMethod === 'express' ? 18 :
    isFreeStandard ? 0 : 9.99;

  const tax = Number(((cartSubtotal - discountAmount) * 0.0825).toFixed(2));
  const orderTotal = Number((cartSubtotal - discountAmount + shippingCost + tax).toFixed(2));

  // Switch to saved address
  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedSavedAddrId(addrId);
    if (addrId !== 'new') {
      const found = currentUser?.addresses.find((a) => a.id === addrId);
      if (found) {
        setAddressForm(found);
      }
    }
  };

  const handleAutofillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('11/29');
    setCardCvc('382');
    setCardName(currentUser?.name || 'Alex Morgan');
    showToast('Test Card credentials filled', 'info');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.addressLine1 || !addressForm.city || !addressForm.postalCode) {
      showToast('Please fill in all mandatory shipping address fields.', 'error');
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);

    // Simulate realistic gateway authentication & server roundtrip
    setTimeout(() => {
      try {
        const order = placeOrder({
          items: cart,
          shippingAddress: addressForm,
          paymentMethod,
          shippingCost,
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setIsProcessing(false);
        setCurrentPage('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setIsProcessing(false);
        showToast('Payment processing error. Please try again.', 'error');
      }
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
          <p className="text-xs text-slate-500">Add products to your bag before checking out.</p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Encrypted End-to-End Transaction</span>
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('cart')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 max-w-xl mx-auto mb-10 text-center">
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentStep === 1
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-extrabold">
              1
            </span>
            <span>Shipping</span>
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentStep === 2
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-extrabold">
              2
            </span>
            <span>Delivery</span>
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentStep === 3
                ? 'bg-slate-950 text-white border-slate-950'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-extrabold">
              3
            </span>
            <span>Payment</span>
          </button>
        </div>

        {/* 2-Column Layout: Steps Form + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <h2 className="text-base font-bold text-slate-950">Shipping Destination</h2>
                  </div>
                  <span className="text-xs text-slate-500">Step 1 of 3</span>
                </div>

                {/* Saved Address Selector */}
                {currentUser && currentUser.addresses.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-700">Saved Addresses</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentUser.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr.id)}
                          className={`p-3 rounded-2xl border cursor-pointer text-xs transition ${
                            selectedSavedAddrId === addr.id
                              ? 'border-slate-950 bg-slate-50 shadow-xs ring-1 ring-slate-950'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                            <span>{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-slate-600 truncate">{addr.addressLine1}</p>
                          <p className="text-slate-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address Form Inputs */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Street Address *</label>
                    <input
                      type="text"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Apartment, Suite, Unit (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.addressLine2 || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      placeholder="e.g. Suite 4B"
                      className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">City *</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">State / Region *</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Postal Code *</label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition"
                  >
                    <span>Continue to Delivery Speed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Options */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <h2 className="text-base font-bold text-slate-950">Select Shipping Speed</h2>
                  </div>
                  <span className="text-xs text-slate-500">Step 2 of 3</span>
                </div>

                <div className="space-y-3">
                  <label 
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      shippingMethod === 'standard' ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center">
                        {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Standard Ground (3 - 5 business days)</h4>
                        <p className="text-[11px] text-slate-500">Carbon-neutral fulfillment via UPS</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold">
                      {isFreeStandard ? <span className="text-emerald-600 font-extrabold">FREE</span> : '$9.99'}
                    </span>
                  </label>

                  <label 
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      shippingMethod === 'express' ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center">
                        {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">UPS 2-Day Priority Air</h4>
                        <p className="text-[11px] text-slate-500">Guaranteed 2-day domestic arrival</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">$18.00</span>
                  </label>

                  <label 
                    onClick={() => setShippingMethod('overnight')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      shippingMethod === 'overnight' ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center">
                        {shippingMethod === 'overnight' && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">FedEx Priority Overnight</h4>
                        <p className="text-[11px] text-slate-500">Arrives tomorrow by 10:30 AM</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">$29.00</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <h2 className="text-base font-bold text-slate-950">Payment Method</h2>
                  </div>
                  <span className="text-xs text-slate-500">Step 3 of 3</span>
                </div>

                {/* Gateway Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'stripe', label: 'Stripe Direct', icon: ShieldCheck },
                    { id: 'razorpay', label: 'Razorpay / UPI', icon: QrCode },
                    { id: 'cod', label: 'Cash on Deliv.', icon: Building },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                          paymentMethod === p.id
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Card payment form */}
                {(paymentMethod === 'card' || paymentMethod === 'stripe') && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Card Credentials</span>
                      <button
                        type="button"
                        onClick={handleAutofillTestCard}
                        className="text-[11px] font-bold text-amber-700 bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition"
                      >
                        Fill Test Card (4242...)
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-slate-950"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">CVC Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-slate-950"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-600">Name on Card</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-950"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Razorpay / UPI QR simulation */}
                {paymentMethod === 'razorpay' && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-900 border border-slate-200 shadow-xs">
                      <QrCode className="w-10 h-10" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">Razorpay Unified Payments Gateway</h4>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Supports instant UPI (Google Pay, PhonePe, Paytm), NetBanking, and international cards. Clicking Place Order authorizes securely.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery option */}
                {paymentMethod === 'cod' && (
                  <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Pay upon home delivery</p>
                    <p className="text-[11px] text-amber-700">Please prepare exact cash or card for the courier upon parcel arrival.</p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                  >
                    Back to Delivery
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 py-3.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition active:scale-98"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Verifying & Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize & Place Order (${orderTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Order Review & Pricing Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 sticky top-28">
              <h3 className="text-base font-bold text-slate-950 pb-3 border-b border-slate-100">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              {/* Items overview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.code} - {appliedCoupon.discountPercent}%)</span>
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
                  <span>Estimated Tax (8.25%)</span>
                  <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-950">
                  <span>Order Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Destination preview */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">Deliver To:</p>
                <p>{addressForm.fullName}</p>
                <p>{addressForm.addressLine1}, {addressForm.city}, {addressForm.state} {addressForm.postalCode}</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
