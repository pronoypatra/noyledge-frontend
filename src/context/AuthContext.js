import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem("token"), // Get the token from localStorage
  });

  useEffect(() => {
    if (auth.token && !auth.user) {
      // If token is available and user is not set, decode the token and set user
      try {
        const payload = JSON.parse(atob(auth.token.split(".")[1]));
        setAuth((prev) => ({
          ...prev,
          user: { _id: payload.userId, role: payload.role },
        }));
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [auth.token, auth.user]); // Only run the effect if token or user state changes

  // You can add a function to log out the user and remove the token
  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
