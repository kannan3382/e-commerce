export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  images: string[];
  specs: Record<string, string>;
  tags: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: string;
  label: string;
  description: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  appliedCoupon?: string;
  shippingAddress: Address;
  paymentMethod: 'card' | 'stripe' | 'razorpay' | 'upi' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentId?: string;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  iconName: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export type PageRoute = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'categories' 
  | 'cart' 
  | 'checkout' 
  | 'profile' 
  | 'wishlist'
  | 'about' 
  | 'contact' 
  | 'admin';
