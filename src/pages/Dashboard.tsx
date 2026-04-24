import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatINR } from "@/lib/pricing";
import { toast } from "sonner";
import {
  Calendar, Heart, Trophy, Plus, Pencil, Trash2, Sparkles, Loader2,
  CheckCircle2, Clock, Upload, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

type Score = { id: string; score: number; played_on: string };
type Sub = { id: string; plan: string; status: string; renews_at: string; amount_inr: number; charity_percent: number };
type Charity = { id: string; name: string; image_url: string | null };
type Win = {
  id: string; tier: string; matched_count: number; prize_inr: number;
  payout_status: string; verification_status: string; proof_url: string | null;
  draw: { draw_month: string; winning_numbers: number[] } | null;
};

const Dashboard = () => {
  const { user, hasActiveSub, refresh } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [sub, setSub] = useState<Sub | null>(null);
  const [charity, setCharity] = useState<Charity | null>(null);
  const [percent, setPercent] = useState(10);
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(true);

  // score form
  const [score, setScore] = useState<number>(20);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [editing, setEditing] = useState<Score | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: sc }, { data: subs }, { data: prof }, { data: w }] = await Promise.all([
      supabase.from("scores").select("*").eq("user_id", user.id).order("played_on", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).order("renews_at", { ascending: false }).limit(1),
      supabase.from("profiles").select("charity_id,charity_percent,charities(id,name,image_url)").eq("id", user.id).maybeSingle(),
      supabase.from("winners").select("*,draw:draws(draw_month,winning_numbers)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setScores(sc ?? []);
    setSub(subs?.[0] ?? null);
    if (prof) {
      setPercent(Number(prof.charity_percent ?? 10));
      // @ts-ignore — joined
      setCharity(prof.charities ?? null);
    }
    setWins((w as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (score < 1 || score > 45) return toast.error("Score must be between 1 and 45");
    setBusy(true);
    try {
      if (editing) {
        const { error } = await supabase.from("scores")
          .update({ score, played_on: date }).eq("id", editing.id);
        if (error) throw error;
        toast.success("Score updated");
      } else {
        const { error } = await supabase.from("scores").insert({
          user_id: user.id, score, played_on: date,
        });
        if (error) {
          if (error.code === "23505") throw new Error("You already entered a score for this date — edit it instead.");
          throw error;
        }
        toast.success("Score added");
      }
      setEditing(null);
      setScore(20);
      setDate(new Date().toISOString().slice(0, 10));
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  const removeScore = async (id: string) => {
    const { error } = await supabase.from("scores").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Score removed");
    load();
  };

  const updatePercent = async (next: number) => {
    if (!user) return;
    setPercent(next);
    await supabase.from("profiles").update({ charity_percent: next }).eq("id", user.id);
    if (sub) await supabase.from("subscriptions").update({ charity_percent: next }).eq("id", sub.id);
  };

  const uploadProof = async (winId: string) => {
    // Mock: just set proof_url and pending status
    const fakeUrl = `https://proof.example.com/${winId}.png`;
    const { error } = await supabase.from("winners").update({
      proof_url: fakeUrl,
      verification_status: "pending",
    }).eq("id", winId);
    if (error) return toast.error(error.message);
    toast.success("Proof uploaded — awaiting admin review");
    load();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background"><Header />
        <div className="container py-32 text-center text-muted-foreground">Loading your dashboard…</div>
      </main>
    );
  }

  const renews = sub ? new Date(sub.renews_at) : null;
  const daysLeft = renews ? Math.max(0, Math.ceil((renews.getTime() - Date.now()) / 86400000)) : 0;
  const totalWon = wins.reduce((s, w) => s + Number(w.prize_inr), 0);
  const pendingPayouts = wins.filter((w) => w.payout_status === "pending").length;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="container py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Your dashboard</div>
            <h1 className="mt-2 font-serif text-4xl font-semibold">Welcome, {user?.email?.split("@")[0]}</h1>
          </div>
          {!hasActiveSub && (
            <Link to="/pricing" className="inline-flex items-center gap-2 rounded-full bg-gold-gradient text-primary px-5 py-2.5 text-sm font-medium shadow-gold">
              <Sparkles className="h-4 w-4" /> Activate subscription
            </Link>
          )}
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Stat label="Subscription" value={sub ? sub.plan : "Inactive"} sub={sub ? `Renews in ${daysLeft}d` : "No active plan"} icon={<Calendar className="h-4 w-4" />} />
          <Stat label="Charity" value={charity?.name ?? "Not set"} sub={`${percent}% per payment`} icon={<Heart className="h-4 w-4" />} />
          <Stat label="Total won" value={formatINR(totalWon)} sub={`${wins.length} wins`} icon={<Trophy className="h-4 w-4" />} />
          <Stat label="Pending payouts" value={String(pendingPayouts)} sub="Verification + payout" icon={<Clock className="h-4 w-4" />} />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Scores */}
          <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-2xl font-semibold">Your scores</h2>
              <span className="text-xs text-muted-foreground">{scores.length}/5 stored · oldest auto-replaced</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5">One Stableford score per date (1–45). Your latest 5 are your draw entry.</p>

            <form onSubmit={submitScore} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mb-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Score (1–45)</label>
                <input type="number" min={1} max={45} required value={score} onChange={(e) => setScore(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Date</label>
                <input type="date" required value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <button disabled={busy} className="self-end inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary-glow disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editing ? "Save" : "Add"}
              </button>
            </form>

            {scores.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                No scores yet — add your first one above.
              </div>
            ) : (
              <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {scores.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 p-4 bg-card-gradient">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gold-gradient grid place-items-center text-primary shadow-gold font-serif text-lg font-semibold">
                        {s.score}
                      </div>
                      <div>
                        <div className="font-medium">{new Date(s.played_on).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        <div className="text-xs text-muted-foreground">Stableford</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(s); setScore(s.score); setDate(s.played_on); }} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => removeScore(s.id)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Charity */}
          <aside className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-semibold mb-1">Your charity</h2>
              <p className="text-sm text-muted-foreground mb-4">Adjust your contribution any time (10% min).</p>
              {charity ? (
                <div className="flex items-center gap-3 mb-4">
                  {charity.image_url && <img src={charity.image_url} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />}
                  <div className="font-medium">{charity.name}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground mb-4">No charity selected.</div>
              )}
              <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground mb-2">
                <span>Contribution</span><span className="text-foreground font-medium">{percent}%</span>
              </div>
              <input type="range" min={10} max={100} step={5} value={percent} onChange={(e) => updatePercent(Number(e.target.value))} className="w-full accent-[hsl(var(--gold))]" />
              <Link to="/charities" className="text-xs text-primary hover:underline mt-3 inline-block">Browse charities →</Link>
            </section>

            {/* Winnings */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Recent wins</h2>
              {wins.length === 0 ? (
                <p className="text-sm text-muted-foreground">No wins yet — keep entering scores to be in every monthly draw.</p>
              ) : (
                <ul className="space-y-3">
                  {wins.slice(0, 5).map((w) => (
                    <li key={w.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-baseline justify-between">
                        <div className="font-medium">{w.tier.replace("_", " ").replace("match", "Match")}</div>
                        <div className="font-serif text-lg font-semibold text-primary">{formatINR(Number(w.prize_inr))}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Draw {w.draw ? new Date(w.draw.draw_month).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : ""}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <Badge tone={w.verification_status === "approved" ? "success" : w.verification_status === "rejected" ? "destructive" : "warning"} icon={<CheckCircle2 className="h-3 w-3" />}>
                          Verification: {w.verification_status}
                        </Badge>
                        <Badge tone={w.payout_status === "paid" ? "success" : "warning"}>
                          Payout: {w.payout_status}
                        </Badge>
                      </div>
                      {!w.proof_url && (
                        <button onClick={() => uploadProof(w.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs rounded-full border border-border px-3 py-1.5 hover:bg-muted">
                          <Upload className="h-3 w-3" /> Upload score proof
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {!hasActiveSub && (
              <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>Your subscription is inactive. <Link to="/pricing" className="underline font-medium">Reactivate</Link> to enter the next monthly draw.</div>
              </div>
            )}
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
};

const Stat = ({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card-gradient p-5">
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">{icon}{label}</div>
    <div className="font-serif text-2xl font-semibold mt-2 capitalize truncate">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{sub}</div>
  </div>
);

const Badge = ({ children, tone, icon }: { children: React.ReactNode; tone: "success" | "warning" | "destructive"; icon?: React.ReactNode }) => {
  const cls = tone === "success" ? "bg-success/10 text-success border-success/30"
    : tone === "destructive" ? "bg-destructive/10 text-destructive border-destructive/30"
    : "bg-warning/10 text-warning-foreground border-warning/30";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 capitalize ${cls}`}>{icon}{children}</span>;
};

export default Dashboard;
