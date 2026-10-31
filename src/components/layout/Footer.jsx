import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Snowflake, Heart, Award, Send } from 'lucide-react';
import Logo from '../common/Logo';
import { useNotification } from '../../context/NotificationContext';

export default function Footer({ navigate }) {
  const { addToast } = useNotification();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Thank you for subscribing to PureHaven Seasonal Releases!', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-forest-950 text-cream-100 pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-forest-900/80">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-forest-900/40 border border-forest-800/60">
            <div className="p-3 rounded-xl bg-forest-800 text-butter-400">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-cream-50">Sub-Zero Cold Chain</h4>
              <p className="text-xs text-cream-300">Strict 2°C–6°C insulated delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-forest-900/40 border border-forest-800/60">
            <div className="p-3 rounded-xl bg-forest-800 text-butter-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-cream-50">100% Vegetarian Rennet</h4>
              <p className="text-xs text-cream-300">Pure plant & microbial enzymes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-forest-900/40 border border-forest-800/60">
            <div className="p-3 rounded-xl bg-forest-800 text-butter-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-cream-50">Ethical Pasture Grazing</h4>
              <p className="text-xs text-cream-300">Grass-fed cows & heritage A2 herds</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-forest-900/40 border border-forest-800/60">
            <div className="p-3 rounded-xl bg-forest-800 text-butter-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-cream-50">Razorpay Verified</h4>
              <p className="text-xs text-cream-300">Encrypted payment security</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Links & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-forest-900/80">
          
          {/* Brand Info & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-cream-200/90 leading-relaxed max-w-sm">
              “Crafted with Care. Savoured with Joy.”
              Handcrafted small-batch artisan cheeses, slow-churned cultured A2 farmhouse butter, and curated dairy gifts sourced from ethical pasture sanctuaries.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-cream-200">
              {/* Direct Clickable Phone Link */}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-butter-400 flex-shrink-0" />
                <span>Customer Care & Concierge: </span>
                <a
                  href="tel:+919142166210"
                  className="font-bold text-butter-300 hover:text-white transition-colors underline decoration-dotted"
                  title="Click to call PureHaven"
                >
                  +91 91421 66210
                </a>
              </div>

              {/* Direct Clickable Email Link */}
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-butter-400 flex-shrink-0" />
                <span>Inquiries & Wholesale: </span>
                <a
                  href="mailto:purehavencare26@gmail.com"
                  className="font-bold text-butter-300 hover:text-white transition-colors underline decoration-dotted"
                  title="Click to email PureHaven"
                >
                  purehavencare26@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-butter-400 flex-shrink-0 mt-0.5" />
                <span>PureHaven Fromagerie & Dairy Curing Caves, Nilgiri Highlands & Bengaluru, India</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-butter-400 mb-4">
              Artisan Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-200">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'hard-aged' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Hard & Aged Cheeses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'soft-bloomy' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Soft & Bloomy Rinds
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'fresh-curd' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Fresh Burrata & Curds
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'butter-cultured' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Cultured A2 Butter & Dairy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'gift-hampers' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Gourmet Gift Hampers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-butter-400 mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-200">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('track')}
                  className="hover:text-butter-300 transition-colors"
                >
                  Track Cold-Chain Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('support')}
                  className="hover:text-butter-300 transition-colors"
                >
                  Customer Support & Tickets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-butter-300 transition-colors"
                >
                  Our Pastures & Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policies', { section: 'shipping' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Cold-Chain Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('policies', { section: 'refunds' })}
                  className="hover:text-butter-300 transition-colors"
                >
                  Returns & Perishable Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-butter-400 mb-4">
              The Seasonal Journal
            </h4>
            <p className="text-xs text-cream-300 mb-3 leading-relaxed">
              Receive private alerts for limited cave releases, truffle season batches, and sommelier tasting pairings.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-forest-800 text-xs text-cream-100 placeholder-forest-500 focus:outline-none focus:border-butter-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-butter-500 hover:bg-butter-400 text-forest-950 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-butter-300">✓ You are registered for our private reserve releases.</p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {new Date().getFullYear()} PureHaven Artisan Cheese & Farmhouse Dairy. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('policies', { section: 'privacy' })}
              className="hover:text-cream-100 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate('policies', { section: 'terms' })}
              className="hover:text-cream-100 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate('policies', { section: 'shipping' })}
              className="hover:text-cream-100 transition-colors"
            >
              Cold Chain Logistics
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
