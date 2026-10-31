import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { products as initialProducts } from '../data/products';
import { categories } from '../data/categories';

export default function ShopPage({ initialCategory = null, onQuickView, navigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedMilk, setSelectedMilk] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [priceMax, setPriceMax] = useState(4000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('bestseller'); // 'bestseller' | 'price-low' | 'price-high' | 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesMilk = product.milkType.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesMilk) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
        return false;
      }

      // Milk Type
      if (selectedMilk !== 'all' && !product.milkType.toLowerCase().includes(selectedMilk.toLowerCase())) {
        return false;
      }

      // Dietary
      if (selectedDietary !== 'all') {
        const hasDietary = product.dietary.some((d) =>
          d.toLowerCase().includes(selectedDietary.toLowerCase())
        );
        if (!hasDietary) return false;
      }

      // Price Max
      if (product.price > priceMax) {
        return false;
      }

      // Stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // bestseller default
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedMilk, selectedDietary, priceMax, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMilk('all');
    setSelectedDietary('all');
    setPriceMax(4000);
    setInStockOnly(false);
    setSortBy('bestseller');
  };

  return (
    <div className="min-h-screen bg-cream-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-2">
            <button type="button" onClick={() => navigate('home')} className="hover:text-forest-900">Home</button>
            <span>/</span>
            <span className="font-bold text-forest-950">Artisan Dairy Catalog</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Artisanal Cheeses & Farmhouse Dairy
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl">
            Explore our handcrafted cave-aged wheels, bloomy rinds, and slow-churned A2 butters. Sourced directly from verified sustainable Indian dairy farms.
          </p>
        </div>

        {/* Search, Filter Trigger, and Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cheese by name, notes, or milk..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 text-forest-900 text-xs font-bold border border-cream-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-charcoal-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-forest-700"
              >
                <option value="bestseller">Featured & Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Content Layout (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-3xl border border-cream-200 shadow-soft h-fit`}>
            <div className="flex items-center justify-between pb-4 border-b border-cream-100">
              <h3 className="font-serif text-base font-bold text-forest-950 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-forest-700" />
                <span>Filters</span>
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-butter-700 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2.5">
                Category
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-forest-900 text-cream-50 font-bold'
                      : 'text-charcoal-700 hover:bg-cream-100'
                  }`}
                >
                  All Dairy Collections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-forest-900 text-cream-50 font-bold'
                        : 'text-charcoal-700 hover:bg-cream-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Milk Source */}
            <div className="pt-4 border-t border-cream-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2.5">
                Milk Heritage
              </h4>
              <div className="space-y-1 text-xs">
                {[
                  { label: 'All Milk Sources', val: 'all' },
                  { label: 'Gir Cow A2 Milk', val: 'gir' },
                  { label: 'Pasture Cow Milk', val: 'cow' },
                  { label: 'Murrah Buffalo Milk', val: 'buffalo' },
                  { label: 'Himalayan Yak & Dzo', val: 'yak' }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSelectedMilk(item.val)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedMilk === item.val
                        ? 'bg-forest-900 text-cream-50 font-bold'
                        : 'text-charcoal-700 hover:bg-cream-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="pt-4 border-t border-cream-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2.5">
                Dietary Attributes
              </h4>
              <div className="space-y-1 text-xs">
                {[
                  { label: 'All Dietary Types', val: 'all' },
                  { label: 'Vegetarian Microbial Rennet', val: 'vegetarian' },
                  { label: '100% Grass-Fed', val: 'grass-fed' },
                  { label: 'Low Lactose / Aged', val: 'lactose' }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSelectedDietary(item.val)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedDietary === item.val
                        ? 'bg-forest-900 text-cream-50 font-bold'
                        : 'text-charcoal-700 hover:bg-cream-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-cream-100">
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-charcoal-700">Max Price:</span>
                <span className="font-bold text-forest-950 font-serif">₹{priceMax}</span>
              </div>
              <input
                type="range"
                min="350"
                max="4000"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-forest-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-charcoal-400 mt-1">
                <span>₹350</span>
                <span>₹4,000</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-cream-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-charcoal-800">In-Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-forest-900 rounded cursor-pointer"
              />
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Results count banner */}
            <div className="mb-4 flex items-center justify-between text-xs text-charcoal-600">
              <p>
                Showing <strong className="text-forest-950">{filteredProducts.length}</strong> artisan selections
              </p>
              {filteredProducts.length !== initialProducts.length && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-forest-800 hover:underline"
                >
                  Clear Active Filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-soft">
                <h3 className="font-serif text-xl font-bold text-forest-950 mb-2">
                  No matching artisan dairy found
                </h3>
                <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-6">
                  Try widening your price range, clearing the search term, or selecting "All Collections".
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
