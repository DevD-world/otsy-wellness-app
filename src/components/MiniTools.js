import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Save, Check, RefreshCw, Volume2, VolumeX, 
  BookOpen, Headphones, Video, ChevronLeft, Lightbulb, 
  Type, Moon, Sun, ArrowLeft, ArrowRight, X, Filter, Clock, CheckSquare, Droplets, Flame, Trash, Timer, Laptop
} from 'lucide-react';
import './MiniTools.css';

// Import Book Data
// Make sure you have src/data/BooksData.js created from the previous step!
import { booksCollection } from '../data/BooksData'; 

// =========================================================
// 1. MINI BREATHING TOOL
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
// 2. MINI JOURNAL
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
        placeholder="Write your worries here. We'll hold them for you..." 
        value={entry} onChange={(e) => setEntry(e.target.value)}
        className="mini-textarea"
      />
      <button className={`mini-btn ${saved ? 'success' : ''}`} onClick={saveEntry}>
        {saved ? <><Check size={16}/> Saved to Device</> : <><Save size={16}/> Save Note</>}
      </button>
    </div>
  );
};

// =========================================================
// 3. MINI MOOD TRACKER
// =========================================================
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
          <button key={i} className={`mini-mood-btn ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)}>
            <span className="emoji">{m.emoji}</span>
            <span className="label">{m.label}</span>
          </button>
        ))}
      </div>
      {selected !== null && <p className="mini-feedback">Mood tracked! <br/> <small>Sign in to see your monthly trends.</small></p>}
    </div>
  );
};

// =========================================================
// 4. MINI SOUNDSCAPES (MULTI-TRACK)
// =========================================================
export const MiniSound = () => {
  const [activeSound, setActiveSound] = useState(null);
  const audioRef = useRef(new Audio());

  const sounds = [
    { id: 'rain', name: 'Heavy Rain', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
    { id: 'forest', name: 'Forest Birds', url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg' },
    { id: 'fire', name: 'Fireplace', url: 'https://actions.google.com/sounds/v1/ambiences/fireplace.ogg' }
  ];

  const playSound = (sound) => {
    if (activeSound === sound.id) {
      audioRef.current.pause();
      setActiveSound(null);
    } else {
      audioRef.current.src = sound.url;
      audioRef.current.loop = true;
      audioRef.current.play();
      setActiveSound(sound.id);
    }
  };

  useEffect(() => { return () => { audioRef.current.pause(); }; }, []);

  return (
    <div className="mini-tool-container">
      <div className="sound-grid">
        {sounds.map(s => (
          <button 
            key={s.id} 
            className={`mini-btn small ${activeSound === s.id ? 'active-sound' : ''}`} 
            onClick={() => playSound(s)}
          >
            {activeSound === s.id ? <Pause size={14}/> : <Play size={14}/>} {s.name}
          </button>
        ))}
      </div>
      <div className={`sound-visualizer ${activeSound ? 'active' : ''}`}><span></span><span></span><span></span><span></span></div>
    </div>
  );
};

// =========================================================
// 5. MINI BUBBLE GAME (WITH SOUND)
// =========================================================
export const MiniBubble = () => {
  const [bubbles, setBubbles] = useState(Array(20).fill(false)); 
  const [soundOn, setSoundOn] = useState(true);
  
  // Use a reliable short pop sound
  const popAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3');

  const popBubble = (index) => {
    if (bubbles[index]) return;
    
    if (soundOn) { 
      popAudio.currentTime = 0; 
      popAudio.volume = 0.3; 
      popAudio.play().catch(e => console.log("Audio play blocked by browser")); 
    }

    const newBubbles = [...bubbles]; newBubbles[index] = true; setBubbles(newBubbles);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="mini-tool-container">
      <div className="sound-toggle" onClick={() => setSoundOn(!soundOn)}>
        {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />} <small>Sound</small>
      </div>
      <div className="bubbles-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px'}}>
        {bubbles.map((popped, i) => (
          <div key={i} onClick={() => popBubble(i)} className={`bubble-item ${popped ? 'popped' : ''}`}></div>
        ))}
      </div>
      <button className="mini-btn" onClick={() => setBubbles(Array(20).fill(false))} style={{marginTop:'15px'}}>
        <RefreshCw size={14}/> Reset
      </button>
    </div>
  );
};

// =========================================================
// 6. MINI MEMORY GAME
// =========================================================
export const MiniMemory = () => {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  
  useEffect(() => { shuffle(); }, []);
  const shuffle = () => {
    setCards([...emojis].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e })));
    setFlipped([]); setSolved([]);
  };
  
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
      <button className="mini-btn" onClick={shuffle} style={{marginTop:'10px'}}><RefreshCw size={14}/> New Game</button>
    </div>
  );
};

// =========================================================
// 7. MINI WELLNESS FACTS
// =========================================================
export const MiniFacts = () => {
  const [fact, setFact] = useState("Click below to learn something new!");
  const facts = [
    "Hearing your own name activates a unique part of your brain.",
    "Smiling (even falsely) can trick your brain into releasing endorphins.",
    "Looking at the color blue can have a calming physiological effect.",
    "Your brain uses 20% of the total oxygen and blood in your body.",
    "Spending just 20 minutes in nature lowers stress hormone levels.",
    "Deep breathing stimulates the Vagus nerve, slowing your heart rate."
  ];

  const getFact = () => {
    const random = facts[Math.floor(Math.random() * facts.length)];
    setFact(random);
  };

  return (
    <div className="mini-tool-container">
      <div className="fact-box">
        <Lightbulb size={24} color="#f9a825"/>
        <p>{fact}</p>
      </div>
      <button className="mini-btn" onClick={getFact}>Next Fact</button>
    </div>
  );
};

// =========================================================
// 8. PROPER LIBRARY (FULL READER + MEDIA)
// =========================================================
export const MiniLibrary = () => {
  const [activeTab, setActiveTab] = useState('read'); // read | listen | watch
  const [readingBook, setReadingBook] = useState(null); // The book object currently open
  const [currentChapter, setCurrentChapter] = useState(0); 
  const [selectedMedia, setSelectedMedia] = useState(null); 

  // Library State
  const [visibleCount, setVisibleCount] = useState(6);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Reader Settings
  const [theme, setTheme] = useState('light'); // light | sepia | dark
  const [fontSize, setFontSize] = useState(18); // px
  
  // Audio Book State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  // --- AUDIOBOOK ENGINE ---
  const toggleSpeech = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; 
      utterance.pitch = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const goodVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha'));
      if(goodVoice) utterance.voice = goodVoice;

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      speechRef.current = utterance;
    }
  };

  // Stop audio when closing book
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, [readingBook]);

  // --- FILTER LOGIC ---
  const categories = ['All', 'Stoicism', 'Psychology', 'Spirituality', 'Mindset'];
  const filteredBooks = booksCollection.filter(b => categoryFilter === 'All' || b.category === categoryFilter);

  // --- MEDIA DATA ---
  const mediaData = {
    listen: [
      { id: 'l1', title: "Rain & Thunder", author: "Nature Sounds", desc: "High fidelity storm sounds.", src: "https://actions.google.com/sounds/v1/weather/thunderstorm.ogg" },
      { id: 'l2', title: "Guided Mindfulness", author: "Relaxation", desc: "A gentle body scan.", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 'l3', title: "Brown Noise", author: "Deep Focus", desc: "Smoother than white noise.", src: "https://actions.google.com/sounds/v1/water/waves_crashing.ogg" }
    ],
    watch: [
      { id: 'w1', title: "How to Make Stress Your Friend", author: "Kelly McGonigal", desc: "TED Talk on mindset.", videoId: "RcGyVTAoXEU" },
      { id: 'w2', title: "Yoga for Anxiety", author: "Yoga With Adriene", desc: "20-minute practice.", videoId: "bJJWArRfKa0" },
      { id: 'w3', title: "Sleep Toolkit", author: "Andrew Huberman", desc: "Science-based tools.", videoId: "h2aWYjSA1Jc" }
    ]
  };

  // --- RENDER: FULL SCREEN E-READER ---
  if (readingBook) {
    return (
      <div className={`full-reader-overlay reader-theme-${theme}`}>
        <div className="reader-header">
          <button className="reader-btn" onClick={() => setReadingBook(null)}><ChevronLeft size={24}/> Back</button>
          
          <div className="reader-title-box">
            <div style={{fontWeight:'bold'}}>{readingBook.title}</div>
            <div style={{fontSize:'0.8rem', opacity:0.7}}>Chapter {currentChapter + 1}</div>
          </div>
          
          <div className="reader-controls">
            {/* AUDIOBOOK TOGGLE */}
            <button 
              className={`reader-btn ${isSpeaking ? 'active-speak' : ''}`} 
              onClick={() => toggleSpeech(readingBook.chapters[currentChapter].content)}
              title="Listen to this chapter"
            >
              {isSpeaking ? <Volume2 size={22} color="#2e7d32"/> : <VolumeX size={22}/>}
            </button>

            <button className="reader-btn" onClick={() => setFontSize(Math.max(14, fontSize - 2))}><Type size={16}/></button>
            <button className="reader-btn" onClick={() => setFontSize(Math.min(28, fontSize + 2))}><Type size={22}/></button>
            <button className="reader-btn" onClick={() => setTheme(theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light')}>
              {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
          </div>
        </div>

        <div className="reader-content">
          <h2 className="chapter-title" style={{ color: theme === 'dark' ? '#fff' : '#333' }}>
            {readingBook.chapters[currentChapter].title}
          </h2>
          <div className="text-body" style={{ fontSize: `${fontSize}px`, color: theme === 'dark' ? '#ddd' : '#333' }}>
            {readingBook.chapters[currentChapter].content}
          </div>
        </div>

        <div className="reader-footer">
          <button className="nav-chapter-btn" disabled={currentChapter === 0} onClick={() => { setCurrentChapter(prev => prev - 1); window.speechSynthesis.cancel(); setIsSpeaking(false); }}>
            <ArrowLeft size={16}/> Prev
          </button>
          <span>{currentChapter + 1} / {readingBook.chapters.length}</span>
          <button className="nav-chapter-btn" disabled={currentChapter === readingBook.chapters.length - 1} onClick={() => { setCurrentChapter(prev => prev + 1); window.speechSynthesis.cancel(); setIsSpeaking(false); }}>
            Next <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: MEDIA PLAYER ---
  if (selectedMedia) {
    return (
      <div className="media-viewer">
        <button className="back-link" onClick={() => setSelectedMedia(null)}><ChevronLeft size={16}/> Back</button>
        <div className="viewer-header"><h3>{selectedMedia.title}</h3><span className="author-tag">{selectedMedia.author}</span></div>
        {activeTab === 'listen' && (
          <div className="audio-player-wrapper">
            <div className="audio-visual"><Headphones size={48} color="#1565c0" /></div>
            <audio controls autoPlay src={selectedMedia.src} className="native-audio">Browser not supported.</audio>
          </div>
        )}
        {activeTab === 'watch' && (
          <div className="video-wrapper">
            <iframe width="100%" height="250" src={`https://www.youtube.com/embed/${selectedMedia.videoId}`} title="YouTube" frameBorder="0" allowFullScreen></iframe>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER: BOOKSHELF (Main View) ---
  return (
    <div className="mini-tool-container">
      <div className="lib-tabs">
        <button className={`lib-tab ${activeTab === 'read'?'active':''}`} onClick={()=>setActiveTab('read')}><BookOpen size={16}/> Books</button>
        <button className={`lib-tab ${activeTab === 'listen'?'active':''}`} onClick={()=>setActiveTab('listen')}><Headphones size={16}/> Audio</button>
        <button className={`lib-tab ${activeTab === 'watch'?'active':''}`} onClick={()=>setActiveTab('watch')}><Video size={16}/> Video</button>
      </div>

      {/* READ TAB WITH CATEGORIES & LOAD MORE */}
      {activeTab === 'read' && (
        <>
          <div className="category-pills">
            {categories.map(cat => (
              <span key={cat} className={`cat-pill ${categoryFilter===cat?'active':''}`} onClick={()=>setCategoryFilter(cat)}>
                {cat}
              </span>
            ))}
          </div>

          <div className="library-bookshelf">
            {filteredBooks.slice(0, visibleCount).map(book => (
              <div key={book.id} className="book-item" onClick={() => { setReadingBook(book); setCurrentChapter(0); }}>
                <img src={book.cover} alt={book.title} className="book-cover"/>
                <div><div className="book-title">{book.title}</div><div className="book-author">{book.author}</div></div>
              </div>
            ))}
          </div>

          {filteredBooks.length > visibleCount && (
            <button className="mini-btn" style={{marginTop:'20px', width:'100%'}} onClick={() => setVisibleCount(prev => prev + 6)}>
              Load More Books
            </button>
          )}
        </>
      )}

      {/* LISTEN/WATCH TAB */}
      {(activeTab === 'listen' || activeTab === 'watch') && (
        <div className="lib-scroll-list">
          {mediaData[activeTab].map(item => (
            <div key={item.id} className="lib-list-item" onClick={() => setSelectedMedia(item)}>
              <div className="lib-icon-box">{activeTab === 'listen' ? <Headphones size={20}/> : <Play size={20} fill="currentColor"/>}</div>
              <div className="lib-item-info"><h4>{item.title}</h4><p>{item.desc}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MiniSleep = () => {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTimes, setBedTimes] = useState([]);

  const calculateBedtime = () => {
    const [hours, minutes] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0);

    // Calculate 4, 5, and 6 cycles back (90 mins each)
    // 6 cycles = 9 hours, 5 cycles = 7.5 hours, 4 cycles = 6 hours
    const cycles = [6, 5, 4]; 
    const times = cycles.map(c => {
      const d = new Date(wakeDate.getTime() - (c * 90 * 60 * 1000));
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    
    setBedTimes(times);
  };

  return (
    <div className="mini-tool-container">
      <div style={{textAlign:'center', marginBottom:'15px'}}>
        <h3 style={{fontSize:'1.1rem', color:'#333'}}>Sleep Calculator</h3>
        <p style={{fontSize:'0.9rem', color:'#666'}}>Wake up refreshed by timing your REM cycles.</p>
      </div>
      
      <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px'}}>
        <label style={{fontWeight:'bold', color:'#333'}}>I want to wake up at:</label>
        <input 
          type="time" 
          value={wakeTime} 
          onChange={(e) => setWakeTime(e.target.value)}
          style={{padding:'8px', borderRadius:'8px', border:'1px solid #ccc'}}
        />
      </div>

      <button className="mini-btn" onClick={calculateBedtime}>Calculate Bedtime</button>

      {bedTimes.length > 0 && (
        <div style={{marginTop:'20px', width:'100%'}}>
          <p style={{fontSize:'0.9rem', color:'#1565c0', fontWeight:'bold', marginBottom:'10px'}}>For best rest, fall asleep at:</p>
          <div style={{display:'flex', justifyContent:'space-around'}}>
            {bedTimes.map((t, i) => (
              <div key={i} style={{background:'#e3f2fd', padding:'10px', borderRadius:'10px', textAlign:'center'}}>
                <span style={{display:'block', fontWeight:'bold', fontSize:'1.1rem', color:'#1565c0'}}>{t}</span>
                <span style={{fontSize:'0.7rem', color:'#666'}}>{[9, 7.5, 6][i]} hrs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// 10. DAILY HABIT CHECKLIST (FUNCTIONAL TOOL)
// =========================================================
export const MiniHabits = () => {
  // Load saved habits or default
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('otsy_habits');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: "Drink Water", icon: "💧", completed: false },
      { id: 2, text: "Step Outside", icon: "☀️", completed: false },
      { id: 3, text: "Deep Breaths", icon: "🌬️", completed: false },
      { id: 4, text: "No Phone (1hr)", icon: "📵", completed: false },
    ];
  });

  const toggleHabit = (id) => {
    const newHabits = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
    setHabits(newHabits);
    localStorage.setItem('otsy_habits', JSON.stringify(newHabits));
  };

  const resetHabits = () => {
    const reset = habits.map(h => ({ ...h, completed: false }));
    setHabits(reset);
    localStorage.setItem('otsy_habits', JSON.stringify(reset));
  };

  const progress = Math.round((habits.filter(h => h.completed).length / habits.length) * 100);

  return (
    <div className="mini-tool-container">
      <div style={{width:'100%', marginBottom:'15px'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
          <strong style={{color:'#333'}}>Daily Goals</strong>
          <span style={{color:'#1565c0', fontWeight:'bold'}}>{progress}%</span>
        </div>
        <div style={{width:'100%', height:'8px', background:'#f1f5f9', borderRadius:'4px'}}>
          <div style={{width:`${progress}%`, height:'100%', background:'#1565c0', borderRadius:'4px', transition:'0.3s'}}></div>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'10px', width:'100%'}}>
        {habits.map(h => (
          <div 
            key={h.id} 
            onClick={() => toggleHabit(h.id)}
            style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'12px', borderRadius:'12px', cursor:'pointer',
              background: h.completed ? '#e8f5e9' : 'white',
              border: h.completed ? '1px solid #c8e6c9' : '1px solid #eee',
              transition: '0.2s'
            }}
          >
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <span style={{fontSize:'1.2rem'}}>{h.icon}</span>
              <span style={{color: h.completed ? '#2e7d32' : '#333', textDecoration: h.completed ? 'line-through' : 'none'}}>{h.text}</span>
            </div>
            {h.completed && <Check size={18} color="#2e7d32"/>}
          </div>
        ))}
      </div>

      <button className="mini-btn" onClick={resetHabits} style={{marginTop:'15px', background:'none', border:'1px solid #ddd', color:'#666'}}>
        Reset Day
      </button>
    </div>
  );
};
export const MiniFocus = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus | break

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Play a ding sound here if wanted
            alert(mode === 'focus' ? "Focus complete! Take a break." : "Break over! Back to work.");
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
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = (newMode = 'focus') => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="mini-tool-container">
      <div style={{textAlign:'center', marginBottom:'20px'}}>
        <div style={{fontSize:'3rem', fontWeight:'800', color:'#333', fontFamily:'monospace'}}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p style={{color:'#666', textTransform:'uppercase', letterSpacing:'2px', fontSize:'0.8rem'}}>
          {mode === 'focus' ? '🔥 Deep Work' : '☕ Chill Break'}
        </p>
      </div>

      <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
        <button 
          className="mini-btn" 
          onClick={toggleTimer}
          style={{background: isActive ? '#ef5350' : '#2e7d32', width:'100px', justifyContent:'center'}}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="mini-btn small" onClick={() => resetTimer('focus')}>25m Focus</button>
        <button className="mini-btn small" onClick={() => resetTimer('break')}>5m Break</button>
      </div>

      <div style={{background:'#e3f2fd', padding:'10px', borderRadius:'10px', width:'100%', fontSize:'0.85rem', color:'#1565c0'}}>
        <strong>Tip:</strong> Turn on "Brown Noise" in the Soundscapes tool for maximum concentration.
      </div>
    </div>
  );
};

// =========================================================
// 12. THE BURN BOX (Vent & Destroy)
// =========================================================
export const MiniBurn = () => {
  const [text, setText] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [burned, setBurned] = useState(false);

  const handleBurn = () => {
    if(!text) return;
    setIsBurning(true);
    setTimeout(() => {
      setText("");
      setIsBurning(false);
      setBurned(true);
      setTimeout(() => setBurned(false), 3000);
    }, 2000); // 2 second animation
  };

  if (isBurning) {
    return (
      <div className="mini-tool-container" style={{height:'200px', justifyContent:'center'}}>
        <div className="fire-animation">
          <Flame size={64} color="#e65100" className="flicker" />
          <p style={{color:'#e65100', fontWeight:'bold', marginTop:'10px'}}>Letting it go...</p>
        </div>
      </div>
    );
  }

  if (burned) {
    return (
      <div className="mini-tool-container" style={{height:'200px', justifyContent:'center'}}>
        <Check size={48} color="#2e7d32" />
        <h3 style={{color:'#2e7d32'}}>Gone.</h3>
        <p style={{textAlign:'center', color:'#666'}}>Those thoughts no longer hold power over you.</p>
        <button className="mini-btn" onClick={() => setBurned(false)} style={{marginTop:'15px'}}>Write Again</button>
      </div>
    );
  }

  return (
    <div className="mini-tool-container">
      <p style={{fontSize:'0.9rem', color:'#666', textAlign:'center', marginBottom:'10px'}}>
        Type out your anger, stress, or worries. Then burn them. They won't be saved anywhere.
      </p>
      <textarea 
        placeholder="I am feeling frustrated because..." 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="mini-textarea"
        style={{background:'#fff3e0', borderColor:'#ffe0b2'}}
      />
      <button 
        className="mini-btn" 
        onClick={handleBurn} 
        disabled={!text}
        style={{background:'#d32f2f', width:'100%', justifyContent:'center'}}
      >
        <Flame size={18}/> Burn This Thought
      </button>
    </div>
  );
};