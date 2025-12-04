import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Activity, Wind, HeartHandshake, Lock, Zap, BookOpen, Lightbulb, 
  CheckCircle, ShieldCheck, Smile, X, Plus, Minus, AlertTriangle, Sparkles, Anchor, Shield, Eye, Flame, Moon, Gamepad2
} from 'lucide-react';
import Logo from '../assets/logo.png'; 
import './LandingPage.css';

// Import ALL MiniTools
import { 
  MiniBreathing, MiniJournal, MiniMood, MiniSound, 
  MiniBubble, MiniMemory, MiniLibrary, MiniFacts, 
  MiniSleep, MiniFocus, MiniBurn,
  MiniSobriety, MiniSafeSpace, MiniGrounding
} from '../components/MiniTools';

import PanicOverlay from '../components/PanicOverlay';
import PublicChatWidget from '../components/PublicChatWidget';

// --- FIXED: IMAGE PATHS FOR PUBLIC FOLDER ---
// Since these are in the public folder, we use string paths starting with "/"
const OTSY_DEFAULT = "/otsy.png"; 
const OTSY_DR = "/otsydr.png";
const OTSY_YOGA = "/otsyyoga.png";
const OTSY_CON = "/otsycon.png";

// --- STATIC DATA (Defined outside to prevent crashes) ---

const TIPS = [
  "Did you know? 4-7-8 breathing can stop a panic attack in 2 minutes.",
  "Fact: Writing down worries reduces their power.",
  "Tip: Brown noise helps ADHD brains focus.",
  "Reminder: Healing is not linear."
];

const CLOUD_DATA = [
  { id: 1, label: "Overthinking?", detail: "Racing thoughts? Use the Zen Focus Timer to channel that energy.", pos: "pos-1", toolType: 'focus' },
  { id: 2, label: "Phobia/Fear?", detail: "Face fears safely. Try the Safe Space visualization.", pos: "pos-2", toolType: 'safespace' },
  { id: 3, label: "Anxious?", detail: "Instant grounding. Use the 5-4-3-2-1 technique now.", pos: "pos-3", toolType: 'grounding' },
  { id: 4, label: "Can't Sleep?", detail: "Calculate your perfect wake-up time.", pos: "pos-4", toolType: 'sleep' },
  { id: 5, label: "Emotional?", detail: "Untangle the chaos with mood tracking.", pos: "pos-5", toolType: 'mood' }
];

// --- UPDATED CATEGORIES WITH YOUR IMAGES ---
const CATEGORIES = [
  { 
    id: 'c1', title: "Psychologists", 
    desc: "Experts in talk therapy (CBT, DBT). They help you understand your thought patterns.", 
    imgUrl: OTSY_DEFAULT, // Uses public/otsydr.png
    color: "blue" 
  },
  { 
    id: 'c2', title: "Psychiatrists", 
    desc: "Medical doctors who can diagnose conditions and prescribe medication if needed.", 
    imgUrl: OTSY_DR, // Uses public/otsydr.png
    color: "purple" 
  },
  { 
    id: 'c3', title: "Yoga & Somatic", 
    desc: "Heal trauma through the body using movement and breathwork.", 
    imgUrl: OTSY_YOGA, // Uses public/otsyyoga.png
    color: "green" 
  },
  { 
    id: 'c4', title: "Counselors", 
    desc: "Guidance for life transitions, grief, or relationship issues.", 
    imgUrl: OTSY_CON, // Uses public/otsycon.png
    color: "gold" 
  }
];

const FEATURES = [
  { id: 1, title: "Mood Refreshing", desc: "Shift your mindset.", longDesc: "Track how you feel.", icon: <Activity size={28}/>, colorClass: "blue", type: "mood" },
  { id: 2, title: "Private Journal", desc: "Encrypted locally.", longDesc: "Write without fear.", icon: <Lock size={28}/>, colorClass: "purple", type: "journal" },
  { id: 6, title: "Soundscapes", desc: "Rain, Forest, Fire.", longDesc: "Layered sounds.", icon: <HeartHandshake size={28}/>, colorClass: "pink", type: "sound" },
  { id: 10, title: "Wellness Library", desc: "Read, Listen, Watch.", longDesc: "Resources.", icon: <BookOpen size={28}/>, colorClass: "indigo", type: "library" },
  { id: 11, title: "Zen Focus Timer", desc: "Boost productivity.", longDesc: "Pomodoro timer.", icon: <Wind size={28}/>, colorClass: "cyan", type: "focus" },
  { id: 12, title: "Burn Box", desc: "Write & Destroy.", longDesc: "Type a worry and watch it burn.", icon: <Flame size={28}/>, colorClass: "red", type: "burn" },
  { id: 13, title: "Grounding", desc: "Stop dissociation.", longDesc: "5-4-3-2-1 Technique.", icon: <Eye size={28}/>, colorClass: "green", type: "grounding" },
  { id: 14, title: "Sobriety Anchor", desc: "Recover & Track.", longDesc: "Track days clean.", icon: <Anchor size={28}/>, colorClass: "blue", type: "sobriety" },
  { id: 15, title: "Trauma Safe Space", desc: "Find safety.", longDesc: "Guided visualization.", icon: <Shield size={28}/>, colorClass: "purple", type: "safespace" },
  { id: 8, title: "Sleep Calculator", desc: "Wake up refreshed.", longDesc: "Calculate bedtime.", icon: <Moon size={28}/>, colorClass: "gold", type: "sleep" },
  { id: 5, title: "Anxiety Games", desc: "Pop & Match.", longDesc: "Distract your mind.", icon: <Gamepad2 size={28}/>, colorClass: "cyan", type: "game" },
];

