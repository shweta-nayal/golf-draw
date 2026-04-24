import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatINR, PLAN_PRICES } from "@/lib/pricing";
import { toast } from "sonner";
import { Heart, Lock, Loader2, ShieldCheck, CreditCard } from "lucide-react";

type Charity = { id: string; name: string; tagline: string | null; image_url: string | null };

const Checkout = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const plan = (params.get("plan") === "yearly" ? "yearly" : "monthly") as "monthly" | "yearly";
  const { user, loading, refresh } = useAuth();

  const [charities, setCharities] = useState<Charity[]>([]);
  const [charityId, setCharityId] = useState<string>("");
  const [percent, setPercent] = useState(10);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12 / 28");
  const [cvc, setCvc] = useState("123");
  const [busy, setBusy] = useState(false);

  const price = PLAN_PRICES[plan];
  const toCharity = Math.round((price * percent) / 100);
  const toPool = Math.round(price * 0.4);
  const toPlatform = price - toCharity - toPool;

  useEffect(() => {
    supabase
      .from("charities")
      .select("id,name,tagline,image_url")
      .order("featured", { ascending: false })
      .then(({ data }) => {
        setCharities(data ?? []);
        if (data?.[0]) setCharityId(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!loading && !user) nav(`/auth?mode=signup`);
  }, [loading, user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !charityId) return;
    setBusy(true);
    try {
      const renews = new Date();
      renews.setMonth(renews.getMonth() + (plan === "yearly" ? 12 : 1));

      // Mock payment latency
      await new Promise((r) => setTimeout(r, 900));

      const { error: subErr } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan,
        amount_inr: price,
        charity_id: charityId,
        charity_percent: percent,
        renews_at: renews.toISOString(),
        status: "active",
      });
      if (subErr) throw subErr;

      const { error: profErr } = await supabase
        .from("profiles")
        .update({ charity_id: charityId, charity_percent: percent })
        .eq("id", user.id);
      if (profErr) throw profErr;

      await refresh();
      toast.success("Subscription active!", { description: `${formatINR(toCharity)} pledged to your charity.` });
      nav("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="container py-16 max-w-5xl">
        <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Checkout · {plan} plan</div>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold">Activate your subscription</h1>
        <p className="mt-2 text-muted-foreground">This is a demo checkout — no real card is charged.</p>

        <form onSubmit={submit} className="mt-10 grid lg:grid-cols-5 gap-8">
          {/* LEFT — form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Charity */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-gold" />
                <h2 className="font-serif text-xl font-semibold">Choose your charity</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">A minimum 10% of your subscription goes to this charity. Increase it any time.</p>

              <div className="grid sm:grid-cols-2 gap-3">
                {charities.map((c) => (
                  <label key={c.id} className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${charityId === c.id ? "border-gold bg-gold/5" : "border-border hover:border-primary/40"}`}>
                    <input type="radio" name="ch" className="sr-only" checked={charityId === c.id} onChange={() => setCharityId(c.id)} />
                    {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover shrink-0" />}
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{c.tagline}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Charity contribution</label>
                  <span className="font-serif text-lg">{percent}%</span>
                </div>
                <input
                  type="range" min={10} max={100} step={5}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="w-full accent-[hsl(var(--gold))]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>10% min</span><span>100%</span>
                </div>
              </div>
            </section>

            {/* Mock card */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-gold" />
                <h2 className="font-serif text-xl font-semibold">Payment details</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Test card pre-filled. Click confirm to simulate payment.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Card number</label>
                  <input value={card} onChange={(e) => setCard(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Expiry</label>
                    <input value={exp} onChange={(e) => setExp(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">CVC</label>
                    <input value={cvc} onChange={(e) => setCvc(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-mono" />
                  </div>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Demo only · no real charge
              </div>
            </section>
          </div>

          {/* RIGHT — summary */}
          <aside className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-elegant sticky top-24">
              <div className="text-xs uppercase tracking-widest text-gold">Order summary</div>
              <div className="mt-3 font-serif text-4xl font-semibold">{formatINR(price)}</div>
              <div className="text-xs text-primary-foreground/70 capitalize">{plan} plan · auto-renews</div>

              <div className="mt-6 space-y-2 text-sm">
                <Row label="Plan" value={formatINR(price)} />
                <Row label={`To your charity (${percent}%)`} value={`+ ${formatINR(toCharity)}`} highlight />
                <Row label="To prize pool (40%)" value={`+ ${formatINR(toPool)}`} />
                <Row label="Platform & ops" value={`+ ${formatINR(toPlatform)}`} />
              </div>

              <button
                type="submit"
                disabled={busy || !charityId}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient text-primary py-3.5 text-sm font-medium shadow-gold hover:opacity-95 transition disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm payment · {formatINR(price)}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary-foreground/60">
                <ShieldCheck className="h-3.5 w-3.5" /> Cancel anytime · no hidden fees
              </div>
            </div>
          </aside>
        </form>
      </section>
      <Footer />
    </main>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-primary-foreground/70">{label}</span>
    <span className={highlight ? "text-gold font-medium" : ""}>{value}</span>
  </div>
);

export default Checkout;
