import { winners, impactStats } from "@/data/draws";
import { Trophy, MapPin } from "lucide-react";

export const Winners = () => (
  <section id="winners" className="bg-background py-24 md:py-32">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Real winners</div>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
            Lives changed —{" "}
            <span className="text-primary-glow italic">on both sides.</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Behind every ticket is a winner and a cause. Here are some of the
            most recent moments we got to celebrate.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {impactStats.map((s) => (
              <div key={s.label} className="bg-card p-6">
                <dd className="font-serif text-3xl md:text-4xl font-semibold text-primary">{s.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <ul className="lg:col-span-7 space-y-3">
          {winners.map((w) => (
            <li
              key={w.name + w.date}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card-gradient p-5 hover:shadow-soft hover:border-gold/30 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-gold-gradient grid place-items-center text-primary shadow-gold shrink-0">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold truncate">{w.name}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">{w.date}</span>
                </div>
                <div className="text-sm text-foreground/80 truncate">Won <span className="font-medium">{w.prize}</span></div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {w.location}</span>
                  <span className="text-gold/80">· funded {w.cause}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
