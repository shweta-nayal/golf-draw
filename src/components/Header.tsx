import { Sparkles } from "lucide-react";

export const Header = () => (
  <header className="absolute top-0 inset-x-0 z-30">
    <div className="container flex items-center justify-between py-6">
      <a href="#top" className="flex items-center gap-2 group">
        <div className="h-9 w-9 rounded-lg bg-gold-gradient grid place-items-center shadow-gold transition-transform group-hover:rotate-6">
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={2.4} />
        </div>
        <span className="font-serif text-xl font-semibold text-primary-foreground">
          Draw<span className="text-gold">ForGood</span>
        </span>
      </a>
      <nav className="hidden md:flex items-center gap-8 text-sm text-primary-foreground/80">
        <a href="#draws" className="hover:text-gold transition-colors">Live Draws</a>
        <a href="#causes" className="hover:text-gold transition-colors">Causes</a>
        <a href="#winners" className="hover:text-gold transition-colors">Winners</a>
        <a href="#how" className="hover:text-gold transition-colors">How it works</a>
      </nav>
      <a
        href="#draws"
        className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-primary shadow-gold hover:opacity-95 transition"
      >
        Enter a Draw
      </a>
    </div>
  </header>
);
