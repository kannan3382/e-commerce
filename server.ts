import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory backend data store (seeded with initial catalogue in INR)
let productsStore = [
  {
    id: 'prod-1',
    name: 'AURA Pulse Pro Wireless Studio Headphones',
    slug: 'aura-pulse-pro-wireless-headphones',
    description: 'Crafted with custom 40mm bio-cellulose drivers, active spatial acoustic cancellation, and 45 hours of playback. Encased in bead-blasted aluminum and supple lambskin ear cushions.',
    shortDescription: 'Audiophile active noise cancelling with 40mm bio-cellulose drivers & 45h battery.',
    price: 24999,
    originalPrice: 29999,
    category: 'Audio & Acoustics',
    brand: 'AURA Labs',
    rating: 4.9,
    reviewCount: 128,
    stock: 24,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Driver Size': '40mm Bio-Cellulose',
      'Frequency Response': '10Hz – 40,000Hz',
      'Battery Life': '45 hours (ANC ON)',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm lossless',
    },
    tags: ['wireless', 'anc', 'audiophile', 'studio', 'bluetooth'],
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Chronos Sapphire Titanium Smartwatch',
    slug: 'chronos-sapphire-titanium-smartwatch',
    description: 'Aerospace-grade Grade 5 titanium chassis paired with an ultra-bright sapphire crystal AMOLED display. Continuous HRV, SpO2, and sleep monitoring with dual-frequency GPS.',
    shortDescription: 'Grade 5 titanium chassis, sapphire crystal display, and 14-day endurance battery.',
    price: 39999,
    originalPrice: 44999,
    category: 'Wearables & Watches',
    brand: 'Chronos',
    rating: 4.8,
    reviewCount: 84,
    stock: 18,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Case Material': 'Grade 5 Titanium',
      'Glass': 'Sapphire Crystal (Mohs 9)',
      'Battery': 'Up to 14 days',
    },
    tags: ['smartwatch', 'titanium', 'fitness', 'sapphire'],
    createdAt: '2026-09-12T14:20:00Z',
  },
  {
    id: 'prod-3',
    name: 'Keychron Lumina Walnut Mechanical Keyboard',
    slug: 'keychron-lumina-walnut-keyboard',
    description: 'CNC machined American black walnut body with hot-swappable tactile Gateron Oil King switches. PBT dye-sublimated retro keycaps with gasket mounted brass plate.',
    shortDescription: 'CNC American black walnut with hot-swap tactile switches and gasket mounting.',
    price: 14999,
    originalPrice: 17999,
    category: 'Workspace & Desk',
    brand: 'Lumina Studio',
    rating: 4.9,
    reviewCount: 95,
    stock: 31,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Layout': '75% Compact (84 keys)',
      'Body': 'Solid American Black Walnut',
    },
    tags: ['keyboard', 'mechanical', 'walnut'],
    createdAt: '2026-10-02T08:15:00Z',
  },
  {
    id: 'prod-4',
    name: 'Leica-Inspired Classic 35mm Rangefinder Camera',
    slug: 'classic-35mm-rangefinder-camera',
    description: 'Precision manual focusing with a crisp optical coincidence rangefinder. Full-frame 42MP BSI sensor paired with an integrated 35mm f/2.0 aspherical prime lens.',
    shortDescription: 'Full-frame 42MP optical rangefinder with dedicated 35mm f/2.0 aspheric lens.',
    price: 149999,
    originalPrice: 169999,
    category: 'Optics & Photography',
    brand: 'Vanguard',
    rating: 5.0,
    reviewCount: 42,
    stock: 7,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Sensor': '42.4 Megapixel Full-Frame BSI',
      'Lens': 'Fixed 35mm f/2.0 Aspherical',
    },
    tags: ['camera', 'rangefinder', 'photography'],
    createdAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'AURA Arc Wireless Ergonomic Mouse',
    slug: 'aura-arc-wireless-ergonomic-mouse',
    description: 'Engineered with a 57-degree natural handshake posture angle to eradicate forearm tension. Features a frictionless magnetic MagSpeed scroll wheel.',
    shortDescription: '57° ergonomic wrist relief with machined steel MagSpeed infinite scroll.',
    price: 6999,
    originalPrice: 8499,
    category: 'Workspace & Desk',
    brand: 'AURA Labs',
    rating: 4.7,
    reviewCount: 68,
    stock: 45,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Sensor': 'Darkfield High Precision (4000 DPI)',
      'Battery Life': 'Up to 70 days',
    },
    tags: ['mouse', 'ergonomic', 'office'],
    createdAt: '2026-08-20T09:00:00Z',
  },
  {
    id: 'prod-min-100',
    name: 'AURA Microfiber Studio Optics & Display Cleaning Cloth',
    slug: 'aura-microfiber-studio-cleaning-cloth',
    description: 'Ultra-dense 400 GSM split microfiber cloth designed specifically for cleaning camera optics, smartphone screens, studio headphones, and laptop monitors without scratching.',
    shortDescription: 'High-density 400 GSM optical microfiber cloth for screens, lenses & headphones.',
    price: 100,
    originalPrice: 199,
    category: 'Workspace & Desk',
    brand: 'AURA Labs',
    rating: 4.9,
    reviewCount: 312,
    stock: 150,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Material': '400 GSM Split Microfiber',
      'Washable': 'Yes, reusable',
    },
    tags: ['cloth', 'microfiber', 'cleaning', 'accessories', 'budget'],
    createdAt: '2026-10-25T09:00:00Z',
  },
  {
    id: 'prod-min-149',
    name: 'AURA Magnetic Silicone Cable Organizers (Pack of 3)',
    slug: 'aura-magnetic-silicone-cable-organizers',
    description: 'Soft-touch silicone cable management ties with embedded neodymium magnets.',
    shortDescription: 'Pack of 3 neodymium magnetic silicone clips for cable management.',
    price: 149,
    originalPrice: 249,
    category: 'Workspace & Desk',
    brand: 'AURA Labs',
    rating: 4.8,
    reviewCount: 142,
    stock: 95,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Pack Quantity': '3 units',
    },
    tags: ['cables', 'organizer', 'workspace'],
    createdAt: '2026-10-22T10:00:00Z',
  },
  {
    id: 'prod-min-199',
    name: 'AURA Acoustic Memory Foam Ear Tips (3 Pairs - S/M/L)',
    slug: 'aura-acoustic-memory-foam-ear-tips',
    description: 'Heat-activated high-density memory foam ear tips providing up to +6dB of passive noise isolation.',
    shortDescription: 'Heat-reactive memory foam ear tips with +6dB passive noise isolation.',
    price: 199,
    originalPrice: 399,
    category: 'Audio & Acoustics',
    brand: 'AURA Labs',
    rating: 4.9,
    reviewCount: 218,
    stock: 80,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    ],
    specs: {
      'Sizes Included': 'Small, Medium, Large',
    },
    tags: ['earbuds', 'eartips', 'foam', 'audio'],
    createdAt: '2026-10-20T12:00:00Z',
  },
];


