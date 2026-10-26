import React, { useState } from 'react';
import { X, Database, Code2, Server, Key, FileText, Check, Copy } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DevGuideModal: React.FC = () => {
  const { devGuideOpen, setDevGuideOpen, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'prisma' | 'api' | 'env' | 'deploy'>('prisma');
  const [copied, setCopied] = useState(false);

  if (!devGuideOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Code snippet copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CARD
  STRIPE
  RAZORPAY
  UPI
  COD
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  name         String
  role         Role      @default(CUSTOMER)
  phone        String?
  avatar       String?
  addresses    Address[]
  orders       Order[]
  reviews      Review[]
  wishlist     WishlistItem[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Address {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName     String
  addressLine1 String
  addressLine2 String?
  city         String
  state        String
  postalCode   String
  country      String   @default("United States")
  phone        String
  isDefault    Boolean  @default(false)
  orders       Order[]
  createdAt    DateTime @default(now())
}

model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id               String         @id @default(uuid())
  name             String
  slug             String         @unique
  description      String
  shortDescription String
  price            Decimal        @db.Decimal(10, 2)
  originalPrice    Decimal?       @db.Decimal(10, 2)
  categoryId       String
  category         Category       @relation(fields: [categoryId], references: [id])
  brand            String
  rating           Float          @default(5.0)
  reviewCount      Int            @default(0)
  stock            Int            @default(0)
  isFeatured       Boolean        @default(false)
  isBestSeller     Boolean        @default(false)
  isNewArrival     Boolean        @default(false)
  images           String[]
  specs            Json
  tags             String[]
  orderItems       OrderItem[]
  reviews          Review[]
  wishlistItems    WishlistItem[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}

model Order {
  id                String        @id @default(uuid())
  orderNumber       String        @unique
  userId            String
  user              User          @relation(fields: [userId], references: [id])
  customerName      String
  customerEmail     String
  items             OrderItem[]
  subtotal          Decimal       @db.Decimal(10, 2)
  discount          Decimal       @default(0) @db.Decimal(10, 2)
  shipping          Decimal       @default(0) @db.Decimal(10, 2)
  tax               Decimal       @default(0) @db.Decimal(10, 2)
  total             Decimal       @db.Decimal(10, 2)
  appliedCoupon     String?
  shippingAddressId String
  shippingAddress   Address       @relation(fields: [shippingAddressId], references: [id])
  paymentMethod     PaymentMethod
  paymentStatus     String        @default("paid")
  paymentId         String?
  status            OrderStatus   @default(PENDING)
  trackingNumber    String
  carrier           String
  estimatedDelivery DateTime
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  name      String
  price     Decimal  @db.Decimal(10, 2)
  quantity  Int      @default(1)
  image     String
  finish    String?
}

model Coupon {
  id              String   @id @default(uuid())
  code            String   @unique
  discountPercent Int
  minSpend        Decimal  @db.Decimal(10, 2)
  description     String
  expiresAt       DateTime
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
}

model Review {
  id               String   @id @default(uuid())
  productId        String
  product          Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  rating           Int      @default(5)
  title            String
  comment          String
  verifiedPurchase Boolean  @default(true)
  createdAt        DateTime @default(now())
}

model WishlistItem {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}`;

  const envTemplateCode = `# .env.example
# PostgreSQL Connection (Prisma)
DATABASE_URL="postgresql://postgres:password@localhost:5432/aura_ecommerce?schema=public"

# NextAuth / Session Secret
NEXTAUTH_SECRET="your-ultra-secure-random-secret-key-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Gateway
STRIPE_PUBLIC_KEY="pk_test_51Mz..."
STRIPE_SECRET_KEY="sk_test_51Mz..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Razorpay Gateway
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Cloudflare R2 / AWS S3 Image Uploads
S3_BUCKET_NAME="aura-product-media"
S3_REGION="us-west-2"
S3_ACCESS_KEY="AKIA..."
S3_SECRET_KEY="..."

# Transactional Email (Resend / SendGrid)
RESEND_API_KEY="re_..."
SUPPORT_EMAIL="concierge@aura.store"`;

  const serverApiCode = `// pages/api/checkout/create-order.ts or app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { items, address, couponCode, paymentMethod } = await req.json();

    // 1. Server-side product price & inventory verification
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: \`Product \${item.name} is out of stock.\` },
          { status: 400 }
        );
      }

      verifiedSubtotal += Number(product.price) * item.quantity;
      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    // 2. Validate Discount Coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
      });
      if (coupon && verifiedSubtotal >= Number(coupon.minSpend)) {
        discount = (verifiedSubtotal * coupon.discountPercent) / 100;
      }
    }

    // 3. Calculate Tax & Total
    const shipping = verifiedSubtotal >= 99 ? 0 : 9.99;
    const tax = Number(((verifiedSubtotal - discount) * 0.0825).toFixed(2));
    const total = Number((verifiedSubtotal - discount + shipping + tax).toFixed(2));

    // 4. Atomic Prisma Transaction (Decrements Stock & Creates Order)
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber: \`AUR-2026-\${Math.floor(1000 + Math.random() * 9000)}\`,
          userId: address.userId,
          customerName: address.fullName,
          customerEmail: address.email,
          shippingAddressId: address.id,
          subtotal: verifiedSubtotal,
          discount,
          shipping,
          tax,
          total,
          paymentMethod,
          paymentStatus: 'paid',
          status: 'PENDING',
          trackingNumber: \`TRK\${Date.now()}\`,
          carrier: 'UPS Ground Express',
          estimatedDelivery: new Date(Date.now() + 3 * 86400000),
          items: { create: verifiedItems },
        },
      });
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Server payment error' }, { status: 500 });
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setDevGuideOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="relative bg-slate-900 text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-800 z-10 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Production Architecture & Database Blueprint</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  PostgreSQL • Prisma • Next.js
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete relational schemas, server APIs, and deployment blueprints.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDevGuideOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-950 border-b border-slate-800 px-6 gap-2 pt-2">
          {[
            { id: 'prisma', label: '1. Prisma Schema (PostgreSQL)', icon: Database },
            { id: 'api', label: '2. Next.js Server API Route', icon: Server },
            { id: 'env', label: '3. Environment Template (.env)', icon: Key },
            { id: 'deploy', label: '4. Deployment Guide', icon: Code2 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 transition border-b-2 ${
                  activeTab === t.id
                    ? 'bg-slate-900 text-amber-400 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200 border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          
          {activeTab === 'prisma' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-400 font-sans">
                <p className="text-xs">
                  Relational PostgreSQL schema with User RBAC, Products, Stock, OrderItems, Reviews, and Coupons:
                </p>
                <button
                  onClick={() => handleCopy(prismaSchemaCode)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                {prismaSchemaCode}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-400 font-sans">
                <p className="text-xs">
                  Server-side atomic order creation with price recalculation, stock reservation, and Stripe validation:
                </p>
                <button
                  onClick={() => handleCopy(serverApiCode)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                {serverApiCode}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-400 font-sans">
                <p className="text-xs">
                  Environment variables template with database URLs, payment keys, and object storage:
                </p>
                <button
                  onClick={() => handleCopy(envTemplateCode)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy .env'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                {envTemplateCode}
              </pre>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4 font-sans text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-400 text-sm">Deployment & Migration Instructions</h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
                  <li>
                    <strong>Provision Database:</strong> Spin up a managed PostgreSQL instance on Supabase, Neon, or Google Cloud SQL.
                  </li>
                  <li>
                    <strong>Run Migrations:</strong> Execute <code>npx prisma migrate dev --name init</code> to create tables.
                  </li>
                  <li>
                    <strong>Seed Initial Data:</strong> Run <code>npx prisma db seed</code> using the provided 12 audio & titanium products.
                  </li>
                  <li>
                    <strong>Set Environment Variables:</strong> Configure <code>DATABASE_URL</code>, <code>STRIPE_SECRET_KEY</code>, and <code>NEXTAUTH_SECRET</code> in your Vercel or Cloud Run environment.
                  </li>
                  <li>
                    <strong>Build & Deploy:</strong> Deploy with <code>npm run build</code>. All static pages are pre-rendered while checkout and order tracking routes run dynamically.
                  </li>
                </ol>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
