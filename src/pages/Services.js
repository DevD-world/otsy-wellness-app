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
  
  // State for Doctors & Appointments
  const [doctorsList, setDoctorsList] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle');

  // --- 1. FETCH DOCTORS & MY APPOINTMENTS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Verified Doctors
        const qDocs = query(
          collection(db, "users"), 
          where("role", "==", "doctor"), 
          where("isVerified", "==", true)
        );
        const docsSnapshot = await getDocs(qDocs);
        const fetchedDocs = docsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (fetchedDocs.length > 0) {
          setDoctorsList(fetchedDocs);
        } else {
          // Demo Fallback
          setDoctorsList([
            { id: 'd1', name: "Dr. Demo", specialty: "Psychologist", rating: 5.0, reviews: 10, price: "$50", isDemo: true }
          ]);
        }

        // B. Fetch My Appointments (If Logged In)
        if (auth.currentUser) {
          const qAppt = query(
            collection(db, "appointments"), 
            where("userId", "==", auth.currentUser.uid)
          );
          const apptSnapshot = await getDocs(qAppt);
          const myAppts = apptSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort newest first
          setMyAppointments(myAppts.sort((a,b) => new Date(b.date) - new Date(a.date)));
        }

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. JOIN VIDEO CALL (INTERNAL) ---
  const handleJoinSession = (apptId) => {
    const roomName = `otsy-secure-${apptId}`;
    navigate(`/call/${roomName}`); // Navigates to your internal VideoCall.js page
  };

  // --- 3. FILTER LOGIC ---
  const filteredDoctors = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 4. BOOKING LOGIC ---
  const handleBookClick = (doctor) => {
    if (!auth.currentUser) {
      if(window.confirm("You need a patient account to book. Sign in now?")) {
        navigate('/auth');
      }
      return;
    }
    setSelectedDoc(doctor);
    setIsBooking(true);
    setBookingStatus('idle');
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    if(!bookingDate || !bookingTime) return alert("Select date/time");
    setBookingStatus('loading');

    try {
      await addDoc(collection(db, "appointments"), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Patient",
        doctorId: selectedDoc.id, 
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
        // Refresh page to show new appointment or just reload window
        window.location.reload(); 
      }, 2000);

    } catch (error) {
      console.error(error);
      setBookingStatus('idle');
    }
  };

  return (
    <div className="services-container">
      
      {/* --- SECTION: MY APPOINTMENTS --- */}
      {auth.currentUser && myAppointments.length > 0 && (
        <div className="my-appointments-section">
          <h2 className="section-title">My Scheduled Sessions</h2>
          <div className="my-appts-grid">
            {myAppointments.map(appt => (
              <div key={appt.id} className="my-appt-card">
                <div className="appt-info">
                  <h4>Dr. {appt.doctorName}</h4>
                  <p className="appt-datetime">
                    <Calendar size={14}/> {appt.date} • <Clock size={14}/> {appt.time}
                  </p>
                  <span className={`status-badge ${appt.status || 'confirmed'}`}>
                    {appt.status === 'confirmed' ? 'Upcoming' : appt.status || 'Confirmed'}
                  </span>
                </div>
                
                {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                  <button className="join-btn-patient" onClick={() => handleJoinSession(appt.id)}>
                    <Video size={16}/> Join Video Call
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION: FIND DOCTORS --- */}
      <div className="services-header">
        <h2>Find Professional Help</h2>
        <p>Verified therapists and counselors, ready to listen.</p>
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={20}/>
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
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
                  <span className="rating"><Star size={14} fill="#fdd835" color="#fdd835"/> {doc.rating || 5.0}</span>
                </div>
                <p className="specialty">{doc.specialty}</p>
                <div className="doc-meta">
                  <span><Video size={14}/> Video Call</span>
                  <span><MapPin size={14}/> Online</span>
                </div>
                {doc.isDemo && <small style={{color:'orange'}}>*Demo Profile</small>}
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
                <p>Date: {bookingDate} at {bookingTime}</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <Stethoscope size={24} color="#1565c0"/>
                  <div><h3>Book with {selectedDoc.name}</h3></div>
                </div>
                <form onSubmit={confirmBooking}>
                  <div className="form-group">
                    <label>Select Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Select Time</label>
                    <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required>
                      <option value="">-- Choose --</option>
                      <option>09:00 AM</option><option>11:00 AM</option><option>02:00 PM</option><option>04:00 PM</option>
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