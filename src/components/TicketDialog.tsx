import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Draw } from "@/data/draws";
import { Heart, Minus, Plus, Ticket, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const TicketDialog = ({
  draw,
  open,
  onOpenChange,
}: {
  draw: Draw | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [qty, setQty] = useState(5);
  const total = useMemo(() => (draw ? qty * draw.ticketPrice : 0), [qty, draw]);
  const toCause = Math.round((total * (draw?.causePercent ?? 0)) / 100);

  if (!draw) return null;

  const presets = [1, 5, 10, 25, 50];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          <img src={draw.image} alt={draw.prize} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(var(--emerald-deep) / 0.85), hsl(var(--emerald-deep) / 0.1))" }} />
          <div className="absolute bottom-4 left-6 right-6 text-primary-foreground">
            <div className="text-[11px] uppercase tracking-widest text-gold">{draw.causeShort}</div>
            <h3 className="font-serif text-2xl font-semibold mt-1">{draw.title}</h3>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="text-left mb-4">
            <DialogTitle className="font-serif text-xl">Choose your tickets</DialogTitle>
            <DialogDescription>
              £{draw.ticketPrice} per ticket · {draw.causePercent}% donated to {draw.causeShort.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 mb-5">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setQty(p)}
                className={`rounded-full px-4 py-1.5 text-sm border transition ${
                  qty === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {p} {p === 1 ? "ticket" : "tickets"}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Ticket className="h-5 w-5 text-gold" />
              <div>
                <div className="text-sm font-medium">Tickets</div>
                <div className="text-xs text-muted-foreground">£{draw.ticketPrice} each</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 grid place-items-center rounded-full border border-border hover:bg-muted">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-serif text-lg w-8 text-center tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-8 w-8 grid place-items-center rounded-full border border-border hover:bg-muted">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-secondary p-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">£{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-gold" /> Goes to charity</span>
              <span className="font-medium text-primary">£{toCause.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => {
              toast.success(`${qty} ticket${qty > 1 ? "s" : ""} reserved!`, {
                description: `£${toCause} will support ${draw.causeShort.toLowerCase()}.`,
              });
              onOpenChange(false);
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient text-primary py-3.5 text-sm font-medium shadow-gold hover:opacity-95 transition"
          >
            Confirm entry · £{total.toLocaleString()}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout · audited by Grant Thornton
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
