import React from 'react';
import { X, ShieldCheck, Calendar, Award, Building2 } from 'lucide-react';
import './VerificationModal.css';

const VerificationModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="verify-overlay" onClick={onClose}>
      <div className="verify-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-verify" onClick={onClose}><X size={20}/></button>
        
        {/* ANIMATED CHECKMARK */}
        <div className="success-animation">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <h2 className="verify-title">Identity Verified</h2>
        <p className="verify-subtitle">This License ID matches official government records.</p>

        <div className="official-data-box">
          <div className="data-row header">
            <ShieldCheck size={20} color="#2e7d32"/>
            <span>OFFICIAL REGISTRY DATA</span>
          </div>
          
          <div className="data-grid">
            <div className="data-item">
              <label>Doctor Name</label>
              <strong>{doctor.name}</strong>
            </div>
            <div className="data-item">
              <label>Status</label>
              <span className="badge-active">{doctor.status}</span>
            </div>
            <div className="data-item">
              <label><Award size={14}/> Qualification</label>
              <span>{doctor.qualification}</span>
            </div>
            <div className="data-item">
              <label><Building2 size={14}/> Council</label>
              <span>{doctor.council}</span>
            </div>
            <div className="data-item">
              <label><Calendar size={14}/> Valid Until</label>
              <span>{doctor.validUntil}</span>
            </div>
          </div>
        </div>

        <button className="verify-ok-btn" onClick={onClose}>Approve & Close</button>
      </div>
    </div>
  );
};

export default VerificationModal;