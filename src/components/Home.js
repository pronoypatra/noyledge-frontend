import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { auth, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (!loading && auth.user && auth.token) {
      navigate("/dashboard");
    }
  }, [auth, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="home-container">
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      </div>
    );
  }

  // Don't show home page if user is logged in (will redirect)
  if (auth.user && auth.token) {
    return null;
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Quiz App</h1>
      <p className="home-subtitle">Welcome to the ultimate quiz platform!</p>
      <div className="home-buttons">
        <Link to="/login"><button className="btn">Login</button></Link>
        <Link to="/register"><button className="btn">Register</button></Link>
      </div>
    </div>
  );
};

export default Home;
