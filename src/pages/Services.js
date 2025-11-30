import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Calendar, Clock, CheckCircle, Video, X } from 'lucide-react';
import './Services.css'; // We will update this next

// FIREBASE
import { auth, db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const doctors = [
  { id: 1, name: "Dr. Sarah Jenkins", specialty: "Anxiety & Stress", rating: 4.9, reviews: 120, image: "https://randomuser.me/api/portraits/women/44.jpg", price: "$50/hr" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Depression & Trauma", rating: 4.8, reviews: 85, image: "https://randomuser.me/api/portraits/men/32.jpg", price: "$60/hr" },
  { id: 3, name: "Emily Carter, LMFT", specialty: "Relationship Counseling", rating: 5.0, reviews: 200, image: "https://randomuser.me/api/portraits/women/68.jpg", price: "$55/hr" },
  { id: 4, name: "Dr. James Wilson", specialty: "Child Psychology", rating: 4.7, reviews: 90, image: "https://randomuser.me/api/portraits/men/45.jpg", price: "$70/hr" },
];

const Services = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Booking State
  const [selectedDoc, setSelectedDoc] = useState(null); // The doctor being booked
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooking, setIsBooking] = useState(false); // Controls Modal visibility
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle | loading | success

  // Filter Doctors
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. OPEN BOOKING MODAL
  const handleBookClick = (doctor) => {
    // Check if user is logged in
    if (!auth.currentUser) {
      if(window.confirm("You must be logged in to book an appointment. Go to Login?")) {
        navigate('/auth');
      }
      return;
    }
    setSelectedDoc(doctor);
    setIsBooking(true);
    setBookingStatus('idle');
  };

  // 2. CONFIRM BOOKING (SAVE TO FIREBASE)
  const confirmBooking = async (e) => {
    e.preventDefault();
    if(!bookingDate || !bookingTime) return alert("Please select date and time");

    setBookingStatus('loading');

    try {
      // Add to 'appointments' collection
      await addDoc(collection(db, "appointments"), {
        userId: auth.currentUser.uid,
        doctorId: selectedDoc.id,
        doctorName: selectedDoc.name,
        specialty: selectedDoc.specialty,
        image: selectedDoc.image,
        date: bookingDate,
        time: bookingTime,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });

      setBookingStatus('success');
      
      // Close after 2 seconds
      setTimeout(() => {
        setIsBooking(false);
        setSelectedDoc(null);
        setBookingDate('');
        setBookingTime('');
        navigate('/dashboard/settings'); // Go to Profile to see it
      }, 2000);

    } catch (error) {
      console.error("Error booking:", error);
      alert("Failed to book. Please try again.");
      setBookingStatus('idle');
    }
  };

  return (
    <div className="services-container">
      {/* HEADER */}
      <div className="services-header">
        <h2>Find Professional Help</h2>
        <p>Verified therapists and counselors, ready to listen.</p>
        
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={20}/>
          <input 
            type="text" 
            placeholder="Search by name or specialty (e.g. Anxiety)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DOCTORS GRID */}
      <div className="doctors-grid">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="doctor-card">
            <div className="doc-img-wrapper">
              <img src={doc.image} alt={doc.name} />
              <div className="verified-badge">✓ Verified</div>
            </div>
            <div className="doc-info">
              <div className="doc-top">
                <h3>{doc.name}</h3>
                <span className="rating"><Star size={14} fill="#fdd835" color="#fdd835"/> {doc.rating} ({doc.reviews})</span>
              </div>
              <p className="specialty">{doc.specialty}</p>
              <div className="doc-meta">
                <span><Video size={14}/> Video Call</span>
                <span><MapPin size={14}/> Online</span>
              </div>
              <div className="doc-actions">
                <span className="price">{doc.price}</span>
                <button className="book-btn" onClick={() => handleBookClick(doc)}>Book Session</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {isBooking && selectedDoc && (
        <div className="booking-overlay">
          <div className="booking-modal">
            <button className="close-booking" onClick={() => setIsBooking(false)}><X size={24}/></button>
            
            {bookingStatus === 'success' ? (
              <div className="success-view">
                <CheckCircle size={60} color="#2e7d32" />
                <h3>Booking Confirmed!</h3>
                <p>You have an appointment with {selectedDoc.name}</p>
                <p>Date: {bookingDate} at {bookingTime}</p>
                <small>Redirecting to your schedule...</small>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <img src={selectedDoc.image} alt="Doctor" className="avatar-small"/>
                  <div>
                    <h3>Book with {selectedDoc.name}</h3>
                    <p>{selectedDoc.specialty}</p>
                  </div>
                </div>

                <form onSubmit={confirmBooking}>
                  <div className="form-group">
                    <label><Calendar size={16}/> Select Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                  </div>

                  <div className="form-group">
                    <label><Clock size={16}/> Select Time</label>
                    <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required>
                      <option value="">-- Choose Slot --</option>
                      <option>09:00 AM</option>
                      <option>11:00 AM</option>
                      <option>02:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>

                  <button type="submit" className="confirm-btn" disabled={bookingStatus === 'loading'}>
                    {bookingStatus === 'loading' ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;