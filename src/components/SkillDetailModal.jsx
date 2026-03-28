import { useEffect, useRef } from 'react';
import useRoadmapStore from '../store/useRoadmapStore';
import './SkillDetailModal.css';

const PROGRESS_OPTIONS = [
  { key: 'completed', label: 'Completed', icon: '✅', color: '#22c55e' },
  { key: 'in-progress', label: 'In Progress', icon: '🔄', color: '#f59e0b' },
  { key: 'skipped', label: 'I Know This', icon: '⏭️', color: '#6366f1' },
];

const DIFFICULTY_COLORS = {
  beginner: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', label: 'Beginner' },
  intermediate: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Intermediate' },
  advanced: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'Advanced' },
};

function SkillDetailModal() {
  const { selectedSkill, clearSelectedSkill, getSkillProgress, updateProgress } = useRoadmapStore();
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const currentProgress = selectedSkill ? getSkillProgress(selectedSkill.id) : null;

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') clearSelectedSkill();
    };
    if (selectedSkill) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedSkill, clearSelectedSkill]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      clearSelectedSkill();
    }
  };

  const handleProgressClick = (status) => {
    if (currentProgress === status) {
      updateProgress(selectedSkill.id, null); // Toggle off
    } else {
      updateProgress(selectedSkill.id, status);
    }
  };

  if (!selectedSkill) return null;

  const difficulty = DIFFICULTY_COLORS[selectedSkill.difficulty] || DIFFICULTY_COLORS.beginner;
  const resources = selectedSkill.resources || [];
  const estimatedHours = selectedSkill.estimated_hours || null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-card" ref={modalRef}>
        {/* Close button */}
        <button className="modal-close" onClick={clearSelectedSkill} aria-label="Close">
          ✕
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-badges">
            <span
              className="difficulty-badge"
              style={{ background: difficulty.bg, color: difficulty.color }}
            >
              {difficulty.label}
            </span>
            {estimatedHours && (
              <span className="time-badge">
                🕐 ~{estimatedHours}h
              </span>
            )}
          </div>
          <h3 className="modal-title">{selectedSkill.name}</h3>
        </div>

        {/* Description */}
        {selectedSkill.description && (
          <p className="modal-description">{selectedSkill.description}</p>
        )}

        {/* Progress Tracking */}
        <div className="modal-section">
          <h4 className="section-label">Track Progress</h4>
          <div className="progress-buttons">
            {PROGRESS_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`progress-btn ${currentProgress === opt.key ? 'active' : ''}`}
                onClick={() => handleProgressClick(opt.key)}
                style={{
                  '--btn-color': opt.color,
                }}
              >
                <span className="progress-btn-icon">{opt.icon}</span>
                <span className="progress-btn-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources */}
        {resources.length > 0 && (
          <div className="modal-section">
            <h4 className="section-label">Learning Resources</h4>
            <div className="resources-list">
              {resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  <span className="resource-icon">🔗</span>
                  <span className="resource-title">{res.title}</span>
                  <span className="resource-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillDetailModal;
