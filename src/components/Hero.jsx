import GoalInput from './GoalInput';
import AdvancedOptions from './AdvancedOptions';

function Hero({ 
  theme, 
  toggleTheme, 
  goal, 
  setGoal, 
  loading, 
  error, 
  onGenerate,
  options,
  setOptions
}) {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          AI-Powered Career Roadmaps
        </div>

        <h1>Build Your Future with <span className="gradient-text">SkillGalaxy</span></h1>

        <p className="hero-subtitle">
          Enter your career goal and let AI generate an interactive 3D roadmap
          to guide your learning journey through the stars.
        </p>

        <GoalInput
          value={goal}
          onChange={setGoal}
          onSubmit={onGenerate}
          isLoading={loading}
          error={error}
        />

        <AdvancedOptions 
          options={options} 
          setOptions={setOptions} 
          disabled={loading} 
        />

        <div className="trending-topics">
          <span>Trending:</span>
          {['Full Stack Developer', 'Data Scientist', 'UI/UX Designer', 'Machine Learning'].map(topic => (
            <button 
              key={topic} 
              className="trending-tag"
              onClick={() => setGoal(topic)}
              disabled={loading}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
