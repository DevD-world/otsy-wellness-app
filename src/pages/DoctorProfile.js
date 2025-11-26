import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Database
  const doctors = [
    { id: 1, name: "Dr. Sarah Jenkins", role: "Psychiatrist", rating: 4.9, location: "New York, NY", bio: "Dr. Sarah has over 15 years of experience treating anxiety disorders and depression. She believes in a holistic approach combining medication management with therapy.", patients: "1,200+", exp: "15 Yrs" },
    { id: 2, name: "Dr. Aravind Patel", role: "Psychologist", rating: 4.8, location: "Online", bio: "Specializing in CBT and trauma-informed care, Dr. Patel helps patients navigate complex emotional landscapes through talk therapy.", patients: "850+", exp: "8 Yrs" },
    { id: 3, name: "Emma Wood", role: "Yoga Therapist", rating: 5.0, location: "Austin, TX", bio: "Emma combines traditional yoga flow with somatic healing to help release stored trauma from the body.", patients: "2,000+", exp: "10 Yrs" },
    { id: 4, name: "Dr. James Carter", role: "Psychiatrist", rating: 4.7, location: "Chicago, IL", bio: "Focusing on adult ADHD and mood disorders, Dr. Carter uses a patient-centered approach.", patients: "500+", exp: "5 Yrs" },
    { id: 5, name: "Lisa Wong", role: "Yoga Therapist", rating: 4.9, location: "Online", bio: "Lisa helps clients connect mind and body through guided meditation and restorative yoga.", patients: "1,100+", exp: "7 Yrs" },
    { id: 6, name: "Dr. Marcus Reid", role: "Psychologist", rating: 4.8, location: "Seattle, WA", bio: "Expert in cognitive behavioral therapy for social anxiety and panic disorders.", patients: "900+", exp: "12 Yrs" }
  ];

  const doc = doctors.find(d => d.id === parseInt(id)) || doctors[0];

  // --- NEW: Handle Booking with Specific Time ---
  const handleQuickBook = (timeSlot) => {
    // Navigate to Services page, passing the Doctor ID and Time as "State"
    navigate('/dashboard/services', { 
      state: { 
        preSelectedDoctorId: doc.id, 
        preSelectedTime: timeSlot 
      } 
    });
  };

  return (
    <div className="doc-profile-container">
      <button className="back-link" onClick={() => navigate('/dashboard/services')}>
        <ArrowLeft size={20}/> Back to Specialists
      </button>

      {/* Header Card */}
      <div className="doc-header-card">
        <div className="doc-avatar-large">{doc.name.charAt(0)}</div>
        <div className="doc-header-info">
          <span className="doc-role-tag">{doc.role}</span>
          <h1>{doc.name}</h1>
          <div className="doc-location">
            <MapPin size={16}/> {doc.location}
            <span className="doc-rating"><Star size={16} fill="gold" color="gold"/> {doc.rating} (120 reviews)</span>
          </div>
        </div>
        <div className="doc-badge">
           <ShieldCheck size={20}/> Verified
        </div>
      </div>

      <div className="doc-content-grid">
        {/* Left: Bio */}
        <div className="doc-main">
          <div className="doc-section">
            <h3>About</h3>
            <p>{doc.bio}</p>
          </div>

          <div className="doc-stats-row">
            <div className="doc-stat"><h4>{doc.patients}</h4><span>Patients</span></div>
            <div className="doc-stat"><h4>{doc.exp}</h4><span>Experience</span></div>
            <div className="doc-stat"><h4>4.9</h4><span>Rating</span></div>
          </div>

          <div className="doc-section">
            <h3>Patient Reviews</h3>
            <div className="review-item">
               <div className="review-header"><strong>Alice M.</strong><div className="stars">⭐⭐⭐⭐⭐</div></div>
               <p>"Changed my life. I finally feel understood."</p>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="doc-sidebar">
          <div className="booking-widget">
             <h3>Availability</h3>
             <div className="avail-slots">
                {/* BUTTONS NOW TRIGGER BOOKING */}
                <button onClick={() => handleQuickBook('09:00 AM')}>09:00 AM</button>
                <button onClick={() => handleQuickBook('11:00 AM')}>11:00 AM</button>
                <button onClick={() => handleQuickBook('02:00 PM')}>02:00 PM</button>
             </div>
             
             {/* General Book Button (No time pre-selected) */}
             <button className="main-book-btn" onClick={() => handleQuickBook(null)}>
               <Calendar size={18}/> Book Appointment
             </button>
             <p className="note">Select a time to book instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;