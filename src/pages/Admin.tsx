import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatINR, PRIZE_POOL_SHARE, TIER_SHARE } from "@/lib/pricing";
import { algorithmicDraw, computeMatches, randomDraw, type EntryWithUser } from "@/lib/drawEngine";
import { toast } from "sonner";
import {
  BarChart3, Users, Heart, Trophy, Sparkles, Play, CheckCircle2, XCircle,
  Plus, Pencil, Trash2, Loader2, Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = "overview" | "users" | "charities" | "draws" | "winners";

const Admin = () => {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="container py-10">
        <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Admin panel</div>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Mission control</h1>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-8">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="charities"><Heart className="h-4 w-4 mr-2" />Charities</TabsTrigger>
            <TabsTrigger value="draws"><Sparkles className="h-4 w-4 mr-2" />Draws</TabsTrigger>
            <TabsTrigger value="winners"><Trophy className="h-4 w-4 mr-2" />Winners</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6"><Overview /></TabsContent>
          <TabsContent value="users" className="mt-6"><UsersPanel /></TabsContent>
          <TabsContent value="charities" className="mt-6"><CharitiesPanel /></TabsContent>
          <TabsContent value="draws" className="mt-6"><DrawsPanel /></TabsContent>
          <TabsContent value="winners" className="mt-6"><WinnersPanel /></TabsContent>
        </Tabs>
      </section>
      <Footer />
    </main>
  );
};

