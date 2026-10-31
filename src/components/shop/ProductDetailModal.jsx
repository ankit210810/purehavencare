import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Snowflake, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useNotification();

  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : { weight: product.weight, price: product.price }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('tasting'); // 'tasting' | 'storage' | 'reviews'

  // Review state
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) {
      addToast('Please enter your name and comments', 'error');
      return;
    }

    const reviewObj = {
      id: `rev_${Date.now()}`,
      customerName: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Wonderful artisan cheese',
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
      isVerified: true
    };

    setReviewsList([reviewObj, ...reviewsList]);
    addToast('Review submitted and approved!', 'success');
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden z-10 animate-fade-in max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-charcoal-700 hover:text-charcoal-950 shadow-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 shadow-soft">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.isBestseller && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-cream-50 shadow-md">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === img
                          ? 'border-forest-800 scale-105 shadow-sm'
                          : 'border-cream-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Cold-Chain Notice */}
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 flex items-start gap-3 text-xs text-forest-900">
                <Snowflake className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">PureHaven Cold-Chain Protection</p>
                  <p className="text-forest-700 mt-0.5 leading-relaxed">
                    Shipped inside thermal wool casings packed with reusable frozen gel packs. Maintains 2°C – 6°C for 48 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Meta header */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="forest">{product.aging}</Badge>
                  <Badge variant="gold">{product.milkType}</Badge>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="mt-2.5 flex items-center gap-3">
                  <RatingStars rating={product.rating} reviewCount={reviewsList.length} />
                  <span className="text-xs text-forest-700 font-medium">Verified Reviews</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-forest-950">
                    ₹{selectedVariant.price || product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-charcoal-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-forest-700 font-semibold bg-forest-100 px-2.5 py-0.5 rounded-full">
                    {selectedVariant.weight}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                  {product.description}
                </p>

                {/* Weight Variant Selector */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                      Select Size / Format:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            selectedVariant.weight === v.weight
                              ? 'bg-forest-900 text-cream-50 border-forest-900 shadow-sm'
                              : 'bg-white text-charcoal-800 border-cream-300 hover:border-forest-600'
                          }`}
                        >
                          <span>{v.weight}</span>
                          <span className="ml-1.5 opacity-80">(₹{v.price})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 text-charcoal-700 hover:text-charcoal-950 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm font-bold text-charcoal-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 text-charcoal-700 hover:text-charcoal-950 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-butter-400" />
                    <span>Add to Cart • ₹{(selectedVariant.price || product.price) * quantity}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-colors shadow-sm ${
                      isFavorited
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'border-cream-300 text-charcoal-600 hover:text-rose-600 hover:bg-cream-50'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="mt-6 pt-4 border-t border-cream-200 flex flex-wrap gap-1.5">
                {product.dietary.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream-100 text-[11px] font-medium text-forest-900"
                  >
                    <Check className="w-3 h-3 text-forest-700" />
                    {tag}
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* Deep Tabs: Tasting, Ingredients, Storage, Reviews */}
          <div className="mt-10 pt-6 border-t border-cream-200">
            <div className="flex border-b border-cream-200 gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('tasting')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'tasting'
                    ? 'border-forest-900 text-forest-950'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                Tasting Notes & Pairings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('storage')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'storage'
                    ? 'border-forest-900 text-forest-950'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                Ingredients & Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-forest-900 text-forest-950'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cream-200 text-charcoal-800">
                  {reviewsList.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Tasting Notes */}
            {activeTab === 'tasting' && (
              <div className="py-6 space-y-4 animate-fade-in text-xs sm:text-sm text-charcoal-700">
                <div>
                  <h4 className="font-bold text-forest-950 mb-1">Palate & Aroma Profile</h4>
                  <p className="leading-relaxed bg-cream-50 p-4 rounded-2xl border border-cream-200">
                    {product.tastingNotes}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-forest-950 mb-2">Sommelier Recommended Pairings</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.pairings.map((pair, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-butter-50 border border-butter-200 text-forest-950 font-medium text-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {pair}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Ingredients & Storage */}
            {activeTab === 'storage' && (
              <div className="py-6 space-y-4 animate-fade-in text-xs sm:text-sm text-charcoal-700">
                <div>
                  <h4 className="font-bold text-forest-950 mb-1">Ingredients</h4>
                  <p className="leading-relaxed">{product.ingredients}</p>
                </div>
                <div>
                  <h4 className="font-bold text-rose-800 mb-1">Allergen Information</h4>
                  <p className="leading-relaxed text-charcoal-800 font-medium">{product.allergens}</p>
                </div>
                <div>
                  <h4 className="font-bold text-forest-950 mb-1">Storage & Serving Ritual</h4>
                  <p className="leading-relaxed">{product.storage}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="py-6 space-y-6 animate-fade-in">
                
                {/* Header with write review button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-forest-950">
                      Customer Reviews
                    </h4>
                    <p className="text-xs text-charcoal-500">
                      Authentic ratings from verified cheese lovers
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900">
                      Submit Your Tasting Review
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Radhika Sen"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                          Rating
                        </label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                          <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                          <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                          <option value={2}>⭐⭐ 2 Stars - Below Expectations</option>
                          <option value={1}>⭐ 1 Star - Poor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="e.g. Sublime flavor and crystalline texture!"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                        Your Detailed Review
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe the aroma, texture, flavor notes, and pairings..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors shadow-sm"
                    >
                      Post Review
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-forest-950">
                            {rev.customerName}
                          </span>
                          {rev.isVerified && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-100 text-forest-800 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-forest-700" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-charcoal-400">{rev.date}</span>
                      </div>

                      <RatingStars rating={rev.rating} />

                      {rev.title && (
                        <h5 className="font-serif text-sm font-bold text-charcoal-900 pt-1">
                          {rev.title}
                        </h5>
                      )}

                      <p className="text-xs text-charcoal-700 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
