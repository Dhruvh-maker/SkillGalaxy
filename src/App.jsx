import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import useAuthStore from './store/useAuthStore';
import './App.css';

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('skillgalaxy-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillgalaxy-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (isLoading) {
    return <div className="loading-screen">Loading SkillGalaxy...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app" data-theme={theme}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/generator" /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/generator" /> : <Signup />} />
            <Route 
              path="/generator" 
              element={isAuthenticated ? <Generator theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
