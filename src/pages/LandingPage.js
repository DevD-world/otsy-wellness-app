import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ChevronDown, ChevronUp, X, 
  Activity, Shield, Users, Star, Plus, Minus,
  Wind, HeartHandshake, Lock, Zap, BookOpen, Lightbulb, Quote, Heart, Mail
} from 'lucide-react';
import './LandingPage.css';

// IMPORT ALL TOOLS
import { MiniBreathing, MiniJournal, MiniMood, MiniSound, MiniBubble, MiniMemory, MiniLibrary, MiniFacts } from '../components/MiniTools';

const OTSY_IMG_URL = "otsy.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCloud, setSelectedCloud] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeGame, setActiveGame] = useState('bubble'); 

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const cloudData = [
    { id: 1, label: "Overthinking?", detail: "Racing thoughts? Zen Mode quiets the noise.", pos: "pos-1" },
    { id: 2, label: "Phobia?", detail: "Face fears with gradual exposure techniques.", pos: "pos-2" },
    { id: 3, label: "Anxious?", detail: "Instant grounding when panic strikes.", pos: "pos-3" },
    { id: 4, label: "Stressed?", detail: "Lower cortisol with 4-7-8 breathing.", pos: "pos-4" },
    { id: 5, label: "Emotional?", detail: "Untangle the chaos with mood tracking.", pos: "pos-5" }
  ];

  // --- UPDATED FEATURES ---
  const features = [
    {
      id: 1, title: "Wellness Library",
      desc: "Read articles instantly.",
      longDesc: "Access bite-sized guides on sleep, anxiety, and psychology without leaving this page.",
      icon: <BookOpen size={28}/>, colorClass: "blue", type: "library" // New
    },
    {
      id: 2, title: "Private Journal",
      desc: "Encrypted locally.",
      longDesc: "Write without fear. Saves to your browser instantly.",
      icon: <Lock size={28}/>, colorClass: "purple", type: "journal"
    },
    {
      id: 5, title: "Anxiety Games",
      desc: "Pop, Match, Relax.",
      longDesc: "Tactile distractions to stop panic spirals.",
      icon: <Zap size={28}/>, colorClass: "cyan", type: "game" 
    },
    {
      id: 6, title: "Soundscapes",
      desc: "Rain, Forest, Fire.",
      longDesc: "Layered sounds to help you focus or sleep.",
      icon: <HeartHandshake size={28}/>, colorClass: "pink", type: "sound"
    },
    {
      id: 7, title: "Brain Facts",
      desc: "Did you know?",
      longDesc: "Learn something new about your psychology.",
      icon: <Lightbulb size={28}/>, colorClass: "gold", type: "facts" // New
    },
    {
      id: 3, title: "Professional Help",
      desc: "Verified therapists.",
      longDesc: "Login required for booking to ensure privacy.",
      icon: <Users size={28}/>, colorClass: "green", type: "auth"
    },
  ];

  const renderWidget = (feature) => {
    switch(feature.type) {
      case 'library': return <MiniLibrary />;
      case 'journal': return <MiniJournal />;
      case 'facts': return <MiniFacts />;
      case 'sound': return <MiniSound />;
      case 'game': 
        return (
          <div style={{width: '100%'}}>
            <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'20px'}}>
              <button onClick={()=>setActiveGame('bubble')} style={{padding:'5px 15px', borderRadius:'15px', border:'1px solid #eee', background: activeGame==='bubble'?'#e0f7fa':'white', cursor:'pointer'}}>Bubble Pop</button>
              <button onClick={()=>setActiveGame('memory')} style={{padding:'5px 15px', borderRadius:'15px', border:'1px solid #eee', background: activeGame==='memory'?'#e0f7fa':'white', cursor:'pointer'}}>Memory Match</button>
            </div>
            {activeGame === 'bubble' ? <MiniBubble /> : <MiniMemory />}
          </div>
        );
      case 'auth': 
        return <div style={{textAlign:'center'}}><p style={{marginBottom:'15px'}}>Login required.</p><button className="cta-primary" onClick={() => navigate('/auth')}>Log In / Sign Up</button></div>;
      default: return null;
    }
  };

  // ... (Testimonials, FAQs, Footer remain the same as previous step) ...
  const testimonials = [
    { id: 1, name: "Sarah J.", role: "Student", text: "Otsy helps me sleep before exams. The Brown Noise is a lifesaver!", avatar: "S" },
    { id: 2, name: "Mike T.", role: "Developer", text: "I use the Zen Mode every afternoon to reset my focus.", avatar: "M" },
    { id: 3, name: "Dr. A. Patel", role: "Therapist", text: "I recommend this to my patients for tracking mood.", avatar: "A" }
  ];

  return (
    <div className="landing-container">
      {/* Nav */}
      <nav className="landing-nav">
        <h2 className="logo">Otsy.</h2>
        <div className="nav-links">
          <button className="login-link" onClick={() => navigate('/auth')}>Log In</button>
          <button className="signup-btn" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero-section-centered">
        <div className="hero-text-center">
          <div className="badge-pill">✨ Your Mental Wellness Companion</div>
          <h1>Don't Let Your Mind <br/> <span className="highlight-text">Bully You.</span></h1>
          <p>Tap the clouds below to see how Otsy helps you find your calm.</p>
          <button className="cta-primary center-btn" onClick={() => navigate('/auth')}>Start Your Journey <ArrowRight size={18} /></button>
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
                <button className="cloud-cta-btn" onClick={() => { setSelectedCloud(null); document.querySelector('.features-section').scrollIntoView({behavior: 'smooth'}); }}>Try Free Tools</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header"><h3>Try It Right Now</h3><p>Tap a card to use the tool instantly. No login required.</p></div>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card-interactive" onClick={() => setSelectedFeature(feature)}>
              <div className={`f-icon-large ${feature.colorClass}`}>{feature.icon}</div>
              <div className="f-content"><h3>{feature.title}</h3><p>{feature.desc}</p><span className="learn-more-link">Try now <ArrowRight size={14}/></span></div>
            </div>
          ))}
        </div>
        {selectedFeature && (
  <div className="feature-modal-overlay" onClick={() => setSelectedFeature(null)}>
    {/* DYNAMIC CLASS: 
       If type is 'library', add 'full-screen' class. 
       Otherwise, use normal card style.
    */}
    <div 
      className={`feature-modal-card ${selectedFeature.type === 'library' ? 'full-screen' : ''}`} 
      onClick={(e) => e.stopPropagation()}
    >
      <button className="close-feature" onClick={() => setSelectedFeature(null)}><X/></button>
      
      {/* CONDITIONAL HEADER: 
         Only show the Icon/Title/Desc if NOT in Library mode (CSS hides it, but logic is safer)
      */}
      {selectedFeature.type !== 'library' && (
        <>
          <div className={`modal-icon-header ${selectedFeature.colorClass}`}>
            {selectedFeature.icon}
          </div>
          <h2>{selectedFeature.title}</h2>
          <p className="feature-modal-desc">{selectedFeature.longDesc}</p>
        </>
      )}

      {/* For Library, we might want a custom header inside the component, or just the tool */}
      {selectedFeature.type === 'library' && (
        <div style={{marginBottom:'20px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
           <h2 style={{margin:0, color:'#1565c0'}}>Otsy Library</h2>
           <p style={{margin:0, color:'#64748b'}}>Read, Listen, and Watch.</p>
        </div>
      )}

      <div className="feature-modal-actions">
        {renderWidget(selectedFeature)}
      </div>
    </div>
  </div>
)}
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header"><h3>Loved by the Community</h3></div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.id} className="testi-card">
              <Quote className="quote-icon" size={24}/><p>"{t.text}"</p>
              <div className="testi-user"><div className="testi-avatar">{t.avatar}</div><div><h4>{t.name}</h4><span>{t.role}</span></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="fat-footer">
        <div className="footer-content">
          <div className="footer-brand"><h2>Otsy.</h2><p>Your daily dose of calm.</p></div>
          <div className="footer-links">
            <div className="link-col"><h4>Product</h4><span>Features</span><span>Pricing</span></div>
            <div className="link-col"><h4>Company</h4><span>About Us</span><span>Contact</span></div>
          </div>
        </div>
        <div className="footer-bottom"><p>© 2025 Otsy Wellness.</p></div>
      </footer>
    </div>
  );
};

export default LandingPage;