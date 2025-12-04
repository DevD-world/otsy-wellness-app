import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Save, Check, RefreshCw, Volume2, VolumeX, 
  BookOpen, Headphones, Video, ChevronLeft, Lightbulb, 
  Type, Moon, Sun, ArrowLeft, ArrowRight, X,
  Clock, CheckSquare, Timer, Flame, Eye, Hand, Ear, Coffee, Utensils,
  Anchor, DollarSign, Shield, AlertTriangle, CloudRain, Trees, Waves, Trash2, Filter
} from 'lucide-react';
import './MiniTools.css';
import { booksCollection } from '../data/BooksData'; 

// Placeholder Otsy Image
const OTSY_IMG = "https://cdn-icons-png.flaticon.com/512/10604/10604056.png";

// =========================================================
// 1. MINI BREATHING TOOL (UNCHANGED)
// =========================================================
export const MiniBreathing = () => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("Ready?");
  const [phase, setPhase] = useState(""); 

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
      setText("Ready?"); setPhase("");
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

// =========================================================
// 2. MINI JOURNAL (UNCHANGED)
// =========================================================
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
        placeholder="Write your worries here..." 
        value={entry} onChange={(e) => setEntry(e.target.value)}
        className="mini-textarea"
      />
      <button className={`mini-btn ${saved ? 'success' : ''}`} onClick={saveEntry}>
        {saved ? <><Check size={16}/> Saved</> : <><Save size={16}/> Save Note</>}
      </button>
    </div>
  );
};

