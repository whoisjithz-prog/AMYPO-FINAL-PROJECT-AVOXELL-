import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import { AboutPage, ContactPage } from './pages/StaticPages';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[#f8faff] text-slate-800">
            {/* Global Sticky Navbar present on all pages */}
            <Navbar />

            {/* Main Page Route Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <Routes>
                {/* 1. Home Page (Top-Left screen in mockup) */}
                <Route path="/" element={<HomePage />} />

                {/* 2. Shop / Product Listing Page (Top-Right screen in mockup) */}
                <Route path="/shop" element={<ShopPage />} />

                {/* 3. Product Details Page (Bottom-Left screen in mockup) */}
                <Route path="/product/:slug" element={<ProductDetailPage />} />

                {/* 4. Shopping Cart Page (Bottom-Right screen in mockup) */}
                <Route path="/cart" element={<CartPage />} />

                {/* Additional SRS Pages */}
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faqs" element={<AboutPage />} />
                <Route path="/shipping" element={<AboutPage />} />
                <Route path="/returns" element={<AboutPage />} />
                <Route path="/support" element={<ContactPage />} />
              </Routes>
            </main>

            {/* Global Footer (shown on home, cart, etc.) */}
            <Footer />

            {/* Login / Register Modal */}
            <AuthModal />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
