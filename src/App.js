import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import Onboarding from './Onboarding';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import DashboardLayout from './components/DashboardLayout';

// Internal Pages
import DashboardHome from './pages/DashboardHome';
import Services from './pages/Services';
import Library from './pages/Library';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import ArticleView from './pages/ArticleView';
import Community from './pages/Community';
import Glossary from './pages/Glossary';
import ChatSession from './pages/ChatSession';
import DoctorProfile from './pages/DoctorProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. START HERE: Onboarding Chat */}
        <Route path="/" element={<Onboarding />} />

        {/* 2. THEN GO HERE: Public Home Page */}
        <Route path="/home" element={<LandingPage />} />

        {/* 3. Auth & Dashboard */}
        <Route path="/auth" element={<Auth />} />
        
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
           <Route path="doctor/:id" element={<DoctorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;