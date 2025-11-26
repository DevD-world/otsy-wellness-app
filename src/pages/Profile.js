import React from 'react';
import { User, Zap, Award, BookOpen, Clock, Lock } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  // --- REAL DATA LOGIC ---
  const user = {
    name: JSON.parse(localStorage.getItem('otsy_user'))?.name || "Friend",
    joinDate: "Nov 2025",
    streak: 3, // Hardcoded for now (requires complex date logic)
    // Pulling real numbers from storage
    totalJournals: localStorage.getItem('otsy_stats_journal') || 0,
    minutesMindful: localStorage.getItem('otsy_stats_mins') || 0
  };

  const badges = [
    { id: 1, name: "First Step", icon: <User size={20}/>, unlocked: true, desc: "Created an account" },
    { id: 2, name: "Dedicated", icon: <Zap size={20}/>, unlocked: true, desc: "3 Day Streak" },
    // Unlock if journals >= 1
    { id: 3, name: "Journalist", icon: <BookOpen size={20}/>, unlocked: parseInt(user.totalJournals) >= 1, desc: "Write 1 Journal Entry" },
    // Unlock if minutes >= 10
    { id: 4, name: "Zen Master", icon: <Clock size={20}/>, unlocked: parseInt(user.minutesMindful) >= 10, desc: "10 Mins of Breathing" },
    { id: 5, name: "Socialite", icon: <Award size={20}/>, unlocked: false, desc: "Share an article" },
    { id: 6, name: "Survivor", icon: <Award size={20}/>, unlocked: false, desc: "Use the app for 1 month" },
  ];

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header-card">
        <div className="profile-avatar">{user.name.charAt(0)}</div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>Member since {user.joinDate}</p>
        </div>
        <div className="streak-badge"><Zap size={18} fill="orange" color="orange"/> <span>{user.streak} Day Streak</span></div>
      </div>

      {/* Stats Grid - Now showing REAL numbers */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><BookOpen size={24}/></div>
          <h3>{user.totalJournals}</h3>
          <p>Journal Entries</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Clock size={24}/></div>
          <h3>{user.minutesMindful}m</h3>
          <p>Mindful Minutes</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><Award size={24}/></div>
          <h3>{badges.filter(b => b.unlocked).length}</h3>
          <p>Badges Earned</p>
        </div>
      </div>

      {/* Achievements */}
      <h3 className="section-title">Achievements</h3>
      <div className="badges-grid">
        {badges.map(badge => (
          <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon">{badge.unlocked ? badge.icon : <Lock size={20}/>}</div>
            <div className="badge-details">
              <h4>{badge.name}</h4>
              <p>{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;