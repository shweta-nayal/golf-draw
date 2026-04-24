import causeEducation from "@/assets/cause-education.jpg";
import causeEnvironment from "@/assets/cause-environment.jpg";
import causeHealth from "@/assets/cause-health.jpg";
import causeWater from "@/assets/cause-water.jpg";

const causes = [
  { img: causeEducation, title: "Education", copy: "12,400 children back in classrooms across 9 countries." },
  { img: causeEnvironment, title: "Environment", copy: "320 hectares of rainforest protected and restored." },
  { img: causeHealth, title: "Healthcare", copy: "Mobile clinics reaching 60+ remote communities monthly." },
  { img: causeWater, title: "Clean water", copy: "48 wells built — clean water for 38,000 people." },
];

export const Causes = () => (
  <section id="causes" className="bg-background py-24 md:py-32">
    <div className="container">
      <div className="max-w-2xl mb-14">
        <div className="text-xs uppercase tracking-[0.22em] text-gold font-medium">Where the money goes</div>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-balance">
          Four pillars. <span className="text-primary-glow italic">Real impact.</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Every draw is paired with a verified charity partner. We publish the
          numbers — receipts, photos, lives changed — for every campaign.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {causes.map((c, i) => (
          <article
            key={c.title}
            className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-soft hover:shadow-elegant transition-all duration-500"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <img
              src={c.img}
              alt={c.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, hsl(var(--emerald-deep) / 0.92) 0%, hsl(var(--emerald-deep) / 0.2) 55%, transparent 100%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
              <div className="h-px w-10 bg-gold mb-4" />
              <h3 className="font-serif text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/80 leading-relaxed">{c.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
