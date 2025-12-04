import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Imports
import Onboarding from './Onboarding';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import VideoCall from './pages/VideoCall';

// User Pages
import DashboardHome from './pages/DashboardHome';
import Services from './pages/Services';
import Library from './pages/Library';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import Community from './pages/Community';
import Glossary from './pages/Glossary';
import ChatSession from './pages/ChatSession';
import UserHomePage from './pages/UserHomePage';
// Doctor & Admin Pages
import DoctorSignup from './pages/DoctorSignup';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* --- DOCTOR & ADMIN ROUTES (Place these OUTSIDE dashboard) --- */}
        <Route path="/doctor-signup" element={<DoctorSignup />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* --- USER PROTECTED ROUTES --- */}
        <Route element={<ProtectedRoute />}>
        <Route path="/user-home" element={<UserHomePage />} />
        <Route path="/call/:roomId" element={<VideoCall />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
             <Route index element={<DashboardHome />} />
             <Route path="services" element={<Services />} />
             <Route path="library" element={<Library />} />
             <Route path="tools" element={<Tools />} />
             <Route path="settings" element={<Settings />} />
             <Route path="community" element={<Community />} />
             <Route path="glossary" element={<Glossary />} />
             <Route path="chat" element={<ChatSession />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;