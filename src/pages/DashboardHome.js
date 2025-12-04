import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Wind, BookOpen, MessageCircle, Heart, Zap, Sun, Calendar, Smile } from 'lucide-react';
import './DashboardHome.css';

const OTSY_IMG = "otsyyoga.png";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [user] = useState(auth.currentUser);
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');
  const [moodLogged, setMoodLogged] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    setQuote("Your mind is a garden. Your thoughts are the seeds.");
  }, []);

  const handleMood = async (mood) => {
    if(!user) return;
    try {
      await addDoc(collection(db, "mood_logs"), { uid: user.uid, mood, createdAt: serverTimestamp() });
      setMoodLogged(true); setTimeout(() => setMoodLogged(false), 3000);
    } catch(e) { console.error(e); }
  };

  return (
    <div className="dash-home-container">
      <header className="dash-hero-section">
        <div className="hero-content">
          <h1>{greeting}, <span className="highlight-name">{user?.displayName?.split(' ')[0]}</span>!</h1>
          <p className="quote-text">"{quote}"</p>
          <div className="hero-mood-box">
            <span>How are you feeling?</span>
            {moodLogged ? <span className="mood-success">✨ Logged! Otsy is proud of you.</span> : (
              <div className="mood-buttons">
                <button onClick={()=>handleMood('bad')} title="Bad">😔</button>
                <button onClick={()=>handleMood('okay')} title="Okay">😐</button>
                <button onClick={()=>handleMood('good')} title="Good">🙂</button>
                <button onClick={()=>handleMood('great')} title="Great">😁</button>
              </div>
            )}
          </div>
        </div>
        <img src={OTSY_IMG} alt="Otsy" className="floating-otsy" />
      </header>

      {/* QUICK ACCESS GRID */}
      <section className="section-block">
        <h3>✨ Quick Access</h3>
        <div className="features-grid-dash">
          <div className="feature-card f-blue" onClick={() => navigate('/dashboard/tools')}><div className="f-icon"><Wind size={24}/></div><h4>Panic Button</h4><p>4-7-8 Breathing</p></div>
          <div className="feature-card f-purple" onClick={() => navigate('/dashboard/library')}><div className="f-icon"><BookOpen size={24}/></div><h4>Library</h4><p>Books & Audio</p></div>
          <div className="feature-card f-green" onClick={() => navigate('/dashboard/tools')}><div className="f-icon"><Calendar size={24}/></div><h4>Mood Log</h4><p>Track history</p></div>
          <div className="feature-card f-orange" onClick={() => navigate('/dashboard/community')}><div className="f-icon"><Heart size={24}/></div><h4>Community</h4><p>Peer Support</p></div>
        </div>
      </section>

      {/* DOCTOR CATEGORIES */}
      <section className="section-block">
        <div className="section-header">
          <h3>🩺 Find a Professional</h3>
          <span className="see-all" onClick={() => navigate('/dashboard/services')}>See All <ArrowRight size={14}/></span>
        </div>
        <div className="doc-cat-grid">
          <div className="doc-cat-card" onClick={() => navigate('/dashboard/services')}>
            <div className="cat-icon-box blue"><Brain size={24} color="white"/></div>
            <div className="cat-info"><h4>Psychologists</h4><span>Talk Therapy</span></div>
          </div>
          <div className="doc-cat-card" onClick={() => navigate('/dashboard/services')}>
            <div className="cat-icon-box purple"><Zap size={24} color="white"/></div>
            <div className="cat-info"><h4>Psychiatrists</h4><span>Medical Help</span></div>
          </div>
          <div className="doc-cat-card" onClick={() => navigate('/dashboard/services')}>
            <div className="cat-icon-box orange"><Smile size={24} color="white"/></div>
            <div className="cat-info"><h4>Counselors</h4><span>Guidance</span></div>
          </div>
          <div className="doc-cat-card" onClick={() => navigate('/dashboard/services')}>
            <div className="cat-icon-box green"><Sun size={24} color="white"/></div>
            <div className="cat-info"><h4>Somatic</h4><span>Body Healing</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DashboardHome;