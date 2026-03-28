import { useState } from 'react';
import useRoadmapStore from '../store/useRoadmapStore';
import './ShareRoadmap.css';

function ShareRoadmap() {
  const { roadmap, goal } = useRoadmapStore();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!roadmap || !goal) return null;

  const generateShareText = () => {
    const skills = roadmap.skills || [];
    let text = `🚀 My ${goal} Career Roadmap (via SkillGalaxy)\n\n`;
    skills.forEach((skill, i) => {
      const prefix = i === 0 ? '🏁' : i === skills.length - 1 ? '🏆' : `${i + 1}.`;
      text += `${prefix} ${skill.name}`;
      if (skill.difficulty) text += ` [${skill.difficulty}]`;
      if (skill.estimated_hours) text += ` (~${skill.estimated_hours}h)`;
      text += '\n';
    });
    text += `\n✨ Generated with SkillGalaxy`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      setShowDropdown(false);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = generateShareText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      setShowDropdown(false);
    }
  };

  const handleTwitterShare = () => {
    const text = `🚀 Just created my ${goal} career roadmap with SkillGalaxy! ${roadmap.skills.length} skills to master. Check it out! ✨`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
    setShowDropdown(false);
  };

  const handleLinkedInShare = () => {
    const text = `I just mapped out my ${goal} career path using SkillGalaxy — an AI-powered roadmap builder. ${roadmap.skills.length} skills organized into a clear learning path!`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://skillgalaxy.app')}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=520');
    setShowDropdown(false);
  };

  const handleDownloadJSON = () => {
    const data = { goal, roadmap, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillgalaxy-${goal.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDropdown(false);
  };

  return (
    <div className="share-wrapper">
      <button
        className="share-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Share roadmap"
      >
        <span className="share-icon">↗</span>
        <span className="share-text">Share</span>
      </button>

      {showDropdown && (
        <>
          <div className="share-backdrop" onClick={() => setShowDropdown(false)}></div>
          <div className="share-dropdown">
            <button className="share-option" onClick={handleCopy}>
              <span className="share-option-icon">{copied ? '✅' : '📋'}</span>
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button className="share-option" onClick={handleTwitterShare}>
              <span className="share-option-icon">𝕏</span>
              <span>Share on X / Twitter</span>
            </button>
            <button className="share-option" onClick={handleLinkedInShare}>
              <span className="share-option-icon">in</span>
              <span>Share on LinkedIn</span>
            </button>
            <div className="share-divider"></div>
            <button className="share-option" onClick={handleDownloadJSON}>
              <span className="share-option-icon">💾</span>
              <span>Download JSON</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ShareRoadmap;
