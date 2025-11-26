import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Add useLocation
import { Star, MapPin, Calendar, CheckCircle, X, Trash2 } from 'lucide-react';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Access state passed from Doctor Profile

  const [filter, setFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingStep, setBookingStep] = useState('form'); 
  const [appointments, setAppointments] = useState([]);
  
  // 3. New State to hold the pre-filled time
  const [formTime, setFormTime] = useState('09:00 AM'); 

  const doctorsData = [
    { id: 1, name: "Dr. Sarah Jenkins", role: "Psychiatrist", rating: 4.9, location: "New York, NY", available: "Today", img: "SJ" },
    { id: 2, name: "Dr. Aravind Patel", role: "Psychologist", rating: 4.8, location: "Online", available: "Tomorrow", img: "AP" },
    { id: 3, name: "Emma Wood", role: "Yoga Therapist", rating: 5.0, location: "Austin, TX", available: "Today", img: "EW" },
    { id: 4, name: "Dr. James Carter", role: "Psychiatrist", rating: 4.7, location: "Chicago, IL", available: "Next Week", img: "JC" },
    { id: 5, name: "Lisa Wong", role: "Yoga Therapist", rating: 4.9, location: "Online", available: "Today", img: "LW" },
    { id: 6, name: "Dr. Marcus Reid", role: "Psychologist", rating: 4.8, location: "Seattle, WA", available: "Tomorrow", img: "MR" }
  ];

  const filteredDoctors = filter === 'All' ? doctorsData : doctorsData.filter(doc => doc.role.includes(filter));

  // --- LOAD APPOINTMENTS ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('otsy_appointments') || '[]');
    setAppointments(saved);
  }, []);

  // --- 4. CHECK FOR INCOMING BOOKING REQUEST ---
  useEffect(() => {
    if (location.state) {
      const { preSelectedDoctorId, preSelectedTime } = location.state;
      
      if (preSelectedDoctorId) {
        const docToBook = doctorsData.find(d => d.id === preSelectedDoctorId);
        if (docToBook) {
          setSelectedDoctor(docToBook);
          setBookingStep('form');
          // If a time was clicked, set it. Otherwise default to 9AM.
          if (preSelectedTime) setFormTime(preSelectedTime);
        }
      }
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const openBooking = (doctor) => { 
    setSelectedDoctor(doctor); 
    setBookingStep('form'); 
    setFormTime('09:00 AM'); // Reset time for manual opens
  };
  
  const closeBooking = () => { setSelectedDoctor(null); };

  const confirmBooking = (e) => {
    e.preventDefault();
    setBookingStep('loading');
    setTimeout(() => {
      const newAppt = {
        id: Date.now(),
        doctor: selectedDoctor.name,
        role: selectedDoctor.role,
        date: e.target[0].value,
        time: formTime // Use the state variable
      };
      const updated = [...appointments, newAppt];
      setAppointments(updated);
      localStorage.setItem('otsy_appointments', JSON.stringify(updated));
      
      setBookingStep('success');
    }, 1500);
  };

  const cancelAppt = (id) => {
    if(window.confirm("Cancel this appointment?")) {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      localStorage.setItem('otsy_appointments', JSON.stringify(updated));
    }
  };

  return (
    <div className="services-container">
      {/* MY APPOINTMENTS */}
      {appointments.length > 0 && (
        <div className="my-appointments-section">
          <h3>My Appointments</h3>
          <div className="appt-grid">
            {appointments.map(appt => (
              <div key={appt.id} className="appt-card">
                <div className="appt-info">
                  <h4>{appt.doctor}</h4>
                  <p>{appt.role}</p>
                  <div className="appt-time"><span>📅 {appt.date}</span><span>⏰ {appt.time}</span></div>
                </div>
                <button className="cancel-btn" onClick={() => cancelAppt(appt.id)}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="services-header">
        <div><h2>Find a Professional</h2><p>Verified experts ready to help you.</p></div>
        <div className="filter-group">
          {['All', 'Psychiatrist', 'Psychologist', 'Yoga'].map(cat => (
            <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="doctors-grid">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="doc-card">
            <div className={`doc-card-header ${doc.role.split(' ')[0].toLowerCase()}-bg`}>
              <div className="avatar-circle">{doc.img}</div>
              <span className="availability-badge"><CheckCircle size={12}/> {doc.available}</span>
            </div>
            <div className="doc-card-body">
              <span className={`role-badge ${doc.role.split(' ')[0].toLowerCase()}`}>{doc.role}</span>
              <h3 style={{cursor: 'pointer'}} onClick={() => navigate(`/dashboard/doctor/${doc.id}`)}>
                {doc.name}
              </h3>
              <div className="doc-meta"><span><MapPin size={14} /> {doc.location}</span><span className="rating"><Star size={14} fill="#FFD700" color="#FFD700"/> {doc.rating}</span></div>
              <button className="book-appt-btn" onClick={() => openBooking(doc)}><Calendar size={16}/> Book Session</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeBooking}><X size={20}/></button>
            {bookingStep === 'form' && (
              <>
                <div className="modal-header"><h3>Book with {selectedDoctor.name}</h3><span className="role-text">{selectedDoctor.role}</span></div>
                <form className="booking-form" onSubmit={confirmBooking}>
                  <label>Select Date</label><input type="date" required className="form-input" />
                  <label>Select Time</label>
                  
                  {/* Controlled Select Input */}
                  <select 
                    className="form-input" 
                    value={formTime} 
                    onChange={(e) => setFormTime(e.target.value)}
                  >
                    <option>09:00 AM</option>
                    <option>11:00 AM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                  </select>

                  <button type="submit" className="confirm-btn">Confirm Appointment</button>
                </form>
              </>
            )}
            {bookingStep === 'loading' && <div className="loading-state"><div className="spinner"></div><p>Connecting...</p></div>}
            {bookingStep === 'success' && (
              <div className="success-state"><div className="success-icon"><CheckCircle size={40}/></div><h3>Confirmed!</h3><p>Booked with {selectedDoctor.name}</p><button className="confirm-btn" onClick={closeBooking}>Done</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;