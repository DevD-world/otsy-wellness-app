import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Settings, Home,
  Brain, Zap, Heart, Sun, ArrowRight, Wind, MessageCircle, Anchor, Shield, X 
} from 'lucide-react';
import { MiniBreathing, MiniSobriety, MiniSafeSpace } from '../components/MiniTools';
import Logo from '../assets/logo.png'; 
import './UserHomePage.css';

const OTSY_IMG = "otsy.png";

const UserHomePage = () => {
  const navigate = useNavigate();
  const [user] = useState(auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [activeTool, setActiveTool] = useState(null);
  const [moodLogged, setMoodLogged] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  const handleMood = async (mood) => {
    if(!user) return;
    try { await addDoc(collection(db, "mood_logs"), { uid: user.uid, mood, createdAt: serverTimestamp() }); setMoodLogged(true); setTimeout(() => setMoodLogged(false), 3000); } catch(e) {}
  };

  const getInitials = (name) => name ? name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "U";

  return (
    <div className="uhp-container">
      
      {/* HEADER */}
      <nav className="uhp-navbar">
        <div className="uhp-brand">
          <img src={Logo} alt="Mindful Holt" className="uhp-logo-img" />
          <span className="uhp-brand-text">Mindful Holt</span>
        </div>
        
        {/* DROPDOWN LOGIC */}
        <div className="uhp-profile-container">
          <div className="uhp-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="uhp-user-name">{user?.displayName?.split(' ')[0]}</span>
            <div className="uhp-avatar">
              {user?.photoURL ? <img src={user.photoURL} alt="User"/> : <span>{getInitials(user?.displayName)}</span>}
            </div>
          </div>
          
          {dropdownOpen && (
            <>
              {/* Invisible Backdrop to close menu */}
              <div className="uhp-click-backdrop" onClick={() => setDropdownOpen(false)}></div>
              
              <div className="uhp-dropdown-menu">
                <div className="uhp-dd-info">
                  <strong>{user?.displayName}</strong>
                  <small>{user?.email}</small>
                </div>
                
                <button onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}>
                  <LayoutDashboard size={16}/> Workbench
                </button>
                <button onClick={() => { navigate('/dashboard/settings'); setDropdownOpen(false); }}>
                  <Settings size={16}/> Settings
                </button>
                
                <div className="uhp-dd-divider"></div>
                
                <button className="uhp-dd-logout" onClick={handleLogout}>
                  <LogOut size={16}/> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* BODY CONTENT */}
      <main className="uhp-main">
        <div className="uhp-hero">
          <div className="uhp-hero-text">
            <h1>{greeting}, <span className="highlight">{user?.displayName?.split(' ')[0]}</span>.</h1>
            <p>"Small steps are still steps. You are doing great."</p>
            <div className="hero-mood-box">
              <span>How are you feeling?</span>
              {moodLogged ? <span style={{color:'#2e7d32'}}>✨ Logged!</span> : (
                <div className="mood-buttons">
                  <button onClick={()=>handleMood('bad')}>😔</button>
                  <button onClick={()=>handleMood('okay')}>😐</button>
                  <button onClick={()=>handleMood('good')}>🙂</button>
                  <button onClick={()=>handleMood('great')}>😁</button>
                </div>
              )}
            </div>
          </div>
          <img src={OTSY_IMG} alt="Otsy" className="uhp-mascot"/>
        </div>

        <h3 className="uhp-section-header">✨ Sanctuary Tools</h3>
        <div className="uhp-tools-grid">
          <div className="uhp-tool-card purple" onClick={() => setActiveTool('safe')}><Shield size={32}/><h4>Safe Space</h4><p>Trauma Grounding</p></div>
          <div className="uhp-tool-card green" onClick={() => setActiveTool('sobriety')}><Anchor size={32}/><h4>Sobriety</h4><p>Track Recovery</p></div>
          <div className="uhp-tool-card blue" onClick={() => setActiveTool('breath')}><Wind size={32}/><h4>Panic Button</h4><p>4-7-8 Breathing</p></div>
          <div className="uhp-tool-card orange" onClick={() => navigate('/dashboard/chat')}><MessageCircle size={32}/><h4>AI Chat</h4><p>Vent Freely</p></div>
        </div>

        <div className="uhp-row-flex">
          <h3 className="uhp-section-header">🩺 Find Support</h3>
          <span onClick={() => navigate('/dashboard/services')} className="view-link">View All &rarr;</span>
        </div>
        <div className="uhp-doc-grid">
          <div className="doc-tile" onClick={() => navigate('/dashboard/services')}><Brain color="#1565c0"/><span>Psychology</span></div>
          <div className="doc-tile" onClick={() => navigate('/dashboard/services')}><Zap color="#7b1fa2"/><span>Psychiatry</span></div>
          <div className="doc-tile" onClick={() => navigate('/dashboard/services')}><Heart color="#ef6c00"/><span>Counseling</span></div>
          <div className="doc-tile" onClick={() => navigate('/dashboard/services')}><Sun color="#2e7d32"/><span>Somatic</span></div>
        </div>
      </main>

      {/* Modal */}
      {activeTool && (
        <div className="tool-modal-overlay" onClick={() => setActiveTool(null)}>
          <div className="tool-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveTool(null)}><X size={24}/></button>
            {activeTool === 'breath' && <MiniBreathing />}
            {activeTool === 'sobriety' && <MiniSobriety />}
            {activeTool === 'safe' && <MiniSafeSpace />}
          </div>
        </div>
      )}
    </div>
  );
};
export default UserHomePage;