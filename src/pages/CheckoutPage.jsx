import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Lock, 
  MapPin, 
  Snowflake,
  QrCode,
  Banknote,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { processPayment } from '../services/paymentService';
import { saveOrder } from '../services/orderService';
import { supabase, isSupabaseConfigured, localDb } from '../services/supabaseClient';
import PaymentGatewayModal from '../components/checkout/PaymentGatewayModal';

export default function CheckoutPage({ navigate, onOrderPlaced }) {
  const { 
    items, 
    subtotal, 
    coupon, 
    couponDiscount, 
    shippingFee, 
    coldChainFee, 
    gst, 
    total, 
    clearCart,
    pincode
  } = useCart();

  const { user } = useAuth();
  const { addToast } = useNotification();

  // Form State
  const defaultAddr = (user?.addresses && user.addresses[0]) || {};

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Arjun Mehta',
    email: user?.email || 'customer@purehaven.in',
    phone: user?.phone || '9142166210',
    addressLine1: defaultAddr.addressLine1 || 'Villa 14, Whispering Pines, Indiranagar',
    addressLine2: defaultAddr.addressLine2 || 'Near Defense Colony Park',
    city: defaultAddr.city || 'Bengaluru',
    state: defaultAddr.state || 'Karnataka',
    pincode: defaultAddr.pincode || pincode || '560038',
    deliveryInstructions: 'Please do not leave in direct sunlight. Ring bell upon arrival.'
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'priority'
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'upi' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderNumber, setPendingOrderNumber] = useState('');

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft max-w-md">
          <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-charcoal-600 mb-6">Please add artisanal dairy items to your cart before proceeding to checkout.</p>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      addToast('Please fill all mandatory shipping address fields', 'error');
      return;
    }

    const orderNumber = `PH-${Math.floor(10000 + Math.random() * 90000)}`;
    setPendingOrderNumber(orderNumber);

    if (paymentMethod === 'cod') {
      finalizeOrder(orderNumber, {
        paymentId: `cod_${Date.now()}`,
        status: 'pending',
        paymentMethod: 'cod'
      });
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    setShowPaymentModal(false);
    finalizeOrder(pendingOrderNumber, paymentResult);
  };

  const finalizeOrder = async (orderNumber, paymentResult) => {
    setIsProcessing(true);

    try {
      // 3. Construct Order Record
      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        userId: user?.id || 'guest',
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        status: 'confirmed',
        paymentStatus: paymentResult.status || 'paid',
        paymentMethod: paymentResult.paymentMethod || paymentMethod,
        paymentId: paymentResult.paymentId || `pay_${Date.now()}`,
        subtotal,
        discount: couponDiscount,
        couponCode: coupon?.code || null,
        shippingFee,
        coldChainFee,
        taxAmount: gst,
        total,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          image: item.product.images[0],
          weight: item.selectedVariant.weight,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        deliveryAddress: {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          instructions: formData.deliveryInstructions
        },
        courierName: 'PureHaven ColdChain Express',
        trackingNumber: `CC-${Math.floor(200000 + Math.random() * 800000)}`,
        estimatedDelivery: 'Within 24–36 Hours (Chilled Transit)',
        createdAt: new Date().toISOString()
      };

      // 4. Save to Database (Supabase PostgreSQL + local persistent backup)
      await saveOrder(newOrder);

      // 5. Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti gracefully skipped if canvas not ready
      }

      // 6. Clear Cart & Notify
      clearCart();
      addToast(`Order ${orderNumber} placed successfully!`, 'success');

      if (onOrderPlaced) {
        onOrderPlaced(newOrder);
      }
      navigate('order-confirmation', { order: newOrder });

    } catch (err) {
      addToast(err.message || 'Payment processing failed. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('cart')}
            className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Secure Cold-Chain Checkout
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Review your delivery address, select cold-transit parameters, and finalize payment.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Address, Shipping, Payment */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200 shadow-soft">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-cream-100">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-forest-950">
                    Cold-Chain Delivery Address
                  </h2>
                  <p className="text-xs text-charcoal-500">Where should we deliver your chilled dairy crate?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Contact Phone Number (For Courier Delivery Call) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Email Address (For Order Tracking & Invoices) *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Street Address / Villa / Apartment Details *
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name, Street"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Landmark / Locality (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Near park, main road landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Delivery Instructions for Rider
                  </label>
                  <input
                    type="text"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring doorbell, keep in shade"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Cold-Chain Shipping Options */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200 shadow-soft">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-cream-100">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-forest-950">
                    Cold-Chain Logistics Speed
                  </h2>
                  <p className="text-xs text-charcoal-500">Thermal casing with gel packs active for 48 hours</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'standard' ? 'border-forest-900 bg-forest-50/40' : 'border-cream-200 hover:border-cream-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-forest-900 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-950">
                        PureHaven Express Cold-Chain (24–36 Hours)
                      </p>
                      <p className="text-[11px] text-charcoal-500">
                        Insulated thermal wool casing + sub-zero gel ice packs
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-forest-900">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Options */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200 shadow-soft">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-cream-100">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-forest-950">
                    Payment Gateway (Razorpay Verified)
                  </h2>
                  <p className="text-xs text-charcoal-500">Select your preferred payment method</p>
                </div>
              </div>

              <div className="space-y-3">
                
                {/* Razorpay Card / NetBanking */}
                <label className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay' ? 'border-forest-900 bg-forest-50/40' : 'border-cream-200 hover:border-cream-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-forest-900 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-forest-800" />
                        <span>Razorpay / Credit & Debit Cards / NetBanking</span>
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        All Indian & International cards supported with 256-bit encryption. (Test Mode ready)
                      </p>
                    </div>
                  </div>
                </label>

                {/* Instant UPI */}
                <label className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-forest-900 bg-forest-50/40' : 'border-cream-200 hover:border-cream-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-forest-900 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-forest-800" />
                        <span>Instant UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Zero transaction fees, immediate payment confirmation.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-forest-900 bg-forest-50/40' : 'border-cream-200 hover:border-cream-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-forest-900 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-forest-800" />
                        <span>Cash / UPI on Delivery</span>
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Pay our cold-chain courier upon delivery after inspecting packaging temperature.
                      </p>
                    </div>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Submit */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-5">
              <h3 className="font-serif text-lg font-bold text-forest-950 border-b border-cream-100 pb-3">
                Review Order ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items Summary Thumbnails */}
              <div className="max-h-56 overflow-y-auto divide-y divide-cream-100 pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant.weight}`} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cream-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-forest-950 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-charcoal-500">
                        {item.selectedVariant.weight} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-charcoal-900 font-serif">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs text-charcoal-700 pt-3 border-t border-cream-100">
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
                  <span>Insulated Cold Packaging</span>
                  <span>{coldChainFee === 0 ? <strong className="text-forest-700">FREE</strong> : `₹${coldChainFee}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Express Cold Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-forest-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>

                <div className="flex justify-between text-charcoal-500">
                  <span>Taxes (5% Dairy GST)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="pt-3 border-t border-cream-200 flex justify-between text-base font-bold text-forest-950">
                  <span>Total Payable</span>
                  <span className="font-serif text-2xl text-forest-950">₹{total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-forest-900 hover:bg-forest-800 disabled:opacity-60 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-premium"
              >
                {isProcessing ? (
                  <span>Verifying Payment & Packaging...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-butter-400" />
                    <span>Pay ₹{total} & Confirm Order</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-charcoal-500 text-center space-y-1">
                <p>PureHaven 100% Cold-Chain Freshness Guarantee</p>
                <p>Order queries? Call Concierge: <strong>+91 91421 66210</strong></p>
              </div>

            </div>
          </div>

        </form>

        {/* Razorpay Sandbox Payment Gateway Modal */}
        <PaymentGatewayModal
          isOpen={showPaymentModal}
          orderNumber={pendingOrderNumber}
          amount={total}
          customerName={formData.fullName}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          defaultMethod={paymentMethod}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />

      </div>
    </div>
  );
}
