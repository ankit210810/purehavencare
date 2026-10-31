import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { products } from '../../data/products';

export default function BestsellersSection({ onQuickView, navigate }) {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
              Bestsellers & Cellar Reserve
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-xl">
              Our most celebrated aged wedges and farmhouse churns, acclaimed by culinary chefs and home gourmands.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-forest-700 transition-colors uppercase tracking-wider"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
