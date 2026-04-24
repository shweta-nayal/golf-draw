import { Link, useNavigate } from "react-router-dom";
import { Wordmark } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export const Header = ({ light = false }: { light?: boolean }) => {
  const { user, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  const linkClass = light
    ? "hover:text-gold transition-colors text-primary-foreground/85"
    : "hover:text-primary transition-colors text-foreground/75";

  return (
    <header className={`${light ? "absolute top-0 inset-x-0 z-30" : "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur"}`}>
      <div className="container flex items-center justify-between py-4 md:py-5">
        <Link to="/"><Wordmark light={light} /></Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/charities" className={linkClass}>Charities</Link>
          <Link to="/how-it-works" className={linkClass}>How it works</Link>
          <Link to="/pricing" className={linkClass}>Pricing</Link>
          {user && <Link to="/dashboard" className={linkClass}>Dashboard</Link>}
          {isAdmin && <Link to="/admin" className={linkClass}>Admin</Link>}
        </nav>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border ${light ? "border-primary-foreground/20 text-primary-foreground" : "border-border text-foreground"} hover:bg-foreground/5 transition`}>
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => nav("/dashboard")}>Dashboard</DropdownMenuItem>
              {isAdmin && <DropdownMenuItem onClick={() => nav("/admin")}>Admin panel</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => { await signOut(); nav("/"); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => nav("/auth")} className={light ? "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : ""}>
              Sign in
            </Button>
            <Button onClick={() => nav("/pricing")} className="bg-gold-gradient text-primary hover:opacity-95 shadow-gold rounded-full">
              Subscribe
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
