import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

type Charity = {
  id: string;
  name: string;
  tagline: string | null;
  image_url: string | null;
  category: string | null;
};

export const FeaturedCharities = () => {
  const [list, setList] = useState<Charity[]>([]);
  useEffect(() => {
    supabase
      .from("charities")
      .select("id,name,tagline,image_url,category")
      .eq("featured", true)
      .limit(3)
      .then(({ data }) => setList(data ?? []));
  }, []);

  return (
    <section className="bg-background pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Featured causes</div>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
              Pick a charity. <span className="text-primary-glow italic">Power their next chapter.</span>
            </h2>
          </div>
          <Link to="/charities" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1">
            See all charities <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((c) => (
            <article key={c.id} className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-soft hover:shadow-elegant transition-all duration-500">
              {c.image_url && (
                <img src={c.image_url} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(var(--emerald-deep) / 0.95) 0%, hsl(var(--emerald-deep) / 0.2) 55%, transparent 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">
                  <Sparkles className="h-3 w-3" /> {c.category}
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">{c.tagline}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