/* =========================================================== OVERVIEW */
const Overview = () => {
  const [stats, setStats] = useState({ users: 0, subs: 0, pool: 0, charity: 0, draws: 0, winners: 0 });
  useEffect(() => {
    (async () => {
      const [u, s, c, d, w] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("amount_inr,charity_percent,status").eq("status", "active"),
        supabase.from("charities").select("id", { count: "exact", head: true }),
        supabase.from("draws").select("id", { count: "exact", head: true }),
        supabase.from("winners").select("id", { count: "exact", head: true }),
      ]);
      const totalAmount = (s.data ?? []).reduce((sum, r) => sum + Number(r.amount_inr), 0);
      const totalCharity = (s.data ?? []).reduce((sum, r) => sum + (Number(r.amount_inr) * Number(r.charity_percent)) / 100, 0);
      void c;
      setStats({
        users: u.count ?? 0,
        subs: s.data?.length ?? 0,
        pool: totalAmount * PRIZE_POOL_SHARE,
        charity: totalCharity,
        draws: d.count ?? 0,
        winners: w.count ?? 0,
      });
    })();
  }, []);

  const items = [
    { l: "Total users", v: stats.users, icon: <Users className="h-4 w-4" /> },
    { l: "Active subscriptions", v: stats.subs, icon: <Sparkles className="h-4 w-4" /> },
    { l: "Current prize pool", v: formatINR(stats.pool), icon: <Trophy className="h-4 w-4" /> },
    { l: "Pledged to charity", v: formatINR(stats.charity), icon: <Heart className="h-4 w-4" /> },
    { l: "Draws run", v: stats.draws, icon: <BarChart3 className="h-4 w-4" /> },
    { l: "Winners", v: stats.winners, icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((i) => (
        <div key={i.l} className="rounded-2xl border border-border bg-card-gradient p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">{i.icon}{i.l}</div>
          <div className="mt-3 font-serif text-3xl font-semibold">{i.v}</div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================== USERS */
const UsersPanel = () => {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id,full_name,email,charity_percent,charities(name),subscriptions(plan,status,renews_at,amount_inr)")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="text-left p-4">User</th><th className="text-left p-4">Charity</th><th className="text-left p-4">Plan</th><th className="text-left p-4">Status</th><th className="text-right p-4">Amount</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">No users yet.</td></tr>}
          {rows.map((r) => {
            const sub = r.subscriptions?.[0];
            return (
              <tr key={r.id} className="border-t border-border">
                <td className="p-4">
                  <div className="font-medium">{r.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </td>
                <td className="p-4">{r.charities?.name ?? "—"} <span className="text-xs text-muted-foreground">({r.charity_percent}%)</span></td>
                <td className="p-4 capitalize">{sub?.plan ?? "—"}</td>
                <td className="p-4 capitalize">{sub?.status ?? "inactive"}</td>
                <td className="p-4 text-right">{sub ? formatINR(Number(sub.amount_inr)) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* =========================================================== CHARITIES */
const CharitiesPanel = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", tagline: "", description: "", category: "", image_url: "", upcoming_event: "", featured: false });

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from("charities").select("*").order("name");
    setRows(data ?? []);
  };
  const startEdit = (r: any | null) => {
    setEditing(r);
    setForm(r ? { ...r, tagline: r.tagline ?? "", description: r.description ?? "", category: r.category ?? "", image_url: r.image_url ?? "", upcoming_event: r.upcoming_event ?? "", featured: !!r.featured } : { name: "", tagline: "", description: "", category: "", image_url: "", upcoming_event: "", featured: false });
  };
  const save = async () => {
    if (!form.name) return toast.error("Name required");
    if (editing) {
      const { error } = await supabase.from("charities").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Charity updated");
    } else {
      const { error } = await supabase.from("charities").insert(form);
      if (error) return toast.error(error.message);
      toast.success("Charity added");
    }
    setEditing(null); load();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("charities").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Charity deleted"); load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold">All charities ({rows.length})</h3>
          <button onClick={() => startEdit(null)} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary-glow">
            <Plus className="h-4 w-4" /> New charity
          </button>
        </div>
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {r.image_url && <img src={r.image_url} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name} {r.featured && <span className="ml-1 text-[10px] uppercase text-gold">Featured</span>}</div>
                <div className="text-xs text-muted-foreground truncate">{r.tagline}</div>
              </div>
              <button onClick={() => startEdit(r)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => remove(r.id)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      </div>

      <aside className="rounded-2xl border border-border bg-card p-5 space-y-3 h-fit sticky top-24">
        <h3 className="font-serif text-lg font-semibold">{editing ? "Edit charity" : "New charity"}</h3>
        {[
          ["name", "Name"], ["tagline", "Tagline"], ["category", "Category"],
          ["image_url", "Image URL"], ["upcoming_event", "Upcoming event"],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</label>
            <input value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
        ))}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
        </label>
        <button onClick={save} className="w-full rounded-full bg-primary text-primary-foreground py-2 text-sm hover:bg-primary-glow">{editing ? "Save changes" : "Add charity"}</button>
        {editing && <button onClick={() => setEditing(null)} className="w-full text-xs text-muted-foreground hover:text-primary">Cancel</button>}
      </aside>
    </div>
  );
};

/* =========================================================== DRAWS */
const DrawsPanel = () => {
  const [draws, setDraws] = useState<any[]>([]);
  const [logic, setLogic] = useState<"random" | "algorithmic">("random");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ winning: number[]; matches: any; pool: number } | null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from("draws").select("*,winners(id,tier,prize_inr,user_id)").order("draw_month", { ascending: false });
    setDraws(data ?? []);
  };

  const simulate = async () => {
    setBusy(true);
    try {
      // Pull active subscriptions for pool calc
      const { data: subs } = await supabase.from("subscriptions").select("amount_inr").eq("status", "active");
      const baseAmount = (subs ?? []).reduce((s, r) => s + Number(r.amount_inr), 0);

      // Fetch all users' last 5 scores
      const { data: scoresAll } = await supabase.from("scores").select("user_id,score,played_on").order("played_on", { ascending: false });
      const byUser = new Map<string, number[]>();
      for (const s of scoresAll ?? []) {
        const arr = byUser.get(s.user_id) ?? [];
        if (arr.length < 5) arr.push(s.score);
        byUser.set(s.user_id, arr);
      }
      const entries: EntryWithUser[] = [...byUser.entries()].map(([user_id, numbers]) => ({ user_id, numbers }));
      const allScoresFlat = (scoresAll ?? []).map((s) => s.score);
      const winning = logic === "random" ? randomDraw() : algorithmicDraw(allScoresFlat);
      const matches = computeMatches(winning, entries);
      const pool = baseAmount * PRIZE_POOL_SHARE;
      // Add rolled-over jackpot from previous unpublished
      const lastJackpotRollover = (draws.find((d) => d.is_published)?.rollover_out_inr ?? 0);
      setPreview({ winning, matches, pool: pool + Number(lastJackpotRollover) });
      toast.success("Simulation ready", { description: `Winning numbers: ${winning.join(" · ")}` });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      const month = new Date(); month.setDate(1);
      const drawMonth = month.toISOString().slice(0, 10);

      const { winning, matches, pool } = preview;
      const tier5Pool = pool * TIER_SHARE.match_5;
      const tier4Pool = pool * TIER_SHARE.match_4;
      const tier3Pool = pool * TIER_SHARE.match_3;
      const rolloverOut = matches.match_5.length === 0 ? tier5Pool : 0;

      const { data: drawRow, error: dErr } = await supabase.from("draws").insert({
        draw_month: drawMonth,
        logic,
        winning_numbers: winning,
        pool_total_inr: pool,
        rollover_out_inr: rolloverOut,
        is_published: true,
        is_simulation: false,
        published_at: new Date().toISOString(),
      }).select().single();
      if (dErr) throw dErr;

      const winners: any[] = [];
      const splitOrSkip = (users: string[], poolAmount: number, tier: "match_5" | "match_4" | "match_3", matched: number) => {
        if (users.length === 0 || poolAmount === 0) return;
        const each = Math.floor(poolAmount / users.length);
        users.forEach((uid) => winners.push({
          draw_id: drawRow.id, user_id: uid, tier, matched_count: matched,
          prize_inr: each, payout_status: "pending", verification_status: "pending",
        }));
      };
      splitOrSkip(matches.match_5, tier5Pool, "match_5", 5);
      splitOrSkip(matches.match_4, tier4Pool, "match_4", 4);
      splitOrSkip(matches.match_3, tier3Pool, "match_3", 3);

      if (winners.length) {
        const { error: wErr } = await supabase.from("winners").insert(winners);
        if (wErr) throw wErr;
      }

      toast.success(`Draw published — ${winners.length} winners across all tiers`);
      setPreview(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 h-fit">
        <h3 className="font-serif text-xl font-semibold mb-1">Run a draw</h3>
        <p className="text-sm text-muted-foreground mb-4">Simulate first to preview. Publishing creates winners.</p>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Draw logic</label>
            <select value={logic} onChange={(e) => setLogic(e.target.value as any)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="random">Random — true lottery</option>
              <option value="algorithmic">Algorithmic — weighted by user scores</option>
            </select>
          </div>
          <button onClick={simulate} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm hover:bg-muted disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />} Simulate
          </button>
          <button onClick={publish} disabled={!preview || busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient text-primary py-2.5 text-sm font-medium shadow-gold disabled:opacity-50">
            <Play className="h-4 w-4" /> Publish results
          </button>
        </div>

        {preview && (
          <div className="mt-6 rounded-xl bg-secondary p-4 text-sm space-y-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Preview</div>
            <div className="font-mono text-base text-primary font-medium">{preview.winning.join(" · ")}</div>
            <div className="text-xs text-muted-foreground">Pool: {formatINR(preview.pool)}</div>
            <div className="text-xs">5-match: {preview.matches.match_5.length} · 4-match: {preview.matches.match_4.length} · 3-match: {preview.matches.match_3.length}</div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h3 className="font-serif text-xl font-semibold">Draw history</h3>
        {draws.length === 0 ? (
          <div className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-12 text-center">No draws yet.</div>
        ) : draws.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs uppercase tracking-widest text-gold">{d.is_published ? "Published" : "Draft"} · {d.logic}</div>
                <div className="font-serif text-xl font-semibold mt-1">{new Date(d.draw_month).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-primary">{(d.winning_numbers ?? []).join(" · ")}</div>
                <div className="text-xs text-muted-foreground">Pool {formatINR(Number(d.pool_total_inr))}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{d.winners?.length ?? 0} winners · Rollover out: {formatINR(Number(d.rollover_out_inr))}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================== WINNERS */
const WinnersPanel = () => {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from("winners")
      .select("*,profile:profiles(full_name,email),draw:draws(draw_month)")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("winners").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated"); load();
  };

  return (
    <div className="space-y-3">
      {rows.length === 0 && <div className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-12 text-center">No winners yet.</div>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-border bg-card p-5 grid lg:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="font-medium">{r.profile?.full_name || r.profile?.email || "Unknown"}</div>
            <div className="text-xs text-muted-foreground">
              {r.tier.replace("_", " ")} · {r.draw ? new Date(r.draw.draw_month).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : ""} · {formatINR(Number(r.prize_inr))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Proof: {r.proof_url ? <a href={r.proof_url} className="text-primary underline">view</a> : "not uploaded"} · Verification: <span className="capitalize">{r.verification_status}</span> · Payout: <span className="capitalize">{r.payout_status}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => update(r.id, { verification_status: "approved" })} className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success border border-success/30 px-3 py-1.5 text-xs">
              <CheckCircle2 className="h-3 w-3" /> Approve
            </button>
            <button onClick={() => update(r.id, { verification_status: "rejected" })} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30 px-3 py-1.5 text-xs">
              <XCircle className="h-3 w-3" /> Reject
            </button>
            <button onClick={() => update(r.id, { payout_status: "paid" })} className="inline-flex items-center gap-1 rounded-full bg-gold-gradient text-primary px-3 py-1.5 text-xs font-medium">
              Mark paid
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;
