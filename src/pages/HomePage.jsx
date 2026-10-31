import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryShowcase from '../components/home/CategoryShowcase';
import BestsellersSection from '../components/home/BestsellersSection';
import ArtisanStorySection from '../components/home/ArtisanStorySection';
import CuratedHampersSection from '../components/home/CuratedHampersSection';
import QualityColdChainSection from '../components/home/QualityColdChainSection';
import ReviewsSection from '../components/home/ReviewsSection';
import FAQSection from '../components/home/FAQSection';

export default function HomePage({ navigate, onQuickView, onOpenAI }) {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection navigate={navigate} onOpenAI={onOpenAI} />

      {/* 2. Featured Product Categories */}
      <CategoryShowcase navigate={navigate} />

      {/* 3. Bestsellers & Reserve Cheeses */}
      <BestsellersSection onQuickView={onQuickView} navigate={navigate} />

      {/* 4. Sustainable Sourcing & Farm Partners */}
      <ArtisanStorySection navigate={navigate} />

      {/* 5. Gourmet Gift Hampers & Bundles */}
      <CuratedHampersSection onQuickView={onQuickView} navigate={navigate} />

      {/* 6. Cold Chain Quality & Temperature Assurance */}
      <QualityColdChainSection />

      {/* 7. Customer Reviews */}
      <ReviewsSection />

      {/* 8. Frequently Asked Questions */}
      <FAQSection navigate={navigate} />
    </div>
  );
}
