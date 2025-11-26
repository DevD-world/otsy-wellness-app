import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Onboarding from './Onboarding';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Services from './pages/Services';
import Library from './pages/Library';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import ArticleView from './pages/ArticleView';
import Community from './pages/Community';
import Glossary from './pages/Glossary';
import ChatSession from './pages/ChatSession';

// 1. IMPORT THE DOCTOR PROFILE HERE (This was likely missing)
import DoctorProfile from './pages/DoctorProfile'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
           <Route index element={<DashboardHome />} />
           <Route path="services" element={<Services />} />
           <Route path="library" element={<Library />} />
           <Route path="tools" element={<Tools />} />
           <Route path="settings" element={<Settings />} />
           <Route path="community" element={<Community />} />
           <Route path="glossary" element={<Glossary />} />
           <Route path="chat" element={<ChatSession />} />
           <Route path="article/:id" element={<ArticleView />} />
           
           {/* 2. ADD THE ROUTE HERE (Inside the Dashboard route) */}
           <Route path="doctor/:id" element={<DoctorProfile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;