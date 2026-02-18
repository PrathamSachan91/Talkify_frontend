import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Requires the user to be logged in.
 * Unauthenticated → /login
 * Still initializing → null (Static shows its loader)
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, initialized } = useSelector((s) => s.auth);

  if (!initialized) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { isAuthenticated, initialized, user } = useSelector((s) => s.auth);

  if (!initialized) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return user?.user_type === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export const PublicRoute = () => {
  const { isAuthenticated, initialized } = useSelector((s) => s.auth);

  if (!initialized) return null;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};