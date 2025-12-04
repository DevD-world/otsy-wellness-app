import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar'; 
import { auth } from '../firebase';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = auth.currentUser;

  return (
    <div className="dashboard-layout">
      
      {/* SIDEBAR */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar closeMobile={() => setSidebarOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content-wrapper">
        
        {/* TOPBAR - Now receives 'isSidebarOpen' prop */}
        <TopBar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen} // <--- NEW PROP
          user={user} 
        />
        
        <div className="content-scrollable">
          <Outlet /> 
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default DashboardLayout;