let ordersStore: any[] = [
  {
    id: 'ord-9021',
    orderNumber: 'AUR-2026-9021',
    userId: 'usr-demo-1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.in',
    items: [
      {
        productId: 'prod-1',
        name: 'AURA Pulse Pro Wireless Studio Headphones',
        price: 24999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      },
    ],
    subtotal: 24999,
    discount: 2499.9,
    shipping: 0,
    tax: 4049.84,
    total: 26548.94,
    appliedCoupon: 'WELCOME10',
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Sharma',
      addressLine1: '12th Main Road, HAL 2nd Stage',
      addressLine2: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      phone: '+91 98765 43210',
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'shipped',
    trackingNumber: 'BLUEDART-882910394',
    carrier: 'Blue Dart Priority Air',
    estimatedDelivery: 'Oct 28, 2026',
    createdAt: '2026-10-24T18:30:00Z',
    updatedAt: '2026-10-25T11:00:00Z',
  },
];

const couponsStore = [
  { code: 'FESTIVE20', discountPercent: 20, minSpend: 15000, isActive: true },
  { code: 'WELCOME10', discountPercent: 10, minSpend: 2500, isActive: true },
  { code: 'DIWALI15', discountPercent: 15, minSpend: 7500, isActive: true },
];

// ---------------- BACKEND REST API ENDPOINTS ----------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    server: 'Express.js & Java Spring Boot Interop Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  const { category, brand, search } = req.query;
  let result = [...productsStore];

  if (category && category !== 'all') {
    result = result.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (brand && brand !== 'all') {
    result = result.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = productsStore.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: 'prod-' + Date.now(),
    slug: (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    createdAt: new Date().toISOString(),
  };
  productsStore.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const idx = productsStore.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  productsStore[idx] = { ...productsStore[idx], ...req.body };
  res.json(productsStore[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  productsStore = productsStore.filter((p) => p.id !== req.params.id);
  res.json({ success: true, message: 'Product removed' });
});

// 3. Orders & Checkout API
app.get('/api/orders', (req, res) => {
  res.json(ordersStore);
});

app.post('/api/checkout', (req, res) => {
  const { items, shippingAddress, paymentMethod, shippingCost, couponCode } = req.body;

  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  // 1. Verify pricing & stock on backend
  let subtotal = 0;
  for (const item of items) {
    const found = productsStore.find((p) => p.id === item.productId || p.id === item.product?.id);
    if (!found) {
      return res.status(400).json({ error: `Product not found: ${item.name}` });
    }
    if (found.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient inventory for ${found.name}. Remaining: ${found.stock}` });
    }
    subtotal += found.price * item.quantity;
  }

  // 2. Validate Coupon
  let discount = 0;
  let appliedCoupon: string | undefined = undefined;
  if (couponCode) {
    const c = couponsStore.find((coup) => coup.code.toUpperCase() === couponCode.toUpperCase() && coup.isActive);
    if (c && subtotal >= c.minSpend) {
      discount = (subtotal * c.discountPercent) / 100;
      appliedCoupon = c.code;
    }
  }

  // 3. Deduct stock atomically
  for (const item of items) {
    const prodId = item.productId || item.product?.id;
    const prod = productsStore.find((p) => p.id === prodId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  const tax = Math.round((subtotal - discount) * 0.18);
  const shipping = Number(shippingCost || 0);
  const total = Math.round(subtotal - discount + shipping + tax);

  const newOrder = {
    id: 'ord-' + Date.now(),
    orderNumber: `AUR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: req.body.userId || 'usr-guest',
    customerName: shippingAddress.fullName,
    customerEmail: req.body.email || 'customer@example.com',
    items: items.map((i: any) => ({
      productId: i.productId || i.product?.id,
      name: i.name || i.product?.name,
      price: i.price || i.product?.price,
      quantity: i.quantity,
      image: i.image || i.product?.images?.[0],
    })),
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedCoupon,
    shippingAddress,
    paymentMethod: paymentMethod || 'upi',
    paymentStatus: 'paid',
    paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
    status: 'pending',
    trackingNumber: `BD${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    carrier: shipping > 200 ? 'Blue Dart Priority Air' : 'Delhivery Ground Express',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ordersStore.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ordersStore.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

// 4. Coupons API
app.get('/api/coupons', (req, res) => {
  res.json(couponsStore);
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  const c = couponsStore.find((coupon) => coupon.code.toUpperCase() === String(code).trim().toUpperCase() && coupon.isActive);
  if (!c) return res.status(404).json({ valid: false, message: 'Invalid or expired coupon' });
  if (subtotal < c.minSpend) {
    return res.status(400).json({ valid: false, message: `Minimum spend is ₹${c.minSpend}` });
  }
  res.json({ valid: true, discountPercent: c.discountPercent, code: c.code });
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ----------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} with Backend REST API`);
  });
}

startServer();
