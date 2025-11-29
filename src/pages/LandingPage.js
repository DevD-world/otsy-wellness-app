import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ChevronDown, ChevronUp, X, 
  Activity, Shield, Users, Star, Plus, Minus,
  Wind, HeartHandshake, Lock
} from 'lucide-react';
import './LandingPage.css';

// IMPORT THE NEW MINI TOOLS
import { MiniBreathing, MiniJournal, MiniMood, MiniSound } from '../components/MiniTools';

const OTSY_IMG_URL = "otsy.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCloud, setSelectedCloud] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const cloudData = [
    { id: 1, label: "Overthinking?", detail: "Racing thoughts? Zen Mode quiets the noise.", pos: "pos-1" },
    { id: 2, label: "Phobia?", detail: "Face fears with gradual exposure techniques.", pos: "pos-2" },
    { id: 3, label: "Anxious?", detail: "Instant grounding when panic strikes.", pos: "pos-3" },
    { id: 4, label: "Stressed?", detail: "Lower cortisol with 4-7-8 breathing.", pos: "pos-4" },
    { id: 5, label: "Emotional?", detail: "Untangle the chaos with mood tracking.", pos: "pos-5" }
  ];

  // FEATURES - Added a 'type' property to know which tool to show
  const features = [
    {
      id: 1,
      title: "Mood Tracking",
      desc: "Identify emotional patterns with analytics.",
      longDesc: "Try tracking your mood right now. In the full app, you'll see charts and trends.",
      icon: <Activity size={28}/>,
      colorClass: "blue",
      type: "mood" // Trigger MiniMood
    },
    {
      id: 2,
      title: "Private Journal",
      desc: "Encrypted locally on your device.",
      longDesc: "Write a quick thought. It saves to your browser's local storage instantly.",
      icon: <Lock size={28}/>,
      colorClass: "purple",
      type: "journal" // Trigger MiniJournal
    },
    {
      id: 3,
      title: "Professional Help",
      desc: "Connect with verified therapists.",
      longDesc: "This requires a secure login to protect patient confidentiality. Please sign in to book.",
      icon: <Users size={28}/>,
      colorClass: "green",
      type: "auth" // Trigger Auth Redirect
    },
    {
      id: 4,
      title: "Gamified Growth",
      desc: "Earn badges and streaks.",
      longDesc: "Every action you take earns XP. In the dashboard, you can unlock badges like 'Mindful Master' and 'Streak Keeper'.",
      icon: <Star size={28}/>,
      colorClass: "gold",
      type: "redirect" // Redirect to Dashboard
    },
    {
      id: 5,
      title: "Breathing Tools",
      desc: "Reduce stress in 60 seconds.",
      longDesc: "Follow the circle. Breathe in when it expands, out when it shrinks.",
      icon: <Wind size={28}/>,
      colorClass: "cyan",
      type: "breathing" // Trigger MiniBreathing
    },
    {
      id: 6,
      title: "Soundscapes", 
      desc: "Focus or relax with ambient sounds.",
      longDesc: "Listen to this sample of heavy rain. The full app includes Forest, Ocean, and White Noise.",
      icon: <HeartHandshake size={28}/>,
      colorClass: "pink",
      type: "sound" // Trigger MiniSound
    }
  ];

  // Helper to render the correct widget inside the modal
  const renderWidget = (feature) => {
    switch(feature.type) {
      case 'breathing': return <MiniBreathing />;
      case 'journal': return <MiniJournal />;
      case 'mood': return <MiniMood />;
      case 'sound': return <MiniSound />;
      case 'auth': 
        return <button className="cta-primary" onClick={() => navigate('/auth')}>Login to Book</button>;
      default: 
        return <button className="cta-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>;
    }
  };

  return (
    <div className="landing-container">
      {/* ... NAV AND HERO (Keep exact same code) ... */}
      <nav className="landing-nav">
        <h2 className="logo">Otsy.</h2>
        <div className="nav-links">
          <button className="login-link" onClick={() => navigate('/auth')}>Log In</button>
          <button className="signup-btn" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      <header className="hero-section-centered">
        <div className="hero-text-center">
          <div className="badge-pill">✨ Your Mental Wellness Companion</div>
          <h1>Don't Let Your Mind <br/> <span className="highlight-text">Bully You.</span></h1>
          <p>Tap the clouds below to see how Otsy helps you find your calm.</p>
          <button className="cta-primary center-btn" onClick={() => navigate('/auth')}>
            Start Your Journey <ArrowRight size={18} />
          </button>
        </div>

        <div className="interactive-sky-center">
          <div className="otter-center floating">
             <img src={OTSY_IMG_URL} alt="Otsy Otter" className="main-otter-img" />
          </div>
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
                <h3>{selectedCloud.label}</h3>
                <div className="modal-divider"></div>
                <p>{selectedCloud.detail}</p>
                <button className="cloud-cta-btn" onClick={() => navigate('/dashboard/tools')}>Try It Free</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="features-section">
        <div className="section-header">
          <h3>Try It Right Now</h3>
          <p>Tap a card to use the tool instantly, without signing up.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="feature-card-interactive" 
              onClick={() => setSelectedFeature(feature)}
            >
              <div className={`f-icon-large ${feature.colorClass}`}>
                {feature.icon}
              </div>
              <div className="f-content">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <span className="learn-more-link">Try now <ArrowRight size={14}/></span>
              </div>
            </div>
          ))}
        </div>

        {/* --- INTERACTIVE FEATURE MODAL --- */}
        {selectedFeature && (
          <div className="feature-modal-overlay" onClick={() => setSelectedFeature(null)}>
            <div className="feature-modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-feature" onClick={() => setSelectedFeature(null)}><X/></button>
              
              <div className={`modal-icon-header ${selectedFeature.colorClass}`}>
                {selectedFeature.icon}
              </div>
              
              <h2>{selectedFeature.title}</h2>
              <p className="feature-modal-desc">{selectedFeature.longDesc}</p>
              
              {/* --- HERE IS THE INTERACTIVE PART --- */}
              <div className="feature-modal-actions">
                {renderWidget(selectedFeature)}
              </div>

            </div>
          </div>
        )}
      </section>

      {/* ... FAQ & FOOTER (Keep same logic) ... */}
      <footer className="landing-footer"><p>© 2025 Otsy Wellness.</p></footer>
    </div>
  );
};

export default LandingPage;