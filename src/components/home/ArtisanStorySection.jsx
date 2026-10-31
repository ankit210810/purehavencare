import React from 'react';
import { Check, ArrowRight, ShieldCheck, Mountain } from 'lucide-react';
import { farmStories } from '../../data/farmStories';

export default function ArtisanStorySection({ navigate }) {
  return (
    <section className="py-20 bg-cream-100/70 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Our Sustainable Roots
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
            Ethical Sanctuaries & High-Altitude Pastures
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-3 leading-relaxed">
            Great cheese cannot be manufactured; it is born from lush pasture, clean mountain air, and content herds. We partner with small-scale pastoralists across India who honor centuries-old ethical dairy traditions.
          </p>
        </div>

        {/* Farm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {farmStories.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-3xl overflow-hidden border border-cream-200/90 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-cream-100 flex items-center gap-1.5 bg-charcoal-950/60 backdrop-blur-md px-3 py-1 rounded-full">
                  <Mountain className="w-3.5 h-3.5 text-butter-400" />
                  {farm.region}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    {farm.herd}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-forest-950 mt-1">
                    {farm.name}
                  </h3>
                  <p className="text-xs text-charcoal-600 mt-2.5 leading-relaxed">
                    {farm.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-cream-100 pt-4">
                    {farm.practices.map((practice, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-forest-950 font-medium">
                        <Check className="w-3.5 h-3.5 text-forest-700 flex-shrink-0 mt-0.5" />
                        <span>{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => navigate('about')}
                    className="text-xs font-bold text-forest-900 hover:text-forest-700 flex items-center gap-1"
                  >
                    <span>Read Partner Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
