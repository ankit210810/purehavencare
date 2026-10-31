import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Compass, 
  LogOut, 
  Truck, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import Logo from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/categories';

export default function Navbar({ currentRoute, navigate, onOpenSearch, onOpenAI }) {
  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout, switchRole } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleNav = (route, params = {}) => {
    navigate(route, params);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    setCategoryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-forest-900 hover:bg-cream-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              type="button"
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none"
            >
              <Logo />
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentRoute === 'home'
                  ? 'text-forest-900 bg-cream-100'
                  : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-100/60'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNav('shop')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentRoute === 'shop'
                  ? 'text-forest-900 bg-cream-100'
                  : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-100/60'
              }`}
            >
              Shop All
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-700 hover:text-forest-900 hover:bg-cream-100/60 transition-colors"
              >
                <span>Collections</span>
                <ChevronDown className="w-4 h-4 text-charcoal-500" />
              </button>

              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-72 rounded-2xl bg-white border border-cream-200 shadow-premium p-2 animate-fade-in z-50"
                >
                  <div className="px-3 py-2 border-b border-cream-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Artisan Categories</p>
                  </div>
                  <div className="py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleNav('shop', { category: cat.slug })}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-cream-50 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-forest-950 group-hover:text-forest-700">
                            {cat.name}
                          </p>
                          <p className="text-[11px] text-charcoal-500 line-clamp-1">
                            {cat.tagline}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-butter-500 ml-2">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentRoute === 'about'
                  ? 'text-forest-900 bg-cream-100'
                  : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-100/60'
              }`}
            >
              Our Story & Farms
            </button>

            <button
              type="button"
              onClick={() => handleNav('track')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentRoute === 'track'
                  ? 'text-forest-900 bg-cream-100'
                  : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-100/60'
              }`}
            >
              <Truck className="w-4 h-4 text-forest-600" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('support')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentRoute === 'support'
                  ? 'text-forest-900 bg-cream-100'
                  : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-100/60'
              }`}
            >
              Concierge
            </button>
          </nav>

          {/* Right: Actions (Search, AI Sommelier, Wishlist, Cart, User) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* AI Assistant Pill */}
            <button
              type="button"
              onClick={onOpenAI}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-butter-100 text-forest-950 border border-butter-300 hover:bg-butter-200 transition-colors text-xs font-bold shadow-xs"
              title="Open PureHaven Fromager AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Ask Sommelier</span>
            </button>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-forest-950 hover:bg-cream-100 transition-colors"
              aria-label="Search dairy and cheeses"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <button
              type="button"
              onClick={() => handleNav('wishlist')}
              className={`relative p-2.5 rounded-xl transition-colors ${
                currentRoute === 'wishlist'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-forest-950 hover:bg-cream-100'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${currentRoute === 'wishlist' ? 'fill-rose-600' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 transition-all shadow-sm active:scale-95"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-butter-400" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {totalItemsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-butter-400 text-forest-950 text-[11px] font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Account / Admin Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-2 rounded-xl text-forest-950 hover:bg-cream-100 transition-colors"
                aria-label="Account Settings"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-butter-400"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 hidden sm:block" />
              </button>

              {accountMenuOpen && (
                <div
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-cream-200 shadow-premium p-2 animate-fade-in z-50"
                >
                  {user ? (
                    <>
                      <div className="px-3 py-2.5 border-b border-cream-100 bg-cream-50/70 rounded-xl mb-1">
                        <p className="text-xs text-charcoal-500">Signed in as</p>
                        <p className="text-sm font-bold text-forest-950 truncate">{user.fullName}</p>
                        <p className="text-xs text-charcoal-500 truncate">{user.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-forest-100 text-forest-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => handleNav('profile')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-charcoal-800 hover:bg-cream-100 transition-colors"
                        >
                          <User className="w-4 h-4 text-forest-700" />
                          <span>My Account & Orders</span>
                        </button>

                        {/* Admin Dashboard Entry */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleNav('admin')}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/80 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}

                        {/* Switch Role Quick Button for College Evaluation */}
                        <button
                          type="button"
                          onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-charcoal-600 hover:bg-cream-100 transition-colors"
                          title="Quick toggle for testing admin features"
                        >
                          <Compass className="w-3.5 h-3.5 text-charcoal-400" />
                          <span>Switch to {isAdmin ? 'Customer' : 'Admin'} Mode</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-xs text-charcoal-600 mb-3">Sign in to track orders, save shipping addresses, and manage your wishlist.</p>
                      <button
                        type="button"
                        onClick={() => handleNav('auth')}
                        className="w-full py-2.5 px-4 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold text-center hover:bg-forest-800 transition-colors"
                      >
                        Sign In or Create Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-premium">
          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="text-left py-2.5 px-3 rounded-xl font-medium text-forest-950 hover:bg-cream-100"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('shop')}
              className="text-left py-2.5 px-3 rounded-xl font-medium text-forest-950 hover:bg-cream-100"
            >
              Shop All Products
            </button>
            <button
              type="button"
              onClick={() => handleNav('about')}
              className="text-left py-2.5 px-3 rounded-xl font-medium text-forest-950 hover:bg-cream-100"
            >
              Our Story & Sustainable Farms
            </button>
            <button
              type="button"
              onClick={() => handleNav('track')}
              className="text-left py-2.5 px-3 rounded-xl font-medium text-forest-950 hover:bg-cream-100"
            >
              Track Cold-Chain Order
            </button>
            <button
              type="button"
              onClick={() => handleNav('support')}
              className="text-left py-2.5 px-3 rounded-xl font-medium text-forest-950 hover:bg-cream-100"
            >
              Customer Support & Concierge
            </button>
            <button
              type="button"
              onClick={() => handleNav('wishlist')}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl font-medium text-forest-950 hover:bg-cream-100"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>My Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="text-left py-2.5 px-3 rounded-xl font-bold text-amber-900 bg-amber-50"
              >
                Admin Dashboard
              </button>
            )}
          </div>

          {/* Direct Phone & Email in Mobile Drawer */}
          <div className="pt-3 border-t border-cream-100 text-xs text-charcoal-600 space-y-2">
            <p className="font-bold text-forest-900 uppercase tracking-wider text-[10px]">PureHaven Concierge</p>
            <a href="tel:+919142166210" className="flex items-center gap-2 text-forest-950 font-semibold">
              <Phone className="w-3.5 h-3.5 text-butter-500" />
              <span>+91 91421 66210</span>
            </a>
            <a href="mailto:purehavencare26@gmail.com" className="flex items-center gap-2 text-forest-950">
              <Mail className="w-3.5 h-3.5 text-butter-500" />
              <span>purehavencare26@gmail.com</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
