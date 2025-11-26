import React, { useState, useEffect } from 'react';
import { User, Trash, Bell, Moon, ChevronRight, Save, X } from 'lucide-react'; // Add Save, X
import './Settings.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false); // NEW STATE
  const [tempName, setTempName] = useState(''); // NEW STATE

  useEffect(() => {
    const data = localStorage.getItem('otsy_user');
    if (data) {
      const parsed = JSON.parse(data);
      setName(parsed.name);
      setTempName(parsed.name);
    }
  }, []);

  // NEW: Save Logic
  const handleSaveName = () => {
    const data = JSON.parse(localStorage.getItem('otsy_user') || '{}');
    data.name = tempName;
    localStorage.setItem('otsy_user', JSON.stringify(data));
    setName(tempName);
    setIsEditing(false);
    // Reload to update header across app
    window.location.reload(); 
  };

  const clearAllData = () => {
    if (window.confirm("This will reset Otsy completely. Are you sure?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const toggleDarkMode = () => { document.body.classList.toggle('dark-mode'); };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Profile</h3>
        <div className="setting-item">
          <div className="icon-bg blue"><User size={20}/></div>
          
          <div className="setting-info">
            <h4>Display Name</h4>
            {/* TOGGLE BETWEEN INPUT AND TEXT */}
            {isEditing ? (
              <input 
                type="text" 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)} 
                className="edit-name-input"
                autoFocus
              />
            ) : (
              <p>{name}</p>
            )}
          </div>

          {/* TOGGLE BUTTONS */}
          {isEditing ? (
            <div style={{display:'flex', gap:'5px'}}>
              <button className="icon-btn-small green" onClick={handleSaveName}><Save size={16}/></button>
              <button className="icon-btn-small grey" onClick={() => setIsEditing(false)}><X size={16}/></button>
            </div>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
      </div>
      
      {/* ... Rest of the settings page ... */}
      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="setting-item">
          <div className="icon-bg purple"><Bell size={20}/></div>
          <div className="setting-info"><h4>Daily Reminders</h4><p>Receive check-in notifications</p></div>
          <div className="toggle-switch active"></div>
        </div>
        <div className="setting-item">
          <div className="icon-bg dark"><Moon size={20}/></div>
          <div className="setting-info"><h4>Dark Mode</h4><p>Switch to dark theme</p></div>
          <div className="toggle-switch" onClick={toggleDarkMode}></div>
        </div>
      </div>
      <div className="settings-section danger-zone">
        <h3>Data Management</h3>
        <div className="setting-item" onClick={clearAllData} style={{cursor: 'pointer'}}>
          <div className="icon-bg red"><Trash size={20}/></div>
          <div className="setting-info"><h4>Reset All Data</h4><p>Clear journal, name, and history</p></div>
          <ChevronRight size={20} color="#ff6b6b" />
        </div>
      </div>

    </div>
  );
};

export default Settings;