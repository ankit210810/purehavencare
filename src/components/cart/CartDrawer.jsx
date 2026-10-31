import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Snowflake, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ navigate }) {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    shippingFee,
    coldChainFee,
    gst,
    total,
    freeShippingThreshold,
    amountForFreeShipping,
    isFreeShipping,
    pincode,
    checkPincode,
    pincodeStatus
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [pincodeInput, setPincodeInput] = useState(pincode);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    checkPincode(pincodeInput);
  };

  const handleGoToCheckout = () => {
    closeCart();
    navigate('checkout');
  };

  const handleGoToCartPage = () => {
    closeCart();
    navigate('cart');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-forest-950">
                Your Tasting Cart
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-forest-900 text-cream-50">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded-xl text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tier Banner */}
          <div className="bg-forest-900 text-cream-100 px-5 py-3 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-butter-300 font-semibold">
                <Snowflake className="w-4 h-4 text-butter-400" />
                <span>🎉 You qualify for FREE Sub-Zero Insulated Express Delivery!</span>
              </div>
            ) : (
              <div>
                <p className="flex justify-between mb-1.5 font-medium">
                  <span>Add <strong className="text-butter-300">₹{amountForFreeShipping}</strong> more for Free Chilled Delivery</span>
                  <span className="font-bold">{freeShippingProgress}%</span>
                </p>
                <div className="w-full bg-forest-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-butter-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-cream-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-forest-700 mb-4">
                  <Snowflake className="w-8 h-8 text-forest-800" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-charcoal-500 max-w-xs mb-6">
                  Explore our cave-matured reserve cheddars, bloomy rinds, and cultured A2 butter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors"
                >
                  Explore Artisan Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.product.id}-${item.selectedVariant.weight}`} className="py-4 flex gap-3.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-cream-200 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-forest-950 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-charcoal-500 mt-0.5">
                      {item.selectedVariant.weight}
                    </p>
                    <p className="font-serif text-sm font-bold text-forest-900 mt-1">
                      ₹{item.price}
                    </p>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-cream-300 rounded-lg bg-cream-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant.weight, item.quantity - 1)}
                          className="p-1 text-charcoal-600 hover:text-charcoal-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-charcoal-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant.weight, item.quantity + 1)}
                          className="p-1 text-charcoal-600 hover:text-charcoal-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id, item.selectedVariant.weight)}
                        className="text-charcoal-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-5 border-t border-cream-200 bg-cream-50/50 space-y-4">
              
              {/* Coupon Section */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-butter-100 border border-butter-300 text-xs text-charcoal-900">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-butter-600" />
                    <span>Coupon <strong>{coupon.code}</strong> applied (-₹{couponDiscount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. FIRSTFARM)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-xs uppercase focus:outline-none focus:border-forest-700"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal-900">₹{subtotal}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-forest-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Insulated Cold-Chain & Ice Packs
                    {isFreeShipping && <span className="text-[10px] text-forest-700 font-bold">(FREE)</span>}
                  </span>
                  <span>{coldChainFee === 0 ? 'FREE' : `₹${coldChainFee}`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Express Shipping
                    {isFreeShipping && <span className="text-[10px] text-forest-700 font-bold">(FREE)</span>}
                  </span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>

                <div className="flex justify-between text-charcoal-500">
                  <span>Applicable GST (5%)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="pt-2 border-t border-cream-200 flex justify-between text-sm font-bold text-forest-950">
                  <span>Estimated Total</span>
                  <span className="font-serif text-lg text-forest-950">₹{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoToCartPage}
                  className="w-full py-2 text-center text-xs text-forest-900 font-bold hover:underline"
                >
                  View Full Cart & Pincode Checker
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
