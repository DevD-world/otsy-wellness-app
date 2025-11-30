import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Upload, Stethoscope, CheckCircle } from 'lucide-react';
import './DoctorSignup.css'; // Create this CSS file similarly to Auth.css

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialty: '', license: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: "Dr. " + formData.name });

      // 2. Save to Firestore with "Pending" status
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: "Dr. " + formData.name,
        email: formData.email,
        role: "doctor",
        specialty: formData.specialty,
        licenseNumber: formData.license,
        isVerified: false, // <--- CRITICAL: Not visible yet
        rating: 5.0, // Default start
        reviews: 0,
        image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png", // Default Doc Avatar
        createdAt: new Date().toISOString()
      });

      // 3. Redirect to Dashboard (which will show the "Pending" screen)
      navigate('/doctor-dashboard');

    } catch (error) {
      console.error(error);
      alert("Error registering: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card doctor-card">
        <div style={{textAlign:'center', marginBottom:'20px'}}>
          <Stethoscope size={40} color="#2e7d32" />
          <h2>Join Otsy Specialists</h2>
          <p>Help us heal the world.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Dr. Full Name" required 
            onChange={(e) => setFormData({...formData, name: e.target.value})}/>
          
          <input type="email" placeholder="Professional Email" required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}/>
          
          <input type="password" placeholder="Password" required 
            onChange={(e) => setFormData({...formData, password: e.target.value})}/>

          <select className="auth-input" required onChange={(e) => setFormData({...formData, specialty: e.target.value})}>
            <option value="">Select Specialty</option>
            <option value="Psychologist">Psychologist</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Therapist">Therapist</option>
            <option value="Counselor">Counselor</option>
          </select>

          <input type="text" placeholder="Medical License ID" required 
            onChange={(e) => setFormData({...formData, license: e.target.value})}/>

          {/* Simulated File Upload */}
          <div className="file-upload-mock">
            <Upload size={16}/> <span>Upload License Document (PDF/JPG)</span>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Submitting Application...' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;