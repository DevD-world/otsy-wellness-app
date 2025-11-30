import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, BookOpen, Smile, Frown, Meh, Sun, CloudRain } from 'lucide-react';
import './DashboardHome.css'; // Ensure you have this or create basic CSS for it

// --- FIREBASE IMPORTS ---
import { auth, db } from '../firebase';
import { doc, setDoc, arrayUnion, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [userName, setUserName] = useState('Friend');

  // 1. Check Login Status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName || 'Friend');
      } else {
        // Guest Mode
        const localUser = localStorage.getItem('otsy_user');
        if (localUser) setUserName(JSON.parse(localUser).name);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. SAVE MOOD FUNCTION
  const handleMoodClick = async (level) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const moodEntry = { date: today, level: level, timestamp: Date.now() };

    setMoodSaved(true);

    if (user) {
      // --- CLOUD SAVE (Logged In) ---
      try {
        const userRef = doc(db, "users", user.uid);
        // We use arrayUnion to add to the list without overwriting existing data
        await setDoc(userRef, { 
          moods: arrayUnion(moodEntry) 
        }, { merge: true });
        console.log("Mood saved to cloud");
      } catch (e) {
        console.error("Error saving mood:", e);
      }
    } else {
      // --- LOCAL SAVE (Guest) ---
      const existing = JSON.parse(localStorage.getItem('otsy_mood_history') || '[]');
      existing.push(moodEntry);
      localStorage.setItem('otsy_mood_history', JSON.stringify(existing));
    }

    // Reset "Saved" message after 2 seconds
    setTimeout(() => setMoodSaved(false), 2000);
  };

  return (
    <div className="dashboard-home">
      
      {/* 1. WELCOME SECTION */}
      <section className="welcome-banner">
        <div>
          <h2>Ready to start the day, {userName}?</h2>
          <p>Your mental health is a priority. Let's check in.</p>
        </div>
        <div className="streak-badge">
          <Zap size={18} fill="orange" color="orange"/> <span>3 Day Streak</span>
        </div>
      </section>

      {/* 2. MOOD CHECK-IN */}
      <section className="checkin-section">
        <h3>How are you feeling right now?</h3>
        {moodSaved ? (
          <div className="mood-feedback">
            <span style={{fontSize: '2rem'}}>✨</span>
            <p>Mood tracked! View your trends in Profile.</p>
          </div>
        ) : (
          <div className="mood-buttons">
            <button className="m-btn bad" onClick={() => handleMoodClick(1)}>
              <CloudRain size={24}/> <span>Anxious</span>
            </button>
            <button className="m-btn low" onClick={() => handleMoodClick(2)}>
              <Frown size={24}/> <span>Low</span>
            </button>
            <button className="m-btn mid" onClick={() => handleMoodClick(3)}>
              <Meh size={24}/> <span>Okay</span>
            </button>
            <button className="m-btn good" onClick={() => handleMoodClick(4)}>
              <Smile size={24}/> <span>Good</span>
            </button>
            <button className="m-btn great" onClick={() => handleMoodClick(5)}>
              <Sun size={24}/> <span>Great</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. QUICK ACTIONS GRID */}
      <section className="quick-actions">
        <div className="action-card purple" onClick={() => navigate('/dashboard/tools')}>
          <WindIcon />
          <h4>Breathing</h4>
          <p>2 min reset</p>
        </div>
        <div className="action-card blue" onClick={() => navigate('/dashboard/tools')}>
          <PenIcon />
          <h4>Journal</h4>
          <p>Clear your mind</p>
        </div>
        <div className="action-card green" onClick={() => navigate('/dashboard/services')}>
          <UserIcon />
          <h4>Therapy</h4>
          <p>Book a session</p>
        </div>
      </section>

      {/* 4. DAILY QUOTE */}
      <section className="quote-banner">
        <p>"You don't have to control your thoughts. You just have to stop letting them control you."</p>
      </section>

    </div>
  );
};

// Simple Icons for the grid to save imports
const WindIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-1.7-1.3-3-3-3h-11a3 3 0 0 1 0-6h11"/><path d="M11.5 13a3 3 0 0 0 0-6h-8"/><path d="M7 19c0-1.7-1.3-3-3-3h0a3 3 0 0 1 0-6h3"/></svg>;
const PenIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default DashboardHome;