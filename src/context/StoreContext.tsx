import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  User, 
  Review, 
  Coupon, 
  Address, 
  FilterState, 
  PageRoute,
  OrderStatus 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_USER, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS 
} from '../data/mockData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Navigation
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  selectedProductId: string | null;
  navigateToProduct: (productId: string) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'card' | 'stripe' | 'razorpay' | 'upi' | 'cod';
    shippingCost: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getReviewsForProduct: (productId: string) => Review[];

  // User / Auth
  currentUser: User | null;
  login: (email: string, role?: 'customer' | 'admin', name?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Modals & Overlays
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  emailModalOrder: Order | null;
  setEmailModalOrder: (order: Order | null) => void;
  devGuideOpen: boolean;
  setDevGuideOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  brand: 'all',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);

  // Persistent Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('aura_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Persistent Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistent Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('aura_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Persistent User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : (INITIAL_USER.wishlist || []);
    } catch {
      return [];
    }
  });

  // Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('aura_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Modals & UI
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [emailModalOrder, setEmailModalOrder] = useState<Order | null>(null);
  const [devGuideOpen, setDevGuideOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aura_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aura_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('aura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product Navigation
  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
  };

  // Products CRUD
  const addProduct = (newProduct: Omit<Product, 'id' | 'slug' | 'createdAt'>) => {
    const id = 'prod-' + Date.now();
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product: Product = {
      ...newProduct,
      id,
      slug,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" created successfully!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const p = products.find((prod) => prod.id === id);
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    showToast(`Product "${p?.name || id}" removed`, 'info');
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
    showToast(`Category "${category.name}" added`, 'success');
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedColor: color, selectedSize: size }];
      }
    });

    showToast(`Added ${quantity} × ${product.name} to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }

    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `This code requires a minimum spend of $${found.minSpend}. (Your subtotal is $${cartSubtotal.toFixed(2)})`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied: ${found.discountPercent}% OFF!`, 'success');
    return { success: true, message: `Applied ${found.discountPercent}% discount.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast(`Coupon ${coupon.code} created!`, 'success');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from wishlist' : 'Added to your wishlist!', exists ? 'info' : 'success');
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (orderPayload: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'card' | 'stripe' | 'razorpay' | 'upi' | 'cod';
    shippingCost: number;
  }): Order => {
    // 1. Verify stock & calculate server totals
    const subtotal = orderPayload.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    }

    const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
    const total = Number((subtotal - discount + orderPayload.shippingCost + tax).toFixed(2));

    const orderNumber = `AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: currentUser?.id || 'guest-' + Date.now(),
      customerName: orderPayload.shippingAddress.fullName || currentUser?.name || 'Valued Customer',
      customerEmail: currentUser?.email || 'customer@example.com',
      items: orderPayload.items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        selectedColor: i.selectedColor,
      })),
      subtotal,
      discount,
      shipping: orderPayload.shippingCost,
      tax,
      total,
      appliedCoupon: appliedCoupon?.code,
      shippingAddress: orderPayload.shippingAddress,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: 'paid',
      paymentId: `pi_${Math.random().toString(36).substring(2, 12)}`,
      status: 'pending',
      trackingNumber: `TRK${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      carrier: orderPayload.shippingCost > 15 ? 'FedEx Priority Overnight' : 'UPS Ground Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Reduce inventory in products list
    setProducts((prev) =>
      prev.map((product) => {
        const orderedItem = orderPayload.items.find((i) => i.product.id === product.id);
        if (orderedItem) {
          const newStock = Math.max(0, product.stock - orderedItem.quantity);
          return { ...product, stock: newStock };
        }
        return product;
      })
    );

    // 3. Save order
    setOrders((prev) => [newOrder, ...prev]);

    // 4. Empty cart & coupon
    clearCart();
    setAppliedCoupon(null);

    // 5. Open transactional confirmation receipt
    setEmailModalOrder(newOrder);

    showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
    showToast(`Order status updated to "${status.toUpperCase()}"`, 'info');
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avgRating = Number(
      (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === reviewData.productId
          ? { ...p, rating: avgRating, reviewCount: prodReviews.length }
          : p
      )
    );

    showToast('Your verified review was submitted. Thank you!', 'success');
  };

  const getReviewsForProduct = (productId: string) =>
    reviews.filter((r) => r.productId === productId);

  // User actions
  const login = (email: string, role: 'customer' | 'admin' = 'customer', name?: string) => {
    const user: User = {
      id: role === 'admin' ? 'usr-admin' : 'usr-' + Date.now(),
      name: name || (role === 'admin' ? 'Store Administrator' : email.split('@')[0]),
      email,
      role,
      addresses: currentUser?.addresses || INITIAL_USER.addresses,
      wishlist: currentUser?.wishlist || [],
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}! Signed in as ${role}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been signed out', 'info');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });
    showToast('Profile updated', 'success');
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addr,
      id: 'addr-' + Date.now(),
    };
    const updated = [...currentUser.addresses, newAddr];
    setCurrentUser({ ...currentUser, addresses: updated });
    showToast('New shipping address saved', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.filter((a) => a.id !== id);
    setCurrentUser({ ...currentUser, addresses: updated });
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setCurrentUser({ ...currentUser, addresses: updated });
    showToast('Default address updated', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        navigateToProduct,
        filterState,
        setFilterState,
        resetFilters,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,

        categories,
        addCategory,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponStatus,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,

        reviews,
        addReview,
        getReviewsForProduct,

        currentUser,
        login,
        logout,
        updateUser,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,

        quickViewProduct,
        setQuickViewProduct,
        trackingOrderId,
        setTrackingOrderId,
        emailModalOrder,
        setEmailModalOrder,
        devGuideOpen,
        setDevGuideOpen,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
