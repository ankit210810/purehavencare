import React, { useState } from 'react';
import { CheckCircle2, Truck, Printer, ArrowRight, Snowflake, Phone, Mail, Package } from 'lucide-react';
import InvoiceModal from '../components/common/InvoiceModal';

export default function OrderConfirmationPage({ order, navigate }) {
  const [showInvoice, setShowInvoice] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft max-w-md">
          <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">Order Not Found</h2>
          <p className="text-xs text-charcoal-600 mb-6">No recent order details available. Please check your order history.</p>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold"
          >
            Return to PureHaven Home
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    setShowInvoice(true);
  };

  return (
    <div className="min-h-screen bg-cream-50/60 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Receipt Container */}
        <div className="bg-white rounded-3xl border border-cream-200 shadow-premium overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Success Banner */}
          <div className="text-center space-y-2 pb-6 border-b border-cream-100">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-10 h-10 text-forest-700" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-900 text-butter-300">
              Order Confirmed & Payment Verified
            </span>
            <h1 className="font-serif text-3xl font-bold text-forest-950 pt-2">
              Thank You for Your Artisan Order!
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto">
              Our fromagerie cellar master is preparing your cheeses and packing them into insulated cold-chain containers.
            </p>
          </div>

          {/* Key Reference Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs">
            <div>
              <p className="text-charcoal-500">Order Number</p>
              <p className="font-serif text-base font-bold text-forest-950">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-charcoal-500">Payment Status</p>
              <p className="font-bold text-forest-800 uppercase">{order.paymentStatus}</p>
            </div>
            <div>
              <p className="text-charcoal-500">Estimated Delivery</p>
              <p className="font-bold text-charcoal-900">24–36 Hours</p>
            </div>
            <div>
              <p className="text-charcoal-500">Total Paid</p>
              <p className="font-serif text-base font-bold text-forest-950">₹{order.total}</p>
            </div>
          </div>

          {/* Cold Chain Guarantee Box */}
          <div className="p-4 rounded-2xl bg-forest-900 text-cream-50 flex items-start gap-3.5 text-xs">
            <Snowflake className="w-5 h-5 text-butter-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-butter-300">Continuous Sub-Zero Cold-Chain Active</p>
              <p className="text-cream-200 mt-0.5 leading-relaxed">
                Your order is protected by {order.courierName} with food-grade gel ice packs and breathable wax cheese paper. Tracking ID: <strong>{order.trackingNumber}</strong>
              </p>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-forest-950">
              Purchased Selections
            </h3>
            <div className="divide-y divide-cream-100 border-y border-cream-100 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-bold text-forest-950">{item.name}</p>
                      <p className="text-charcoal-500 text-[11px]">{item.weight} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-charcoal-900">₹{item.total || (item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-xs text-charcoal-700 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-forest-700 font-bold">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cold Chain Packaging & Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable Dairy Taxes (5%)</span>
                <span>₹{order.taxAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-forest-950 pt-2 border-t border-cream-200">
                <span>Grand Total</span>
                <span className="font-serif text-lg">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-1">
            <p className="font-bold uppercase tracking-wider text-charcoal-600">Dispatched To:</p>
            <p className="font-bold text-forest-950 text-sm">{order.customerName}</p>
            <p className="text-charcoal-700">{order.deliveryAddress?.line1}, {order.deliveryAddress?.line2}</p>
            <p className="text-charcoal-700">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
            <p className="text-charcoal-600 pt-1">Phone: {order.customerPhone} | Email: {order.customerEmail}</p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-cream-200">
            <button
              type="button"
              onClick={() => navigate('track', { orderNumber: order.orderNumber })}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <Truck className="w-4 h-4 text-butter-400" />
              <span>Track Cold-Chain Courier</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-950 font-bold text-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('shop')}
              className="w-full sm:w-auto py-3.5 px-4 text-xs font-bold text-forest-900 hover:underline"
            >
              Continue Shopping
            </button>
          </div>

        </div>

        {/* Official Printable Tax Invoice Modal */}
        <InvoiceModal
          order={order}
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
        />

      </div>
    </div>
  );
}
