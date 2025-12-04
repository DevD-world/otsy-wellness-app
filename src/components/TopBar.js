import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Home, Settings, User } from 'lucide-react';
import Logo from '../assets/logo.png'; 
import './TopBar.css';

const TopBar = ({ toggleSidebar, isSidebarOpen, user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (name) => name ? name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "U";

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="topbar">
      {/* LEFT: Sidebar Toggle & Branding */}
      <div className="topbar-left">
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <Menu size={26} color="#1565c0"/>
        </button>
        
        {/* Hide Logo if Sidebar is open to prevent overlap */}
        {!isSidebarOpen && (
          <div className="brand-wrapper fade-in" onClick={() => navigate('/user-home')}>
             <img src={Logo} alt="Mindful Holt" className="topbar-logo-img" />
             <span className="brand-name">Mindful Holt</span>
          </div>
        )}
      </div>

      {/* RIGHT: Profile Dropdown */}
      <div className="topbar-right">
        <div className="profile-container">
          <div className="user-avatar-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <span>{getInitials(user?.displayName)}</span>}
          </div>

          {dropdownOpen && (
            <>
              <div className="click-backdrop" onClick={() => setDropdownOpen(false)}></div>
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="dd-name">{user?.displayName}</p>
                  <p className="dd-email">{user?.email}</p>
                </div>
                <div className="dropdown-items">
                  <button onClick={() => { navigate('/user-home'); setDropdownOpen(false); }}>
                    <Home size={16}/> Home Hub
                  </button>
                  <button onClick={() => { navigate('/dashboard/settings'); setDropdownOpen(false); }}>
                    <Settings size={16}/> Settings
                  </button>
                  <div className="dd-divider"></div>
                  <button className="dd-logout" onClick={handleLogout}>
                    <LogOut size={16}/> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;