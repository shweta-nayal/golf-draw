import { Heart, Ticket, Clock } from "lucide-react";
import { type Draw } from "@/data/draws";
import { Countdown } from "./Countdown";

export const DrawCard = ({ draw, onEnter }: { draw: Draw; onEnter: (d: Draw) => void }) => {
  const pct = Math.round((draw.ticketsSold / draw.ticketsTotal) * 100);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card-gradient border border-border shadow-soft hover:shadow-elegant transition-all duration-500">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={draw.image}
          alt={draw.prize}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/60 via-transparent to-transparent" style={{ background: "linear-gradient(to top, hsl(var(--emerald-deep) / 0.7), transparent 60%)" }} />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-medium text-primary shadow-gold">
          <Heart className="h-3 w-3" /> {draw.causePercent}% to cause
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="text-xs uppercase tracking-widest text-gold font-medium">{draw.causeShort}</div>
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-foreground">{draw.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{draw.cause}</p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Per ticket</div>
            <div className="font-serif text-3xl font-semibold text-foreground">£{draw.ticketPrice}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground justify-end">
              <Clock className="h-3 w-3" /> Ends in
            </div>
            <Countdown endsAt={draw.endsAt} />
          </div>
        </div>

        <div className="mt-5">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gold-gradient transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{draw.ticketsSold.toLocaleString()} sold</span>
            <span>{draw.ticketsTotal.toLocaleString()} total</span>
          </div>
        </div>

        <button
          onClick={() => onEnter(draw)}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary-glow transition-colors"
        >
          <Ticket className="h-4 w-4" /> Enter this draw
        </button>
      </div>
    </article>
  );
};
