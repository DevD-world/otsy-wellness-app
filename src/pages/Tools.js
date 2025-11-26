import React, { useState, useEffect, useRef } from 'react';
import { Wind, PenTool, Sparkles, Save, Trash2, Check, Volume2, Play, Pause } from 'lucide-react';
import './Tools.css';
import ZenMode from '../components/ZenMode';
const Tools = () => {
  // --- 1. BREATHING TOOL STATE ---
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle'); // 'inhale', 'hold', 'exhale', 'idle'
  const [instruction, setInstruction] = useState('Ready to Start');

  // --- 2. JOURNAL TOOL STATE ---
  const [entry, setEntry] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [showZen, setShowZen] = useState(false);
  // --- 3. SOUNDSCAPES STATE ---
  const [activeSound, setActiveSound] = useState(null); // 'rain', 'forest', 'ocean'
  const audioRef = useRef(new Audio());

  // --- 4. AFFIRMATION STATE ---
  const [quote, setQuote] = useState("You are stronger than you know.");
  
  const affirmations = [
    "I am enough just as I am.",
    "My feelings are valid.",
    "I choose to be kind to myself today.",
    "This too shall pass.",
    "I am in charge of my own happiness.",
    "I breathe in peace and breathe out stress."
  ];

  // --- LOGIC: BREATHING ---
  const toggleBreathing = () => {
    if (isBreathing) {
      // User is stopping: Add simulated minutes to Profile Stats (LocalStorage)
      const currentMins = parseInt(localStorage.getItem('otsy_stats_mins') || '0');
      localStorage.setItem('otsy_stats_mins', currentMins + 5); 
    }
    setIsBreathing(!isBreathing);
  };

  useEffect(() => {
    let timers = [];
    if (isBreathing) {
      const runCycle = () => {
        // Step 1: Inhale (4s)
        setBreathPhase('inhale');
        setInstruction('Inhale... (4s)');
        
        // Step 2: Hold (7s)
        timers.push(setTimeout(() => { 
          setBreathPhase('hold'); 
          setInstruction('Hold... (7s)'); 
        }, 4000));

        // Step 3: Exhale (8s)
        timers.push(setTimeout(() => { 
          setBreathPhase('exhale'); 
          setInstruction('Exhale... (8s)'); 
        }, 11000));

        // Step 4: Loop (Total 19s)
        timers.push(setTimeout(runCycle, 19000)); 
      };
      runCycle(); 
    } else {
      setBreathPhase('idle');
      setInstruction('Ready to Start');
      timers.forEach(clearTimeout); 
    }
    return () => timers.forEach(clearTimeout);
  }, [isBreathing]);


  // --- LOGIC: JOURNAL ---
  useEffect(() => {
    const savedData = localStorage.getItem('otsy_journal_v1');
    if (savedData) setEntry(savedData);
  }, []);

  const handleSave = () => {
    if (!entry.trim()) return;
    localStorage.setItem('otsy_journal_v1', entry);
    
    // Update Stats for Profile
    const currentCount = parseInt(localStorage.getItem('otsy_stats_journal') || '0');
    localStorage.setItem('otsy_stats_journal', currentCount + 1);

    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete your entry?")) {
      setEntry('');
      localStorage.removeItem('otsy_journal_v1');
    }
  };

  // --- LOGIC: SOUNDSCAPES ---
  const sounds = {
    rain: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
    forest: "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg",
    ocean: "https://actions.google.com/sounds/v1/water/waves_crashing.ogg"
  };

  const toggleSound = (soundKey) => {
    if (activeSound === soundKey) {
      // Stop playing
      audioRef.current.pause();
      setActiveSound(null);
    } else {
      // Start playing new sound
      audioRef.current.src = sounds[soundKey];
      audioRef.current.loop = true;
      audioRef.current.play();
      setActiveSound(soundKey);
    }
  };

  // Cleanup audio when leaving page
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);


  // --- LOGIC: AFFIRMATION ---
  const newQuote = () => {
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    setQuote(random);
  };

  return (
    <div className="tools-container">
      <div className="tools-header">
        <h2>Wellness Tools</h2>
        <p>Interactive exercises to help you reset.</p>
      </div>
      {/* --- RENDER ZEN MODE IF ACTIVE --- */}
      {showZen && <ZenMode onClose={() => setShowZen(false)} />}

      <div className="tools-header">...</div>

      <div className="tools-grid">
        
        {/* --- ADD THIS NEW CARD (Put it first or last) --- */}
        <div className="tool-card zen-trigger-card" 
             style={{background: 'linear-gradient(135deg, #232526, #414345)', color: 'white', cursor: 'pointer'}}
             onClick={() => setShowZen(true)}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Zen Mode</h3>
            <div style={{background:'rgba(255,255,255,0.2)', padding:'5px 10px', borderRadius:'15px', fontSize:'0.8rem'}}>Immersive</div>
          </div>
          <p style={{opacity: 0.8, margin: '10px 0'}}>Enter full-screen relaxation.</p>
          <button style={{marginTop:'auto', background:'white', color:'#333', border:'none', padding:'10px', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>
            Enter
          </button>
        </div>

        {/* ... Your existing cards (Breathing, Journal, Soundscapes, etc.) ... */}
        
      </div>

      <div className="tools-grid">
        
        {/* CARD 1: BREATHING */}
        <div className="tool-card breathing-card">
          <div className="card-top">
            <Wind className="icon-purple" />
            <h3>Guided Breathing</h3>
          </div>
          <div className="circle-container">
            <div className={`breath-circle ${breathPhase}`}>
               <span>{isBreathing ? breathPhase.toUpperCase() : "START"}</span>
            </div>
            <p className="breath-instruction">{instruction}</p>
          </div>
          <button className={`action-btn ${isBreathing ? 'stop' : 'start'}`} onClick={toggleBreathing}>
            {isBreathing ? 'Stop Session' : 'Start Breathing'}
          </button>
        </div>

        {/* CARD 2: JOURNAL */}
        <div className="tool-card journal-card">
          <div className="card-top">
            <PenTool className="icon-blue" />
            <h3>Private Journal</h3>
            {saveStatus && <span className="saved-badge"><Check size={14}/> Saved</span>}
          </div>
          <textarea 
            className="journal-input" 
            placeholder="Write your thoughts here..." 
            value={entry} 
            onChange={(e) => setEntry(e.target.value)} 
          />
          <div className="button-row">
            <button className="save-btn" onClick={handleSave}><Save size={16}/> Save</button>
            <button className="clear-btn" onClick={handleClear}><Trash2 size={16}/></button>
          </div>
        </div>

        {/* CARD 3: SOUNDSCAPES */}
        <div className="tool-card sound-card">
          <div className="card-top">
            <Volume2 className="icon-green" />
            <h3>Soundscapes</h3>
          </div>
          <div className="sound-grid">
            <button className={`sound-btn ${activeSound === 'rain' ? 'active' : ''}`} onClick={() => toggleSound('rain')}>
              {activeSound === 'rain' ? <Pause size={20}/> : <Play size={20}/>}
              <span>Heavy Rain</span>
            </button>
            <button className={`sound-btn ${activeSound === 'forest' ? 'active' : ''}`} onClick={() => toggleSound('forest')}>
              {activeSound === 'forest' ? <Pause size={20}/> : <Play size={20}/>}
              <span>Forest</span>
            </button>
            <button className={`sound-btn ${activeSound === 'ocean' ? 'active' : ''}`} onClick={() => toggleSound('ocean')}>
              {activeSound === 'ocean' ? <Pause size={20}/> : <Play size={20}/>}
              <span>Ocean Waves</span>
            </button>
          </div>
          {activeSound && (
            <div className="now-playing-anim">
              <span className="bar"></span><span className="bar"></span><span className="bar"></span> Playing...
            </div>
          )}
        </div>

        {/* CARD 4: AFFIRMATION */}
        <div className="tool-card quote-card">
          <div className="card-top">
            <Sparkles className="icon-gold" />
            <h3>Affirmation</h3>
          </div>
          <div className="quote-display">"{quote}"</div>
          <button className="new-quote-btn" onClick={newQuote}>New Affirmation</button>
        </div>

      </div>
    </div>
    
  );
};

export default Tools;