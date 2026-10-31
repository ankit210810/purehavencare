import React from 'react';
import { Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Store Announcement" className="bg-forest-950 text-cream-100 text-xs py-2 px-4 border-b border-forest-900/60">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Cold Chain Guarantee */}
        <div className="flex items-center gap-2 text-butter-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-butter-400" />
          <span>Complimentary Sub-Zero Cold-Chain Express on Orders Above ₹1,499</span>
        </div>

        {/* Right: Direct Customer Phone & Email Links (Mandatory requirement) */}
        <div className="flex items-center gap-4 text-cream-200">
          <a
            href="tel:+919142166210"
            className="flex items-center gap-1.5 hover:text-butter-300 transition-colors cursor-pointer"
            title="Call PureHaven Direct Concierge"
          >
            <Phone className="w-3 h-3 text-butter-400" />
            <span className="font-medium">+91 91421 66210</span>
          </a>

          <span className="text-forest-700 hidden md:inline">|</span>

          <a
            href="mailto:purehavencare26@gmail.com"
            className="hidden md:flex items-center gap-1.5 hover:text-butter-300 transition-colors cursor-pointer"
            title="Email PureHaven Concierge"
          >
            <Mail className="w-3 h-3 text-butter-400" />
            <span>purehavencare26@gmail.com</span>
          </a>

          <span className="text-forest-700 hidden lg:inline">|</span>

          <div className="hidden lg:flex items-center gap-1 text-cream-300 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-butter-400" />
            <span>100% Vegetarian Rennet & Pure A2 Dairy</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
