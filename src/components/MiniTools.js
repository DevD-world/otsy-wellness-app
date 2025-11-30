import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Save, Check, RefreshCw, Volume2, VolumeX, 
  BookOpen, Headphones, Video, ChevronLeft, Lightbulb, 
  Type, Moon, Sun, ArrowLeft, ArrowRight, X, Filter
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