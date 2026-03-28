import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Map, CheckCircle2 } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';
import ProgressBar from './ProgressBar';
import ShareRoadmap from './ShareRoadmap';
import './RoadmapRoad.css';

function RoadmapRoad({ roadmap }) {
  const [visibleNodes, setVisibleNodes] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef(null);

  const { selectSkill, progress, goal } = useRoadmapStore();

  const handleDownload = async () => {
    if (!containerRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure all animations are finished
      await new Promise(r => setTimeout(r, 600));
      
      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: '#0f172a', // Matches our dark theme
        style: {
          padding: '40px',
          borderRadius: '0'
        }
      });
      
      const link = document.createElement('a');
      link.download = `skillgalaxy-${goal.replace(/\s+/g, '-').toLowerCase()}-roadmap.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const skills = roadmap?.skills || [];
  const goalProgress = progress[goal] || {};

  // Animate nodes appearing one by one
  useEffect(() => {

    if (skills.length === 0) return;

    setVisibleNodes(0);

    const timer = setInterval(() => {

      setVisibleNodes(prev => {

        if (prev >= skills.length) {
          clearInterval(timer);
          return prev;
        }

        return prev + 1;

      });

    }, 400);

    return () => clearInterval(timer);

  }, [skills.length]);

  const handleNodeClick = (skill) => {
    selectSkill(skill);
  };

  if (!skills.length) return null;

  return (

    <section
      className="roadmap-road-section"
      ref={containerRef}
    >

      <div className="roadmap-road-header">
        <div className="roadmap-road-header-top">
          <div className="roadmap-road-badge">
            <span className="badge-pulse"></span>
            Your Learning Path
          </div>

          <div className="roadmap-actions">
            <button 
              className="action-btn download-btn" 
              onClick={handleDownload}
              disabled={isExporting}
            >
              {isExporting ? <span className="spinner-small" /> : <Download size={18} />}
              {isExporting ? 'Exporting...' : 'Export Image'}
            </button>
            <ShareRoadmap />
          </div>
        </div>

        <h2 className="roadmap-road-title">
          <span className="gradient-text">
            Career Roadmap
          </span>
        </h2>

        <p className="roadmap-road-subtitle">
          Follow the path from start to mastery — {skills.length} milestones to conquer
        </p>
      </div>

      <ProgressBar />

      <div className="roadmap-grid-container">

        {skills.map((skill, index) => {

          const isVisible = index < visibleNodes;
          const isFirst = index === 0;
          const isLast = index === skills.length - 1;

          const status = goalProgress[skill?.id];

          return (

            <div
              key={skill?.id || index}
              className={`grid-node-wrapper ${isVisible ? 'visible' : ''}`}
            >

              <div
                className={`label-card 
                  ${isFirst ? 'first' : ''} 
                  ${isLast ? 'last' : ''} 
                  ${status ? `status-${status}` : ''}
                `}
                onClick={() => skill && handleNodeClick(skill)}
              >

                <div className="label-top-row">

                  <span className="label-step">

                    {isFirst
                      ? '🚀 START'
                      : isLast
                        ? '🏆 GOAL'
                        : `STEP ${index + 1}`}

                  </span>

                  {skill?.difficulty && (

                    <span
                      className={`label-difficulty diff-${skill.difficulty}`}
                    >
                      {skill.difficulty}
                    </span>

                  )}

                </div>

                <span className="label-name">
                  {skill?.name}
                </span>

                {status && (

                  <span
                    className={`label-status status-badge-${status}`}
                  >

                    {status === 'completed'
                      ? '✅ Done'
                      : status === 'in-progress'
                        ? '🔄 Learning'
                        : '⏭️ Known'}

                  </span>

                )}

                <span className="label-click-hint">
                  Click to expand
                </span>

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}

export default RoadmapRoad;