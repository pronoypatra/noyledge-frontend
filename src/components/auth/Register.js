import React, { useState, useContext } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Register.css";
import "../../App.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { updateAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      if (res.data && res.data.token) {
        updateAuth(res.data, res.data.token);
        navigate("/dashboard");
      } else {
        alert("Registration failed: Invalid response from server");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          (err.code === 'ECONNREFUSED' ? "Cannot connect to server. Please ensure the backend server is running." : "Registration failed");
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Create an Account</h2>

        <input
          className="form-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>

        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
