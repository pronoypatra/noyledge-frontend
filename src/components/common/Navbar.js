import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExploreIcon from '@mui/icons-material/Explore';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonIcon from '@mui/icons-material/Person';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import './Navbar.css';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!auth.user || !auth.token) {
    return null; // Don't show navbar if not logged in
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <QuizIcon className="brand-icon" />
            <span>Quiz App</span>
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            <DashboardIcon className="nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/explore" className="nav-link">
            <ExploreIcon className="nav-icon" />
            <span>Explore</span>
          </Link>
          <Link to="/people" className="nav-link">
            <PeopleIcon className="nav-icon" />
            <span>People</span>
          </Link>
          <Link to="/chat" className="nav-link">
            <ChatIcon className="nav-icon" />
            <span>Chat</span>
          </Link>
          {auth.user.role === 'admin' && (
            <Link to="/admin/reports" className="nav-link">
              <ReportProblemIcon className="nav-icon" />
              <span>Reports</span>
            </Link>
          )}
          <Link to={`/profile/${userId}`} className="nav-link">
            <PersonIcon className="nav-icon" />
            <span>Profile</span>
          </Link>
          <Link to="/saved/quizzes" className="nav-link">
            <BookmarkIcon className="nav-icon" />
            <span>Saved</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <LogoutIcon className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

