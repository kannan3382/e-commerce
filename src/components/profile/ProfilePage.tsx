import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  Truck, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  Trash2, 
  Star,
  ShoppingBag,
  ArrowRight,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Address, Order, OrderStatus } from '../../types';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    products, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateToProduct, 
    logout, 
    setCurrentPage, 
    setIsAuthModalOpen,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setEmailModalOrder,
    trackingOrderId,
    setTrackingOrderId,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'security'>('orders');

  // New address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: currentUser?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: currentUser?.phone || '',
  });

  if (!currentUser) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to view your profile</h2>
          <p className="text-xs text-slate-500">
            Access your order history, live parcel tracking, saved addresses, and wishlist.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Sign In to AURA
          </button>
        </div>
      </div>
    );
  }

  // Filter orders for current user (or show all if demo)
  const userOrders = orders.filter((o) => o.userId === currentUser.id || o.customerEmail === currentUser.email);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Selected order for tracking modal
  const selectedTrackingOrder = orders.find((o) => o.id === trackingOrderId);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.city || !newAddr.postalCode) {
      showToast('Please fill out all mandatory address fields.', 'error');
      return;
    }
    addAddress(newAddr);
    setShowAddressModal(false);
    setNewAddr({
      fullName: currentUser.name,
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: currentUser.phone || '',
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
            <Truck className="w-3.5 h-3.5" />
            In Transit (Shipped)
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            Processing & Packaging
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            Pending Confirmation
          </span>
        );
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-md">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
          {[
            { id: 'orders', label: `Orders & Tracking (${userOrders.length})`, icon: Package },
            { id: 'addresses', label: `Saved Addresses (${currentUser.addresses.length})`, icon: MapPin },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders and Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No orders placed yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your purchase receipts, carrier tracking codes, and warranty slips will appear right here.
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="px-6 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5"
                >
                  {/* Order Card Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-slate-950">
                          #{order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTrackingOrderId(order.id)}
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Parcel</span>
                      </button>

                      <button
                        onClick={() => setEmailModalOrder(order)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                        title="View Official Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            onClick={() => navigateToProduct(item.productId)}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-100 cursor-pointer"
                          />
                          <div>
                            <h4 
                              onClick={() => navigateToProduct(item.productId)}
                              className="font-bold text-slate-900 cursor-pointer hover:underline"
                            >
                              {item.name}
                            </h4>
                            <p className="text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Logistics & Total Strip */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-500">Carrier:</span>
                      <p className="font-semibold text-slate-800">
                        {order.carrier} (Tracking: {order.trackingNumber})
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        Estimated Arrival: {order.estimatedDelivery}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-slate-500">Total Paid:</span>
                      <p className="text-base font-black text-slate-950">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Shipping Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-950">Manage Delivery Addresses</h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-950 text-sm">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-slate-500">{addr.addressLine2}</p>}
                    <p className="text-slate-600">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-slate-500">{addr.country}</p>
                    <p className="text-slate-600 pt-1 font-mono">{addr.phone}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-slate-700 font-semibold hover:text-slate-950"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Default Address
                      </span>
                    )}

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-rose-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any product in our catalog to save it for future consideration.
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="px-6 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      onClick={() => navigateToProduct(p.id)}
                      className="aspect-square w-full object-cover bg-slate-100 cursor-pointer"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-700">{p.brand}</span>
                        <h4 
                          onClick={() => navigateToProduct(p.id)}
                          className="font-bold text-xs text-slate-900 line-clamp-1 cursor-pointer hover:underline"
                        >
                          {p.name}
                        </h4>
                        <span className="font-black text-sm text-slate-950 mt-1 block">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 border border-slate-200 text-slate-500 hover:text-rose-500 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Live Order Tracking Modal */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setTrackingOrderId(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 z-10 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-950">Live Parcel Tracking</h3>
                  <p className="font-mono text-xs text-slate-500">#{selectedTrackingOrder.orderNumber}</p>
                </div>
              </div>
              <button onClick={() => setTrackingOrderId(null)}>
                <Check className="w-5 h-5 text-slate-400 hover:text-slate-950" />
              </button>
            </div>

            {/* Carrier Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500">Carrier:</span>
                <p className="font-bold text-slate-900">{selectedTrackingOrder.carrier}</p>
                <p className="font-mono text-slate-600 text-[11px]">TRK: {selectedTrackingOrder.trackingNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Estimated Delivery:</span>
                <p className="font-bold text-emerald-700">{selectedTrackingOrder.estimatedDelivery}</p>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="space-y-6 pl-2 relative before:absolute before:top-3 before:bottom-3 before:left-5 before:w-0.5 before:bg-slate-200">
              {[
                { label: 'Order Confirmed', time: 'Oct 24, 6:30 PM', completed: true },
                { label: 'Studio Quality Calibration & Inspection', time: 'Oct 24, 8:45 PM', completed: true },
                { 
                  label: `Dispatched with ${selectedTrackingOrder.carrier}`, 
                  time: 'Oct 25, 9:15 AM', 
                  completed: selectedTrackingOrder.status === 'shipped' || selectedTrackingOrder.status === 'delivered' 
                },
                { 
                  label: 'Out for Local Courier Delivery', 
                  time: selectedTrackingOrder.status === 'delivered' ? 'Oct 25, 1:30 PM' : 'Expected Oct 28', 
                  completed: selectedTrackingOrder.status === 'delivered' 
                },
                { 
                  label: 'Delivered to Recipient Front Porch', 
                  time: selectedTrackingOrder.status === 'delivered' ? 'Oct 25, 3:15 PM' : 'Pending', 
                  completed: selectedTrackingOrder.status === 'delivered' 
                },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step.completed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div>
                    <h5 className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTrackingOrderId(null)}
              className="w-full py-3 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Close Live Tracker
            </button>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddressModal(false)} className="fixed inset-0 bg-slate-950/70" />
          <form
            onSubmit={handleCreateAddress}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 border border-slate-200 z-10"
          >
            <h3 className="text-base font-bold text-slate-950">Add Shipping Address</h3>
            
            <div>
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Street Address</label>
              <input
                type="text"
                value={newAddr.addressLine1}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">City</label>
                <input
                  type="text"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Postal Code</label>
                <input
                  type="text"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
