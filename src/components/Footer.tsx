import { Sparkles } from "lucide-react";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground/70 py-16 border-t border-primary-foreground/10">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gold-gradient grid place-items-center shadow-gold">
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={2.4} />
            </div>
            <span className="font-serif text-xl font-semibold text-primary-foreground">
              Draw<span className="text-gold">ForGood</span>
            </span>
          </div>
          <p className="mt-4 text-sm max-w-xs">
            A new kind of prize draw. Beautifully simple. Radically transparent.
            Built to give back.
          </p>
        </div>
        <div>
          <h4 className="text-primary-foreground font-medium mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#draws" className="hover:text-gold transition">Live draws</a></li>
            <li><a href="#causes" className="hover:text-gold transition">Causes</a></li>
            <li><a href="#winners" className="hover:text-gold transition">Past winners</a></li>
            <li><a href="#how" className="hover:text-gold transition">How it works</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary-foreground font-medium mb-4">Trust</h4>
          <ul className="space-y-2 text-sm">
            <li>Independently audited by Grant Thornton</li>
            <li>Registered with the UK Gambling Commission</li>
            <li>Charity partners verified annually</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} DrawForGood. All rights reserved.</p>
        <p>Play responsibly · 18+ · BeGambleAware.org</p>
      </div>
    </div>
  </footer>
);
