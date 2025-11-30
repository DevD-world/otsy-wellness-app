import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Upload, Stethoscope, AlertTriangle } from 'lucide-react';
import './DoctorSignup.css';

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialty: '', license: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    console.log("Starting Signup Process...");

    try {
      // 1. Create User in Firebase Authentication
      console.log("Creating Auth User...");
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("Auth User Created:", user.uid);

      // 2. Update Display Name
      await updateProfile(user, { displayName: "Dr. " + formData.name });

      // 3. Create Document in Firestore
      console.log("Writing to Firestore...");
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: "Dr. " + formData.name,
          email: formData.email,
          role: "doctor",
          specialty: formData.specialty,
          licenseNumber: formData.license,
          isVerified: false,
          rating: 5.0,
          reviews: 0,
          image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          createdAt: new Date().toISOString()
        });
        console.log("Firestore Write Success!");
        
        // 4. Success - Redirect
        navigate('/doctor-dashboard');

      } catch (dbError) {
        console.error("Firestore Error:", dbError);
        setErrorMsg("Account created, but database failed. Check Firestore Rules.");
      }

    } catch (error) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("This email is already registered. Please Log In.");
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg("Password must be at least 6 characters.");
      } else {
        setErrorMsg(error.message);
      }
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

        {errorMsg && (
          <div style={{
            background:'#ffebee', color:'#c62828', padding:'10px', 
            borderRadius:'8px', marginBottom:'15px', fontSize:'0.9rem',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <AlertTriangle size={16}/> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Dr. Full Name" required 
            onChange={(e) => setFormData({...formData, name: e.target.value})}/>
          
          <input type="email" placeholder="Professional Email" required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}/>
          
          <input type="password" placeholder="Password (Min 6 chars)" required 
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

          <div className="file-upload-mock">
            <Upload size={16}/> <span>Upload License Document (PDF/JPG)</span>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit for Verification'}
          </button>
        </form>
        
        <p style={{textAlign:'center', marginTop:'15px', fontSize:'0.9rem'}}>
          Already registered? <span style={{color:'#2e7d32', cursor:'pointer', fontWeight:'bold'}} onClick={() => navigate('/auth')}>Log In here</span>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignup;