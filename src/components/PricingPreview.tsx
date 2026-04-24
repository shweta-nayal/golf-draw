import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatINR, PLAN_PRICES } from "@/lib/pricing";

const features = [
  "Last-5-scores draw entry every month",
  "Match 3, 4 or 5 prize tiers",
  "Choose your charity (min. 10%)",
  "Winnings dashboard & payout tracking",
  "Independent winner verification",
];

export const PricingPreview = () => {
  const nav = useNavigate();
  return (
    <section className="bg-secondary/40 pt-12 md:pt-16 pb-24 md:pb-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Plans</div>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
            Two plans. <span className="text-primary-glow italic">One mission.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Cancel any time. All plans include the same access — choose the cadence you like.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {(["monthly", "yearly"] as const).map((plan) => {
            const price = PLAN_PRICES[plan];
            const isYearly = plan === "yearly";
            return (
              <article key={plan} className={`relative rounded-2xl border p-8 transition-all ${isYearly ? "border-gold/50 bg-card-gradient shadow-elegant" : "border-border bg-card"}`}>
                {isYearly && (
                  <div className="absolute -top-3 right-6 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-medium text-primary shadow-gold">
                    Save {formatINR(PLAN_PRICES.monthly * 12 - PLAN_PRICES.yearly)}
                  </div>
                )}
                <div className="text-xs uppercase tracking-widest text-gold font-medium">{plan}</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-semibold">{formatINR(price)}</span>
                  <span className="text-muted-foreground text-sm">/ {isYearly ? "year" : "month"}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => nav(`/checkout?plan=${plan}`)}
                  className={`mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium transition ${
                    isYearly ? "bg-gold-gradient text-primary shadow-gold hover:opacity-95" : "bg-primary text-primary-foreground hover:bg-primary-glow"
                  }`}
                >
                  Choose {plan}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
