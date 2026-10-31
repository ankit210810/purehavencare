import React from 'react';
import { X, Printer, ShieldCheck, Snowflake, CheckCircle2, Phone, Mail } from 'lucide-react';
import Logo from './Logo';

export default function InvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Derive financials
  const subtotal = order.subtotal || order.items?.reduce((acc, it) => acc + (it.price * it.quantity), 0) || order.total;
  const discount = order.discount || 0;
  const shipping = order.shippingFee !== undefined ? order.shippingFee : (subtotal > 1499 ? 0 : 150);
  const gstAmount = Math.round(subtotal * 0.05); // 5% GST included
  const cgst = (gstAmount / 2).toFixed(2);
  const sgst = (gstAmount / 2).toFixed(2);
  const invoiceNumber = `INV-2026-${order.orderNumber || order.id?.slice(0, 8)}`;
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-xs transition-opacity print:hidden"
      />

      {/* Invoice Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden z-10 my-auto animate-fade-in print:m-0 print:p-0 print:border-none print:shadow-none print:rounded-none">
        
        {/* Action Bar (Hidden on print) */}
        <div className="print:hidden bg-forest-900 px-6 py-4 flex items-center justify-between text-cream-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-butter-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Tax Invoice & Dispatch Slip
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-butter-500 hover:bg-butter-400 text-forest-950 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 space-y-6 text-charcoal-800 bg-white" id="invoice-sheet">
          
          {/* Header with Logo and Seller Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-cream-200">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-butter-400 font-serif font-bold text-xl">
                  P
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold text-forest-950 tracking-tight">PureHaven</h1>
                  <p className="text-[11px] text-forest-800 font-medium">Artisan Dairy & Cave Fromagerie</p>
                </div>
              </div>

              <div className="text-[11px] text-charcoal-600 mt-3 space-y-0.5">
                <p>PureHaven Heritage Pastures, Sahyadri Foothills</p>
                <p>Bengaluru, Karnataka - 560038, India</p>
                <p>GSTIN: <span className="font-mono font-bold text-charcoal-800">29AABCP1234F1Z9</span> | FSSAI Lic: <span className="font-mono font-bold text-charcoal-800">11223334000188</span></p>
                <p>Support: +91 91421 66210 | purehavencare26@gmail.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-forest-50 text-forest-900 border border-forest-200 text-[11px] font-bold uppercase tracking-wider mb-2">
                ORIGINAL TAX INVOICE
              </span>
              <p className="font-mono font-bold text-forest-950 text-sm">{invoiceNumber}</p>
              <p className="text-charcoal-500 mt-1">Order Date: <span className="font-semibold text-charcoal-800">{orderDate}</span></p>
              <p className="text-charcoal-500">Order ID: <span className="font-semibold text-charcoal-800">{order.orderNumber}</span></p>
              <p className="text-charcoal-500">Payment Mode: <span className="font-semibold text-charcoal-800 uppercase">{order.paymentMethod || 'Razorpay / UPI'}</span></p>
              {order.paymentId && (
                <p className="text-charcoal-500 font-mono text-[10px]">Txn ID: {order.paymentId}</p>
              )}
            </div>
          </div>

          {/* Billed To / Shipped To Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px] text-charcoal-500 mb-1">
                Billed To & Recipient
              </p>
              <p className="font-bold text-forest-950 text-sm">
                {order.customerName || order.deliveryAddress?.fullName || 'PureHaven Customer'}
              </p>
              <p className="text-charcoal-600 mt-0.5">{order.customerEmail}</p>
              <p className="text-charcoal-600">Phone: {order.customerPhone || order.deliveryAddress?.phone || '+91 91421 66210'}</p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-[10px] text-charcoal-500 mb-1">
                Cold-Chain Delivery Address
              </p>
              <p className="text-charcoal-800 leading-relaxed">
                {order.deliveryAddress?.line1 || order.deliveryAddress?.addressLine1 || 'PureHaven Cellar Dispatch'},{' '}
                {order.deliveryAddress?.line2 || order.deliveryAddress?.addressLine2 ? `${order.deliveryAddress?.line2 || order.deliveryAddress?.addressLine2}, ` : ''}
                {order.deliveryAddress?.city || 'Bengaluru'}, {order.deliveryAddress?.state || 'Karnataka'} - <strong className="text-forest-950">{order.deliveryAddress?.pincode || '560038'}</strong>
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-forest-800">
                <Snowflake className="w-3.5 h-3.5 text-forest-700" />
                <span>Cold Chain Express: {order.courierName || 'BlueDart Cold-Express'} ({order.trackingNumber || 'PH-EXPRESS-9281'})</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-forest-900 bg-forest-950 text-cream-50 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Artisan Product</th>
                  <th className="py-2.5 px-3">Batch / Origin</th>
                  <th className="py-2.5 px-3 text-center">Weight</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {order.items?.map((item, idx) => {
                  const lineTotal = item.total || (item.price * item.quantity);
                  return (
                    <tr key={idx} className="hover:bg-cream-50/50">
                      <td className="py-3 px-3 text-charcoal-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-forest-950">{item.name}</p>
                        <p className="text-[10px] text-charcoal-500">100% Veg Rennet • Single Estate Milk</p>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-charcoal-600">
                        {item.milkType || 'A2 Pasture Milk'}
                      </td>
                      <td className="py-3 px-3 text-center text-charcoal-700">{item.weight || '250g'}</td>
                      <td className="py-3 px-3 text-center font-bold text-forest-950">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-charcoal-700">₹{item.price}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-forest-950">₹{lineTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation & Tax Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-cream-200 gap-6">
            <div className="text-[11px] text-charcoal-500 space-y-1.5 max-w-sm">
              <p className="font-bold text-forest-900 uppercase tracking-wider text-[10px]">
                Cold Chain & Perishable Guarantee
              </p>
              <p>
                All cheeses are sealed in oxygen-permeable affineur paper with dry ice. Please refrigerate at 4°C immediately upon delivery.
              </p>
              <p className="text-[10px] text-charcoal-400">
                GST is calculated at 5% for dairy products in accordance with HSN 0406 (Cheese) and HSN 0405 (Butter).
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-charcoal-600">
                <span>Insulated Cold Express:</span>
                <span className="font-mono">{shipping === 0 ? 'FREE (Complimentary)' : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between text-charcoal-500 text-[11px] pt-1 border-t border-cream-100">
                <span>CGST (2.5%):</span>
                <span className="font-mono">₹{cgst}</span>
              </div>
              <div className="flex justify-between text-charcoal-500 text-[11px]">
                <span>SGST (2.5%):</span>
                <span className="font-mono">₹{sgst}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-forest-950 pt-2 border-t-2 border-forest-900">
                <span>Grand Total (INR):</span>
                <span className="font-serif text-lg font-bold">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Official Seal and Sign-off */}
          <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-forest-800 text-forest-800 flex items-center justify-center p-1 text-[8px] font-bold text-center uppercase tracking-tighter">
                PUREHAVEN VERIFIED
              </div>
              <div className="text-[11px] text-charcoal-500">
                <p className="font-semibold text-forest-900">Digitally Verified Cold-Chain Dispatch</p>
                <p>Authorized Cellar Affineur Signature</p>
              </div>
            </div>

            <div className="text-[10px] text-charcoal-400">
              <p>Computer generated tax invoice. No signature required.</p>
              <p className="font-medium text-forest-950">“Crafted with Care. Savoured with Joy.”</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
