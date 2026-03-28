import { useState } from 'react';
import { Settings2, ChevronDown, ChevronUp, Cpu, Clock, Zap } from 'lucide-react';
import './AdvancedOptions.css';

function AdvancedOptions({ options, setOptions, disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`advanced-options-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="advanced-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        type="button"
      >
        <span className="toggle-label">
          <Settings2 size={16} /> Advanced Settings
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="options-grid">
          <div className="option-group">
            <label><Cpu size={14} /> Difficulty</label>
            <div className="pill-selector">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  className={options.difficulty === level ? 'active' : ''}
                  onClick={() => handleChange('difficulty', level)}
                  type="button"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label><Clock size={14} /> Time Commitment</label>
            <div className="pill-selector">
              {['fast', 'balanced', 'detailed'].map(time => (
                <button
                  key={time}
                  className={options.time === time ? 'active' : ''}
                  onClick={() => handleChange('time', time)}
                  type="button"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label><Zap size={14} /> Tech Focus</label>
            <div className="pill-selector">
              {['practical', 'theoretical', 'interview'].map(focus => (
                <button
                  key={focus}
                  className={options.focus === focus ? 'active' : ''}
                  onClick={() => handleChange('focus', focus)}
                  type="button"
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedOptions;
