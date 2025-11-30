import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Check, X, ShieldAlert } from 'lucide-react';
import './AdminDashboard.css'; // Simple CSS

const AdminDashboard = () => {
  const [pendingDocs, setPendingDocs] = useState([]);

  // Fetch only unverified doctors
  const fetchPending = async () => {
    const q = query(collection(db, "users"), where("role", "==", "doctor"), where("isVerified", "==", false));
    const snap = await getDocs(q);
    setPendingDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchPending(); }, []);

  const approveDoctor = async (id) => {
    if(window.confirm("Approve this doctor? They will become visible to all users.")) {
      await updateDoc(doc(db, "users", id), { isVerified: true });
      fetchPending(); // Refresh list
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <ShieldAlert size={32} color="#d32f2f"/>
        <h2>Otsy Admin Panel</h2>
      </div>
      
      <h3>Pending Verifications ({pendingDocs.length})</h3>
      
      <div className="admin-list">
        {pendingDocs.length === 0 && <p>No pending approvals.</p>}
        
        {pendingDocs.map(doc => (
          <div key={doc.id} className="admin-row">
            <div className="doc-info">
              <h4>{doc.name}</h4>
              <p>{doc.specialty} • License: {doc.licenseNumber}</p>
              <small>{doc.email}</small>
            </div>
            <div className="admin-actions">
              <button className="approve-btn" onClick={() => approveDoctor(doc.id)}>
                <Check size={16}/> Approve
              </button>
              <button className="reject-btn"><X size={16}/> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;