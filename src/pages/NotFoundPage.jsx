import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage({ navigate }) {
  return (
    <div className="min-h-[70vh] bg-cream-50/60 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-cream-200 p-8 sm:p-10 text-center shadow-soft space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-800 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-forest-900" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
          404 — Page Not Found
        </span>

        <h1 className="font-serif text-3xl font-bold text-forest-950">
          Lost in the Curing Caves?
        </h1>

        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
          The dairy collection or page you are looking for has been relocated or is currently resting in our aging vaults.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Return to PureHaven Home</span>
            <ArrowRight className="w-4 h-4 text-butter-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
