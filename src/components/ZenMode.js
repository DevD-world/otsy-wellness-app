import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './ZenMode.css';

const ZenMode = ({ onClose }) => {
  const [phase, setPhase] = useState('Inhale');
  const audioRef = useRef(null);

  // Play Audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; 
      audioRef.current.play().catch(e => console.log("Audio error:", e));
    }
  }, []);

  // Breathing Loop
  useEffect(() => {
    const loop = () => {
      setPhase('Inhale');
      setTimeout(() => {
        setPhase('Hold');
        setTimeout(() => {
          setPhase('Exhale');
        }, 4000); 
      }, 4000); 
    };

    loop();
    const interval = setInterval(loop, 12000); 
    return () => clearInterval(interval);
  }, []);

  const handleExit = () => {
    if (audioRef.current) audioRef.current.pause();
    onClose();
  };

  return (
    <div className="zen-overlay">
      
      {/* VIDEO SOURCE:
         This is a direct link to a calm nature loop. 
      */}
      <video autoPlay loop muted playsInline className="zen-video">
        <source 
          src="/ootsy-welcome.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* AUDIO SOURCE */}
      <audio ref={audioRef} loop>
        <source src="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" type="audio/ogg" />
      </audio>

      <div className="zen-dimmer"></div>

      <div className="zen-content">
        <div className={`zen-circle ${phase.toLowerCase()}`}></div>
        <h1 className="zen-text">{phase}</h1>
        <p className="zen-sub">Focus on the sound of the rain.</p>
      </div>

      <button className="zen-exit-btn" onClick={handleExit}>
        <X size={24} /> Exit Zen Mode
      </button>
    </div>
  );
};

export default ZenMode;