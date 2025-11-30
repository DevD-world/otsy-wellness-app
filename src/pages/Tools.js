import React, { useState, useEffect, useRef } from 'react';
import { Wind, PenTool, Sparkles, Save, Trash2, Check, Sliders, Play, Pause } from 'lucide-react';
import './Tools.css';

// --- FIREBASE IMPORTS ---
import { auth, db } from '../firebase'; 
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth";

// --- SOUND TRACK COMPONENT (Keep as is) ---
const SoundTrack = ({ name, url, icon }) => {
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

const Tools = () => {
  // State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle'); 
  const [instruction, setInstruction] = useState('Ready');
  const [entry, setEntry] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [quote, setQuote] = useState("You are stronger than you know.");
  
  // User State
  const [user, setUser] = useState(null);

  // 1. CHECK LOGIN STATUS
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // If logged in, load from Cloud
        loadFromCloud(currentUser.uid);
      } else {
        // If guest, load from LocalStorage
        const localData = localStorage.getItem('otsy_journal_v1');
        if (localData) setEntry(localData);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. LOAD FROM CLOUD FUNCTION
  const loadFromCloud = async (uid) => {
    try {
      const docRef = doc(db, "journals", uid); // Collection: journals, ID: UserID
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEntry(docSnap.data().text);
      }
    } catch (error) {
      console.error("Error loading journal:", error);
    }
  };

  // 3. SAVE FUNCTION (Handles both Cloud & Local)
  const handleSave = async () => {
    setSaveStatus('Saving...');
    
    if (user) {
      // SAVE TO FIREBASE
      try {
        await setDoc(doc(db, "journals", user.uid), {
          text: entry,
          lastUpdated: new Date()
        });
        setSaveStatus('Saved to Cloud!');
      } catch (error) {
        console.error("Error saving:", error);
        setSaveStatus('Error saving');
      }
    } else {
      // SAVE TO LOCAL STORAGE
      localStorage.setItem('otsy_journal_v1', entry);
      setSaveStatus('Saved Locally!');
    }
    
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // Breathing Logic (Keep existing)
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
        <h2>Wellness Tools</h2>
        <p>Interactive exercises to help you reset.</p>
      </div>

      <div className="tools-grid">
        
        {/* MIXER */}
        <div className="tool-card sound-mixer-card">
          <div className="card-top"><Sliders className="icon-green" /><h3>Focus Mixer</h3></div>
          <p className="tool-sub">Create your perfect environment.</p>
          <div className="mixer-grid">
            <SoundTrack name="Heavy Rain" icon="🌧️" url="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" />
            <SoundTrack name="Crackling Fire" icon="🔥" url="https://actions.google.com/sounds/v1/ambiences/fireplace.ogg" />
            <SoundTrack name="Ocean Waves" icon="🌊" url="https://actions.google.com/sounds/v1/water/waves_crashing.ogg" />
            <SoundTrack name="Forest Birds" icon="🐦" url="https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg" />
          </div>
        </div>

        {/* BREATHING */}
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

        {/* JOURNAL (Updated Logic) */}
        <div className="tool-card journal-card">
          <div className="card-top">
            <PenTool className="icon-blue" />
            <h3>{user ? "Cloud Journal" : "Local Journal"}</h3>
            {saveStatus && <span className="saved-badge"><Check size={14}/> {saveStatus}</span>}
          </div>
          
          <textarea 
            className="journal-input" 
            placeholder={user ? "Write here... (Synced to cloud)" : "Write here... (Saved on this device only)"} 
            value={entry} 
            onChange={(e) => setEntry(e.target.value)} 
          />
          
          <div className="button-row">
            <button className="save-btn" onClick={handleSave}><Save size={16}/> Save</button>
            <button className="clear-btn" onClick={() => setEntry('')}><Trash2 size={16}/></button>
          </div>
        </div>

        {/* AFFIRMATION */}
        <div className="tool-card quote-card">
          <div className="card-top"><Sparkles className="icon-gold" /><h3>Daily Quote</h3></div>
          <div className="quote-display">"{quote}"</div>
          <button className="new-quote-btn" onClick={() => setQuote("One day at a time.")}>New Quote</button>
        </div>

      </div>
    </div>
  );
};

export default Tools;