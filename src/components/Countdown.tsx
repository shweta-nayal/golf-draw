import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s };
}

const Cell = ({ v, label }: { v: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="font-serif text-2xl md:text-3xl font-semibold tabular-nums text-foreground">
      {v.toString().padStart(2, "0")}
    </div>
    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{label}</div>
  </div>
);

export const Countdown = ({ endsAt }: { endsAt: string }) => {
  const target = new Date(endsAt);
  const [t, setT] = useState(diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <Cell v={t.d} label="Days" />
      <span className="text-muted-foreground/40">:</span>
      <Cell v={t.h} label="Hrs" />
      <span className="text-muted-foreground/40">:</span>
      <Cell v={t.m} label="Min" />
      <span className="text-muted-foreground/40">:</span>
      <Cell v={t.s} label="Sec" />
    </div>
  );
};
