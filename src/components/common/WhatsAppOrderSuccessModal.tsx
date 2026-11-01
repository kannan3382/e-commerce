import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink, 
  X, 
  Truck, 
  Copy, 
  Check, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupees, formatIndianPhoneNumber, getWhatsAppOrderUrl } from '../../utils/currency';

export const WhatsAppOrderSuccessModal: React.FC = () => {
  const { 
    whatsAppNotificationOrder, 
    setWhatsAppNotificationOrder,
    ownerWhatsAppNumber,
    setEmailModalOrder,
    setTrackingOrderId,
    setCurrentPage,
    showToast
  } = useStore();

  const [copied, setCopied] = useState(false);

  if (!whatsAppNotificationOrder) return null;

  const order = whatsAppNotificationOrder;
  const whatsappUrl = getWhatsAppOrderUrl(order, ownerWhatsAppNumber);

  const handleCopySummary = () => {
    const text = `Order #${order.orderNumber} - ${order.customerName} - Total: ${formatRupees(order.total)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Order summary copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenReceipt = () => {
    setEmailModalOrder(order);
    setWhatsAppNotificationOrder(null);
  };

  const handleTrackPackage = () => {
    setTrackingOrderId(order.id);
    setWhatsAppNotificationOrder(null);
    setCurrentPage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setWhatsAppNotificationOrder(null)}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-emerald-600 text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide">WhatsApp Order Dispatched!</h3>
              <p className="text-[11px] text-emerald-100">Automatically sent to Store Owner</p>
            </div>
          </div>

          <button
            onClick={() => setWhatsAppNotificationOrder(null)}
            className="p-1.5 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Success Status Badge */}
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Order Registered & Alerted
                </span>
                <span className="font-mono text-xs font-extrabold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  #{order.orderNumber}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 truncate mt-0.5">
                Sent to owner WhatsApp: <strong>{formatIndianPhoneNumber(ownerWhatsAppNumber)}</strong>
              </p>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Customer:</span>
              <strong className="text-slate-900">{order.customerName}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Items Ordered:</span>
              <span className="text-slate-900 font-semibold">{order.items.length} product(s)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Payment Mode:</span>
              <span className="text-slate-900 font-bold uppercase">{order.paymentMethod} (PAID)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Estimated Delivery:</span>
              <span className="text-emerald-700 font-semibold">{order.estimatedDelivery}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900">Grand Total:</span>
              <span className="font-black text-slate-950 text-base">{formatRupees(order.total)}</span>
            </div>
          </div>

          {/* Direct WhatsApp Call to Action Button */}
          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Open Chat with Store Owner on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[11px] text-slate-400 text-center">
              If WhatsApp did not launch automatically in a new tab, tap the button above.
            </p>
          </div>

          {/* Extra Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleOpenReceipt}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
              <span>View Invoice</span>
            </button>
            <button
              onClick={handleTrackPackage}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
