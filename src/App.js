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


// import React, { useContext } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";
// import AdminPanel from "./components/dashboard/AdminPanel";
// import UserPanel from "./components/dashboard/UserPanel";
// // import Home from "./pages/Home";
// import ProtectedRoute from "./components/common/ProtectedRoute"; // For protecting routes
// import { AuthProvider, AuthContext } from "./context/AuthContext"; // Import AuthContext
// import QuizAttempt from "./components/dashboard/QuizAttempt";
// import Home from "./components/Home";
// import Dashboard from "./components/dashboard/Dashboard";
// import AdminDashboard from "./components/dashboard/AdminDashboard";
// import UserDashboard from "./components/dashboard/UserDashboard";
// // import { createQuiz } from '../../backend/controllers/quizController';
// // import AddQuestions from ""


// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>}/>
//           {/* Protected route for the dashboard */}
//           {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           <Route path="/dashboard/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}/>
//           <Route path="/dashboard/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}/> */}
//           <Route path="/dashboard"element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>}/>
//           {/* <Route path="/admin/quiz/create" element={<ProtectedRoute role="admin"><CreateQuiz /></ProtectedRoute>} />
//           <Route path="/admin/quiz/:id/questions" element={<ProtectedRoute role="admin"><AddQuestions /></ProtectedRoute>} />
//           <Route path="/admin/quiz/:id/results" element={<ProtectedRoute role="admin"><AdminQuizResults /></ProtectedRoute>} /> */}
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// // Component to display either AdminPanel or UserPanel based on the role
// function RoleBasedDashboard() {
//   const { auth } = useContext(AuthContext); // Get auth context

//   if (!auth.user) {
//     return <Navigate to="/login" />; // Redirect to login if user is not authenticated
//   }

//   // Render different dashboards based on user role
//   return auth.user.role === "admin" ? <AdminPanel /> : <UserPanel />;
// }

// export default App;
