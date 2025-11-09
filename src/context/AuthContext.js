import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem("token"),
  });
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on app startup
  useEffect(() => {
    const restoreSession = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          // Token expired, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setAuth({ user: null, token: null });
          setLoading(false);
          return;
        }

        const user = { 
          _id: payload.userId, 
          role: payload.role 
        };
        
        // Restore user session from token
        setAuth({
          user,
          token,
        });

        // Store userId in localStorage for easy access
        if (payload.userId) {
          localStorage.setItem("userId", payload.userId);
        }
      } catch (err) {
        console.error("Invalid token", err);
        // Token is invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setAuth({ user: null, token: null });
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []); // Run only once on mount

  // Update auth state helper
  const updateAuth = (userData, token) => {
    localStorage.setItem("token", token);
    if (userData._id) {
      localStorage.setItem("userId", userData._id);
    }
    setAuth({
      user: userData,
      token,
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, updateAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
