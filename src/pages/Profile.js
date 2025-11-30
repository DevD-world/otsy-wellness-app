import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, Calendar, Zap, LogOut } from 'lucide-react';
import './Profile.css';

// FIREBASE IMPORTS
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const navigate = useNavigate();
  
  // State
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ streak: 0, entries: 0, badges: 0 });
  const [moodHistory, setMoodHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. DATA LOADING EFFECT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // --- LOGGED IN USER ---
        setUser(currentUser);
        
        try {
          // A. Fetch Moods & Stats
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const moods = data.moods || [];
            generateGridData(moods);
            
            // Calculate basic stats
            setStats({
              streak: calculateStreak(moods),
              entries: moods.length,
              badges: Math.floor(moods.length / 5) // Simple badge logic: 1 badge per 5 entries
            });
          } else {
            generateGridData([]);
          }

          // B. Fetch Appointments
          const q = query(collection(db, "appointments"), where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAppointments(apps);

        } catch (e) {
          console.error("Error loading profile data:", e);
        }
      } else {
        // --- GUEST USER ---
        setUser(null);
        const localMoods = JSON.parse(localStorage.getItem('otsy_mood_history') || '[]');
        generateGridData(localMoods);
        setStats({
          streak: calculateStreak(localMoods),
          entries: localMoods.length,
          badges: Math.floor(localMoods.length / 5)
        });
        setAppointments([]); // Guests don't have cloud appointments
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. HELPER: Calculate Streak
  const calculateStreak = (moods) => {
    if (!moods || moods.length === 0) return 0;
    // Simplified streak logic for demo
    return moods.length > 0 ? 3 : 0; 
  };

  // 3. HELPER: Generate 30-Day Grid
  const generateGridData = (rawMoods) => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      // Find mood for this specific date
      const found = rawMoods.find(m => m.date === dateString);
      
      days.push({
        date: dateString,
        level: found ? found.level : 0 // 0 = No entry
      });
    }
    setMoodHistory(days);
  };

  // 4. HELPER: Color Logic
  const getMoodColor = (level) => {
    switch(level) {
      case 1: return '#ef5350'; // Anxious (Red)
      case 2: return '#ff9800'; // Low (Orange)
      case 3: return '#fdd835'; // Okay (Yellow)
      case 4: return '#42a5f5'; // Good (Blue)
      case 5: return '#66bb6a'; // Great (Green)
      default: return '#e0e0e0'; // Grey (Empty)
    }
  };

  if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Loading Profile...</div>;

  return (
    <div className="profile-container">
      
      {/* --- HEADER --- */}
      <div className="profile-header">
        <div className="avatar-large">
          {user && user.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{width:'100%', height:'100%', borderRadius:'50%'}} />
          ) : (
            user ? user.email.charAt(0).toUpperCase() : 'G'
          )}
        </div>
        <h2>{user ? (user.displayName || 'Wellness Warrior') : 'Guest User'}</h2>
        <p>{user ? user.email : 'Data saved locally on this device.'}</p>
        
        {!user && (
          <button className="login-btn-profile" onClick={() => navigate('/auth')}>
            Log In to Sync Data
          </button>
        )}
      </div>

      {/* --- STATS CARDS --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <Zap className="stat-icon gold" size={24}/>
          <h3>{stats.streak} Days</h3>
          <p>Current Streak</p>
        </div>
        <div className="stat-card">
          <Award className="stat-icon blue" size={24}/>
          <h3>{stats.badges}</h3>
          <p>Badges Earned</p>
        </div>
        <div className="stat-card">
          <Calendar className="stat-icon purple" size={24}/>
          <h3>{stats.entries}</h3>
          <p>Total Check-ins</p>
        </div>
      </div>

      {/* --- MOOD HISTORY --- */}
      <h3 className="section-title">Last 30 Days Mood</h3>
      <div className="mood-calendar-card">
        <div className="mood-grid">
          {moodHistory.map((day, index) => (
            <div 
              key={index} 
              className="mood-dot" 
              style={{ backgroundColor: getMoodColor(day.level) }}
              title={`${day.date}: Level ${day.level}`}
            ></div>
          ))}
        </div>
        <div className="mood-legend">
          <span><span className="dot" style={{background:'#ef5350'}}></span> Anxious</span>
          <span><span className="dot" style={{background:'#ff9800'}}></span> Low</span>
          <span><span className="dot" style={{background:'#fdd835'}}></span> Okay</span>
          <span><span className="dot" style={{background:'#42a5f5'}}></span> Good</span>
          <span><span className="dot" style={{background:'#66bb6a'}}></span> Great</span>
        </div>
      </div>

      {/* --- UPCOMING APPOINTMENTS (Logged In Only) --- */}
      {user && (
        <>
          <h3 className="section-title" style={{marginTop:'30px'}}>Upcoming Appointments</h3>
          <div className="appointments-list">
            {appointments.length > 0 ? (
              appointments.map(app => (
                <div key={app.id} className="app-card">
                  <img src={app.image} alt="Doc" className="app-doc-img"/>
                  <div className="app-details">
                    <h4>{app.doctorName}</h4>
                    <p>{app.specialty}</p>
                    <div className="app-time">
                      <span>📅 {app.date}</span>
                      <span>⏰ {app.time}</span>
                    </div>
                  </div>
                  <span className="status-badge">Confirmed</span>
                </div>
              ))
            ) : (
              <div className="empty-apps">
                <p>No upcoming sessions.</p>
                <button onClick={() => navigate('/dashboard/services')}>Find a Therapist</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- LOGOUT --- */}
      {user && (
        <button 
          className="logout-big-btn" 
          onClick={() => auth.signOut().then(() => navigate('/'))}
        >
          <LogOut size={20}/> Log Out
        </button>
      )}

    </div>
  );
};

export default Profile;