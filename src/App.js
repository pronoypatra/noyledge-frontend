import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CasCallback from "./components/auth/CasCallback";
import AdminPanel from "./components/dashboard/AdminPanel";
import UserPanel from "./components/dashboard/UserPanel";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import QuizAttempt from "./components/dashboard/QuizAttempt";
import Home from "./components/Home";
import CreateQuiz from "./components/admin/CreateQuiz";
import AddQuestions from "./components/admin/AddQuestions";
import AdminQuizResults from "./components/admin/AdminQuizResults";
import Profile from "./components/profile/Profile";
import Explore from "./components/explore/Explore";
import SavedQuizzes from "./components/saved/SavedQuizzes";
import Analytics from "./components/admin/Analytics";
import Reports from "./components/admin/Reports";
import People from "./components/people/People";
import Chat from "./components/chat/Chat";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/cas/success" element={<CasCallback />} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/chat/:chatId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/saved/quizzes" element={<ProtectedRoute><SavedQuizzes /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/quiz/create" element={<ProtectedRoute role="admin"><CreateQuiz /></ProtectedRoute>} />
          <Route path="/admin/quiz/:id/questions" element={<ProtectedRoute role="admin"><AddQuestions /></ProtectedRoute>} />
          <Route path="/admin/quiz/:id/results" element={<ProtectedRoute role="admin"><AdminQuizResults /></ProtectedRoute>} />
          <Route path="/admin/quiz/:quizId/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Component to display either AdminPanel or UserPanel based on the role
function RoleBasedDashboard() {
  const { auth, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  return auth.user.role === "admin" ? <AdminPanel /> : <UserPanel />;
}

export default App;