// =========================================================
// 3. MINI MOOD TRACKER (UNCHANGED)
// =========================================================
export const MiniMood = () => {
  const [selected, setSelected] = useState(null);
  const moods = [ { label: "Happy", emoji: "😊" }, { label: "Calm", emoji: "😌" }, { label: "Anxious", emoji: "😰" }, { label: "Sad", emoji: "😔" } ];
  return (
    <div className="mini-tool-container">
      <div className="mini-mood-grid">
        {moods.map((m, i) => (
          <button key={i} className={`mini-mood-btn ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)}>
            <span className="emoji">{m.emoji}</span><span className="label">{m.label}</span>
          </button>
        ))}
      </div>
      {selected !== null && <p className="mini-feedback">Mood tracked!</p>}
    </div>
  );
};

// =========================================================
// 4. MINI SOUNDSCAPES (FIXED AUDIO)
// =========================================================
export const MiniSound = () => {
  const [activeSound, setActiveSound] = useState(null);
  const audioRef = useRef(new Audio());

  const sounds = [
    { id: 'rain', name: 'Heavy Rain', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
    { id: 'forest', name: 'Forest Birds', url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg' },
    { id: 'fire', name: 'Fireplace', url: 'https://actions.google.com/sounds/v1/ambiences/fireplace.ogg' }
  ];

  const toggleSound = (sound) => {
    if (activeSound === sound.id) {
      audioRef.current.pause();
      setActiveSound(null);
    } else {
      audioRef.current.src = sound.url;
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error("Audio Error:", e));
      setActiveSound(sound.id);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  return (
    <div className="mini-tool-container">
      <div className="sound-header">
        <h3>Soundscapes</h3>
        {activeSound && <span className="sound-visualizer-bars">Playing...</span>}
      </div>
      <div className="sound-grid">
        {sounds.map(s => (
          <button 
            key={s.id} 
            className={`mini-btn small ${activeSound === s.id ? 'active-sound' : ''}`} 
            onClick={() => toggleSound(s)}
          >
            {activeSound === s.id ? <Pause size={14}/> : <Play size={14}/>} {s.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 5. BUBBLE GAME (FIXED POP SOUND)
// =========================================================
export const MiniBubble = () => {
  const [bubbles, setBubbles] = useState(Array(20).fill(false)); 
  
  // Use a reliable, short sound
  const popSoundUrl = "https://actions.google.com/sounds/v1/cartoon/pop.ogg";

  const popBubble = (index) => {
    if (bubbles[index]) return;
    
    // Play Sound immediately
    const audio = new Audio(popSoundUrl);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio blocked"));

    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);
    
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="mini-tool-container">
      <div className="bubbles-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px'}}>
        {bubbles.map((popped, i) => (
          <div 
            key={i} 
            onClick={() => popBubble(i)} 
            className={`bubble-item ${popped ? 'popped' : ''}`}
          ></div>
        ))}
      </div>
      <button className="mini-btn" onClick={() => setBubbles(Array(20).fill(false))} style={{marginTop:'15px'}}>Reset Bubbles</button>
    </div>
  );
};

// =========================================================
// 6. MEMORY GAME (UNCHANGED)
// =========================================================
export const MiniMemory = () => {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  useEffect(() => { setCards([...emojis].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e }))); }, []);
  const handleClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) setSolved([...solved, ...newFlipped]);
      setTimeout(() => setFlipped([]), 1000);
    }
  };
  return (
    <div className="mini-tool-container">
      <div className="memory-grid">
        {cards.map((c, i) => (
          <div key={i} className={`memory-card ${flipped.includes(i) || solved.includes(i) ? 'flipped' : ''}`} onClick={() => handleClick(i)}>
            <div className="front">❓</div><div className="back">{c.emoji}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 7. FACTS
// =========================================================
export const MiniFacts = () => {
  const [fact, setFact] = useState("Click below!");
  const facts = ["Smiling triggers endorphins.", "Blue colors calm the mind.", "20 mins in nature lowers stress."];
  return (
    <div className="mini-tool-container">
      <div className="fact-box"><Lightbulb size={24} color="#f9a825"/><p>{fact}</p></div>
      <button className="mini-btn" onClick={() => setFact(facts[Math.floor(Math.random()*facts.length)])}>Next Fact</button>
    </div>
  );
};

// =========================================================
// 8. MINI LIBRARY (FIXED: Heading, Filters, Audio)
// =========================================================
export const MiniLibrary = () => {
  const [activeTab, setActiveTab] = useState('read'); 
  const [readingBook, setReadingBook] = useState(null); 
  const [currentChapter, setCurrentChapter] = useState(0); 
  const [selectedMedia, setSelectedMedia] = useState(null); 
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Psychology', 'Stoicism', 'Mindset'];
  
  const mediaData = {
    listen: [ 
      { id: 'l1', title: "Rain & Thunder", author: "Nature Sounds", color: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)", icon: <CloudRain size={32} color="#546e7a"/>, src: "https://actions.google.com/sounds/v1/weather/thunderstorm.ogg" },
      { id: 'l2', title: "Forest Birds", author: "Morning Ambience", color: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", icon: <Trees size={32} color="#2e7d32"/>, src: "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg" },
      { id: 'l3', title: "Ocean Waves", author: "Deep Sleep", color: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", icon: <Waves size={32} color="#0277bd"/>, src: "https://actions.google.com/sounds/v1/water/waves_crashing.ogg" } 
    ],
    watch: [ 
      { id: 'w1', title: "Stress as a Friend", author: "Kelly McGonigal", color: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", videoId: "RcGyVTAoXEU" },
      { id: 'w2', title: "Power of Vulnerability", author: "Brené Brown", color: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", videoId: "iCvmsMzlF7o" }
    ]
  };

  // Filter Logic
  const getFilteredBooks = () => {
    if(filter === 'All') return booksCollection;
    return booksCollection.filter(b => b.category === filter); // Assuming booksCollection has 'category'
  };

  if (readingBook) {
    return (
      <div className="full-reader-overlay">
        <div className="reader-header">
          <button className="reader-btn" onClick={() => setReadingBook(null)}><ChevronLeft/> Back</button>
          <span>{readingBook.title}</span><div style={{width:'40px'}}></div>
        </div>
        <div className="reader-content">
          <h2>{readingBook.chapters[currentChapter].title}</h2>
          <div className="text-body">{readingBook.chapters[currentChapter].content}</div>
        </div>
        <div className="reader-footer">
          <button disabled={currentChapter===0} onClick={()=>setCurrentChapter(c=>c-1)}><ArrowLeft/></button>
          <span>{currentChapter+1}/{readingBook.chapters.length}</span>
          <button disabled={currentChapter===readingBook.chapters.length-1} onClick={()=>setCurrentChapter(c=>c+1)}><ArrowRight/></button>
        </div>
      </div>
    );
  }

  if (selectedMedia) {
    return (
      <div className="media-viewer">
        <button className="back-link" onClick={() => setSelectedMedia(null)}><ChevronLeft size={16}/> Back</button>
        <div className="viewer-content">
          <h3>{selectedMedia.title}</h3>
          {activeTab === 'listen' && (
            <div style={{width: '100%', padding: '20px'}}>
              {/* HTML5 AUDIO PLAYER */}
              <audio controls autoPlay src={selectedMedia.src} style={{width:'100%', marginTop:'20px'}}></audio>
            </div>
          )}
          {activeTab === 'watch' && <iframe width="100%" height="300" src={`https://www.youtube.com/embed/${selectedMedia.videoId}`} title="Video" frameBorder="0" allowFullScreen style={{borderRadius:'12px'}}></iframe>}
        </div>
      </div>
    );
  }

  return (
    <div className="mini-tool-container" style={{padding:'0'}}>
      
      {/* HEADING & TABS */}
      <div className="lib-top-section">
        <h3 style={{margin:'15px 15px 5px', color:'#1e293b'}}>Wellness Library</h3>
        <div className="lib-tabs">
          <button className={`lib-tab ${activeTab==='read'?'active':''}`} onClick={()=>setActiveTab('read')}><BookOpen size={14}/> Books</button>
          <button className={`lib-tab ${activeTab==='listen'?'active':''}`} onClick={()=>setActiveTab('listen')}><Headphones size={14}/> Audio</button>
          <button className={`lib-tab ${activeTab==='watch'?'active':''}`} onClick={()=>setActiveTab('watch')}><Video size={14}/> Video</button>
        </div>
      </div>

      {/* FILTER PILLS */}
      {activeTab === 'read' && (
        <div className="lib-filters">
          {categories.map(cat => (
            <span key={cat} className={`filter-pill ${filter===cat ? 'active' : ''}`} onClick={()=>setFilter(cat)}>
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div className="lib-horizontal-scroll">
        {activeTab === 'read' && getFilteredBooks().map((book, i) => (
          <div key={book.id} className="horizontal-card"
            style={{background: i%2===0 ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' : 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'}} 
            onClick={()=>{setReadingBook(book);setCurrentChapter(0)}}
          >
            <div className="h-card-content"><h4>{book.title}</h4><p>{book.author}</p></div>
            <span className="h-card-pill">Read</span>
          </div>
        ))}
        {(activeTab === 'listen' || activeTab === 'watch') && mediaData[activeTab].map(item => (
          <div key={item.id} className="horizontal-card" style={{background: item.color}} onClick={()=>setSelectedMedia(item)}>
            <div className="h-card-icon">{item.icon || <Play size={24}/>}</div>
            <div className="h-card-content"><h4>{item.title}</h4><p>{item.author}</p></div>
            <span className="h-card-pill">Play</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 9. SLEEP CALCULATOR
// =========================================================
export const MiniSleep = () => {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTimes, setBedTimes] = useState([]);
  const calculateBedtime = () => {
    const [hours, minutes] = wakeTime.split(':').map(Number);
    const wakeDate = new Date(); wakeDate.setHours(hours, minutes, 0);
    setBedTimes([6, 5, 4].map(c => new Date(wakeDate.getTime() - (c * 90 * 60 * 1000)).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})));
  };
  return (
    <div className="mini-tool-container">
      <div style={{textAlign:'center'}}><h3>Sleep Calculator</h3><p>Wake up refreshed.</p></div>
      <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'10px'}}/>
      <button className="mini-btn" onClick={calculateBedtime}>Calculate</button>
      {bedTimes.length>0 && <div style={{marginTop:'15px', display:'flex', justifyContent:'space-around'}}>{bedTimes.map(t=><strong key={t}>{t}</strong>)}</div>}
    </div>
  );
};

// =========================================================
// 10. HABIT TRACKER
// =========================================================
export const MiniHabits = () => {
  const [habits, setHabits] = useState([{id:1, text:"Water", completed:false}, {id:2, text:"Sun", completed:false}]);
  return <div className="mini-tool-container">{habits.map(h=><div key={h.id} onClick={()=>setHabits(habits.map(i=>i.id===h.id?{...i,completed:!i.completed}:i))} style={{padding:'10px', margin:'5px 0', border:'1px solid #eee', background: h.completed?'#e8f5e9':'white'}}>{h.text} {h.completed&&'✓'}</div>)}</div>;
};

// =========================================================
// 11. ZEN FOCUS TIMER (FIXED LOGIC)
// =========================================================
export const MiniFocus = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false); // Done
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="mini-tool-container" style={{textAlign:'center'}}>
      <h3>Zen Focus</h3>
      <div style={{fontSize:'3rem', margin:'10px 0', fontFamily:'monospace', color:'#1565c0'}}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
        <button className="mini-btn" onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="mini-btn" style={{background:'white', color:'#555', border:'1px solid #ddd'}} onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

// =========================================================
// 12. BURN BOX (FIXED ANIMATION)
// =========================================================
export const MiniBurn = () => {
  const [text, setText] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = () => {
    if (!text) return;
    setIsBurning(true);
    setTimeout(() => {
      setText("");
      setIsBurning(false);
    }, 2000); // Wait for animation
  };

  return (
    <div className="mini-tool-container" style={{overflow:'hidden'}}>
      <h3>Burn Box</h3>
      <p style={{fontSize:'0.8rem'}}>Write a worry and burn it away.</p>
      
      {/* BURNING ANIMATION WRAPPER */}
      <div className={`burn-wrapper ${isBurning ? 'burning' : ''}`}>
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          className="mini-textarea" 
          placeholder="I am worried about..."
          disabled={isBurning}
        />
      </div>

      <button className="mini-btn" onClick={handleBurn} style={{background:'#d32f2f'}}>
        <Flame size={16}/> Burn
      </button>
    </div>
  );
};

// =========================================================
// 13. GROUNDING (WITH OTSY)
// =========================================================
export const MiniGrounding = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { count: 5, color: "#e3f2fd", textColor: "#1565c0", title: "Sight", task: "Help Otsy find 5 things you can SEE." },
    { count: 4, color: "#e8f5e9", textColor: "#2e7d32", title: "Touch", task: "Help Otsy find 4 things you can TOUCH." },
    { count: 3, color: "#fff3e0", textColor: "#ef6c00", title: "Sound", task: "Help Otsy find 3 things you can HEAR." },
    { count: 2, color: "#f3e5f5", textColor: "#7b1fa2", title: "Smell", task: "Help Otsy find 2 things you can SMELL." },
    { count: 1, color: "#ffebee", textColor: "#c62828", title: "Taste", task: "Help Otsy find 1 thing you can TASTE." }
  ];
  if (step === 5) return <div className="mini-tool-container" style={{textAlign:'center', background:'#f0fdf4'}}><img src={OTSY_IMG} alt="Otsy" style={{width:'80px'}}/><h3 style={{color:'#2e7d32'}}>Grounded!</h3><button className="mini-btn" onClick={()=>setStep(0)}>Reset</button></div>;
  return (
    <div className="mini-tool-container" style={{textAlign:'center', padding:0}}>
      <div style={{background: steps[step].color, padding:'20px'}}>
        <img src={OTSY_IMG} alt="Otsy" style={{width:'80px'}}/>
        <h2 style={{fontSize:'2.5rem', margin:'5px 0', color: steps[step].textColor}}>{steps[step].count}</h2>
        <h4 style={{margin:0, color: steps[step].textColor}}>{steps[step].title}</h4>
      </div>
      <div style={{padding:'20px'}}>
        <p>{steps[step].task}</p>
        <button className="mini-btn" onClick={()=>setStep(step+1)} style={{background: steps[step].textColor, border:'none', width:'100%'}}>Next Step</button>
      </div>
    </div>
  );
};

// =========================================================
// 14. SOBRIETY ANCHOR
// =========================================================
export const MiniSobriety = () => {
  const [config, setConfig] = useState(null); 
  const [formDate, setFormDate] = useState('');
  const [sosMode, setSosMode] = useState(false);
  const [sosTimer, setSosTimer] = useState(60);

  useEffect(() => { const saved = localStorage.getItem('otsy_sobriety'); if(saved) setConfig(JSON.parse(saved)); }, []);
  useEffect(() => { let interval; if (sosMode && sosTimer > 0) interval = setInterval(() => setSosTimer(t => t - 1), 1000); return () => clearInterval(interval); }, [sosMode, sosTimer]);

  if (sosMode) return <div className="mini-tool-container" style={{textAlign:'center', background:'#ffebee'}}><AlertTriangle size={48} color="#c62828"/><h3>Urge Surfing</h3><div style={{fontSize:'3rem', margin:'10px 0'}}>00:{sosTimer}</div>{sosTimer===0 && <button className="mini-btn" onClick={()=>{setSosMode(false); setSosTimer(60)}}>I'm Okay</button>}</div>;
  if (config) {
    const diff = Math.ceil(Math.abs(new Date() - new Date(config.date)) / (1000 * 60 * 60 * 24));
    return <div className="mini-tool-container" style={{textAlign:'center'}}><h3><Anchor/> Sobriety</h3><h2 style={{fontSize:'3rem', color:'#2e7d32'}}>{diff}</h2><span>Days Clean</span><button onClick={()=>setSosMode(true)} style={{display:'block', width:'100%', marginTop:'10px', background:'#c62828', color:'white', border:'none', padding:'10px', borderRadius:'5px'}}>SOS: CRAVING</button></div>;
  }
  return <div className="mini-tool-container"><h3>Sobriety Tracker</h3><input type="date" className="mini-textarea" style={{height:'40px'}} value={formDate} onChange={(e)=>setFormDate(e.target.value)} /><button className="mini-btn" onClick={()=>{localStorage.setItem('otsy_sobriety', JSON.stringify({date:formDate})); setConfig({date:formDate})}}>Start</button></div>;
};

// =========================================================
// 15. SAFE SPACE
// =========================================================
export const MiniSafeSpace = () => {
  const [isActive, setIsActive] = useState(false);
  if(isActive) return <div className="mini-tool-container" style={{background:'#f3e5f5', textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}><h3>Safe Space</h3><p>"You are safe here."</p><button className="mini-btn" onClick={()=>setIsActive(false)}>Leave</button></div>;
  return <div className="mini-tool-container" style={{textAlign:'center'}}><Shield size={48} color="#7b1fa2"/><h3>Safe Space</h3><button className="mini-btn" onClick={()=>setIsActive(true)} style={{background:'#ab47bc'}}>Enter</button></div>;
};