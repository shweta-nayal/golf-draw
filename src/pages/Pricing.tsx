import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingPreview } from "@/components/PricingPreview";

const Pricing = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="container pt-16 pb-4 text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Pricing</div>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Choose your plan</h1>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
        Subscribe, enter scores, support a charity, and join every monthly draw.
      </p>
    </section>
    <PricingPreview />
    <Footer />
  </main>
);

export default Pricing;
