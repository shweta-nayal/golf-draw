import { ArrowRight, Heart, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-draw.jpg";

export const Hero = () => (
  <section id="top" className="relative isolate overflow-hidden bg-hero-gradient text-primary-foreground">
    <div
      className="absolute inset-0 -z-10 opacity-60"
      style={{ backgroundImage: "var(--gradient-radial-gold)" }}
      aria-hidden
    />
    <div className="absolute inset-0 -z-10 mix-blend-overlay opacity-40">
      <img src={heroImg} alt="" className="h-full w-full object-cover" />
    </div>

    <div className="container relative pt-36 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-3xl animate-float-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-primary/30 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
          4 live draws · ends this week
        </div>

        <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05] font-semibold text-balance">
          Win extraordinary prizes.{" "}
          <span className="gold-shimmer">Change a life</span> doing it.
        </h1>

        <p className="mt-6 max-w-xl text-lg md:text-xl text-primary-foreground/80 text-balance">
          DrawForGood turns every ticket into hope. 75% of every entry goes
          directly to the cause behind the prize — verified, audited, public.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#draws"
            className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-medium text-primary shadow-gold hover:scale-[1.02] transition"
          >
            See live draws
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-7 py-3.5 text-sm font-medium hover:bg-primary-foreground/5 transition"
          >
            How it works
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-xl">
          <div>
            <dt className="text-xs uppercase tracking-widest text-gold/80">Raised</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">£12.4M</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-gold/80">Winners</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">1,920</dd>
          </div>
          <div className="hidden sm:block">
            <dt className="text-xs uppercase tracking-widest text-gold/80">Causes</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">284</dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="container relative">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary-foreground/10 rounded-2xl overflow-hidden border border-primary-foreground/10 mb-[-3rem] relative z-10 backdrop-blur-sm">
        {[
          { icon: ShieldCheck, t: "Independently audited", d: "All draws certified by Grant Thornton." },
          { icon: Heart, t: "75% goes to good", d: "Every ticket directly funds the cause." },
          { icon: ArrowRight, t: "Transparent winners", d: "Public draws, livestreamed and verified." },
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
