import React from 'react';
import { Snowflake, Thermometer, Clock, ShieldCheck, Box } from 'lucide-react';

export default function QualityColdChainSection() {
  const steps = [
    {
      icon: Thermometer,
      title: "Curing Cave Integrity (2°C–4°C)",
      description: "Cheeses are harvested directly from humidity-controlled limestone curing rooms moments before order fulfillment."
    },
    {
      icon: Box,
      title: "Biodegradable Wool Insulation",
      description: "Packed inside high-density insulated thermal liners that reflect exterior heat and lock inside chilled mountain temperatures."
    },
    {
      icon: Snowflake,
      title: "Sub-Zero Gel Ice Packs",
      description: "Certified food-grade phase-change gel packs stay solid for up to 48 hours, preventing any moisture contact or thawing."
    },
    {
      icon: Clock,
      title: "24 to 36 Hr Express Dispatch",
      description: "Priority cold-chain air and surface logistics guarantee your dairy arrives in pristine, chilled condition across India."
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Farm-To-Door Cold Chain</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            How We Deliver Delicate Dairy Chilled Across India
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-3 leading-relaxed">
            Perishable artisan cheeses and cultured butters require continuous thermal vigilance. Here is how our certified cold-chain ensures restaurant-grade freshness.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-cream-50 border border-cream-200/80 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center mb-5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
