import React from 'react';
import { ShieldCheck, Heart, Award, ArrowRight, Mountain, Sparkles, Check } from 'lucide-react';

export default function AboutPage({ navigate }) {
  return (
    <div className="min-h-screen bg-cream-50/60 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Our Heritage & Purpose
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 leading-tight">
            Reviving the Ancient Art of Artisan Farmhouse Dairy
          </h1>
          <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed">
            “Crafted with Care. Savoured with Joy.”
            PureHaven was founded on a simple conviction: the finest cheese is not an industrial product of speed, but a slow, reverent dialogue between pasture, climate, healthy herds, and patient affineurs.
          </p>
        </div>

        {/* Big Feature Image */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-cream-200 shadow-float bg-cream-200">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=1200"
            alt="High mountain pastures where PureHaven partner herds graze freely"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-cream-50">
            <span className="text-xs font-bold uppercase tracking-wider text-butter-300">Nilgiri Highlands, 7,200 ft</span>
            <p className="font-serif text-xl sm:text-2xl font-bold">Lush clover meadows and natural limestone aging caves</p>
          </div>
        </div>

        {/* 3 Core Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-3xl border border-cream-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center">
              <Mountain className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Traditional Cave Affinage</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We age our clothbound cheddars and goudas on untreated spruce planks inside natural stone cellars where wild microclimates nurture rich tyrosine crystals and savory crusts.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-cream-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Ethical Calf-First Pastures</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Our partner sanctuaries honor traditional ahimsa principles. Calves nurse first, cows graze openly on pesticide-free pastures, and no synthetic lactation hormones are ever permitted.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-cream-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">100% Vegetarian Coagulants</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Every single wheel is set using pure non-animal microbial coagulants and natural lactic cultures. Zero animal rennet is used across our entire production facility.
            </p>
          </div>
        </div>

        {/* Founder & Mission Section */}
        <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Small-Batch Dedication</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              Why Cold-Chain Integrity Matters
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
              Real artisan cheese is alive. Unpasteurized rind cultures and delicate butterfat molecules lose their sublime texture if subjected to warm ambient temperatures.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
              That is why we engineered a cold-chain distribution network utilizing biodegradable sheep wool insulation and phase-change gel ice packs that keep your parcel at 2°C–6°C for 48 hours throughout transit across India.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-800 transition-colors shadow-sm"
              >
                <span>Taste Our Cheeses</span>
                <ArrowRight className="w-4 h-4 text-butter-400" />
              </button>
            </div>
          </div>

          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
            <img
              src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800"
              alt="Artisan wheels maturing in curing rooms"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
