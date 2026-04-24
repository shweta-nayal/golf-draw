import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Draws } from "@/components/Draws";
import { Causes } from "@/components/Causes";
import { HowItWorks } from "@/components/HowItWorks";
import { Winners } from "@/components/Winners";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Draws />
      <Causes />
      <HowItWorks />
      <Winners />
      <Footer />
    </main>
  );
};

export default Index;
