import { create } from 'zustand';

const PROGRESS_KEY = 'skillgalaxy-progress';
const HISTORY_KEY = 'skillgalaxy-history';

// Load from localStorage
const loadProgress = () => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const useRoadmapStore = create((set, get) => ({
  // Current roadmap
  roadmap: null,
  goal: '',

  // Progress: { [goalKey]: { [skillId]: 'completed' | 'in-progress' | 'skipped' } }
  progress: loadProgress(),

  // History: [{ goal, roadmap, createdAt }]
  history: loadHistory(),

  // Currently selected skill for detail modal
  selectedSkill: null,

  // Actions
  setRoadmap: (roadmap, goal) => {
    set({ roadmap, goal });

    // Save to history
    if (roadmap && goal) {
      const entry = {
        id: Date.now(),
        goal,
        roadmap,
        createdAt: new Date().toISOString(),
      };
      const history = [entry, ...get().history.slice(0, 19)]; // Keep last 20
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      set({ history });
    }
  },

  selectSkill: (skill) => set({ selectedSkill: skill }),
  clearSelectedSkill: () => set({ selectedSkill: null }),

  // Progress tracking
  getSkillProgress: (skillId) => {
    const { goal, progress } = get();
    return progress[goal]?.[skillId] || null;
  },

  updateProgress: (skillId, status) => {
    const { goal, progress } = get();
    if (!goal) return;

    const goalProgress = { ...(progress[goal] || {}) };

    if (status === null) {
      delete goalProgress[skillId];
    } else {
      goalProgress[skillId] = status;
    }

    const newProgress = { ...progress, [goal]: goalProgress };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    set({ progress: newProgress });
  },

  getCompletionStats: () => {
    const { goal, progress, roadmap } = get();
    if (!roadmap || !goal) return { completed: 0, inProgress: 0, skipped: 0, total: 0, percent: 0 };

    const goalProgress = progress[goal] || {};
    const total = roadmap.skills.length;
    const completed = Object.values(goalProgress).filter(s => s === 'completed').length;
    const inProgress = Object.values(goalProgress).filter(s => s === 'in-progress').length;
    const skipped = Object.values(goalProgress).filter(s => s === 'skipped').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, inProgress, skipped, total, percent };
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
    set({ history: [] });
  },

  loadFromHistory: (entry) => {
    set({ roadmap: entry.roadmap, goal: entry.goal });
  },
}));

export default useRoadmapStore;
