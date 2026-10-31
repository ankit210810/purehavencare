import React from 'react';
import { Gift, ArrowRight, Sparkles, Check } from 'lucide-react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function CuratedHampersSection({ onQuickView, navigate }) {
  const { addItem } = useCart();
  const hamper = products.find((p) => p.id === 'prod-hamper-connoisseur') || products[products.length - 2];

  return (
    <section className="py-20 bg-forest-950 text-cream-100 overflow-hidden relative">
      
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-butter-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hamper Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-forest-800 shadow-float bg-forest-900 aspect-[4/3]">
              <img
                src={hamper.images[0]}
                alt={hamper.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-butter-400 text-forest-950 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                <span>Luxury Keepsake Crate</span>
              </div>

              <div className="absolute bottom-5 inset-x-5 text-cream-50">
                <span className="text-xs font-bold text-butter-300 uppercase tracking-widest">
                  Gift Edition
                </span>
                <h3 className="font-serif text-2xl font-bold mt-0.5">
                  The Connoisseur Grand Hamper
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Order CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-forest-800 text-butter-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-butter-400" />
              <span>Gourmet Gifting & Entertaining</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 leading-tight">
              Curated Gift Hampers for Memorable Celebrations
            </h2>

            <p className="text-sm text-cream-200 leading-relaxed">
              Arrives inside a handcrafted pine wood crate lined with insulated wool and frozen gel packs. Includes our 18M Reserve Cheddar, Black Truffle Gouda, Camembert Brie, Cultured A2 Butter, Kashmiri Wildflower Honey, Rosemary Sourdough Crackers, and an acacia wood tasting board.
            </p>

            {/* List of included gourmet elements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-cream-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-butter-400 flex-shrink-0" />
                <span>4 Reserve Cave-Aged Cheeses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-butter-400 flex-shrink-0" />
                <span>Golden Cultured A2 Butter (250g)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-butter-400 flex-shrink-0" />
                <span>Raw Kashmiri Wildflower Honey</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-butter-400 flex-shrink-0" />
                <span>Artisan Wooden Tasting Board & Knife</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-cream-300">Complete Gourmet Crate:</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-cream-50">₹2,850</span>
                  <span className="text-sm text-cream-400 line-through">₹3,290</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => addItem(hamper)}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-butter-500 hover:bg-butter-400 active:scale-98 text-forest-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Add Hamper to Cart
                </button>

                <button
                  type="button"
                  onClick={() => onQuickView(hamper)}
                  className="px-4 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-cream-100 text-xs font-semibold border border-forest-800"
                >
                  View Contents
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
