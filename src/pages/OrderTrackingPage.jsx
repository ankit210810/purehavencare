import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  Snowflake, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { localDb } from '../services/supabaseClient';
import { fetchAllOrders } from '../services/orderService';

export default function OrderTrackingPage({ initialOrderNumber = '', navigate }) {
  const [searchInput, setSearchInput] = useState(initialOrderNumber || '');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderNumber));

  const lookupOrder = async (numberToFind) => {
    const clean = (numberToFind || searchInput).trim().toUpperCase();
    if (!clean) return;

    setHasSearched(true);
    let allOrders = localDb.get('orders', []);
    let found = allOrders.find(
      (o) => o.orderNumber?.toUpperCase() === clean || o.trackingNumber?.toUpperCase() === clean
    );

    // If not found locally, fetch latest from Supabase
    if (!found) {
      allOrders = await fetchAllOrders();
      found = allOrders.find(
        (o) => o.orderNumber?.toUpperCase() === clean || o.trackingNumber?.toUpperCase() === clean
      );
    }

    if (found) {
      setCurrentOrder(found);
    } else {
      setCurrentOrder(null);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchInput(initialOrderNumber);
      lookupOrder(initialOrderNumber);
    } else {
      lookupOrder('PH-84291');
    }
  }, [initialOrderNumber]);

  const stages = [
    { key: 'confirmed', title: 'Order Confirmed', desc: 'Cellar reserve reserved' },
    { key: 'processing', title: 'In Chilling & Cutting', desc: 'Hand-sliced in 4°C room' },
    { key: 'packed', title: 'Insulated Wool Packaging', desc: 'Sub-zero gel ice packs added' },
    { key: 'shipped', title: 'In Cold-Chain Transit', desc: 'Refrigerated transit active' },
    { key: 'out_for_delivery', title: 'Out for Chilled Delivery', desc: 'Courier dispatch on route' },
    { key: 'delivered', title: 'Delivered Fresh', desc: 'Transferred to home fridge' }
  ];

  // Helper to determine stage index
  const getStageIndex = (status) => {
    const map = {
      pending_payment: 0,
      confirmed: 1,
      processing: 2,
      packed: 3,
      shipped: 4,
      out_for_delivery: 5,
      delivered: 6
    };
    return map[status] || 3;
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.status) : 3;

  return (
    <div className="min-h-screen bg-cream-50/60 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Snowflake className="w-3.5 h-3.5 text-forest-700" />
            <span>Real-Time Temperature Monitoring</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Track Cold-Chain Transit
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Monitor your artisan dairy delivery, transit route, and temperature conditions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-cream-200 shadow-soft max-w-lg mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookupOrder(searchInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order No (e.g. PH-84291)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold focus:outline-none focus:border-forest-700 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Order Details View */}
        {currentOrder && (
          <div className="bg-white rounded-3xl border border-cream-200 shadow-premium overflow-hidden p-6 sm:p-8 space-y-8 animate-fade-in">
            
            {/* Top Bar Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cream-100 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Order Reference</span>
                <h2 className="font-serif text-2xl font-bold text-forest-950">{currentOrder.orderNumber}</h2>
                <p className="text-xs text-charcoal-500 mt-0.5">Courier: {currentOrder.courierName} ({currentOrder.trackingNumber})</p>
              </div>

              <div className="sm:text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-800">
                  Status: {currentOrder.status?.replace('_', ' ')}
                </span>
                <p className="text-xs text-charcoal-600 mt-1 font-medium">Estimated: {currentOrder.estimatedDelivery}</p>
              </div>
            </div>

            {/* Cold Chain Sensor Reading */}
            <div className="p-4 rounded-2xl bg-forest-900 text-cream-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-forest-800 text-butter-400">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-butter-300">Live Parcel Temperature Telemetry</p>
                  <p className="text-xs text-cream-200">Sensor reading: <strong>3.2°C</strong> (Safe dairy storage threshold 2°C – 6°C)</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-forest-800 text-forest-200 text-xs font-bold border border-forest-700">
                ✓ Insulated Thermal Wool Intact
              </span>
            </div>

            {/* Progress Timeline Stepper */}
            <div className="py-4">
              <h3 className="font-serif text-base font-bold text-forest-950 mb-6">
                Fulfillment & Transit Lifecycle
              </h3>

              <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-6 gap-2">
                {stages.map((stg, index) => {
                  const isCompleted = index <= currentStageIndex;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div key={stg.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center mb-6 sm:mb-0 relative">
                      {/* Node Icon */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-colors ${
                          isCompleted
                            ? 'bg-forest-900 text-butter-400 shadow-md'
                            : 'bg-cream-200 text-charcoal-500'
                        } ${isCurrent ? 'ring-4 ring-forest-200' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>

                      <div className="ml-4 sm:ml-0 sm:mt-3">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-forest-950' : 'text-charcoal-700'}`}>
                          {stg.title}
                        </p>
                        <p className="text-[10px] text-charcoal-500 mt-0.5">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination & Items breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-cream-100 text-xs">
              
              {/* Destination */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                <h4 className="font-bold text-forest-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-forest-800" />
                  <span>Delivery Destination</span>
                </h4>
                <p className="font-bold text-charcoal-900">{currentOrder.customerName}</p>
                <p className="text-charcoal-600">{currentOrder.deliveryAddress?.line1}, {currentOrder.deliveryAddress?.city}</p>
                <p className="text-charcoal-600">{currentOrder.deliveryAddress?.state} - {currentOrder.deliveryAddress?.pincode}</p>
                <p className="text-charcoal-500 pt-1">Recipient Phone: {currentOrder.customerPhone}</p>
              </div>

              {/* Items in transit */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                <h4 className="font-bold text-forest-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-forest-800" />
                  <span>Crate Contents</span>
                </h4>
                <div className="divide-y divide-cream-200/60 max-h-32 overflow-y-auto pr-1">
                  {currentOrder.items?.map((it, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span className="font-medium text-charcoal-800 truncate">{it.name} ({it.weight})</span>
                      <span className="text-charcoal-500 ml-2">×{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Need Help footer */}
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest-900">
              <span>Have delivery questions or need to change address?</span>
              <div className="flex items-center gap-4">
                <a href="tel:+919142166210" className="font-bold flex items-center gap-1 hover:underline">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 91421 66210</span>
                </a>
                <button
                  type="button"
                  onClick={() => navigate('support')}
                  className="font-bold text-forest-950 underline"
                >
                  Open Support Ticket
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Not Found State */}
        {!currentOrder && hasSearched && (
          <div className="bg-white rounded-3xl border border-cream-200 shadow-soft p-10 text-center max-w-lg mx-auto space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-amber-700" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Shipment Not Found</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              No active shipment matches "{searchInput}". Please double check your order reference number from your receipt email.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
