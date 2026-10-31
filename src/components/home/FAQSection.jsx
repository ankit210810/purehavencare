import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';
import { faqCategories } from '../../data/faqData';

export default function FAQSection({ navigate }) {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [openIndex, setOpenIndex] = useState(0);

  const currentCat = faqCategories.find((c) => c.id === activeCategory) || faqCategories[0];

  return (
    <section className="py-20 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
            PureHaven Dairy & Storage Insights
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
            Everything you need to know about cold-chain logistics, storage rituals, and dietary standards.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-forest-900 text-cream-50 shadow-sm'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Accordion Questions */}
        <div className="max-w-3xl mx-auto space-y-3">
          {currentCat.questions.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-cream-200 bg-cream-50/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-bold text-forest-950 hover:text-forest-700"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-forest-700 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-700 leading-relaxed border-t border-cream-200/60 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-14 max-w-2xl mx-auto p-6 rounded-3xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif text-base font-bold text-forest-950">
              Need personal cheese advice or bulk orders?
            </h4>
            <p className="text-xs text-forest-800 mt-0.5">
              Call our head fromager at <a href="tel:+919142166210" className="font-bold underline">+91 91421 66210</a> or write to <a href="mailto:purehavencare26@gmail.com" className="font-bold underline">purehavencare26@gmail.com</a>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('support')}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors"
          >
            Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}
