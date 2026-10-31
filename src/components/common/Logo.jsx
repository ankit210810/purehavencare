import React from 'react';

export default function Logo({ className = "h-10", variant = "dark" }) {
  const isLight = variant === "light";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Artisan Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-forest-900 border border-butter-400/40 shadow-sm overflow-hidden">
        {/* Cheese Wheel & Sheaf Motif SVG */}
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Cheese Wheel Arc */}
          <path
            d="M20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 17.5 33.3 15.2 32.1 13.2L20 20V6Z"
            fill="#F4BA2E"
          />
          {/* Inner Curd Holes */}
          <circle cx="14" cy="22" r="2" fill="#1C3527" />
          <circle cx="21" cy="26" r="1.5" fill="#1C3527" />
          <circle cx="26" cy="22" r="1.8" fill="#1C3527" />
          {/* Wheat sheaf blade */}
          <path
            d="M23 7C25.5 10 27 13.5 28 17M20 7C22 10.5 23.5 13.5 24 17"
            stroke="#FFF9E6"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-serif text-2xl font-bold tracking-tight leading-none ${
            isLight ? 'text-cream-50' : 'text-forest-950'
          }`}
        >
          PureHaven
        </span>
        <span
          className={`text-[10px] uppercase font-semibold tracking-widest mt-0.5 ${
            isLight ? 'text-butter-300' : 'text-forest-700'
          }`}
        >
          Artisan Dairy & Fromagerie
        </span>
      </div>
    </div>
  );
}
