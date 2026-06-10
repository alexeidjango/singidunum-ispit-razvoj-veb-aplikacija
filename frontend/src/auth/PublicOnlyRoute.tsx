import { Navigate, Outlet } from "react-router";
import { useAuth } from "./useAuth";

export const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
