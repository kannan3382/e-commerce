import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Package,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PageRoute } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    currentUser,
    logout,
    setIsAuthModalOpen,
    products,
    navigateToProduct,
    setFilterState,
    setDevGuideOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setFilterState((prev) => ({ ...prev, searchQuery }));
    setCurrentPage('shop');
    setIsSearchFocused(false);
  };

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop All', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      {/* Promotional Top Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">
              Special Offer
            </span>
            <span className="truncate">
              Enjoy <strong>20% OFF</strong> orders over $200 with code <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">SAVE20</code>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setDevGuideOpen(true)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture & Guides</span>
            </button>
            <span className="text-slate-600">|</span>
            <span>Free Global Express over $99</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div 
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="cursor-pointer flex items-center gap-2 group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xl tracking-tighter shadow-md group-hover:bg-slate-800 transition">
                A
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-950 flex items-center gap-1">
                  AURA
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                </span>
                <span className="block text-[10px] tracking-widest text-slate-600 uppercase font-semibold -mt-1">
                  Modern Commerce
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setCurrentPage(link.page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm font-medium transition-colors py-1 border-b-2 ${
                  currentPage === link.page
                    ? 'text-slate-950 border-slate-950 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-slate-950 hover:border-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search Bar with live autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-xs md:max-w-md hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search headphones, titanium, watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 rounded-full border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Search Dropdown Results */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Results for &ldquo;{searchQuery}&rdquo;</span>
                  <button 
                    onClick={handleSearchSubmit}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    View all ({products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length})
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          navigateToProduct(product.id);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-600">{product.category}</span>
                            <span className="text-xs font-semibold text-slate-900">${product.price}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-600">
                    No products matching &ldquo;{searchQuery}&rdquo; found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Admin quick jump, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Admin Switch Button */}
            <button
              onClick={() => {
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                currentPage === 'admin'
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
              title="Admin Portal: manage products, inventory, orders, discounts"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setCurrentPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-950 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-slate-900">
                ${cartSubtotal.toFixed(2)}
              </span>
            </button>

            {/* User Account / Dropdown */}
            <div ref={userMenuRef} className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-medium text-slate-800 hidden sm:inline-block max-w-[80px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-full transition shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-600 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-slate-100 text-slate-700 rounded">
                      Role: {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setIsUserDropdownOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 flex items-center gap-2.5 transition"
                  >
                    <UserIcon className="w-4 h-4 text-slate-600" />
                    <span>My Account & Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('admin');
                      setIsUserDropdownOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-950 flex items-center gap-2.5 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Admin Store Management</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 rounded-full border border-slate-200 text-slate-900 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-white z-50 border-t border-slate-200 overflow-y-auto p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-3 mb-2">
              Navigation
            </p>
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setCurrentPage(link.page);
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-base transition ${
                  currentPage === link.page
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider px-3 mb-2">
              Quick Portals
            </p>
            <button
              onClick={() => {
                setCurrentPage('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Dashboard
              </span>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </button>
            <button
              onClick={() => {
                setDevGuideOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-slate-600" />
              Prisma / PostgreSQL Schema & Tech Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
