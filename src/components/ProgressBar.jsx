import useRoadmapStore from '../store/useRoadmapStore';
import './ProgressBar.css';

function ProgressBar() {
  const goal = useRoadmapStore(state => state.goal);
  const roadmap = useRoadmapStore(state => state.roadmap);
  const progress = useRoadmapStore(state => state.progress);
  
  const goalProgress = progress[goal] || {};

  const total = roadmap?.skills?.length || 0;
  
  if (total === 0) return null;

  const completed = Object.values(goalProgress).filter(s => s === 'completed').length;
  const inProgress = Object.values(goalProgress).filter(s => s === 'in-progress').length;
  const skipped = Object.values(goalProgress).filter(s => s === 'skipped').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = { completed, inProgress, skipped, total, percent };

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-info">
        <div className="progress-left">
          <span className="progress-label">Your Progress</span>
          <span className="progress-fraction">
            {stats.completed} / {stats.total} skills
          </span>
        </div>
        <span className="progress-percent">{stats.percent}%</span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${stats.percent}%` }}
        >
          {stats.percent > 0 && <div className="progress-glow"></div>}
        </div>
      </div>

      <div className="progress-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#22c55e' }}></span>
          <span>Completed ({stats.completed})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
          <span>In Progress ({stats.inProgress})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#6366f1' }}></span>
          <span>Known ({stats.skipped})</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
