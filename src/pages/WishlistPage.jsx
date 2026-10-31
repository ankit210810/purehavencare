import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, ShieldCheck, Thermometer } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';

export default function WishlistPage({ navigate, onQuickView }) {
  const { wishlist, wishlistCount, toggleWishlist, moveToCart, clearWishlist, moveAllToCart } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-cream-50/60 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="hover:text-forest-900 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-forest-950 font-bold">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7 fill-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                  Your Tasting Wishlist
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cream-100 text-forest-900 border border-cream-300">
                  {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Hand-picked cheeses, cultured farm butter, and gourmet bundles saved for your cellar.
              </p>
            </div>
          </div>

          {/* Bulk Action Buttons (when items exist) */}
          {wishlistCount > 0 && (
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={moveAllToCart}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-butter-400" />
                <span>Move All to Cart</span>
              </button>

              <button
                type="button"
                onClick={clearWishlist}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cream-200 hover:bg-rose-50 text-charcoal-600 hover:text-rose-700 text-xs font-semibold transition-colors"
                title="Clear all items from wishlist"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Content Grid or Empty State */}
        {wishlistCount === 0 ? (
          <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center shadow-soft max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-800 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-forest-900" />
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              Your cellar wishlist is empty
            </h2>
            
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-md mx-auto">
              Explore our cave-aged reserve cheeses, artisanal cultured butter, and gourmet gift hampers to bookmark your favorite flavors.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <span>Explore PureHaven Collections</span>
                <ArrowRight className="w-4 h-4 text-butter-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>

            {/* Cold Chain Guarantee Footer Banner */}
            <div className="bg-gradient-to-r from-forest-900 to-forest-950 rounded-2xl p-6 text-cream-50 flex flex-col sm:flex-row items-center justify-between gap-4 border border-butter-400/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-800/80 border border-butter-400/30 flex items-center justify-center text-butter-400 flex-shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-butter-400">
                    Insulated Cold-Chain Assurance
                  </h4>
                  <p className="text-xs text-cream-200 mt-0.5">
                    All items in your wishlist are dispatched in temperature-controlled packaging with recyclable dry ice packs.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('shop')}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 border border-cream-200/20 text-xs font-semibold text-cream-100 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
