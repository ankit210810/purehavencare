import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, reviewCount = null, size = "w-4 h-4" }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-butter-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < fullStars
                ? 'fill-butter-400 text-butter-500'
                : i === fullStars && hasHalf
                ? 'fill-butter-200 text-butter-400'
                : 'text-cream-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-charcoal-700">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== null && (
        <span className="text-xs text-charcoal-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
