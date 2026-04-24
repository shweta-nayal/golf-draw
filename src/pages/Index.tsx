import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedCharities } from "@/components/FeaturedCharities";
import { PricingPreview } from "@/components/PricingPreview";
import { Footer } from "@/components/Footer";

const Index = () => (
  <main className="min-h-screen bg-background">
    <Header light />
    <Hero />
    <HowItWorks />
    <FeaturedCharities />
    <PricingPreview />
    <Footer />
  </main>
);

export default Index;
