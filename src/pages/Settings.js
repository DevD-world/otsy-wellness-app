import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Volume2, Shield, User, ChevronRight, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

// FIREBASE
import { auth, db } from '../firebase';
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  
  // Preferences State
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  
  // Profile Edit State
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');

  // 1. Load Saved Preferences (from LocalStorage for now)
  useEffect(() => {
    const savedDark = localStorage.getItem('otsy_dark_mode') === 'true';
    setDarkMode(savedDark);
    if(savedDark) document.body.classList.add('dark-mode');
  }, []);

  // 2. Toggle Dark Mode
  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('otsy_dark_mode', newVal);
    
    if(newVal) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  };

  // 3. Update Profile Name
  const handleSaveProfile = async () => {
    if(!user) return;
    setStatus('Saving...');
    try {
      await updateProfile(user, { displayName: displayName });
      // Also update in Firestore if user exists there
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName: displayName }).catch(e => console.log("No firestore doc yet"));
      
      setStatus('Saved!');
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      setStatus('Error');
    }
    setTimeout(() => setStatus(''), 2000);
  };

  // 4. Reset Password
  const handlePasswordReset = () => {
    if(!user) return;
    navigate('/auth'); // Usually you'd send a reset email here
    alert("For security, please log out and use 'Forgot Password' on the login screen.");
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings & Preferences</h2>
        <p>Customize your Otsy experience.</p>
      </div>

      <div className="settings-grid">
        
        {/* SECTION 1: APP PREFERENCES */}
        <div className="settings-card">
          <h3>App Settings</h3>
          
          <div className="setting-item">
            <div className="setting-label">
              <div className="icon-bg purple"><Moon size={20}/></div>
              <span>Dark Mode</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode}/>
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <div className="icon-bg blue"><Bell size={20}/></div>
              <span>Daily Reminders</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)}/>
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <div className="icon-bg green"><Volume2 size={20}/></div>
              <span>Sound Effects</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={sound} onChange={() => setSound(!sound)}/>
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* SECTION 2: ACCOUNT */}
        <div className="settings-card">
          <h3>Account</h3>
          
          <div className="account-edit-row">
            <div className="setting-label">
              <div className="icon-bg gold"><User size={20}/></div>
              <span>Display Name</span>
            </div>
            {isEditing ? (
              <div className="edit-input-group">
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <button onClick={handleSaveProfile}><Save size={16}/></button>
              </div>
            ) : (
              <span className="value-text" onClick={() => setIsEditing(true)}>
                {displayName || 'Guest'} <ChevronRight size={16}/>
              </span>
            )}
          </div>

          <div className="setting-item clickable" onClick={handlePasswordReset}>
            <div className="setting-label">
              <div className="icon-bg red"><Shield size={20}/></div>
              <span>Security & Password</span>
            </div>
            <ChevronRight size={18} color="#ccc"/>
          </div>
          
          <div className="setting-item clickable logout" onClick={() => { auth.signOut(); navigate('/'); }}>
            <div className="setting-label">
              <div className="icon-bg gray"><LogOut size={20}/></div>
              <span>Log Out</span>
            </div>
          </div>
        </div>

      </div>
      {status && <div className="toast-msg">{status}</div>}
    </div>
  );
};

export default Settings;