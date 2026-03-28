import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRoadmapStore from '../store/useRoadmapStore';
import { Trash2, ExternalLink, CalendarDays, Map, Loader2 } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { history, isLoadingHistory, fetchHistory, clearHistory, loadFromHistory } = useRoadmapStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLoadRoadmap = (entry) => {
    loadFromHistory(entry);
    navigate('/generator');
  };

  if (isLoadingHistory && history.length === 0) {
    return (
      <div className="dashboard-page container loading-state">
        <Loader2 size={48} className="spinner" />
        <p>Fetching your roadmaps from the galaxy...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <div>
          <h1>Your <span className="gradient-text">Roadmaps</span></h1>
          <p className="subtitle">View and continue your past learning journeys</p>
        </div>
        {history.length > 0 && (
          <button className="danger-btn" onClick={clearHistory}>
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Map size={48} />
          </div>
          <h2>No roadmaps yet</h2>
          <p>You haven't generated any career roadmaps yet. Start by generating your first one.</p>
          <button className="primary-cta" onClick={() => navigate('/generator')}>
            Create Roadmap
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((entry) => (
            <div key={entry._id || entry.id} className="history-card" onClick={() => handleLoadRoadmap(entry)}>
              <div className="history-card-header">
                <h3>{entry.goal}</h3>
                <span className="history-date">
                  <CalendarDays size={14} />
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="history-card-body">
                <div className="history-stat">
                  <span className="stat-value">{entry.roadmap?.skills?.length || 0}</span>
                  <span className="stat-label">Skills</span>
                </div>
              </div>
              
              <div className="history-card-footer">
                <span className="continue-text">Continue journey <ExternalLink size={14} /></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
