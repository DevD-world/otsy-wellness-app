import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// Add 'Download' to imports
import { Home, Heart, BookOpen, Users, LogOut, Menu, X, User, Bell, Download } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Friend');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Notification State
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Dr. Sarah confirmed your appointment.", time: "2m ago", unread: true },
    { id: 2, text: "You unlocked the 'Dedicated' badge!", time: "1h ago", unread: true },
    { id: 3, text: "Tip: Try a breathing exercise today.", time: "5h ago", unread: false }
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  // --- NEW: PWA INSTALL STATE ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // 1. User Data
    const stored = localStorage.getItem('otsy_user');
    if (stored) setUserName(JSON.parse(stored).name || 'Friend');
    
    // 2. Mobile Resize
    const handleResize = () => { if (window.innerWidth < 768) setSidebarOpen(false); else setSidebarOpen(true); };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 3. LISTEN FOR INSTALL EVENT
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleQuickExit = () => { window.location.replace("https://www.google.com"); };

  // --- NEW: TRIGGER INSTALL ---
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="dashboard-container">
      <button className="quick-exit-floating" onClick={handleQuickExit} aria-label="Quick Exit">⚠️</button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
         <div className="logo-section"><h2>Otsy.</h2></div>
         <nav className="nav-menu">
            <NavLink to="/dashboard" end className={({isActive})=>`nav-item ${isActive?'active':''}`}><Home size={20}/><span>Overview</span></NavLink>
            <NavLink to="/dashboard/tools" className={({isActive})=>`nav-item ${isActive?'active':''}`}><Heart size={20}/><span>Wellness Tools</span></NavLink>
            <NavLink to="/dashboard/services" className={({isActive})=>`nav-item ${isActive?'active':''}`}><Users size={20}/><span>Professionals</span></NavLink>
            <NavLink to="/dashboard/library" className={({isActive})=>`nav-item ${isActive?'active':''}`}><BookOpen size={20}/><span>Library</span></NavLink>
            <NavLink to="/dashboard/community" className={({isActive})=>`nav-item ${isActive?'active':''}`}><Users size={20}/><span>Community</span></NavLink>
            <NavLink to="/dashboard/glossary" className={({isActive})=>`nav-item ${isActive?'active':''}`}><BookOpen size={20}/><span>Glossary</span></NavLink>
            <div className="divider"></div>
            
            {/* --- NEW: INSTALL APP BUTTON --- */}
            {/* Only show if browser supports install and hasn't been installed yet */}
            {deferredPrompt && (
              <button onClick={handleInstallClick} className="nav-item install-btn">
                <Download size={20} /> <span>Install App</span>
              </button>
            )}

            <NavLink to="/dashboard/settings" className={({isActive})=>`nav-item ${isActive?'active':''}`}><User size={20}/><span>Settings</span></NavLink>
         </nav>
         <button onClick={() => navigate('/')} className="logout-btn"><LogOut size={18}/><span>Exit</span></button>
      </aside>

      <main className="main-content">
         {/* ... (Header code stays exactly the same) ... */}
         <header className="top-bar">
          <div style={{display:'flex', alignItems:'center'}}>
            <button className="toggle-sidebar" onClick={() => setSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <X/> : <Menu/>}</button>
            <div className="welcome-text"><h1>Good Morning, {userName}</h1><p>Let's take this one day at a time.</p></div>
          </div>
          <div className="header-actions">
            <div className="notif-wrapper">
              <button className="icon-btn-header" onClick={() => setShowNotifs(!showNotifs)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="notif-dropdown">
                  <div className="notif-header"><h3>Notifications</h3><span onClick={() => setNotifications(notifications.map(n=>({...n, unread:false})))}>Mark all read</span></div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="profile-icon">{userName.charAt(0)}</div>
          </div>
        </header>
        <div className="content-scrollable"><Outlet /></div>
      </main>
    </div>
  );
};
export default DashboardLayout;