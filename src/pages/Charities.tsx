import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, ArrowLeft, Calendar, Sparkles } from "lucide-react";

type Charity = {
  id: string; name: string; tagline: string | null; description: string | null;
  image_url: string | null; category: string | null; featured: boolean | null;
  upcoming_event: string | null;
};

export const Charities = () => {
  const [list, setList] = useState<Charity[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  useEffect(() => {
    supabase.from("charities").select("*").order("featured", { ascending: false }).then(({ data }) => setList(data ?? []));
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(list.map((c) => c.category).filter(Boolean) as string[]))], [list]);
  const filtered = list.filter((c) =>
    (cat === "All" || c.category === cat) &&
    (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || (c.tagline ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="container py-12">
        <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Charity directory</div>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold">Causes you can power</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Hand-picked partners across India. Pick one at signup or change yours any time from the dashboard.</p>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search charities…" className="w-full rounded-full border border-input bg-background pl-9 pr-4 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm border transition ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Link key={c.id} to={`/charities/${c.id}`} className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition">
              {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-widest text-gold">{c.category}</div>
                <h3 className="mt-1 font-serif text-xl font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                {c.upcoming_event && (
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-primary"><Calendar className="h-3 w-3" /> {c.upcoming_event}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export const CharityDetail = () => {
  const { id } = useParams();
  const [c, setC] = useState<Charity | null>(null);
  useEffect(() => {
    if (!id) return;
    supabase.from("charities").select("*").eq("id", id).maybeSingle().then(({ data }) => setC(data));
  }, [id]);

  if (!c) {
    return (
      <main className="min-h-screen bg-background"><Header />
        <div className="container py-32 text-center text-muted-foreground">Loading charity…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="container py-12 max-w-4xl">
        <Link to="/charities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-3.5 w-3.5" /> All charities</Link>
        {c.image_url && <img src={c.image_url} alt={c.name} className="aspect-[16/9] w-full rounded-2xl object-cover shadow-elegant" />}
        <div className="mt-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold"><Sparkles className="h-3 w-3" /> {c.category}</div>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl font-semibold">{c.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{c.tagline}</p>
          <p className="mt-6 leading-relaxed">{c.description}</p>
          {c.upcoming_event && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
              <Calendar className="h-4 w-4 text-gold" /> Upcoming: {c.upcoming_event}
            </div>
          )}
          <div className="mt-10">
            <Link to="/pricing" className="inline-flex rounded-full bg-gold-gradient text-primary px-6 py-3 text-sm font-medium shadow-gold">
              Subscribe & support {c.name}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};
