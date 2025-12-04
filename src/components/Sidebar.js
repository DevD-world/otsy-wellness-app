import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, HeartHandshake, BookOpen, PenTool, 
  MessageCircle, Users, Book, Settings, LogOut, X 
} from 'lucide-react';
import { auth } from '../firebase';
import Logo from '../assets/logo.png'; // Ensure logo.png exists in src/assets
import './Sidebar.css';

const Sidebar = ({ closeMobile }) => {
  
  const navItems = [
    { path: '/dashboard', label: 'Workbench', icon: <LayoutDashboard size={20}/>, end: true },
    { path: '/dashboard/services', label: 'Find Help', icon: <HeartHandshake size={20}/> },
    { path: '/dashboard/library', label: 'Library', icon: <BookOpen size={20}/> },
    { path: '/dashboard/tools', label: 'Tools', icon: <PenTool size={20}/> },
    { path: '/dashboard/chat', label: 'AI Companion', icon: <MessageCircle size={20}/> },
    { path: '/dashboard/community', label: 'Community', icon: <Users size={20}/> },
    { path: '/dashboard/glossary', label: 'Mind Pedia', icon: <Book size={20}/> },
    { path: '/dashboard/settings', label: 'Settings', icon: <Settings size={20}/> },
  ];

  return (
    <div className="sidebar-container">
      {/* MOBILE CLOSE BUTTON */}
      <button className="mobile-close-btn" onClick={closeMobile}>
        <X size={24}/>
      </button>

      {/* BRAND HEADER (Logo + Text) */}
      <div className="sidebar-brand">
        <img src={Logo} alt="Mindful Holt" className="sidebar-logo-img" />
        <span className="sidebar-brand-text">Mindful Holt</span>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobile}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER LOGOUT */}
      <div className="sidebar-footer">
        <button className="logout-btn-side" onClick={() => auth.signOut()}>
          <LogOut size={18}/> <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;