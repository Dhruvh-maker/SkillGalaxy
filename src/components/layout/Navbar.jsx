import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, UserPlus, User, Rocket, Sparkles, FolderKanban } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import ThemeToggle from '../ThemeToggle';
import './Navbar.css';

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuthStore();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Sparkles className="logo-icon" size={24} />
          <span className="logo-text">SkillGalaxy</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/generator" className={`nav-link ${isActive('/generator')}`}>
            <Rocket size={16} />
            Generator
          </Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            <FolderKanban size={16} />
            Dashboard
          </Link>
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-profile">
              <span className="user-name"><User size={14} /> {user?.name}</span>
              <button onClick={logout} className="logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-link">
                <LogIn size={16} /> Login
              </Link>
              <Link to="/signup" className="signup-btn">
                <UserPlus size={16} /> Sign Up
              </Link>
            </>
          )}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
