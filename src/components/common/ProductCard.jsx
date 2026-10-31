import React from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-forest-900 text-cream-50 shadow-sm">
              Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-charcoal-950 shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/90 backdrop-blur-sm text-charcoal-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Pill */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-950/80 backdrop-blur-md text-white text-xs font-medium">
            <Eye className="w-3.5 h-3.5" />
            View Tasting Notes
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Milk type & Aging badge */}
          <div className="flex items-center gap-2 mb-1.5 text-xs text-forest-700 font-medium">
            <span>{product.aging}</span>
            <span>•</span>
            <span className="truncate">{product.milkType}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Star Rating */}
          <div className="mt-3">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-forest-950">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-charcoal-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-charcoal-500">
              {product.weight}
            </span>
          </div>

          <button
            type="button"
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 active:scale-95 text-cream-50 text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
