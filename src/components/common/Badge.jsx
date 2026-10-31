import React from 'react';

export default function Badge({ children, variant = 'forest', className = '' }) {
  const variants = {
    forest: 'bg-forest-100 text-forest-800 border-forest-200',
    butter: 'bg-butter-100 text-charcoal-900 border-butter-300',
    gold: 'bg-amber-50 text-amber-900 border-amber-300',
    olive: 'bg-olive-100 text-olive-700 border-olive-200',
    cream: 'bg-cream-200 text-charcoal-800 border-cream-300',
    danger: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[variant] || variants.forest
      } ${className}`}
    >
      {children}
    </span>
  );
}
