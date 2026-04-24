import { useState } from "react";
import { draws, type Draw } from "@/data/draws";
import { DrawCard } from "./DrawCard";
import { TicketDialog } from "./TicketDialog";

export const Draws = () => {
  const [active, setActive] = useState<Draw | null>(null);

  return (
    <section id="draws" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Live draws</div>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
              Pick a prize. <span className="text-primary-glow italic">Power a cause.</span>
            </h2>
          </div>
          <a href="#how" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
            How draws work →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {draws.map((d) => (
            <DrawCard key={d.id} draw={d} onEnter={(x) => setActive(x)} />
          ))}
        </div>
      </div>

      <TicketDialog draw={active} open={!!active} onOpenChange={(v) => !v && setActive(null)} />
    </section>
  );
};