const FAQS = [
  { q: "I feel anxious often. How can Otsy help?", a: "Otsy has a dedicated 'Zen Mode' and Grounding tools to stop spirals immediately." },
  { q: "Can this app help me sleep better?", a: "Yes. Our 'Soundscapes' and 'Sleep Calculator' help you disconnect." },
  { q: "Is Otsy a replacement for a therapist?", a: "No, but we connect you with verified therapists in the 'Find Help' section." },
  { q: "Is my journal actually private?", a: "100%. We use 'Local Storage Encryption'. Data stays on your device." }
];

const LandingPage = () => {
  const navigate = useNavigate();
  
  // STATE DEFINITIONS
  const [selectedCloud, setSelectedCloud] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showPanic, setShowPanic] = useState(false); 
  const [showAffirmation, setShowAffirmation] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [activeGame, setActiveGame] = useState('bubble');

  // --- EFFECTS ---
  
  // 1. Scroll & Affirmation Timer
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(() => setShowAffirmation(false), 3500);
    
    return () => { 
      window.removeEventListener('scroll', handleScroll); 
      clearTimeout(timer); 
    };
  }, []);

  // 2. Tip Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const handleCloudFix = (toolType) => {
    const feature = FEATURES.find(f => f.type === toolType);
    if (feature) {
      setSelectedCloud(null);
      setSelectedFeature(feature);
    } else {
      setSelectedCloud(null);
      if (toolType === 'panic') setShowPanic(true);
    }
  };

  const renderWidget = (feature) => {
    switch(feature.type) {
      case 'library': return <MiniLibrary />;
      case 'journal': return <MiniJournal />;
      case 'sound': return <MiniSound />;
      case 'mood': return <MiniMood />;
      case 'focus': return <MiniFocus />;
      case 'burn': return <MiniBurn />;
      case 'grounding': return <MiniGrounding />;
      case 'sobriety': return <MiniSobriety />;
      case 'safespace': return <MiniSafeSpace />;
      case 'sleep': return <MiniSleep />;
      case 'game': 
        return (
          <div style={{width: '100%'}}>
            <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'20px'}}>
              <button onClick={()=>setActiveGame('bubble')} className={`game-tab ${activeGame==='bubble'?'active':''}`}>Bubble Pop</button>
              <button onClick={()=>setActiveGame('memory')} className={`game-tab ${activeGame==='memory'?'active':''}`}>Memory Match</button>
            </div>
            {activeGame === 'bubble' ? <MiniBubble /> : <MiniMemory />}
          </div>
        );
      default: return <p>Tool loading...</p>;
    }
  };

  return (
    <div className="landing-container">
      {/* AFFIRMATION OVERLAY */}
      {showAffirmation && (
        <div className="affirmation-overlay">
          <div className="affirmation-content">
            <Sparkles size={40} color="#F4A261" className="sparkle-anim"/>
            <h2>"Nothing can bring you PEACE but yourself can!!"</h2>
            <p>Welcome to Mindful Holt.</p>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <img src={Logo} alt="Mindful Holt" className="landing-logo-img" />
          <span style={{fontFamily: 'Quicksand, sans-serif', fontWeight: '700', fontSize: '1.5rem', color: scrolled ? '#1565c0' : 'white'}}>Mindful Holt</span>
        </div>
        <div className="nav-links">
          <button className="panic-nav-btn" onClick={() => setShowPanic(true)}>
            <AlertTriangle size={18} /> <span>Panic Mode</span>
          </button>
          <button className="login-link" onClick={() => navigate('/auth')}>Log In</button>
          <button className="signup-btn" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-section-centered">
        <div className="hero-text-center">
          <div className="badge-pill">✨ #1 Wellness Companion</div>
          <h1>Find Your Balance in a <br/> <span className="highlight-text">Noisy World.</span></h1>
          
          <div className="rotating-tip-box">
            <p key={tipIndex} className="fade-text">{TIPS[tipIndex]}</p>
          </div>

          <div className="hero-btn-row">
            <button className="cta-primary center-btn" onClick={() => navigate('/auth')}>Start Your Journey <ArrowRight size={18} /></button>
          </div>
        </div>
        <div className="interactive-sky-center">
          <div className="otter-center floating"><img src={OTSY_DEFAULT} alt="Otsy" className="main-otter-img" /></div>
          
          {/* CLOUDS */}
          <div className="clouds-layer-center">
            {CLOUD_DATA.map((cloud) => (
              <div key={cloud.id} className={`cloud-btn-wrapper ${cloud.pos}`} onClick={() => setSelectedCloud(cloud)}>
                <div className="fluffy-cloud-shape"><span>{cloud.label}</span></div>
              </div>
            ))}
          </div>
          
          {/* CLOUD POPUP */}
          {selectedCloud && (
            <div className="cloud-modal-overlay" onClick={() => setSelectedCloud(null)}>
              <div className="fluffy-modal-cloud fadeInPop" onClick={(e) => e.stopPropagation()}>
                <button className="close-cloud" onClick={() => setSelectedCloud(null)}><X/></button>
                <h3>{selectedCloud.label}</h3>
                <div className="modal-divider"></div>
                <p>{selectedCloud.detail}</p>
                <button className="cloud-cta-btn" onClick={() => handleCloudFix(selectedCloud.toolType)}>
                  Fix this now
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* SPECIALISTS SECTION */}
      <section className="categories-section">
        <div className="section-header-small">
          <h3>Expert Support</h3>
          <p>Verified professionals ready to help you.</p>
        </div>
        <div className="cat-scroll-container">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className={`cat-card ${cat.color}`} onClick={() => setSelectedCategory(cat)}>
              <div className="cat-img-wrapper"><img src={cat.imgUrl} alt={cat.title} className="cat-img" /></div>
              <h4>{cat.title}</h4>
            </div>
          ))}
        </div>

        {/* SPECIALIST POPUP */}
        {selectedCategory && (
          <div className="cloud-modal-overlay" onClick={() => setSelectedCategory(null)}>
            <div className="fluffy-modal-cloud fadeInPop" onClick={(e) => e.stopPropagation()}>
              <button className="close-cloud" onClick={() => setSelectedCategory(null)}><X/></button>
              
              <div className={`modal-img-header ${selectedCategory.color}`}>
                 <img src={selectedCategory.imgUrl} alt={selectedCategory.title} style={{width:'80px', height:'80px', objectFit:'contain'}}/>
              </div>
              
              <h3 style={{marginTop:'15px', color:'#333'}}>{selectedCategory.title}</h3>
              <div className="modal-divider"></div>
              <p style={{textAlign:'left', fontSize:'0.95rem', lineHeight:'1.5'}}>{selectedCategory.desc}</p>
              
              <button className="cloud-cta-btn" onClick={() => navigate('/auth')}>
                Find a {selectedCategory.title.slice(0, -1)}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h3>Interactive Wellness Toolkit</h3>
          <p>Don't just read about relief. Experience it right now.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <div key={feature.id} className="feature-card-interactive" onClick={() => setSelectedFeature(feature)}>
              <div className={`f-icon-large ${feature.colorClass}`}>{feature.icon}</div>
              <div className="f-content"><h3>{feature.title}</h3><p>{feature.desc}</p><span className="learn-more-link">Open Tool <ArrowRight size={14}/></span></div>
            </div>
          ))}
        </div>
        
        {/* TOOL MODAL */}
        {selectedFeature && (
          <div className="feature-modal-overlay" onClick={() => setSelectedFeature(null)}>
            <div className={`feature-modal-card ${selectedFeature.type === 'library' ? 'full-screen' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button className="close-feature" onClick={() => setSelectedFeature(null)}><X/></button>
              
              {selectedFeature.type !== 'library' && (
                <>
                  <div className={`modal-icon-header ${selectedFeature.colorClass}`}>{selectedFeature.icon}</div>
                  <h2>{selectedFeature.title}</h2>
                  <p className="feature-modal-desc">{selectedFeature.longDesc}</p>
                </>
              )}
              
              <div className="feature-modal-actions">{renderWidget(selectedFeature)}</div>
            </div>
          </div>
        )}
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="section-header"><h3>Common Questions</h3></div>
        <div className="faq-container">
          {FAQS.map((item, i) => (
             <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
               <div className="faq-question"><h4>{item.q}</h4><div className="icon-wrapper">{openFaq === i ? <Minus size={20}/> : <Plus size={20}/>}</div></div>
               <div className="faq-answer"><div className="answer-content"><p>{item.a}</p></div></div>
             </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fat-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
              <img src={Logo} alt="Mindful Holt" className="landing-logo-img" style={{height:'50px'}}/>
              <span style={{fontSize:'1.5rem', fontWeight:'bold', color:'white'}}>Mindful Holt</span>
            </div>
            <p>Made with 💙 for a healthier mind.</p>
          </div>
          <div className="footer-links">
            <div className="link-col"><h4>Platform</h4><span>Web App</span><span onClick={() => navigate('/doctor-signup')}>For Therapists</span></div>
          </div>
        </div>
      </footer>

      {showPanic && <PanicOverlay onClose={() => setShowPanic(false)} />}
      <PublicChatWidget />
    </div>
  );
};

export default LandingPage;