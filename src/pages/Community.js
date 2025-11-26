import React, { useState } from 'react'; // Add useState
import { Calendar, MapPin, Users, Heart, ExternalLink, X, CheckCircle } from 'lucide-react'; // Add icons
import './Community.css';

const Community = () => {
  // --- NEW STATE ---
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  const events = [
    { id: 1, title: "Art Therapy Workshop", date: "Nov 28 • 5:00 PM", type: "Online", image: "https://picsum.photos/id/103/300/200" },
    { id: 2, title: "Anxiety Support Group", date: "Dec 02 • 7:00 PM", type: "Zoom", image: "https://picsum.photos/id/106/300/200" },
    { id: 3, title: "Morning Yoga Flow", date: "Dec 05 • 8:00 AM", type: "Live Stream", image: "https://picsum.photos/id/112/300/200" },
  ];
  
  // ... Keep NGOs list ...
  const ngos = [
    { id: 1, name: "Mind Matters", role: "Volunteer Listener", loc: "Remote" },
    { id: 2, name: "City Youth Help", role: "Event Organizer", loc: "New York" },
    { id: 3, name: "Senior Companions", role: "Visitor", loc: "Local Community" },
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    setRegistered(true);
    setTimeout(() => {
      setRegistered(false);
      setSelectedEvent(null);
      alert("Registration Successful!");
    }, 2000);
  };

  return (
    <div className="community-container">
      {/* ... Header code ... */}
      <div className="comm-header">
        <h2>Community & Workshops</h2>
        <p>Connect, learn, and grow with others.</p>
      </div>

      <h3 className="section-label">Upcoming Workshops</h3>
      <div className="events-grid">
        {events.map(ev => (
          <div key={ev.id} className="event-card">
            <div className="event-img" style={{backgroundImage: `url(${ev.image})`}}>
               <span className="event-type-badge">{ev.type}</span>
            </div>
            <div className="event-details">
              <h4>{ev.title}</h4>
              <div className="event-meta"><Calendar size={14}/> {ev.date}</div>
              {/* CLICKING THIS OPENS MODAL */}
              <button className="register-btn" onClick={() => setSelectedEvent(ev)}>Register Free</button>
            </div>
          </div>
        ))}
      </div>

      {/* ... Volunteer section ... */}
      <h3 className="section-label" style={{marginTop: '40px'}}>Volunteer Opportunities</h3>
      <div className="volunteer-list">
        {ngos.map(org => (
           <div key={org.id} className="volunteer-card">
             <div className="vol-icon"><Heart size={24}/></div>
             <div className="vol-info"><h4>{org.name}</h4><p>{org.role}</p><span className="loc-tag"><MapPin size={12}/> {org.loc}</span></div>
             <button className="apply-btn">Apply <ExternalLink size={14}/></button>
           </div>
        ))}
      </div>

      {/* --- NEW REGISTRATION MODAL --- */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedEvent(null)}><X size={20}/></button>
            
            {!registered ? (
              <>
                <div className="modal-header">
                  <h3>Register for Event</h3>
                  <p>{selectedEvent.title}</p>
                </div>
                <form className="booking-form" onSubmit={handleRegister}>
                  <label>Full Name</label>
                  <input type="text" required className="form-input" placeholder="Your Name" />
                  <label>Email Address</label>
                  <input type="email" required className="form-input" placeholder="you@example.com" />
                  <button type="submit" className="confirm-btn">Confirm Registration</button>
                </form>
              </>
            ) : (
              <div className="success-state">
                <CheckCircle size={50} color="green" />
                <h3>You're In!</h3>
                <p>We've sent the link to your email.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;