import { ChevronRight } from 'lucide-react';
import './RoadmapRoad.css';
import './RoadmapSkeleton.css';

function RoadmapSkeleton() {
  // Simulate 6 blank nodes connecting in the grid
  const skeletonNodes = Array.from({ length: 6 });

  return (
    <section className="roadmap-skeleton-section">
      <div className="roadmap-skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>

      <div className="roadmap-grid-container skeleton-grid">
        {skeletonNodes.map((_, index) => {
          const isLast = index === skeletonNodes.length - 1;

          return (
            <div
              key={index}
              className="grid-node-wrapper skeleton-node-wrapper"
              style={{ '--delay': `${index * 0.15}s` }}
            >
              <div className="label-card grid-card skeleton-card">
                <div className="label-top-row">
                  <div className="skeleton-pill"></div>
                  <div className="skeleton-pill small"></div>
                </div>
                <div className="skeleton-text-block"></div>
                <div className="skeleton-text-block short"></div>
              </div>

              {!isLast && (
                <div className="grid-connector skeleton-connector">
                  <ChevronRight size={28} className="connector-icon" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RoadmapSkeleton;
