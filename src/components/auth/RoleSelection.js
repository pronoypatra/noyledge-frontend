import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "./RoleSelection.css";
import "../../App.css";

const RoleSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateAuth } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get user data from URL params (for CAS) or localStorage (for Google)
    const dataParam = searchParams.get("data");
    const storedData = localStorage.getItem("oauthUserData");

    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setUserData(decoded);
        localStorage.setItem("oauthUserData", JSON.stringify(decoded));
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Invalid user data. Please try logging in again.");
      }
    } else if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (err) {
        console.error("Error parsing stored user data:", err);
        setError("Invalid user data. Please try logging in again.");
      }
    } else {
      setError("No user data found. Please try logging in again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (!userData) {
      setError("User data is missing. Please try logging in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      
      if (userData.provider === "google") {
        // Complete Google login with role
        response = await api.post("/auth/google", {
          googleId: userData.googleId,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar || "",
          role: selectedRole,
        });
      } else if (userData.provider === "cas") {
        // Complete CAS login with role
        response = await api.post("/auth/cas", {
          casId: userData.casId,
          email: userData.email,
          name: userData.name,
          role: selectedRole,
        });
      } else {
        throw new Error("Unknown authentication provider");
      }

      if (response.data && response.data.token) {
        // Clear stored OAuth data
        localStorage.removeItem("oauthUserData");
        
        // Update auth context and navigate
        updateAuth(response.data, response.data.token);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error completing login:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!userData && !error) {
    return (
      <div className="role-selection-container">
        <div className="role-selection-form">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="role-selection-container">
      <div className="role-selection-form">
        <h2 className="role-selection-title">Select Your Role</h2>
        <p className="role-selection-subtitle">
          Welcome, {userData?.name}! Please select your role to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="role-options">
            <label className={`role-option ${selectedRole === "user" ? "selected" : ""}`}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={selectedRole === "user"}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              />
              <div className="role-option-content">
                <h3>User</h3>
                <p>Take quizzes, earn badges, and interact with the community</p>
              </div>
            </label>

            <label className={`role-option ${selectedRole === "admin" ? "selected" : ""}`}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={selectedRole === "admin"}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              />
              <div className="role-option-content">
                <h3>Admin</h3>
                <p>Create quizzes, manage content, and moderate the platform</p>
              </div>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn"
            disabled={loading || !selectedRole}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;

