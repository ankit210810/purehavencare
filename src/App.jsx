import React, { useState, useEffect } from 'react';
import { Sparkles, Phone } from 'lucide-react';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/layout/ToastContainer';
import CartDrawer from './components/cart/CartDrawer';
import ProductDetailModal from './components/shop/ProductDetailModal';
import SearchModal from './components/common/SearchModal';
import AIAssistantModal from './components/ai/AIAssistantModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import PoliciesPage from './pages/PoliciesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Check initial URL hash / search for Supabase auth redirects or routes
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    // If Supabase redirected with auth tokens (#access_token=... or ?code=...)
    if (hash.includes('access_token=') || search.includes('code=') || hash.includes('type=')) {
      return 'profile';
    }

    // Check if hash matches a known route (e.g. #wishlist or #shop)
    const cleanHash = hash.replace(/^#\/?/, '').toLowerCase();
    const valid = [
      'home', 'shop', 'cart', 'checkout', 'order-confirmation',
      'track', 'auth', 'profile', 'support', 'about', 'policies', 'admin', 'wishlist'
    ];
    if (valid.includes(cleanHash)) {
      return cleanHash;
    }

    return 'home';
  });
  const [routeParams, setRouteParams] = useState({});

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Sync route with window hash and scroll to top
  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.location.hash = route === 'home' ? '' : `#${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for browser back / forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      const cleanHash = hash.replace(/^#\/?/, '').toLowerCase();
      const valid = [
        'home', 'shop', 'cart', 'checkout', 'order-confirmation',
        'track', 'auth', 'profile', 'support', 'about', 'policies', 'admin', 'wishlist'
      ];
      if (valid.includes(cleanHash)) {
        setCurrentRoute(cleanHash);
      } else if (!cleanHash) {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 font-sans selection:bg-butter-300 selection:text-forest-950">
              
              {/* Top Slim Announcement Bar with direct phone & email */}
              <AnnouncementBar />

              {/* Main Responsive Navigation Bar */}
              <Navbar
                currentRoute={currentRoute}
                navigate={navigate}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenAI={() => setIsAIOpen(true)}
              />

              {/* Page Router View */}
              <main className="flex-1">
                {currentRoute === 'home' && (
                  <HomePage
                    navigate={navigate}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                    onOpenAI={() => setIsAIOpen(true)}
                  />
                )}

                {currentRoute === 'shop' && (
                  <ShopPage
                    initialCategory={routeParams.category}
                    navigate={navigate}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                )}

                {currentRoute === 'cart' && (
                  <CartPage navigate={navigate} />
                )}

                {currentRoute === 'checkout' && (
                  <CheckoutPage
                    navigate={navigate}
                    onOrderPlaced={(order) => setRouteParams({ order })}
                  />
                )}

                {currentRoute === 'order-confirmation' && (
                  <OrderConfirmationPage
                    order={routeParams.order}
                    navigate={navigate}
                  />
                )}

                {currentRoute === 'track' && (
                  <OrderTrackingPage
                    initialOrderNumber={routeParams.orderNumber}
                    navigate={navigate}
                  />
                )}

                {currentRoute === 'auth' && (
                  <AuthPage navigate={navigate} />
                )}

                {currentRoute === 'profile' && (
                  <ProfilePage
                    initialTab={routeParams.tab || 'orders'}
                    navigate={navigate}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                )}

                {currentRoute === 'support' && (
                  <SupportPage navigate={navigate} />
                )}

                {currentRoute === 'about' && (
                  <AboutPage navigate={navigate} />
                )}

                {currentRoute === 'policies' && (
                  <PoliciesPage initialSection={routeParams.section || 'shipping'} />
                )}

                {currentRoute === 'admin' && (
                  <AdminDashboardPage
                    navigate={navigate}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                )}

                {currentRoute === 'wishlist' && (
                  <WishlistPage
                    navigate={navigate}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                )}

                {![
                  'home',
                  'shop',
                  'cart',
                  'checkout',
                  'order-confirmation',
                  'track',
                  'auth',
                  'profile',
                  'support',
                  'about',
                  'policies',
                  'admin',
                  'wishlist'
                ].includes(currentRoute) && (
                  <NotFoundPage navigate={navigate} />
                )}
              </main>

              {/* Global Floating AI Fromager Button */}
              <div className="fixed bottom-6 left-6 z-40">
                <button
                  type="button"
                  onClick={() => setIsAIOpen(true)}
                  className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-forest-900 text-cream-50 border border-butter-400/50 shadow-float hover:bg-forest-800 transition-all active:scale-95"
                  aria-label="Open AI Shopping Assistant"
                >
                  <Sparkles className="w-4 h-4 text-butter-400 animate-pulse" />
                  <span className="text-xs font-bold tracking-wide">
                    Fromager AI
                  </span>
                </button>
              </div>

              {/* Comprehensive Footer */}
              <Footer navigate={navigate} />

              {/* Slideout Cart Drawer */}
              <CartDrawer navigate={navigate} />

              {/* Rich Product Detail Tasting Modal */}
              <ProductDetailModal
                product={quickViewProduct}
                isOpen={Boolean(quickViewProduct)}
                onClose={() => setQuickViewProduct(null)}
              />

              {/* Global Fast Search Modal */}
              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={(prod) => setQuickViewProduct(prod)}
                navigate={navigate}
              />

              {/* PureHaven Fromager AI Assistant Modal */}
              <AIAssistantModal
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />

              {/* Floating Toast Alerts */}
              <ToastContainer />

            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
