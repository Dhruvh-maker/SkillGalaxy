function ThemeToggle({ theme, toggleTheme }) {
  const handleClick = () => {
    toggleTheme();
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleClick}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
}

export default ThemeToggle;
