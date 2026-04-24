import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({
  children,
  requireSub = false,
  requireAdmin = false,
}: {
  children: JSX.Element;
  requireSub?: boolean;
  requireAdmin?: boolean;
}) => {
  const { user, loading, isAdmin, hasActiveSub } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (requireSub && !hasActiveSub && !isAdmin) return <Navigate to="/pricing" replace />;
  return children;
};
