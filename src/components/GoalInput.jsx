import { useState } from 'react';

function GoalInput({ value, onChange, onSubmit, isLoading, error }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value?.trim() && onSubmit && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form className="goal-input-wrapper" onSubmit={handleSubmit}>
      <div className={`input-container ${isFocused ? 'focused' : ''}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What career path do you want to pursue?"
          className="goal-input"
          aria-label="Career goal input"
          maxLength={200}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="submit-button"
          disabled={!value.trim() || isLoading}
          aria-label="Generate roadmap"
        >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <span className="button-text">Generate</span>
              <span className="button-icon">→</span>
            </>
          )}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <p className="input-hint">
        Press Enter or click Generate to create your 3D roadmap
      </p>
    </form>
  );
}

export default GoalInput;

