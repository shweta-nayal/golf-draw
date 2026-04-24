import { ArrowRight, Heart, ShieldCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-golf.jpg";
import { formatINR } from "@/lib/pricing";

export const Hero = () => (
  <section className="relative isolate overflow-hidden bg-hero-gradient text-primary-foreground">
    <div className="absolute inset-0 -z-10 opacity-60" style={{ backgroundImage: "var(--gradient-radial-gold)" }} aria-hidden />
    <div className="absolute inset-0 -z-10 mix-blend-overlay opacity-40">
      <img src={heroImg} alt="" className="h-full w-full object-cover" />
    </div>

    <div className="container relative pt-36 pb-28 md:pt-44 md:pb-40">
      <div className="max-w-3xl animate-float-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-primary/30 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
          New monthly draw · ends 31st
        </div>

        <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05] font-semibold text-balance">
          Play your scores.{" "}
          <span className="gold-shimmer">Change a life.</span>{" "}
          Maybe win it all.
        </h1>

        <p className="mt-6 max-w-xl text-lg md:text-xl text-primary-foreground/85 text-balance">
          A subscription, your last 5 Stableford scores, and a charity you love.
          Every month, our draw turns those numbers into prize money — and a slice
          of every rupee goes straight to good.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/pricing"
            className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-medium text-primary shadow-gold hover:scale-[1.02] transition"
          >
            Start from {formatINR(499)}/mo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-7 py-3.5 text-sm font-medium hover:bg-primary-foreground/5 transition"
          >
            See how it works
          </Link>
        </div>

        <dl className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-xl">
          <div>
            <dt className="text-xs uppercase tracking-widest text-gold/80">Min to charity</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">10%</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-gold/80">To prize pool</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">40%</dd>
          </div>
          <div className="hidden sm:block">
            <dt className="text-xs uppercase tracking-widest text-gold/80">Charity partners</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">6+</dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="container relative">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary-foreground/10 rounded-2xl overflow-hidden border border-primary-foreground/10 mb-[-3rem] relative z-10 backdrop-blur-sm">
        {[
          { icon: Heart, t: "Charity-first", d: "10–100% of every rupee goes to your chosen cause." },
          { icon: Trophy, t: "Real prizes", d: "5, 4 and 3-number tiers — jackpot rolls over." },
          { icon: ShieldCheck, t: "Verified winners", d: "Score proof reviewed before every payout." },
        ].map((f) => (
          <div key={f.t} className="bg-primary/60 p-6 flex items-start gap-4">
            <f.icon className="h-5 w-5 text-gold shrink-0 mt-1" />
            <div>
              <div className="font-medium text-primary-foreground">{f.t}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{f.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
