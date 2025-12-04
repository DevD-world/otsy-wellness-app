import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, CheckCircle, Clock, LogOut, 
  AlertTriangle, ChevronRight, Activity, Video, FileText, X, Save 
} from 'lucide-react';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATES
  const [selectedAppt, setSelectedAppt] = useState(null); // For Notes Modal
  const [clinicalNote, setClinicalNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Stats State
  const [stats, setStats] = useState({ handled: 0, handling: 0, upcoming: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security Check: Kick out if not a doctor
          if (data.role !== 'doctor') { navigate('/dashboard'); return; }
          
          setDoctorData(data);
          
          // Only fetch data if verified
          if (data.isVerified) fetchAppointments(user.uid);
        }
      } else { navigate('/auth'); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAppointments = async (uid) => {
    const q = query(collection(db, "appointments"), where("doctorId", "==", uid));
    const querySnapshot = await getDocs(q);
    
    // Sort by date (newest first)
    const data = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setAppointments(data);

    // Calculate Stats
    const completed = data.filter(a => a.status === 'completed').length;
    const upcoming = data.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length;
    const uniquePatients = new Set(data.map(a => a.userId)).size;

    setStats({ handled: completed, handling: uniquePatients, upcoming: upcoming });
  };

  // --- ACTIONS ---

  const handleJoinCall = (apptId) => {
    // 1. Generate Secure Room ID
    const roomName = `otsy-secure-${apptId}`;
    // 2. Navigate to Internal Video Page
    navigate(`/call/${roomName}`); 
  };

  const handleOpenNotes = (appt) => {
    setSelectedAppt(appt);
    setClinicalNote(appt.notes || ''); // Load existing notes if any
  };

  const saveNotes = async () => {
    if (!selectedAppt) return;
    setNoteSaving(true);
    try {
      const apptRef = doc(db, "appointments", selectedAppt.id);
      await updateDoc(apptRef, {
        notes: clinicalNote
      });
      
      // Update local state UI
      const updatedList = appointments.map(a => 
        a.id === selectedAppt.id ? { ...a, notes: clinicalNote } : a
      );
      setAppointments(updatedList);
      alert("Clinical notes saved securely.");
      setSelectedAppt(null); // Close modal
    } catch (e) {
      console.error(e);
      alert("Failed to save note.");
    }
    setNoteSaving(false);
  };

  const markComplete = async (apptId) => {
    if(!window.confirm("Mark session as completed?")) return;
    try {
      await updateDoc(doc(db, "appointments", apptId), { status: 'completed' });
      fetchAppointments(auth.currentUser.uid); // Refresh list
    } catch (e) { console.error(e); }
  };

  const markCancelled = async (apptId) => {
    if(!window.confirm("Cancel this appointment?")) return;
    try {
      await updateDoc(doc(db, "appointments", apptId), { status: 'cancelled' });
      fetchAppointments(auth.currentUser.uid);
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="loading-screen">Loading Portal...</div>;

  // --- LOCKED STATE (Pending Verification) ---
  if (doctorData && !doctorData.isVerified) {
    return (
      <div className="doc-locked-container">
        <div className="doc-locked-card">
          <div className="status-icon-wrapper pending"><Clock size={48} /></div>
          <h1>Verification Pending</h1>
          <p className="doc-welcome">Dr. {doctorData.name.replace('Dr. ', '')}</p>
          
          <div className="alert-box">
            <AlertTriangle size={18}/> 
            <p>You cannot accept patients until Admin verifies your license.</p>
          </div>

          <button className="doc-logout-btn" onClick={() => { auth.signOut(); navigate('/auth'); }}>Log Out</button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (Verified) ---
  return (
    <div className="doc-layout">
      <aside className="doc-sidebar">
        <div className="doc-brand"><h2>Otsy.</h2><span>Pro</span></div>
        <nav className="doc-nav">
          <div className="nav-item active"><Activity size={20}/> Dashboard</div>
          <div className="nav-item"><Users size={20}/> My Patients</div>
          <div className="nav-item"><Calendar size={20}/> Schedule</div>
        </nav>
        <button className="doc-logout-link" onClick={() => { auth.signOut(); navigate('/auth'); }}>
          <LogOut size={18}/> Sign Out
        </button>
      </aside>

      <main className="doc-main">
        <header className="doc-header">
          <h1>Medical Dashboard</h1>
          <div className="doc-profile-pill">
            <div className="online-indicator"></div>
            <span>{doctorData.name}</span>
          </div>
        </header>

        {/* STATS */}
        <div className="doc-stats-grid">
          <div className="stat-box blue">
            <div className="stat-icon"><Users size={24}/></div>
            <div className="stat-info"><h3>{stats.handling}</h3><p>Active Patients</p></div>
          </div>
          <div className="stat-box green">
            <div className="stat-icon"><CheckCircle size={24}/></div>
            <div className="stat-info"><h3>{stats.handled}</h3><p>Sessions Completed</p></div>
          </div>
          <div className="stat-box purple">
            <div className="stat-icon"><Calendar size={24}/></div>
            <div className="stat-info"><h3>{stats.upcoming}</h3><p>Upcoming</p></div>
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="doc-table-section">
          <h3>Patient Schedule</h3>
          <div className="doc-table-wrapper">
            {appointments.length === 0 ? (
              <div className="empty-state-doc">No appointments scheduled yet.</div>
            ) : (
              <table className="doc-table">
                <thead>
                  <tr><th>Date & Time</th><th>Patient</th><th>Status</th><th>Clinical Actions</th></tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className={appt.status === 'completed' ? 'row-completed' : ''}>
                      <td>
                        <div className="time-stack"><strong>{appt.time}</strong><span>{appt.date}</span></div>
                      </td>
                      <td>{appt.userName}</td>
                      <td>
                        <span className={`status-badge ${appt.status || 'upcoming'}`}>
                          {appt.status === 'confirmed' ? 'Upcoming' : appt.status || 'Confirmed'}
                        </span>
                      </td>
                      <td>
                        <div className="action-row">
                          {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                            <>
                              <button className="icon-btn video" title="Start Video Call" onClick={() => handleJoinCall(appt.id)}>
                                <Video size={16}/>
                              </button>
                              <button className="icon-btn complete" title="Mark Complete" onClick={() => markComplete(appt.id)}>
                                <CheckCircle size={16}/>
                              </button>
                              <button className="icon-btn cancel" title="Cancel" onClick={() => markCancelled(appt.id)}>
                                <X size={16}/>
                              </button>
                            </>
                          )}
                          <button className="icon-btn notes" title="Patient Notes" onClick={() => handleOpenNotes(appt)}>
                            <FileText size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* NOTES MODAL */}
      {selectedAppt && (
        <div className="modal-overlay">
          <div className="notes-modal">
            <div className="modal-head">
              <h3>Clinical Notes: {selectedAppt.userName}</h3>
              <button onClick={() => setSelectedAppt(null)}><X size={20}/></button>
            </div>
            <textarea 
              placeholder="Write SOAP notes here (Subjective, Objective, Assessment, Plan)..."
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
            ></textarea>
            <div className="modal-foot">
              <button className="save-note-btn" onClick={saveNotes} disabled={noteSaving}>
                {noteSaving ? 'Saving...' : <><Save size={16}/> Save to Record</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;