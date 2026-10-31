import React from 'react';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';

export default function CategoryShowcase({ navigate }) {
  return (
    <section className="py-16 sm:py-20 bg-cream-50 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Handcrafted Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
              Curated Dairy & Fromagerie
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-xl">
              Each cheese category is cured under specific humidity and temperature parameters to cultivate authentic textures and deep pasture flavors.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-forest-700 transition-colors uppercase tracking-wider"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => navigate('shop', { category: cat.slug })}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-float transition-all duration-300 border border-cream-200/80 bg-white flex flex-col justify-between ${
                idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Image Aspect Box */}
              <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-sm text-forest-950 shadow-sm">
                  {cat.badge}
                </span>
              </div>

              {/* Text Body */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-600 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal-500">
                    {cat.itemCount} Artisan Selections
                  </span>
                  <span className="font-bold text-forest-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
