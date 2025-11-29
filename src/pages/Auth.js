import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import Firebase functions
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import './Auth.css'; 

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Handle Email/Password Auth
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        saveUserLocally(userCredential.user);
      } else {
        // SIGN UP
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Add Display Name to profile
        await updateProfile(userCredential.user, { displayName: name });
        saveUserLocally(userCredential.user);
      }
      navigate('/dashboard');
    } catch (err) {
      // Show friendly error messages
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
      navigate('/dashboard');
    } catch (err) {
      setError("Google sign in failed. Try again.");
    }
  };

  // Helper to keep app working with existing localStorage logic
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
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">{isLogin ? 'Continue your wellness journey' : 'Start your journey with Otsy'}</p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleAuth}>
          {/* Show Name field only for Sign Up */}
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
      </div>
    </div>
  );
};

export default Auth;