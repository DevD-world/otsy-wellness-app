import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Save, Check } from 'lucide-react';
import './MiniTools.css'; // We will create this CSS next

// --- 1. MINI BREATHING TOOL ---
export const MiniBreathing = () => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("Ready?");
  const [phase, setPhase] = useState(""); // inhale, hold, exhale

  useEffect(() => {
    let timer;
    if (active) {
      const cycle = () => {
        setText("Inhale (4s)"); setPhase("inhale");
        setTimeout(() => { setText("Hold (7s)"); setPhase("hold"); }, 4000);
        setTimeout(() => { setText("Exhale (8s)"); setPhase("exhale"); }, 11000);
        timer = setTimeout(cycle, 19000);
      };
      cycle();
    } else {
      clearTimeout(timer);
      setText("Ready?");
      setPhase("");
    }
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="mini-tool-container">
      <div className={`mini-breath-circle ${phase}`}></div>
      <h3>{text}</h3>
      <button className="mini-btn" onClick={() => setActive(!active)}>
        {active ? "Stop" : "Start Breathing"}
      </button>
    </div>
  );
};

// --- 2. MINI JOURNAL ---
export const MiniJournal = () => {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  const saveEntry = () => {
    if(!entry) return;
    localStorage.setItem('otsy_mini_journal', entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mini-tool-container">
      <textarea 
        placeholder="What's on your mind right now?" 
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="mini-textarea"
      />
      <button className={`mini-btn ${saved ? 'success' : ''}`} onClick={saveEntry}>
        {saved ? <><Check size={16}/> Saved</> : <><Save size={16}/> Save to Device</>}
      </button>
    </div>
  );
};

// --- 3. MINI MOOD TRACKER ---
export const MiniMood = () => {
  const [selected, setSelected] = useState(null);
  const moods = [
    { label: "Happy", emoji: "😊" },
    { label: "Calm", emoji: "😌" },
    { label: "Anxious", emoji: "😰" },
    { label: "Sad", emoji: "😔" }
  ];

  return (
    <div className="mini-tool-container">
      <div className="mini-mood-grid">
        {moods.map((m, i) => (
          <button 
            key={i} 
            className={`mini-mood-btn ${selected === i ? 'selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <span className="emoji">{m.emoji}</span>
            <span className="label">{m.label}</span>
          </button>
        ))}
      </div>
      {selected !== null && <p className="mini-feedback">Mood tracked! <br/>Check the dashboard for trends.</p>}
    </div>
  );
};

// --- 4. MINI SOUNDSCAPES ---
export const MiniSound = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(new Audio("https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg"));

  const toggle = () => {
    if(playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.loop = true;
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  // Cleanup
  useEffect(() => {
    return () => { audioRef.current.pause(); };
  }, []);

  return (
    <div className="mini-tool-container">
      <div className={`sound-visualizer ${playing ? 'active' : ''}`}>
        <span></span><span></span><span></span><span></span>
      </div>
      <button className="mini-btn" onClick={toggle}>
        {playing ? <><Pause size={16}/> Pause Rain</> : <><Play size={16}/> Play Rain Sound</>}
      </button>
    </div>
  );
};