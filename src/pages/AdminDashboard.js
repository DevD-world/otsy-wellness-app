import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Check, X, ShieldAlert, Search, Loader, Shield } from 'lucide-react';
import { verifyMedicalId } from '../utils/medicalRegistry'; // Import the Utility
import VerificationModal from '../components/VerificationModal'; // Import the Modal
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingDocs, setPendingDocs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  // Verification States
  const [verifyId, setVerifyId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  // 1. FETCH DATA (Keep existing logic)
  const fetchData = async () => {
    const qPending = query(collection(db, "users"), where("role", "==", "doctor"), where("isVerified", "==", false));
    const snapPending = await getDocs(qPending);
    setPendingDocs(snapPending.docs.map(d => ({ id: d.id, ...d.data() })));

    const qAll = query(collection(db, "users"));
    const snapAll = await getDocs(qAll);
    setAllUsers(snapAll.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  // 2. HANDLE MANUAL VERIFICATION
  const handleManualVerify = async (e) => {
    e.preventDefault();
    if(!verifyId.trim()) return;

    setIsVerifying(true);
    setVerifyError("");
    setVerifiedData(null);

    // Call the Mock API
    const result = await verifyMedicalId(verifyId);

    if (result.success) {
      setVerifiedData(result.data); // Triggers Modal
    } else {
      setVerifyError(result.error);
    }
    setIsVerifying(false);
  };

  // 3. APPROVE/REJECT LOGIC (Existing)
  const approveDoctor = async (id) => {
    if(window.confirm("Confirm approval?")) {
      await updateDoc(doc(db, "users", id), { isVerified: true });
      fetchData();
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-brand"><ShieldAlert size={28} color="#d32f2f"/> <h2>Admin Panel</h2></div>
        <span>System Status: Online</span>
      </header>

      {/* --- NEW VERIFICATION TOOL --- */}
      <section className="verification-tool-section">
        <h3><Shield size={20}/> Registry Verification Tool</h3>
        <p>Enter a License ID to validate against the Government Database (NMC/NPI).</p>
        
        <form className="verify-search-box" onSubmit={handleManualVerify}>
          <Search size={20} color="#666"/>
          <input 
            type="text" 
            placeholder="Enter Medical License ID (e.g., MED-2024-001)..." 
            value={verifyId}
            onChange={(e) => setVerifyId(e.target.value)}
          />
          <button type="submit" disabled={isVerifying}>
            {isVerifying ? <><Loader size={16} className="spin"/> Checking...</> : "Verify Identity"}
          </button>
        </form>

        {verifyError && (
          <div className="verify-error-msg">
            <X size={16}/> {verifyError}
          </div>
        )}
      </section>

      {/* --- EXISTING TABS (Pending / Users) --- */}
      <div className="admin-tabs">
        <button className={activeTab==='pending'?'active':''} onClick={()=>setActiveTab('pending')}>Pending Requests</button>
        <button className={activeTab==='users'?'active':''} onClick={()=>setActiveTab('users')}>All Users</button>
      </div>
      
      {/* ... (Keep your existing admin-list and admin-table code here) ... */}
      {/* For brevity, I'm assuming you keep the list logic from the previous files */}
      
      <div className="admin-list">
        {activeTab === 'pending' && pendingDocs.map(doc => (
          <div key={doc.id} className="admin-row">
            <div>
              <h4>{doc.name}</h4>
              <p>License: <span className="mono-badge">{doc.licenseNumber}</span></p>
            </div>
            <div className="admin-actions">
              {/* Copy ID button for ease */}
              <button className="copy-btn" onClick={() => setVerifyId(doc.licenseNumber)}>Check ID ⬆</button>
              <button className="approve-btn" onClick={() => approveDoctor(doc.id)}><Check size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* VERIFICATION POPUP */}
      <VerificationModal 
        doctor={verifiedData} 
        onClose={() => setVerifiedData(null)} 
      />
    </div>
  );
};

export default AdminDashboard;