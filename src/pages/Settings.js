import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { Bell, Moon, Shield, Download, Volume2, Eye, Mail, Edit2, Check, User } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  
  // Toggles State
  const [toggles, setToggles] = useState({
    email: true,
    push: true,
    dark: false,
    sound: true,
    privacy: false
  });

  // Handle Toggle Switch
  const handleToggle = (key) => {
    const newState = !toggles[key];
    setToggles({ ...toggles, [key]: newState });

    // Dark Mode Logic
    if (key === 'dark') {
      if (newState) {
        document.body.classList.add('dark-mode-global');
      } else {
        document.body.classList.remove('dark-mode-global');
      }
    }
  };

  // Handle Profile Update
  const saveProfile = async () => {
    if (!newName.trim()) return;
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUser({ ...auth.currentUser, displayName: newName }); // Update local state
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings & Preferences</h2>

      <div className="settings-grid">
        
        {/* ACCOUNT CARD */}
        <div className="settings-card">
          <h3>Account</h3>
          <div className="profile-row">
            <div className="s-avatar">
              {user?.photoURL ? <img src={user.photoURL} alt="User" /> : user?.displayName?.charAt(0)}
            </div>
            
            <div style={{flexGrow:1}}>
              {isEditing ? (
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="edit-name-input"
                />
              ) : (
                <h4>{user?.displayName}</h4>
              )}
              <p>{user?.email}</p>
            </div>

            <button 
              className="icon-action-btn" 
              onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
              title={isEditing ? "Save" : "Edit"}
            >
              {isEditing ? <Check size={18} color="green"/> : <Edit2 size={18}/>}
            </button>
          </div>
        </div>

        {/* PREFERENCES CARD */}
        <div className="settings-card">
          <h3>App Experience</h3>
          
          <div className="setting-item">
            <div className="s-label"><Moon size={18}/> Dark Mode</div>
            <div className={`toggle ${toggles.dark ? 'on' : ''}`} onClick={() => handleToggle('dark')}>
              <div className="knob"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="s-label"><Volume2 size={18}/> Sound Effects</div>
            <div className={`toggle ${toggles.sound ? 'on' : ''}`} onClick={() => handleToggle('sound')}>
              <div className="knob"></div>
            </div>
          </div>

          <div className="setting-item">
            <div className="s-label"><Eye size={18}/> Privacy Blur</div>
            <div className={`toggle ${toggles.privacy ? 'on' : ''}`} onClick={() => handleToggle('privacy')}>
              <div className="knob"></div>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS CARD */}
        <div className="settings-card">
          <h3>Notifications</h3>
          <div className="setting-item">
            <div className="s-label"><Mail size={18}/> Weekly Digest</div>
            <div className={`toggle ${toggles.email ? 'on' : ''}`} onClick={() => handleToggle('email')}>
              <div className="knob"></div>
            </div>
          </div>
          <div className="setting-item">
            <div className="s-label"><Bell size={18}/> Daily Reminders</div>
            <div className={`toggle ${toggles.push ? 'on' : ''}`} onClick={() => handleToggle('push')}>
              <div className="knob"></div>
            </div>
          </div>
        </div>

        {/* DATA CARD */}
        <div className="settings-card">
          <h3>Data & Privacy</h3>
          <button className="data-btn" onClick={() => alert("Downloading your encrypted journal...")}>
            <Download size={16}/> Download My Data
          </button>
          <button className="data-btn delete" onClick={() => alert("Please contact support to permanently delete your account.")}>
            <Shield size={16}/> Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;