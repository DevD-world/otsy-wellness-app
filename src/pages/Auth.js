import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase'; // Ensure db is imported
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import './Auth.css'; 

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- HELPER: ROUTE BASED ON ROLE ---
  const routeUser = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // If no firestore doc exists (e.g. fresh google sign in), assume patient
        navigate('/dashboard');
      }
    } catch (e) {
      console.error("Routing Error:", e);
      navigate('/dashboard'); // Fallback
    }
  };

  // 1. Handle Email/Password Auth
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        // LOGIN
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        // SIGN UP (Patients Only Here - Doctors use /doctor-signup)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        // Create Patient Doc
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          role: "patient",
          createdAt: new Date().toISOString()
        });
      }
      
      saveUserLocally(user);
      await routeUser(user); // Check role and redirect

    } catch (err) {
      const msg = err.code.replace('auth/', '').replace(/-/g, ' ');
      setError(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
    setLoading(false);
  };

  // 2. Handle Google Login
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      saveUserLocally(result.user);
      
      // Check if user exists in DB, if not create as patient
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
      setError("Google sign in failed. Try again.");
    }
  };

  const saveUserLocally = (user) => {
    const userData = {
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      uid: user.uid,
      photo: user.photoURL
    };
    localStorage.setItem('otsy_user', JSON.stringify(userData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Patient Registration'}</h2>
        <p className="auth-subtitle">{isLogin ? 'Continue your wellness journey' : 'Start your journey with Otsy'}</p>
        
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

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>

        {/* LINK TO DOCTOR SIGNUP */}
        <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', fontSize: '0.9rem'}}>
          Are you a Doctor? <span style={{color:'#1565c0', cursor:'pointer', fontWeight:'bold'}} onClick={() => navigate('/doctor-signup')}>Apply Here</span>
        </div>
      </div>
    </div>
  );
};


export default Auth;

