import React from 'react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ProductShowcase from './ProductShowcase';
import HowItWorksSection from './HowItWorksSection';
import ScreeningRoomSection from './ScreeningRoomSection';
import CandidateRecruiterBenefits from './CandidateRecruiterBenefits';
import Footer from './Footer';

/**
 * LandingPage
 * Flagship, high-polish SaaS landing page for NextStep AI.
 * Seamlessly integrates ambient animations, interactive product tours,
 * 3D perspective previews, and candidate/recruiter value journeys.
 */
export default function LandingPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background Layer with Orbs, Grid, & Particles */}
      <AnimatedBackground />

      {/* Main Content Layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ProductShowcase />
          <HowItWorksSection />
          <ScreeningRoomSection />
          <CandidateRecruiterBenefits />
        </main>
        <Footer />
      </div>
    </div>
  );
}
