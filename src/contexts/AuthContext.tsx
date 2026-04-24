import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  hasActiveSub: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasActiveSub, setHasActiveSub] = useState(false);

  const fetchExtras = async (uid: string | null) => {
    if (!uid) {
      setIsAdmin(false);
      setHasActiveSub(false);
      return;
    }
    const [{ data: roles }, { data: subs }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase
        .from("subscriptions")
        .select("status,renews_at")
        .eq("user_id", uid)
        .eq("status", "active")
        .order("renews_at", { ascending: false })
        .limit(1),
    ]);
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    setHasActiveSub(!!subs && subs.length > 0 && new Date(subs[0].renews_at) > new Date());
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      // Defer Supabase calls
      setTimeout(() => fetchExtras(sess?.user?.id ?? null), 0);
    });
    // Then check current session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      fetchExtras(sess?.user?.id ?? null).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    await fetchExtras(user?.id ?? null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ session, user, loading, isAdmin, hasActiveSub, refresh, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
