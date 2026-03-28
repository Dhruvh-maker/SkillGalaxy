import { useNavigate } from 'react-router-dom';
import { Rocket, Map, Target, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        
        <div className="container hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={14} className="badge-icon" />
            <span>AI-Powered Career Navigator</span>
          </div>
          
          <h1 className="hero-title">
            Map Your Future with <span className="gradient-text">SkillGalaxy</span>
          </h1>
          
          <p className="hero-description">
            Don't wander aimlessly. Tell our AI your career goal, and it will instantly generate a highly-structured, step-by-step interactive 3D roadmap tailored for you.
          </p>
          
          <div className="hero-cta-group">
            <button className="primary-cta" onClick={() => navigate('/generator')}>
              Start Building Now <Rocket size={18} />
            </button>
            <button className="secondary-cta" onClick={() => navigate('/dashboard')}>
              View Your Roadmaps
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works bg-secondary">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to launch your career into orbit</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Target size={32} />
              </div>
              <h3>Set Your Goal</h3>
              <p>Type in any career, skill, or role you want to master. We handle the rest.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <BrainCircuit size={32} />
              </div>
              <h3>AI Generation</h3>
              <p>Our intelligent engine maps out the essential prerequisites and milestones.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Track Progress</h3>
              <p>Follow the interactive 3D road, tick off your completed skills, and level up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-showcase">
        <div className="container">
          <div className="features-grid">
            <div className="feature-content">
              <h2>Crystal Clear <span className="gradient-text">Visualization</span></h2>
              <p>
                Forget boring bulleted lists. Our beautiful, interactive roadmaps make it easy to see the big picture. 
                Hover, click, and explore each node to discover what you need to learn.
              </p>
              <ul className="feature-bullets">
                <li><Sparkles size={16} /> Smooth glassmorphic UI</li>
                <li><Sparkles size={16} /> Rich skill data & resources</li>
                <li><Sparkles size={16} /> Color-coded completion tracking</li>
              </ul>
              <button className="outline-cta" onClick={() => navigate('/generator')}>
                Try the Generator
              </button>
            </div>
            <div className="feature-visual">
              <div className="mockup-window">
                <div className="mockup-header">
                  <span className="dot map-red"></span>
                  <span className="dot map-yellow"></span>
                  <span className="dot map-green"></span>
                </div>
                <div className="mockup-body">
                  <div className="mock-node completed">
                    <span className="check">✓</span> React Basics
                  </div>
                  <div className="mock-connector"></div>
                  <div className="mock-node in-progress">
                    <span className="spin">🔄</span> Zustand State
                  </div>
                  <div className="mock-connector"></div>
                  <div className="mock-node locked">
                    Advanced Patterns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ready CTA */}
      <section className="ready-section">
        <div className="container ready-content">
          <h2>Ready to map your skills?</h2>
          <p>Join thousands tracking their career progress with SkillGalaxy.</p>
          <button className="primary-cta glow" onClick={() => navigate('/generator')}>
            Create Your First Roadmap <Map size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
