import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me").then(res => {
      // Redirecting based on the role of the user
      navigate(`/dashboard/${res.data.role}`);
    });
  }, [navigate]); // Add navigate as a dependency to avoid the warning

  return <div>Redirecting to dashboard...</div>;
};

export default Dashboard;
