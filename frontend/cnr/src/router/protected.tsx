import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default ProtectedRoute;
