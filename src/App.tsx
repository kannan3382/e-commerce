/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { EmailConfirmationModal } from './components/common/EmailConfirmationModal';
import { AuthModal } from './components/auth/AuthModal';
import { DevGuideModal } from './components/pages/DevGuideModal';

// Home sections
import { HeroSection } from './components/home/HeroSection';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { BestSellers } from './components/home/BestSellers';
import { SpecialOfferBanner } from './components/home/SpecialOfferBanner';
import { TestimonialsSection } from './components/home/TestimonialsSection';

// Pages
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailsPage } from './components/product/ProductDetailsPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { WishlistPage } from './components/pages/WishlistPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <FeaturedCategories />
            <BestSellers />
            <SpecialOfferBanner />
            <TestimonialsSection />
          </>
        );
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'profile':
        return <ProfilePage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <>
            <HeroSection />
            <FeaturedCategories />
            <BestSellers />
            <SpecialOfferBanner />
            <TestimonialsSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Universal Sticky Navbar */}
      <Navbar />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Universal Footer (hidden in admin mode for clean workbench space) */}
      {currentPage !== 'admin' && <Footer />}

      {/* Global Modals & Slide-outs */}
      <CartDrawer />
      <QuickViewModal />
      <EmailConfirmationModal />
      <AuthModal />
      <DevGuideModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
