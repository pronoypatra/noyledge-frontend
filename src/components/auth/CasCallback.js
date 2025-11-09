import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";

const CasCallback = () => {
  const [searchParams] = useSearchParams();
  const { updateAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      console.error("CAS authentication error:", error);
      navigate("/login?error=cas_error");
      return;
    }

    if (token) {
      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        // Fetch full user data from backend
        api.get(`/profile/${payload.userId}`)
          .then((response) => {
            const userData = response.data.user;
            updateAuth(userData, token);
            navigate("/dashboard");
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            // Still try to use token if user fetch fails
            const userData = {
              _id: payload.userId,
              role: payload.role,
            };
            updateAuth(userData, token);
            navigate("/dashboard");
          });
      } catch (error) {
        console.error("Error processing CAS token:", error);
        navigate("/login?error=cas_token_error");
      }
    } else {
      navigate("/login?error=cas_no_token");
    }
  }, [searchParams, updateAuth, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Completing CAS authentication...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default CasCallback;

