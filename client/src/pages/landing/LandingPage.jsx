/**
 * Cakes and Crunches — Landing Page Entry
 */

import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import TimelineSection from "./TimelineSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TimelineSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
