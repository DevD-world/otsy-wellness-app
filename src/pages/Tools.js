import React, { useState, useEffect, useRef } from 'react';
import { Wind, Sliders, Play, Pause, Zap, RefreshCw, Smile } from 'lucide-react';
import './Tools.css';

// --- SUB-COMPONENT: SOUND TRACK ---
const SoundTrack = ({ name, icon, url }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio(url));

  useEffect(() => { audioRef.current.loop = true; return () => audioRef.current.pause(); }, []);
  useEffect(() => { if (playing) audioRef.current.play(); else audioRef.current.pause(); }, [playing]);
  useEffect(() => { audioRef.current.volume = volume; }, [volume]);

  return (
    <div className="sound-track">
      <div className="track-info"><span className="track-icon">{icon}</span><span className="track-name">{name}</span></div>
      <div className="track-controls">
        <button className={`play-toggle ${playing ? 'active' : ''}`} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} disabled={!playing} className="volume-slider"/>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: BUBBLE WRAP GAME ---
const BubbleWrap = () => {
  // Create 20 bubbles
  const [bubbles, setBubbles] = useState(Array(20).fill(false)); 

  const popBubble = (index) => {
    if (bubbles[index]) return; // Already popped
    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);
    // Optional: Add a light vibration if on mobile
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const resetBubbles = () => setBubbles(Array(20).fill(false));

  return (
    <div className="bubble-game">
      <div className="bubbles-grid">
        {bubbles.map((popped, i) => (
          <div key={i} className={`bubble ${popped ? 'popped' : ''}`} onClick={() => popBubble(i)}></div>
        ))}
      </div>
      <button className="reset-btn" onClick={resetBubbles}><RefreshCw size={14}/> New Sheet</button>
    </div>
  );
};

const Tools = () => {
  // Breathing State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle'); 
  const [instruction, setInstruction] = useState('Ready');

  // Breathing Logic
  useEffect(() => {
    let t = [];
    if (isBreathing) {
      const run = () => {
        setBreathPhase('inhale'); setInstruction('Inhale (4s)');
        t.push(setTimeout(() => { setBreathPhase('hold'); setInstruction('Hold (7s)'); }, 4000));
        t.push(setTimeout(() => { setBreathPhase('exhale'); setInstruction('Exhale (8s)'); }, 11000));
        t.push(setTimeout(run, 19000));
      };
      run();
    } else {
      setBreathPhase('idle'); setInstruction('Ready'); t.forEach(clearTimeout);
    }
    return () => t.forEach(clearTimeout);
  }, [isBreathing]);

  return (
    <div className="tools-container">
      <div className="tools-header">
        <h2>Relax & Refresh</h2>
        <p>Tools to shift your state of mind instantly.</p>
      </div>

      <div className="tools-grid">
        
        {/* 1. EXTENDED SOUND MIXER */}
        <div className="tool-card sound-mixer-card">
          <div className="card-top"><Sliders className="icon-green" /><h3>Soundscapes</h3></div>
          <p className="tool-sub">Mix sounds to block out anxiety.</p>
          <div className="mixer-grid">
            <SoundTrack name="Heavy Rain" icon="🌧️" url="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" />
            <SoundTrack name="Crackling Fire" icon="🔥" url="https://actions.google.com/sounds/v1/ambiences/fireplace.ogg" />
            <SoundTrack name="Ocean Waves" icon="🌊" url="https://actions.google.com/sounds/v1/water/waves_crashing.ogg" />
            <SoundTrack name="Forest Birds" icon="🐦" url="https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg" />
            <SoundTrack name="Night Crickets" icon="🦗" url="https://actions.google.com/sounds/v1/animals/crickets_night.ogg" />
            <SoundTrack name="Coffee Shop" icon="☕" url="https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg" />
            <SoundTrack name="Thunder" icon="⚡" url="https://actions.google.com/sounds/v1/weather/thunderstorm.ogg" />
          </div>
        </div>

        {/* 2. ANXIETY GAME (BUBBLE WRAP) */}
        <div className="tool-card game-card">
          <div className="card-top"><Zap className="icon-gold" /><h3>Stress Pop</h3></div>
          <p className="tool-sub">Pop bubbles to release tension.</p>
          <BubbleWrap />
        </div>

        {/* 3. BREATHING */}
        <div className="tool-card breathing-card">
          <div className="card-top"><Wind className="icon-purple" /><h3>Breathing</h3></div>
          <div className="circle-container">
            <div className={`breath-circle ${breathPhase}`}><span>{isBreathing ? breathPhase : "START"}</span></div>
            <p className="breath-instruction">{instruction}</p>
          </div>
          <button className={`action-btn ${isBreathing?'stop':'start'}`} onClick={()=>setIsBreathing(!isBreathing)}>
            {isBreathing ? 'Stop' : 'Start Session'}
          </button>
        </div>

        {/* 4. MOOD REFRESHER (Affirmation) */}
        <div className="tool-card quote-card">
          <div className="card-top"><Smile className="icon-blue" /><h3>Mood Boost</h3></div>
          <div className="quote-display">"This feeling is temporary. You are permanent."</div>
        </div>

      </div>
    </div>
  );
};

export default Tools;