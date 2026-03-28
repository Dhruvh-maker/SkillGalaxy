import { Link, useLocation } from 'react-router-dom';
import { Rocket, Sparkles, FolderKanban } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import './Navbar.css';

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();

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

        <div className="navbar-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
