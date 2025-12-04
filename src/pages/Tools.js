import React from 'react';
import { MiniBreathing, MiniJournal, MiniMood, MiniSound, MiniGrounding, MiniSobriety, MiniSafeSpace, MiniBurn } from '../components/MiniTools';
import './Tools.css';

const Tools = () => {
  return (
    <div className="tools-page-container">
      <header className="tools-header">
        <h1>Wellness Workbench</h1>
        <p>Tools to hack your happiness chemicals.</p>
      </header>

      <div className="tools-section">
        <h3>🧘 Calm & Grounding</h3>
        <div className="tools-grid">
          <div className="tool-wrapper"><MiniBreathing /></div>
          <div className="tool-wrapper"><MiniGrounding /></div>
          <div className="tool-wrapper"><MiniSafeSpace /></div>
        </div>
      </div>

      <div className="tools-section">
        <h3>📖 Clarity & Focus</h3>
        <div className="tools-grid">
          <div className="tool-wrapper"><MiniJournal /></div>
          <div className="tool-wrapper"><MiniSobriety /></div>
          <div className="tool-wrapper"><MiniBurn /></div>
        </div>
      </div>

      <div className="tools-section">
        <h3>🎧 Sensory & Mood</h3>
        <div className="tools-grid">
          <div className="tool-wrapper"><MiniSound /></div>
          <div className="tool-wrapper"><MiniMood /></div>
        </div>
      </div>
    </div>
  );
};

export default Tools;