import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando sessão...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/main" replace />;
  }

  return children;
}

export default PrivateRoute;
