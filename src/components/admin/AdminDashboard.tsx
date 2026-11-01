import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  SlidersHorizontal, 
  Tag, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Settings,
  MessageSquare,
  Send,
  Save,
  RotateCcw,
  Building,
  PhoneCall,
  Mail,
  Receipt,
  Check,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, Coupon, StoreSettings } from '../../types';
import { 
  formatRupees, 
  getWhatsAppOrderUrl, 
  getWhatsAppTestUrl, 
  formatIndianPhoneNumber, 
  normalizeWhatsAppNumber 
} from '../../utils/currency';
import { INITIAL_STORE_SETTINGS } from '../../data/mockData';


export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    coupons, 
    addCoupon, 
    toggleCouponStatus, 
    categories,
    setCurrentPage, 
    navigateToProduct,
    setEmailModalOrder,
    showToast,
    ownerWhatsAppNumber,
    setOwnerWhatsAppNumber,
    settings,
    updateSettings,
    resetSettingsToDefault
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'discounts' | 'customers' | 'settings'>('overview');
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);


  // Search & filter for products in admin
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // New Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'AURA Labs',
    category: 'Audio & Acoustics',
    price: 19999,
    originalPrice: 24999,
    stock: 20,
    shortDescription: '',
    description: '',
    images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
  });

  // New Coupon Modal state
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discountPercent: 15,
    minSpend: 2500,
    description: 'Holiday promotional discount',
    expiresAt: '2026-12-31',
  });

  // Orders status filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Stats Calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Filtered Products in Admin
  const adminFilteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders in Admin
  const adminFilteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Submit product create/edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Product title is required.', 'error');
      return;
    }

    const enteredPrice = Number(productForm.price);
    if (isNaN(enteredPrice) || enteredPrice < 100) {
      showToast('Product price must be at least ₹100 as per store catalog policy.', 'error');
      return;
    }

    const imagesArray = productForm.images
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);


    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        isFeatured: productForm.isFeatured,
        isBestSeller: productForm.isBestSeller,
        isNewArrival: productForm.isNewArrival,
      });
      setEditingProductId(null);
    } else {
      addProduct({
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        shortDescription: productForm.shortDescription || productForm.name,
        description: productForm.description || productForm.shortDescription || productForm.name,
        rating: 5.0,
        reviewCount: 1,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        specs: {
          'Origin': 'Engineered in California',
          'Warranty': '2-Year Standard Limited',
          'Condition': 'Factory Sealed New',
        },
        tags: ['aura', productForm.category.toLowerCase()],
        isFeatured: productForm.isFeatured,
        isBestSeller: productForm.isBestSeller,
        isNewArrival: productForm.isNewArrival,
      });
    }

    setShowAddProductModal(false);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      shortDescription: p.shortDescription,
      description: p.description,
      images: p.images.join(', '),
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
    });
    setShowAddProductModal(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) {
      showToast('Coupon code is required.', 'error');
      return;
    }

    addCoupon({
      code: newCouponForm.code.trim().toUpperCase(),
      discountPercent: Number(newCouponForm.discountPercent),
      minSpend: Number(newCouponForm.minSpend),
      description: newCouponForm.description,
      expiresAt: newCouponForm.expiresAt,
      isActive: true,
    });

    setShowAddCouponModal(false);
    setNewCouponForm({
      code: '',
      discountPercent: 15,
      minSpend: 100,
      description: '',
      expiresAt: '2026-12-31',
    });
  };

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Navigation Top Header */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                AURA Store Command Center
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Live management of catalog, customer orders, stock inventory, discount vouchers, and sales telemetry.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Owner WhatsApp Order Alert Bar */}
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📲</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950">
                  Store Owner WhatsApp Order Alerts
                </h4>
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Live Active
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-emerald-300">
                  {formatIndianPhoneNumber(ownerWhatsAppNumber)}
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                New customer orders generate instant WhatsApp message summaries with order ID, customer phone, address, and line items.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs">
              <label className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Owner Phone:</label>
              <input
                type="text"
                value={ownerWhatsAppNumber}
                onChange={(e) => setOwnerWhatsAppNumber(e.target.value)}
                placeholder="e.g. 9360723382"
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 w-36"
              />
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Saved</span>
            </div>

            <button
              onClick={() => window.open(getWhatsAppTestUrl(ownerWhatsAppNumber), '_blank')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              title="Send a live test message to WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Test WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>


        {/* Core KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <span className="text-xl font-black">₹</span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Revenue</span>
              <h3 className="text-2xl font-black text-slate-950">{formatRupees(totalRevenue)}</h3>
              <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2% this month
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Orders Processed</span>
              <h3 className="text-2xl font-black text-slate-950">{orders.length}</h3>
              <span className="text-[10px] text-slate-600 font-semibold">
                Avg order: {formatRupees(averageOrderValue)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Active Catalog</span>
              <h3 className="text-2xl font-black text-slate-950">{products.length} Items</h3>
              <span className="text-[10px] text-slate-600 font-semibold">{categories.length} Categories</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Low Stock Warning</span>
              <h3 className="text-2xl font-black text-rose-600">{lowStockProducts.length} Items</h3>
              <span className="text-[10px] text-slate-600 font-semibold">Under 10 units left</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-300 gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'products', label: `Inventory & Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'discounts', label: `Coupons & Discounts (${coupons.length})`, icon: Tag },
            { id: 'customers', label: 'Customers Roster', icon: Users },
            { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
          ].map((tab) => {

            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-slate-950 text-slate-950 font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-slate-950'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Recent Orders Table */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-950">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-slate-900">#{order.orderNumber}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-[11px] text-slate-500">{order.customerEmail}</p>
                        </td>
                        <td className="p-3 font-black text-slate-950">{formatRupees(order.total)}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                            order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          <a
                            href={getWhatsAppOrderUrl(order, ownerWhatsAppNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg inline-flex items-center"
                            title="Send Order Details to Owner via WhatsApp"
                          >
                            <span>📲</span>
                          </a>
                          <button
                            onClick={() => setEmailModalOrder(order)}
                            className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg inline-flex items-center"
                            title="View Receipt"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions & Low Stock alerts */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-950">Quick Operations</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        name: '',
                        brand: 'AURA Labs',
                        category: 'Audio & Acoustics',
                        price: 19999,
                        originalPrice: 24999,
                        stock: 25,
                        shortDescription: '',
                        description: '',
                        images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                        isFeatured: true,
                        isBestSeller: false,
                        isNewArrival: true,
                      });
                      setShowAddProductModal(true);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product to Store</span>
                  </button>

                  <button
                    onClick={() => setShowAddCouponModal(true)}
                    className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>Create Discount Coupon</span>
                  </button>
                </div>
              </div>

              {/* Low stock list */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Low Inventory Items
                  </h4>
                  <span className="text-xs font-bold text-slate-500">{lowStockProducts.length}</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="truncate flex-1 mr-2">
                        <p className="font-bold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{formatRupees(p.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-black text-rose-600 text-xs">{p.stock} left</span>
                        <button
                          onClick={() => updateProduct(p.id, { stock: p.stock + 15 })}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[10px]"
                          title="Restock +15 units"
                        >
                          +15
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            
            {/* Header + Search + Add button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product inventory..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-950"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    name: '',
                    brand: 'AURA Labs',
                    category: 'Audio & Acoustics',
                    price: 199,
                    originalPrice: 249,
                    stock: 20,
                    shortDescription: '',
                    description: '',
                    images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                    isFeatured: true,
                    isBestSeller: false,
                    isNewArrival: true,
                  });
                  setShowAddProductModal(true);
                }}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminFilteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 max-w-xs truncate">{p.name}</h4>
                            <span className="text-[10px] text-amber-700 font-semibold">{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{p.category}</td>
                      <td className="p-3 font-black text-slate-950">{formatRupees(p.price)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-900'}`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => updateProduct(p.id, { stock: p.stock + 5 })}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-semibold"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-slate-800 font-semibold">★ {p.rating} ({p.reviewCount})</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => navigateToProduct(p.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg"
                          title="View on store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-950">Customer Order Queue</h2>
                <p className="text-xs text-slate-500">Manage order fulfillment, delivery statuses, and WhatsApp notifications to the owner.</p>
              </div>
              
              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer & Address</th>
                    <th className="p-3">Items Count</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status Management</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminFilteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        #{order.orderNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[11px] text-slate-500">{order.customerEmail}</p>
                        <p className="text-[10px] text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} items
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-black text-slate-950">{formatRupees(order.total)}</span>
                        <span className="block text-[10px] text-emerald-700 font-bold uppercase">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            order.status === 'shipped' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                            order.status === 'processing' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            'bg-slate-50 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                        <a
                          href={getWhatsAppOrderUrl(order, ownerWhatsAppNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                          title="Send Order Details to Owner via WhatsApp"
                        >
                          <span>📲 WhatsApp</span>
                        </a>
                        <button
                          onClick={() => setEmailModalOrder(order)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: DISCOUNTS & COUPONS */}
        {activeTab === 'discounts' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-950">Promotional Vouchers & Codes</h2>
                <p className="text-xs text-slate-500">Create discount coupons for customers and seasonal campaigns.</p>
              </div>
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className={`p-5 rounded-2xl border transition ${
                    c.isActive ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm tracking-widest text-slate-950 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      {c.code}
                    </span>
                    <button
                      onClick={() => toggleCouponStatus(c.code)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <h4 className="text-xl font-black text-slate-950">{c.discountPercent}% OFF</h4>
                  <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Min spend: {formatRupees(c.minSpend)} • Expires: {c.expiresAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS ROSTER */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-950">Registered Customer Database</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Alex Morgan</td>
                    <td className="p-3 text-slate-600">alex@example.com</td>
                    <td className="p-3 font-bold">{orders.length} orders</td>
                    <td className="p-3 font-black text-slate-950">{formatRupees(totalRevenue)}</td>
                    <td className="p-3"><span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Active VIP</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Elena Rostova</td>
                    <td className="p-3 text-slate-600">elena.sound@studio.org</td>
                    <td className="p-3 font-bold">3 orders</td>
                    <td className="p-3 font-black text-slate-950">{formatRupees(84000)}</td>
                    <td className="p-3"><span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">Member</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: STORE & WHATSAPP SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-slate-100 rounded-xl text-slate-900">
                    <Settings className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-black text-slate-950">Store & WhatsApp Settings</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Active Production
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  Manage store contact details, instant WhatsApp order notifications to owner phone <strong>9360723382</strong>, minimum product and checkout rules (min ₹100), shipping policies, and GST tax percentages.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    resetSettingsToDefault();
                    setSettingsForm(INITIAL_STORE_SETTINGS);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings(settingsForm)}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: WhatsApp and Rules */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. WhatsApp Configuration Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-950">WhatsApp Order Alerts Gateway</h4>
                        <p className="text-[11px] text-slate-500">Live order notifications routed to store owner</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {formatIndianPhoneNumber(settingsForm.ownerWhatsApp)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Store Owner WhatsApp Number *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                            +91
                          </span>
                          <input
                            type="text"
                            value={settingsForm.ownerWhatsApp}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, ownerWhatsApp: e.target.value })
                            }
                            placeholder="9360723382"
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open(getWhatsAppTestUrl(settingsForm.ownerWhatsApp), '_blank')}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Test Ping</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Indian 10-digit mobile numbers are automatically formatted with country code (919360723382) for WhatsApp API dispatch.
                      </p>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <input
                          type="checkbox"
                          checked={settingsForm.enableWhatsAppAlerts}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, enableWhatsAppAlerts: e.target.checked })
                          }
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Auto-Generate Owner WhatsApp Alert on Order Placement
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Presents an instant 1-click WhatsApp message prompt right after customer checkout.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* WhatsApp Message Preview */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                        Live Message Format Preview
                      </span>
                      <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl text-[11px] font-mono leading-relaxed space-y-1 shadow-inner border border-emerald-900">
                        <p className="font-bold text-emerald-300">🛍️ NEW ORDER RECEIVED — AURA E-COMMERCE 🛍️</p>
                        <p className="text-emerald-400/80">━━━━━━━━━━━━━━━━━━━━━━</p>
                        <p>📦 Order ID: #AUR-2026-9481</p>
                        <p>👤 Customer: Alex Morgan (+91 98765 43210)</p>
                        <p>📍 Address: 42 Palm Avenue, Indiranagar, Bengaluru - 560038</p>
                        <p className="pt-1 font-semibold text-emerald-200">🛒 Ordered Items:</p>
                        <p>1. AURA Microfiber Cleaning Cloth (Qty: 2) — ₹200</p>
                        <p>2. AURA Magnetic Silicone Cable Organizers (Qty: 1) — ₹149</p>
                        <p className="pt-1 font-bold text-emerald-300">💰 Grand Total: ₹349 (UPI / PAID)</p>
                        <p className="text-emerald-400/80">━━━━━━━━━━━━━━━━━━━━━━</p>
                        <p className="text-[10px] text-emerald-400 italic">Dispatched to Owner Phone: {settingsForm.ownerWhatsApp || '9360723382'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Catalog & Pricing Rules Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-950">Catalog Pricing & Minimum Rules</h4>
                      <p className="text-[11px] text-slate-500">Price floor policies, shipping tiers and tax setup</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Minimum Product Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="100"
                        value={settingsForm.minProductPrice}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, minProductPrice: Math.max(100, Number(e.target.value)) })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Catalog floor: Cannot sell below ₹100</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Minimum Order Value (₹) *
                      </label>
                      <input
                        type="number"
                        min="100"
                        value={settingsForm.minOrderValue}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, minOrderValue: Math.max(100, Number(e.target.value)) })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Cart checkout minimum: ₹100</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Free Shipping Threshold (₹)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.freeShippingThreshold}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Cart value for free delivery</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Standard Ground Shipping (₹)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.standardShippingFee}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Applied on orders under free limit</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Applicable GST Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.gstRatePercent}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, gstRatePercent: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Standard rate: 18% for electronics</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Low Stock Alert Threshold
                      </label>
                      <input
                        type="number"
                        value={settingsForm.lowStockThreshold}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, lowStockThreshold: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Triggers low stock warnings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Business Profile & Summary */}
              <div className="lg:col-span-5 space-y-8">
                {/* 3. Business Profile Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-950">Store Profile & Helpline</h4>
                      <p className="text-[11px] text-slate-500">Legal branding, tax and support info</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Store Legal Name</label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, storeName: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Support Email Address</label>
                      <input
                        type="email"
                        value={settingsForm.supportEmail}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, supportEmail: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Customer Support Helpline</label>
                      <input
                        type="text"
                        value={settingsForm.supportPhone}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, supportPhone: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">GSTIN Tax Registration</label>
                      <input
                        type="text"
                        value={settingsForm.gstNumber}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, gstNumber: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">Registered Store Address</label>
                      <textarea
                        rows={3}
                        value={settingsForm.storeAddress}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, storeAddress: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <input
                          type="checkbox"
                          checked={settingsForm.enableCod}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, enableCod: e.target.checked })
                          }
                          className="w-4 h-4 accent-slate-950 rounded cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Allow Cash on Delivery (COD) Checkout
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Available alongside UPI and Cards in checkout.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Confirmation Button */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-md space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Save Changes to Store</h4>
                      <p className="text-[11px] text-slate-400">Settings synchronize across your browser sessions</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSettings(settingsForm)}
                    className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply & Save All Store Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>


      {/* Add / Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddProductModal(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />
          <form
            onSubmit={handleSaveProduct}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 border border-slate-200 z-10 animate-in zoom-in-95"
          >
            <h3 className="text-lg font-bold text-slate-950">
              {editingProductId ? 'Edit Product Hardware' : 'Add New Hardware to Catalog'}
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700">Product Name *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="e.g. AURA Precision Studio DAC"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Brand</label>
                <input
                  type="text"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Price (₹) * (Min ₹100)</label>
                <input
                  type="number"
                  min="100"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="Min ₹100"
                  required
                />
              </div>


              <div>
                <label className="text-xs font-bold text-slate-700">Compare-at Price (₹)</label>
                <input
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Stock Count *</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Short Summary</label>
              <input
                type="text"
                value={productForm.shortDescription}
                onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                placeholder="Brief one-line summary for product card"
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Detailed Description</label>
              <textarea
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Full technical overview and engineering notes"
                className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Image URLs (comma separated)</label>
              <input
                type="text"
                value={productForm.images}
                onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[11px]"
              />
            </div>

            <div className="flex gap-4 pt-1 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="accent-slate-950"
                />
                <span className="font-semibold">Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isBestSeller}
                  onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  className="accent-slate-950"
                />
                <span className="font-semibold">Best Seller Badge</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddCouponModal(false)} className="fixed inset-0 bg-slate-950/70" />
          <form
            onSubmit={handleSaveCoupon}
            className="relative bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 z-10"
          >
            <h3 className="text-base font-bold text-slate-950">Create Promo Voucher</h3>

            <div>
              <label className="text-xs font-bold text-slate-700">Code (e.g. VIP25)</label>
              <input
                type="text"
                value={newCouponForm.code}
                onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                placeholder="VIP25"
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Discount %</label>
                <input
                  type="number"
                  value={newCouponForm.discountPercent}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, discountPercent: Number(e.target.value) })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Min Spend (₹)</label>
                <input
                  type="number"
                  value={newCouponForm.minSpend}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, minSpend: Number(e.target.value) })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Description</label>
              <input
                type="text"
                value={newCouponForm.description}
                onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                placeholder="25% off Autumn release"
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCouponModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
