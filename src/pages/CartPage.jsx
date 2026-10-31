import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Snowflake, 
  ShieldCheck, 
  MapPin, 
  Tag, 
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage({ navigate }) {
  const {
    items,
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
  const [pincodeInput, setPincodeInput] = useState(pincode || '');

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

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen bg-cream-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Back Link */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Shopping Cart & Cold-Chain Summary
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-soft max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-forest-800 mx-auto mb-4">
              <Snowflake className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mb-6">
              Browse our cave-aged reserve cheddars, bloomy rinds, and grass-fed A2 cultured butter.
            </p>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="px-6 py-3 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider hover:bg-forest-800 transition-colors shadow-sm"
            >
              Browse Artisan Cheeses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items & Pincode Checker */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping Alert Bar */}
              <div className="bg-forest-900 text-cream-50 p-4 rounded-2xl shadow-soft">
                {isFreeShipping ? (
                  <div className="flex items-center gap-2 text-butter-300 font-bold text-xs">
                    <Snowflake className="w-4 h-4 text-butter-400" />
                    <span>Complimentary sub-zero cold-chain express shipping unlocked!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span>Add <strong>₹{amountForFreeShipping}</strong> more to qualify for Free Chilled Delivery</span>
                      <span className="font-bold">{freeShippingProgress}%</span>
                    </div>
                    <div className="w-full bg-forest-950 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-butter-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
                <div className="p-5 border-b border-cream-100 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-forest-950">
                    Artisan Items ({items.length})
                  </h2>
                  <span className="text-xs text-charcoal-500">Shipped together in thermal wool crate</span>
                </div>

                <div className="divide-y divide-cream-100">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedVariant.weight}`}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-cream-200 flex-shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">
                            {item.product.aging}
                          </span>
                          <h3 className="font-serif text-base font-bold text-forest-950 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-charcoal-500 mt-0.5">
                            Size / Cut: <strong className="text-charcoal-800">{item.selectedVariant.weight}</strong>
                          </p>
                          <p className="font-serif text-sm font-bold text-forest-950 mt-1">
                            ₹{item.price} each
                          </p>
                        </div>
                      </div>

                      {/* Stepper & Line Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant.weight, item.quantity - 1)}
                            className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-charcoal-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant.weight, item.quantity + 1)}
                            className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-base font-bold text-forest-950">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.selectedVariant.weight)}
                          className="text-charcoal-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Pincode Checker Card */}
              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-forest-800" />
                  <h3 className="font-serif text-base font-bold text-forest-950">
                    Verify Cold-Chain Pincode Serviceability
                  </h3>
                </div>
                <p className="text-xs text-charcoal-600 mb-4">
                  Enter your 6-digit postal code to calculate transit duration and cold pack insulation safety.
                </p>

                <form onSubmit={handlePincodeSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium focus:outline-none focus:border-forest-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus.checked && (
                  <div className={`mt-3 text-xs flex items-center gap-2 p-3 rounded-xl ${
                    pincodeStatus.serviceable ? 'bg-forest-50 text-forest-900' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {pincodeStatus.serviceable ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-forest-700" />
                        <span>Serviceable for {pincodeStatus.city}: <strong>{pincodeStatus.deliveryDays}</strong> via Sub-Zero ColdChain</span>
                      </>
                    ) : (
                      <span>Invalid pincode. Please enter a valid 6-digit Indian PIN code.</span>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-5">
                <h2 className="font-serif text-lg font-bold text-forest-950 border-b border-cream-100 pb-3">
                  Order Summary
                </h2>

                {/* Coupon Code Input */}
                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-butter-100 border border-butter-300 text-xs text-charcoal-900">
                    <div>
                      <p className="font-bold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-butter-700" />
                        <span>Code: {coupon.code}</span>
                      </p>
                      <p className="text-[11px] text-charcoal-600 mt-0.5">{coupon.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 hover:underline font-bold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <label className="block text-xs font-semibold text-charcoal-700">
                      Promo / Coupon Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. FIRSTFARM or PUREHAVEN10"
                        className="flex-1 px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs uppercase focus:outline-none focus:border-forest-700"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                  </form>
                )}

                {/* Breakdown Table */}
                <div className="space-y-2.5 text-xs text-charcoal-700 pt-2 border-t border-cream-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal-900">₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-forest-700 font-semibold">
                      <span>Discount ({coupon?.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Insulated Packaging & Gel Packs</span>
                    <span className="font-medium text-charcoal-900">
                      {coldChainFee === 0 ? <strong className="text-forest-700">FREE</strong> : `₹${coldChainFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Express Chilled Shipping</span>
                    <span className="font-medium text-charcoal-900">
                      {shippingFee === 0 ? <strong className="text-forest-700">FREE</strong> : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-charcoal-500">
                    <span>Dairy GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>

                  <div className="pt-3 border-t border-cream-200 flex justify-between text-base font-bold text-forest-950">
                    <span>Grand Total</span>
                    <span className="font-serif text-2xl text-forest-950">₹{total}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => navigate('checkout')}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-forest-900 hover:bg-forest-800 active:scale-98 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-premium"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-butter-400" />
                </button>

                <div className="text-[11px] text-charcoal-500 text-center space-y-1 pt-1">
                  <p>🔒 256-Bit SSL Encrypted & Razorpay Verified Checkout</p>
                  <p>Guaranteed cold delivery or immediate replacement</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
