import { Sparkles, Mail, Globe, MessageCircle } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Sparkles className="logo-icon" size={20} />
            <span className="logo-text">SkillGalaxy</span>
          </div>
          <p className="footer-description">
            AI-powered 3D career roadmaps to map out your future, tracking your skills like a skill tree.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Application</h4>
            <a href="/generator">Generator</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/">Home</a>
          </div>
          <div className="footer-col">
            <h4>Socials</h4>
            <div className="social-links">
              <a href="#" aria-label="Mail"><Mail size={20} /></a>
              <a href="#" aria-label="Website"><Globe size={20} /></a>
              <a href="#" aria-label="Chat"><MessageCircle size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SkillGalaxy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
