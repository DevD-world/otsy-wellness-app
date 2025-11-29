import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure you have firebase installed, OR for now just simulate login
// If you deleted firebase setup, use the Simulated Logic below:
import './Auth.css'; 

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    
    // SIMULATED LOGIN FOR FRONTEND DEMO
    if(email && password) {
      // Create fake user data
      const userData = { 
        name: email.split('@')[0], // Use part of email as name
        email: email 
      };
      
      // Save to localStorage (This logs them in!)
      localStorage.setItem('otsy_user', JSON.stringify(userData));
      
      // Go to Dashboard
      navigate('/dashboard');
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">{isLogin ? 'Continue your wellness journey' : 'Start your journey with Otsy'}</p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleAuth}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="primary-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

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