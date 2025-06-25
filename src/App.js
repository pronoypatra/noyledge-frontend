import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminPanel from "./components/dashboard/AdminPanel";
import UserPanel from "./components/dashboard/UserPanel";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import QuizAttempt from "./components/dashboard/QuizAttempt";
import Home from "./components/Home";
import CreateQuiz from "./components/admin/CreateQuiz"; // Ensure CreateQuiz connects to /api/quizzes
import AddQuestions from "./components/admin/AddQuestions";
import AdminQuizResults from "./components/admin/AdminQuizResults";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/quiz/create" element={<ProtectedRoute role="admin"><CreateQuiz /></ProtectedRoute>} />
          <Route path="/admin/quiz/:id/questions" element={<ProtectedRoute role="admin"><AddQuestions /></ProtectedRoute>} />
          <Route path="/admin/quiz/:id/results" element={<ProtectedRoute role="admin"><AdminQuizResults /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Component to display either AdminPanel or UserPanel based on the role
function RoleBasedDashboard() {
  const { auth } = useContext(AuthContext);

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  return auth.user.role === "admin" ? <AdminPanel /> : <UserPanel />;
}

export default App;
