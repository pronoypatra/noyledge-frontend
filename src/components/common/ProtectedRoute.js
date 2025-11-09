import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { auth, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!auth.token || !auth.user) {
    return <Navigate to="/login" />;
  }

  // Check role if required
  if (role && auth.user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
