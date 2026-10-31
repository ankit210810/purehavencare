import React, { useState, useEffect } from 'react';
import { ShieldCheck, Snowflake, RefreshCw, Lock, FileText, Phone, Mail } from 'lucide-react';

export default function PoliciesPage({ initialSection = 'shipping' }) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  return (
    <div className="min-h-screen bg-cream-50/60 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">Transparency & Trust</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Store Policies & Consumer Protections
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Verified standards regarding perishable cold-chain transit, replacements, and data privacy.
          </p>
        </div>

        {/* Policy Tab Switcher */}
        <div className="flex rounded-2xl bg-white border border-cream-200 p-1.5 shadow-xs overflow-x-auto gap-1">
          {[
            { id: 'shipping', label: 'Cold-Chain Delivery', icon: Snowflake },
            { id: 'refunds', label: 'Returns & Refunds', icon: RefreshCw },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms & Conditions', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSection === tab.id
                    ? 'bg-forest-900 text-cream-50 shadow-sm'
                    : 'text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft text-charcoal-800 leading-relaxed text-xs sm:text-sm space-y-6 animate-fade-in">
          
          {/* Section 1: Shipping Policy */}
          {activeSection === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                Cold-Chain Shipping & Delivery Logistics
              </h2>
              <p>
                At PureHaven, we treat every artisanal cheese wheel and jar of cultured butter with strict temperature vigilance from our curing caves to your doorstep.
              </p>
              
              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">1. Temperature-Controlled Packaging</h3>
              <p>
                All perishable goods are packed inside high-density insulated wool liners and paired with food-grade sub-zero gel ice packs. This packaging maintains a stable core temperature between 2°C and 6°C for up to 48 hours.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">2. Dispatch Days</h3>
              <p>
                To avoid packages languishing in courier transit hubs over weekends, we dispatch orders on Monday, Tuesday, Wednesday, and Thursday mornings. Metro city orders placed before 12:00 PM are dispatched on the same business day.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">3. Complimentary Delivery Threshold</h3>
              <p>
                All orders of ₹1,499 or higher qualify for complimentary express cold-chain delivery. Orders below this threshold incur a standardized ₹150 express air logistics fee and ₹99 insulated gel packaging fee.
              </p>
            </div>
          )}

          {/* Section 2: Returns & Refunds */}
          {activeSection === 'refunds' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                Perishable Returns & Freshness Guarantee
              </h2>
              <p>
                Because our cheeses and dairy are perishable, handcrafted food items, we cannot accept physical returns once an order has been accepted by the customer.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">1. Damaged or Thawed Parcels</h3>
              <p>
                If your parcel arrives with torn packaging, damaged seals, or thawed products exceeding 10°C, please report the issue within <strong>6 hours of delivery</strong> by calling us at <a href="tel:+919142166210" className="font-bold underline text-forest-900">+91 91421 66210</a> or emailing photos to <a href="mailto:purehavencare26@gmail.com" className="font-bold underline text-forest-900">purehavencare26@gmail.com</a>.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">2. Replacement or Full Refund</h3>
              <p>
                Upon review by our quality team, we will immediately process a complimentary priority replacement shipment or issue a 100% refund to your original payment method (processed within 3 to 5 business days via Razorpay).
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">3. Cancellations</h3>
              <p>
                Orders may be cancelled free of charge if requested prior to dispatch (within 2 hours of placement). Once an order has entered cold packing, cancellation is not possible.
              </p>
            </div>
          )}

          {/* Section 3: Privacy Policy */}
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                Privacy Policy & Data Security
              </h2>
              <p>
                PureHaven values your trust. We collect only the information strictly necessary to process and deliver your dairy orders.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">1. Information We Collect</h3>
              <p>
                We collect your name, delivery address, phone number, and email address for dispatch logistics and transactional updates.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">2. Zero Card Storage</h3>
              <p>
                We never store credit card numbers, CVVs, or bank credentials on our servers. All financial transactions are securely tokenized and handled directly through Razorpay's PCI-DSS Level 1 compliant gateway.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">3. Account Deletion Requests</h3>
              <p>
                You may request complete erasure of your account, addresses, and order history at any time by contacting our data protection desk at <a href="mailto:purehavencare26@gmail.com" className="font-bold underline">purehavencare26@gmail.com</a>.
              </p>
            </div>
          )}

          {/* Section 4: Terms & Conditions */}
          {activeSection === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                Terms & Conditions
              </h2>
              <p>
                By placing an order on PureHaven, you agree to these terms governing artisanal food purchases.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">1. Natural Variations in Artisan Cheeses</h3>
              <p>
                Because our cheeses are handcrafted in micro-batches using seasonal pasture milk, subtle natural variations in rind coloration, moisture levels, tyrosine crystallization, and sharpness are expected and celebrated hallmarks of genuine artisanal affinage.
              </p>

              <h3 className="font-serif text-base font-bold text-forest-900 pt-2">2. Customer Storage Obligation</h3>
              <p>
                The customer is responsible for promptly refrigerating delivered cheeses between 2°C and 4°C upon delivery receipt. PureHaven is not liable for spoilage resulting from unattended parcels left in ambient heat.
              </p>
            </div>
          )}

          {/* Contact Footer */}
          <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="font-medium text-charcoal-600">Have questions regarding our policies?</span>
            <div className="flex items-center gap-4">
              <a href="tel:+919142166210" className="font-bold text-forest-900 hover:underline flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 91421 66210</span>
              </a>
              <a href="mailto:purehavencare26@gmail.com" className="font-bold text-forest-900 hover:underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>purehavencare26@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
