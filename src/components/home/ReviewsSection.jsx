import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import RatingStars from '../common/RatingStars';

export default function ReviewsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Vikram Malhotra",
      location: "New Delhi",
      rating: 5,
      product: "Nilgiri Reserve Clothbound Cheddar",
      comment: "This cheddar easily matches the world's best clothbounds. The tyrosine crystals give it that delightful crunch, and the nutty complexity is outstanding. Arrived ice-cold in Delhi within 24 hours.",
      date: "March 2026"
    },
    {
      id: 2,
      name: "Meera Krishnan",
      location: "Bengaluru",
      rating: 5,
      product: "Bloomy Rind Camembert-Style Brie",
      comment: "Let it sit on the counter for 45 minutes before dinner — it was molten perfection. Sweet, mushroomy, utterly luxurious. Packaging with insulated thermal pouches kept it immaculate.",
      date: "March 2026"
    },
    {
      id: 3,
      name: "Chef Kabir Roy",
      location: "Mumbai",
      rating: 5,
      product: "Golden Cultured A2 Farmhouse Butter",
      comment: "The color is naturally sunny yellow from pasture carotene. The cultured lactic tang transforms a simple slice of sourdough into a fine dining experience. Highly recommended.",
      date: "March 2026"
    }
  ];

  return (
    <section className="py-20 bg-cream-50 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Connoisseur Acclaim
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
            Praised by Food Lovers Across the Country
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
            Real experiences from foodies, gourmet chefs, and party hosts.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-7 border border-cream-200 shadow-soft flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <RatingStars rating={t.rating} />
                  <span className="text-[11px] text-charcoal-400">{t.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-800 italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-forest-950">{t.name}</p>
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-700" title="Verified Customer" />
                  </div>
                  <p className="text-[11px] text-charcoal-500">{t.location}</p>
                </div>

                <span className="text-[10px] font-bold text-forest-800 bg-forest-100 px-2 py-1 rounded-md max-w-[130px] truncate">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
