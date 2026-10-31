import React from 'react';
import { Sparkles, ArrowRight, Snowflake, Award, ShieldCheck, Heart } from 'lucide-react';

export default function HeroSection({ navigate, onOpenAI }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-cream-200">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-butter-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-forest-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900 text-butter-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-butter-400" />
              <span>Crafted with Care. Savoured with Joy.</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 leading-[1.15] tracking-tight">
              Artisan Cheeses & Farmhouse Dairy, Handcrafted for the Connoisseur.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-charcoal-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From cave-aged clothbound cheddars in the Nilgiris to 48-hour fermented A2 Gir cow butter. Delivered in certified sub-zero cold-chain boxes straight to your doorstep across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-forest-900 hover:bg-forest-800 active:scale-98 text-cream-50 font-bold text-sm uppercase tracking-wider transition-all shadow-premium"
              >
                <span>Explore Artisan Cellars</span>
                <ArrowRight className="w-4 h-4 text-butter-400" />
              </button>

              <button
                type="button"
                onClick={onOpenAI}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-forest-800/20 hover:border-forest-800 text-forest-950 font-bold text-sm transition-all shadow-soft"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Consult Sommelier AI</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-cream-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-xl sm:text-2xl font-bold text-forest-950">100%</span>
                <span className="text-xs text-charcoal-600">Vegetarian Rennet</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-xl sm:text-2xl font-bold text-forest-950">2°C–6°C</span>
                <span className="text-xs text-charcoal-600">Chilled Cold-Chain</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-xl sm:text-2xl font-bold text-forest-950">18M+</span>
                <span className="text-xs text-charcoal-600">Stone Cave Aging</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Hero Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Featured Photo */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-float border-4 border-white bg-cream-200">
                <img
                  src="https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=900"
                  alt="PureHaven Reserve Clothbound Farmhouse Cheddar"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-5 inset-x-5 text-cream-50">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-butter-500 text-charcoal-950 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    Spring Reserve Release
                  </div>
                  <h3 className="font-serif text-xl font-bold text-cream-50">
                    Nilgiri Clothbound Cheddar
                  </h3>
                  <p className="text-xs text-cream-200 mt-0.5">
                    Aged 18 months in natural high-altitude stone cellars
                  </p>
                </div>
              </div>

              {/* Floating Mini Badge Card 1 */}
              <div className="absolute -top-4 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-cream-200 shadow-premium flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                  <Snowflake className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-950">Sub-Zero Packaging</p>
                  <p className="text-[11px] text-charcoal-500">48-Hr Gel Ice Protection</p>
                </div>
              </div>

              {/* Floating Mini Badge Card 2 */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-cream-200 shadow-premium flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-butter-100 text-amber-700 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-950">Pure A2 Gir Dairy</p>
                  <p className="text-[11px] text-charcoal-500">Heritage Pasture Sanctuary</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
