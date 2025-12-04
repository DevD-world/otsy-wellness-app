import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Auth.css'; 

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Default to "Log In" mode
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- THE SMART REDIRECT LOGIC ---
  // This checks the user's role in Firestore and sends them to the right dashboard
  const routeUser = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // CHECK ROLE
        if (data.role === 'doctor') {
          console.log("User is a Doctor. Going to Doctor Dashboard.");
          navigate('/doctor-dashboard');
        } else if (data.role === 'admin') {
          console.log("User is Admin.");
          navigate('/admin');
        } else {
          console.log("User is Patient.");
          navigate('/user-home');
        }
      } else {
        // Fallback for new Google users (default to Patient)
        navigate('/user-home');
      }
    } catch (e) {
      console.error("Routing Error:", e);
      setError("Login successful, but redirection failed.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        // --- LOG IN (For Doctors, Patients AND Admins) ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        // --- SIGN UP (Patients Only) ---
        // Doctors must use the separate /doctor-signup page
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        // Create Patient Profile in Database
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          role: "patient", // Default role
          createdAt: new Date().toISOString()
        });
      }
      
      // Save basic info to local storage for quick UI access
      localStorage.setItem('otsy_user', JSON.stringify({
        name: user.displayName, email: user.email, uid: user.uid
      }));

      // Decide where to go based on Database Role
      await routeUser(user);

    } catch (err) {
      console.error(err);
      // Clean up Firebase error message
      setError(err.message.replace('Firebase:', '').trim());
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists, if not create as patient
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          role: "patient",
          createdAt: new Date().toISOString()
        });
      }
      await routeUser(result.user);
    } catch (err) {
      setError("Google sign in failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* DYNAMIC HEADER */}
        <h2>{isLogin ? 'Log In' : 'Create Patient Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Doctors & Patients login here' : 'Start your wellness journey'}
        </p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" 
              value={name} onChange={(e) => setName(e.target.value)} required 
            />
          )}
          
          <input 
            type="email" placeholder="Email Address" 
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <button className="google-btn" onClick={handleGoogle}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        {/* TOGGLE BETWEEN LOGIN / SIGNUP */}
        <p className="toggle-text">
          {isLogin ? "New Patient? " : "Have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create Account' : 'Log In Here'}
          </span>
        </p>

        {/* EXPLICIT LINKS FOR DOCTORS */}
        <div style={{
          marginTop: '25px', 
          borderTop: '1px solid #eee', 
          paddingTop: '20px', 
          textAlign: 'center'
        }}>
          {isLogin ? (
            <p style={{fontSize:'0.9rem', color:'#666'}}>
              Are you a Doctor? <br/>
              <span style={{color:'#1565c0', fontWeight:'bold'}}>
                Log in above with your credentials.
              </span>
            </p>
          ) : (
            <div style={{background:'#e3f2fd', padding:'10px', borderRadius:'8px'}}>
              <p style={{fontSize:'0.9rem', color:'#1565c0', marginBottom:'5px'}}>Are you a Therapist?</p>
              <button 
                onClick={() => navigate('/doctor-signup')}
                style={{
                  background: '#1565c0', color: 'white', border: 'none',
                  padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Register as a Doctor Here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;