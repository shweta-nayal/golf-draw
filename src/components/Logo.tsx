import logo from "@/assets/dh-logo.png";

export const Logo = ({ className = "h-9 w-9" }: { className?: string }) => (
  <img src={logo} alt="Digital Heroes" className={className} />
);

export const Wordmark = ({ light = false }: { light?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <Logo className="h-9 w-9" />
    <span className={`font-serif text-xl font-semibold leading-none ${light ? "text-primary-foreground" : "text-primary"}`}>
      Digital <span className="text-gold">Heroes</span>
    </span>
  </div>
);
