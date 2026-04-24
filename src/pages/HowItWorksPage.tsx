import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";

const HowItWorksPage = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="container pt-16 pb-4 max-w-3xl">
      <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">The full story</div>
      <h1 className="mt-3 font-serif text-5xl font-semibold">How Digital Heroes works</h1>
      <p className="mt-4 text-muted-foreground">
        Subscribe, enter your last 5 Stableford scores, pick a charity, and you're in every monthly draw.
        Match 3, 4 or 5 of the winning numbers and win a share of the prize pool.
      </p>
    </section>
    <HowItWorks />
    <section className="container py-24 max-w-3xl">
      <h2 className="font-serif text-3xl font-semibold mb-6">Where every rupee goes</h2>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between border-b border-border pb-3"><span>Charity (you choose %, min 10%)</span><span className="font-medium">10–100%</span></li>
        <li className="flex justify-between border-b border-border pb-3"><span>Prize pool</span><span className="font-medium">40%</span></li>
        <li className="flex justify-between"><span>Platform & operations</span><span className="font-medium">remainder</span></li>
      </ul>
      <h2 className="font-serif text-3xl font-semibold mt-12 mb-6">Prize tiers</h2>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between border-b border-border pb-3"><span>5-Number Match (jackpot · rolls over)</span><span className="font-medium">40% of pool</span></li>
        <li className="flex justify-between border-b border-border pb-3"><span>4-Number Match</span><span className="font-medium">35% of pool</span></li>
        <li className="flex justify-between"><span>3-Number Match</span><span className="font-medium">25% of pool</span></li>
      </ul>
    </section>
    <Footer />
  </main>
);

export default HowItWorksPage;
