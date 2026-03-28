import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RoadmapRoad from '../components/RoadmapRoad';
import RoadmapSkeleton from '../components/RoadmapSkeleton';
import SkillDetailModal from '../components/SkillDetailModal';
import { generateRoadmap } from '../services/mistralApi';
import useRoadmapStore from '../store/useRoadmapStore';

function Generator({ theme, toggleTheme }) {
  const { setRoadmap, roadmap, goal: storeGoal } = useRoadmapStore();
  
  const [localGoal, setLocalGoal] = useState(storeGoal || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!localGoal.trim()) {
      setError('Please enter a career goal');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await generateRoadmap(localGoal);
      setRoadmap(data, localGoal);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Sync loaded history goal back to localGoal input when roadmap changes
  useEffect(() => {
    if (storeGoal && storeGoal !== localGoal) {
      setLocalGoal(storeGoal);
    }
  }, [roadmap, storeGoal]);

  return (
    <div className="generator-page">
      <Hero
        theme={theme}
        toggleTheme={toggleTheme}
        goal={localGoal}
        setGoal={setLocalGoal}
        loading={loading}
        error={error}
        onGenerate={handleGenerate}
      />
      
      {loading ? (
        <RoadmapSkeleton />
      ) : roadmap ? (
        <RoadmapRoad roadmap={roadmap} />
      ) : null}
      
      <SkillDetailModal />
    </div>
  );
}

export default Generator;
