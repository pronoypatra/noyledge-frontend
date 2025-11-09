import React, { useState, useContext, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { API_BASE_URL } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";
import "../../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateAuth, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const casEnabled = process.env.REACT_APP_CAS_ENABLED === "true";

  // Redirect if already logged in
  useEffect(() => {
    if (auth.user && auth.token) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  // Handle CAS login redirect
  const handleCasLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/cas/login`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.token) {
        updateAuth(res.data, res.data.token);
        navigate("/dashboard");
      } else {
        alert("Login failed: Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          (err.code === 'ECONNREFUSED' ? "Cannot connect to server. Please ensure the backend server is running." : "Login failed");
      alert(`Login failed: ${errorMessage}`);
    }
  };

  const handleGoogleSignIn = useCallback(async (response) => {
    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split(".")[1]));
      
      const googleData = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture || "",
      };

      const res = await api.post("/auth/google", googleData);
      if (res.data.token) {
        updateAuth(res.data, res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed. Please try again.");
    }
  }, [updateAuth, navigate]);

  // Load Google OAuth script only if client ID is present
  useEffect(() => {
    if (!clientId) {
      return; // Don't load Google OAuth if no client ID
    }

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
          });

          const buttonContainer = document.getElementById("google-signin-button");
          if (buttonContainer) {
            buttonContainer.innerHTML = '';
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: "outline",
              size: "large",
              width: "100%",
            });
          }
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
        }
      }
    };

    // Check if script already loaded
    if (window.google && window.google.accounts && window.google.accounts.id) {
      initializeGoogleSignIn();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      if (window.google) {
        setTimeout(initializeGoogleSignIn, 100);
      } else {
        existingScript.addEventListener('load', initializeGoogleSignIn);
      }
      return;
    }

    // Load the script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(initializeGoogleSignIn, 100);
    };
    document.body.appendChild(script);
  }, [clientId, handleGoogleSignIn]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <input
          className="form-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">Login</button>

        {(clientId || casEnabled) && (
          <>
            <div className="divider">
              <span>OR</span>
            </div>
            {casEnabled && (
              <button
                type="button"
                className="btn btn-cas"
                onClick={handleCasLogin}
                style={{
                  width: "100%",
                  marginBottom: clientId ? "1rem" : "0",
                  backgroundColor: "#0066cc",
                  color: "white",
                  border: "none",
                }}
              >
                Login with CAS
              </button>
            )}
            {clientId && (
              <div id="google-signin-button" className="google-signin-container"></div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
