import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import SocialProof from '../components/sections/SocialProof';
import Problem from '../components/sections/Problem';
import Solution from '../components/sections/Solution';
import ProductShowcase from '../components/sections/ProductShowcase';
import HowItWorks from '../components/sections/HowItWorks';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import FinalCTA from '../components/sections/FinalCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Solution />
        <ProductShowcase />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
