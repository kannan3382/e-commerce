import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Mail, 
  Printer, 
  Package, 
  Truck, 
  Calendar, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EmailConfirmationModal: React.FC = () => {
  const { 
    emailModalOrder, 
    setEmailModalOrder, 
    setTrackingOrderId, 
    setCurrentPage, 
    showToast 
  } = useStore();

  if (!emailModalOrder) return null;

  const order = emailModalOrder;

  const handleTrackOrder = () => {
    setTrackingOrderId(order.id);
    setEmailModalOrder(null);
    setCurrentPage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setEmailModalOrder(null)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top toolbar */}
        <div className="sticky top-0 bg-slate-900 text-white p-4 px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold tracking-wide">
              Automated Email Confirmation & Tax Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmailModalOrder(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Body Simulation */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <span className="font-black text-xl tracking-tight text-slate-950">AURA</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Official Electronic Sales Invoice</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Payment Confirmed
              </span>
              <p className="font-mono text-xs font-bold text-slate-900 mt-1">#{order.orderNumber}</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-950">
              Thank you for your order, {order.customerName.split(' ')[0]}!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We&apos;ve received your order and our hardware fulfillment team in California has commenced preparation. Your receipt and courier dispatch updates will be sent to <strong>{order.customerEmail}</strong>.
            </p>
          </div>

          {/* Logistics Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                Shipping Details
              </span>
              <p className="font-medium text-slate-900">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.addressLine1}</p>
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Carrier & Delivery
              </span>
              <p className="font-medium text-slate-900">{order.carrier}</p>
              <p className="text-slate-600">Tracking: <code className="font-mono font-bold text-slate-900">{order.trackingNumber}</code></p>
              <p className="text-emerald-700 font-semibold">Est. Delivery: {order.estimatedDelivery}</p>
            </div>
          </div>

          {/* Items Purchased Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Items Ordered</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Savings ({order.appliedCoupon})</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping ({order.carrier})</span>
              <span className="font-bold text-slate-900">
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax (8.25%)</span>
              <span className="font-bold text-slate-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-950">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleTrackOrder}
              className="flex-1 py-3 px-5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Package className="w-4 h-4" />
              <span>Track Package in Real-Time</span>
            </button>
            <button
              onClick={() => setEmailModalOrder(null)}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition text-center"
            >
              Close Invoice
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
