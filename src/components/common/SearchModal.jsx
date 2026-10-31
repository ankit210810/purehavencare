import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';

export default function SearchModal({ isOpen, onClose, onSelectProduct, navigate }) {
  const [query, setQuery] = useState('');

  const quickPills = ["Reserve Cheddar", "Truffle Gouda", "Burrata", "A2 Butter", "Camembert Brie", "Gift Hamper"];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.milkType.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-float border border-cream-200 overflow-hidden z-10 animate-fade-in p-6 space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-cream-200 pb-4">
          <Search className="w-5 h-5 text-forest-800 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artisan cheeses, A2 butter, tasting hampers..."
            className="w-full text-base font-medium text-forest-950 placeholder-charcoal-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-charcoal-400 hover:text-charcoal-900 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-charcoal-500 hover:bg-cream-100"
          >
            ESC
          </button>
        </div>

        {/* Suggestion Pills */}
        {!query && (
          <div className="py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setQuery(pill)}
                  className="px-3 py-1.5 rounded-full bg-cream-50 hover:bg-butter-100 border border-cream-200 text-xs font-semibold text-charcoal-800 transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-80 overflow-y-auto divide-y divide-cream-100 pr-1">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-charcoal-500">No cheeses match "{query}".</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('shop');
                  }}
                  className="text-xs font-bold text-forest-800 hover:underline mt-2 inline-block"
                >
                  Browse all collections →
                </button>
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-cream-50 p-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cream-200"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-forest-950 text-xs sm:text-sm">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-charcoal-500 line-clamp-1">{product.shortDescription}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-serif font-bold text-forest-950 text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-charcoal-400 block">{product.weight}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
