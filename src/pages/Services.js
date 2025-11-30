import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Calendar, Clock, CheckCircle, Video, X, Stethoscope } from 'lucide-react';
import './Services.css'; 

// FIREBASE IMPORTS
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const Services = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Dynamic Doctors
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle');

  // --- 1. FETCH VERIFIED DOCTORS ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Query: Get users who are 'doctor' AND 'isVerified' is true
        const q = query(
          collection(db, "users"), 
          where("role", "==", "doctor"), 
          where("isVerified", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedDocs = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));

        if (fetchedDocs.length > 0) {
          setDoctorsList(fetchedDocs);
        } else {
          // FALLBACK: If no doctors exist in DB yet, show these Dummy Docs for demo purposes
          setDoctorsList([
            { id: 'd1', name: "Dr. Demo (Example)", specialty: "Psychologist", rating: 5.0, reviews: 10, price: "$50", image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png", isDemo: true },
            { id: 'd2', name: "Dr. Sarah Smith", specialty: "Anxiety Expert", rating: 4.8, reviews: 42, price: "$60", image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png", isDemo: true }
          ]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // --- 2. SEARCH FILTER ---
  const filteredDoctors = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 3. HANDLE BOOK CLICK ---
  const handleBookClick = (doctor) => {
    // Force Login to book
    if (!auth.currentUser) {
      if(window.confirm("You need a secure patient account to book an appointment. Sign in/Register now?")) {
        navigate('/auth');
      }
      return;
    }
    setSelectedDoc(doctor);
    setIsBooking(true);
    setBookingStatus('idle');
  };

  // --- 4. CONFIRM BOOKING ---
  const confirmBooking = async (e) => {
    e.preventDefault();
    if(!bookingDate || !bookingTime) return alert("Please select date and time");

    setBookingStatus('loading');

    try {
      await addDoc(collection(db, "appointments"), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Patient",
        doctorId: selectedDoc.id || selectedDoc.uid, // Handle both id types
        doctorName: selectedDoc.name,
        specialty: selectedDoc.specialty,
        date: bookingDate,
        time: bookingTime,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });

      setBookingStatus('success');
      
      setTimeout(() => {
        setIsBooking(false);
        setSelectedDoc(null);
        setBookingDate('');
        setBookingTime('');
        navigate('/dashboard/settings'); // Go to Profile to see appt
      }, 2000);

    } catch (error) {
      console.error("Error booking:", error);
      alert("Failed to book. Please try again.");
      setBookingStatus('idle');
    }
  };

  return (
    <div className="services-container">
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

      {loading ? (
        <div style={{textAlign:'center', padding:'40px'}}>Loading Specialists...</div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className="doctor-card">
              <div className="doc-img-wrapper">
                <img src={doc.image || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} alt={doc.name} />
                <div className="verified-badge">✓ Verified</div>
              </div>
              <div className="doc-info">
                <div className="doc-top">
                  <h3>{doc.name}</h3>
                  <span className="rating"><Star size={14} fill="#fdd835" color="#fdd835"/> {doc.rating || 5.0} ({doc.reviews || 0})</span>
                </div>
                <p className="specialty">{doc.specialty}</p>
                <div className="doc-meta">
                  <span><Video size={14}/> Video Call</span>
                  <span><MapPin size={14}/> Online</span>
                </div>
                {doc.isDemo && <small style={{color:'orange', display:'block', marginBottom:'5px'}}>*Demo Profile</small>}
                <div className="doc-actions">
                  <span className="price">{doc.price || "$50/hr"}</span>
                  <button className="book-btn" onClick={() => handleBookClick(doc)}>Book Session</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  <div className="avatar-small-wrapper">
                     <Stethoscope size={24} color="#1565c0"/>
                  </div>
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