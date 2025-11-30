import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Activity, Users, Star, 
  Wind, HeartHandshake, Lock, Zap, BookOpen, Lightbulb, 
  CheckCircle, ShieldCheck, Smile, Brain, 
  X, Plus, Minus, Clock, CheckSquare, Timer, Flame // <--- ADDED THESE IMPORTS
} from 'lucide-react';
import './LandingPage.css';

import { MiniBreathing, MiniJournal, MiniMood, MiniSound, MiniBubble, MiniMemory, MiniLibrary, MiniFacts, MiniSleep, MiniHabits,MiniBurn, MiniFocus } from '../components/MiniTools';
// IMPORT ALL TOOLS


const OTSY_IMG_URL = "otsy.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedCloud, setSelectedCloud] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeGame, setActiveGame] = useState('bubble'); 
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null); // Added state for FAQ

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const cloudData = [
    { id: 1, label: "Overthinking?", detail: "Racing thoughts? Zen Mode quiets the noise.", pos: "pos-1" },
    { id: 2, label: "Phobia?", detail: "Face fears with gradual exposure techniques.", pos: "pos-2" },
    { id: 3, label: "Anxious?", detail: "Instant grounding when panic strikes.", pos: "pos-3" },
    { id: 4, label: "Stressed?", detail: "Lower cortisol with 4-7-8 breathing.", pos: "pos-4" },
    { id: 5, label: "Emotional?", detail: "Untangle the chaos with mood tracking.", pos: "pos-5" }
  ];

  // --- FEATURES CONFIG ---
  const features = [
    { id: 1, title: "Mood Refreshing", desc: "Shift your mindset instantly.", longDesc: "Track how you feel or express gratitude.", icon: <Activity size={28}/>, colorClass: "blue", type: "mood" },
    { id: 2, title: "Private Journal", desc: "Encrypted locally on your device.", longDesc: "Write without fear. Saves to your browser instantly.", icon: <Lock size={28}/>, colorClass: "purple", type: "journal" },
    { id: 5, title: "Anxiety Games", desc: "Pop, Match, Relax.", longDesc: "Tactile distractions to stop panic spirals.", icon: <Zap size={28}/>, colorClass: "cyan", type: "game" },
    { id: 6, title: "Soundscapes", desc: "Rain, Forest, Fire.", longDesc: "Layered sounds to help you focus or sleep.", icon: <HeartHandshake size={28}/>, colorClass: "pink", type: "sound" },
    { id: 7, title: "Brain Facts", desc: "Did you know?", longDesc: "Learn something new about your psychology.", icon: <Lightbulb size={28}/>, colorClass: "gold", type: "facts" },
    { id: 10, title: "Wellness Library", desc: "Read, Listen, Watch.", longDesc: "A complete collection of mental health resources.", icon: <BookOpen size={28}/>, colorClass: "indigo", type: "library" },
    { id: 8, title: "Sleep Calculator", desc: "Wake up refreshed.", longDesc: "Calculate the perfect bedtime based on 90-minute REM sleep cycles.", icon: <Clock size={28}/>, colorClass: "indigo", type: "sleep" },
    { id: 9, title: "Habit Tracker", desc: "Build small wins.", longDesc: "A simple daily checklist to keep you grounded and moving forward.", icon: <CheckSquare size={28}/>, colorClass: "green", type: "habits" },
    { 
      id: 11, title: "Zen Focus Timer", 
      desc: "Boost productivity.", 
      longDesc: "A Pomodoro-style timer to help you work in focused bursts without burning out.", 
      icon: <Timer size={28}/>, colorClass: "cyan", type: "focus" 
    },
    { 
      id: 12, title: "Venting Box", 
      desc: "Write & Destroy.", 
      longDesc: "A safe space to release anger or intrusive thoughts. Type it out, burn it, and let it go.", 
      icon: <Flame size={28}/>, colorClass: "red", type: "burn" 
    },
  ];

  const faqs = [
    { q: "I feel anxious often. How can Otsy help?", a: "Otsy has a dedicated 'Zen Mode'. It instantly blocks distractions and guides you through breathing exercises." },
    { q: "Can this app help me sleep better?", a: "Yes. Our 'Soundscapes' tool provides brown noise, rain, and forest ambiances to help you disconnect." },
    { q: "Is Otsy a replacement for a therapist?", a: "No, it is a self-care companion. However, if you need human help, our 'Professionals' tab connects you with verified therapists." },
    { q: "Is my journal actually private?", a: "100%. We use 'Local Storage Encryption'. Your journal entries live on your device, not our servers." },
    { q: "Is it free?", a: "The core features—Mood Tracking, Journaling, and Games—are completely free forever." }
  ];

  const renderWidget = (feature) => {
    switch(feature.type) {
      case 'library': return <MiniLibrary />;
      case 'journal': return <MiniJournal />;
      case 'facts': return <MiniFacts />;
      case 'sound': return <MiniSound />;
      case 'mood': return <MiniMood />;
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
      case 'sleep': return <MiniSleep />;   // NEW
      case 'habits': return <MiniHabits />;
      case 'focus': return <MiniFocus />; // NEW
      case 'burn': return <MiniBurn />;
      default: return null;
    }
  };

  return (
    <div className="landing-container">
      
      {/* 1. NAVBAR (Sticky & Glass) */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <h2 className="logo">Mindful Holt</h2>
        <div className="nav-links">
          <button className="login-link" onClick={() => navigate('/auth')}>Log In</button>
          <button className="signup-btn" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      {/* 2. HERO SECTION (Classic Otsy) */}
      <header className="hero-section-centered">
        <div className="hero-text-center">
          <div className="badge-pill">✨ #1 Wellness Companion 2025</div>
          <h1>Find Your Balance in a <br/> <span className="highlight-text">Noisy World.</span></h1>
          <p>Your personal AI companion for anxiety, sleep, and self-growth. <br/>Private, effective, and free.</p>
          <div className="hero-btn-row">
            <button className="cta-primary center-btn" onClick={() => navigate('/auth')}>Start Your Journey <ArrowRight size={18} /></button>
            <button className="cta-secondary" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>Explore Tools</button>
          </div>
        </div>
        <div className="interactive-sky-center">
          <div className="otter-center floating"><img src={OTSY_IMG_URL} alt="Otsy Otter" className="main-otter-img" /></div>
          <div className="clouds-layer-center">
            {cloudData.map((cloud) => (
              <div key={cloud.id} className={`cloud-btn-wrapper ${cloud.pos}`} onClick={() => setSelectedCloud(cloud)}>
                <div className="fluffy-cloud-shape"><span>{cloud.label}</span></div>
              </div>
            ))}
          </div>
          {selectedCloud && (
            <div className="cloud-modal-overlay" onClick={() => setSelectedCloud(null)}>
              <div className="fluffy-modal-cloud fadeInPop" onClick={(e) => e.stopPropagation()}>
                <button className="close-cloud" onClick={() => setSelectedCloud(null)}><X/></button>
                <h3>{selectedCloud.label}</h3><div className="modal-divider"></div><p>{selectedCloud.detail}</p>
                <button className="cloud-cta-btn" onClick={() => { setSelectedCloud(null); document.getElementById('features').scrollIntoView({behavior:'smooth'}); }}>Fix this now</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 3. SCROLLING MARQUEE (Modern Feel) */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>SLEEP BETTER • REDUCE ANXIETY • FOCUS DEEPER • TRACK MOODS • FIND THERAPY • BREATHE EASIER • </span>
          <span>SLEEP BETTER • REDUCE ANXIETY • FOCUS DEEPER • TRACK MOODS • FIND THERAPY • BREATHE EASIER • </span>
        </div>
      </div>

      {/* 4. THE PROBLEM & SOLUTION (Persuasion) */}
      <section className="problem-solution-section">
        <div className="ps-container">
          <div className="ps-text">
            <h3 className="section-label">WHY OTSY?</h3>
            <h2>Mental health support shouldn't be complicated.</h2>
            <p>You don't need another complex dashboard. You need a friend. Otsy combines scientifically proven CBT techniques with a simple, friendly interface to help you feel better in minutes, not months.</p>
            <ul className="benefits-list">
              <li><CheckCircle size={20} color="#2e7d32"/> <strong>Instant Relief:</strong> Games & Breathing tools ready in 1 tap.</li>
              <li><CheckCircle size={20} color="#2e7d32"/> <strong>Data Privacy:</strong> Your journal never leaves your device.</li>
              <li><CheckCircle size={20} color="#2e7d32"/> <strong>Professional Care:</strong> Access to 50+ verified therapists.</li>
            </ul>
          </div>
          <div className="ps-visual">
            <div className="stat-floater f1"><Brain size={24}/> <span>Cognitive Therapy</span></div>
            <div className="stat-floater f2"><Smile size={24}/> <span>Mood Analysis</span></div>
            <div className="stat-floater f3"><ShieldCheck size={24}/> <span>100% Private</span></div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FEATURES GRID */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h3>Interactive Wellness Toolkit</h3>
          <p>Don't just read about relief. Experience it right now.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card-interactive" onClick={() => setSelectedFeature(feature)}>
              <div className={`f-icon-large ${feature.colorClass}`}>{feature.icon}</div>
              <div className="f-content"><h3>{feature.title}</h3><p>{feature.desc}</p><span className="learn-more-link">Open Tool <ArrowRight size={14}/></span></div>
            </div>
          ))}
        </div>

        {/* FEATURE MODAL */}
        {selectedFeature && (
          <div className="feature-modal-overlay" onClick={() => setSelectedFeature(null)}>
            <div className={`feature-modal-card ${selectedFeature.type === 'library' ? 'full-screen' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button className="close-feature" onClick={() => setSelectedFeature(null)}><X/></button>
              
              {selectedFeature.type !== 'library' && (
                <>
                  <div className={`modal-icon-header ${selectedFeature.colorClass}`}>{selectedFeature.icon}</div>
                  <h2>{selectedFeature.title}</h2><p className="feature-modal-desc">{selectedFeature.longDesc}</p>
                </>
              )}
              
              {selectedFeature.type === 'library' && (
                <div style={{marginBottom:'20px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                   <h2 style={{margin:0, color:'#1565c0'}}>Otsy Library</h2><p style={{margin:0, color:'#64748b'}}>Read, Listen, and Watch.</p>
                </div>
              )}

              <div className="feature-modal-actions">{renderWidget(selectedFeature)}</div>
            </div>
          </div>
        )}
      </section>

      {/* 6. PRIVACY & SCIENCE (Trust) */}
      <section className="privacy-banner">
        <div className="privacy-content">
          <ShieldCheck size={48} className="shield-icon"/>
          <div>
            <h3>Your Thoughts Are Yours Alone.</h3>
            <p>We use <strong>Local-First Architecture</strong>. This means your journal entries and personal reflections are encrypted on your device. We cannot read them. We do not sell them.</p>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="faq-section">
        <div className="section-header">
          <h3>Common Questions</h3>
        </div>
        <div className="faq-container">
          {faqs.map((item, i) => (
             <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
               <div className="faq-question">
                 <h4>{item.q}</h4>
                 <div className="icon-wrapper">{openFaq === i ? <Minus size={20}/> : <Plus size={20}/>}</div>
               </div>
               <div className="faq-answer"><div className="answer-content"><p>{item.a}</p></div></div>
             </div>
          ))}
        </div>
      </section>

      {/* 8. PROFESSIONAL FOOTER */}
      <footer className="fat-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>Mindful Holt</h2>
            <p>Made with 💙 for a healthier mind.</p>
            <p className="copyright">© 2025 Mindful Holt | Otsy Wellness Inc.</p>
          </div>
          <div className="footer-links">
            <div className="link-col"><h4>Platform</h4><span>Web App</span><span>iOS (Coming Soon)</span><span>Android (Coming Soon)</span></div>
            <div className="link-col"><h4>Resources</h4><span>Crisis Support</span><span>Find a Therapist</span><span>Community</span></div>
            <div className="link-col"><h4>Legal</h4><span>Privacy Policy</span><span>Terms of Service</span><span>Cookie Policy</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;