import { Wordmark } from "./Logo";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground/70 py-16 border-t border-primary-foreground/10">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <Wordmark light />
          <p className="mt-4 text-sm max-w-xs">
            A new kind of platform — golf, charity, and a chance to win.
            Built to feel modern, designed to do good.
          </p>
        </div>
        <div>
          <h4 className="text-primary-foreground font-medium mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/how-it-works" className="hover:text-gold transition">How it works</Link></li>
            <li><Link to="/charities" className="hover:text-gold transition">Charities</Link></li>
            <li><Link to="/pricing" className="hover:text-gold transition">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-gold transition">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary-foreground font-medium mb-4">Trust</h4>
          <ul className="space-y-2 text-sm">
            <li>Independently verified winners</li>
            <li>Transparent monthly draws</li>
            <li>Charity partners reviewed annually</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} Digital Heroes. All rights reserved.</p>
        <p>Play responsibly · 18+</p>
      </div>
    </div>
  </footer>
);
