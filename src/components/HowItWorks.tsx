import { Ticket, Sparkles, HeartHandshake } from "lucide-react";

const steps = [
  { icon: Ticket, title: "Choose a draw", copy: "Pick a prize you love. Each one funds a verified charity partner." },
  { icon: Sparkles, title: "Enter & wait", copy: "Tickets from £5. Draws are livestreamed and independently audited." },
  { icon: HeartHandshake, title: "Win — and give", copy: "Winners get the prize. 75% of every ticket goes straight to good." },
];

export const HowItWorks = () => (
  <section id="how" className="bg-primary text-primary-foreground py-24 md:py-32 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-30 pointer-events-none"
      style={{ background: "var(--gradient-radial-gold)" }}
      aria-hidden
    />
    <div className="container relative">
      <div className="max-w-2xl mb-16">
        <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">How it works</div>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
          Simple to enter. <span className="gold-shimmer">Serious about impact.</span>
        </h2>
      </div>

      <ol className="grid md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-gold-gradient grid place-items-center text-primary shadow-gold">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-serif text-5xl font-semibold text-gold/30">0{i + 1}</div>
            </div>
            <h3 className="font-serif text-2xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-primary-foreground/75 leading-relaxed">{s.copy}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
