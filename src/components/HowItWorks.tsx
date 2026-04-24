import { Pencil, Sparkles, Trophy, HeartHandshake } from "lucide-react";

const steps = [
  { icon: Pencil, title: "Enter your last 5 scores", copy: "Stableford 1–45 per round, dated. Your last 5 are always your draw entry." },
  { icon: Sparkles, title: "We run the monthly draw", copy: "Random or weighted by user scores. 5 numbers from 1 to 45 — published live." },
  { icon: Trophy, title: "Match 3, 4 or 5 to win", copy: "Prize pool is auto-split between tiers. Jackpot rolls over if no 5-match." },
  { icon: HeartHandshake, title: "Your charity gets paid", copy: "Every subscription funds your chosen cause — minimum 10%, your call." },
];

export const HowItWorks = () => (
  <section className="bg-primary text-primary-foreground pt-40 md:pt-48 pb-24 md:pb-32 relative overflow-hidden">
    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "var(--gradient-radial-gold)" }} aria-hidden />
    <div className="container relative">
      <div className="max-w-2xl mb-16">
        <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">How it works</div>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
          Simple to play. <span className="gold-shimmer">Serious about impact.</span>
        </h2>
      </div>

      <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-gold-gradient grid place-items-center text-primary shadow-gold">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-serif text-4xl font-semibold text-gold/30">0{i + 1}</div>
            </div>
            <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-primary-foreground/75 leading-relaxed text-sm">{s.copy}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
