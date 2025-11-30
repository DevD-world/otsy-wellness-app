import React, { useState, useEffect } from 'react';
import { X, Phone, Wind, Shield } from 'lucide-react';
import './PanicOverlay.css'; // We will create this next

const PanicOverlay = ({ onClose }) => {
  const [step, setStep] = useState(0); // 0: Breathe, 1: Grounding, 2: Help
  const [breathText, setBreathText] = useState("Breathe In");
  const [scale, setScale] = useState(1);

  // Breathing Animation Loop
  useEffect(() => {
    if (step !== 0) return;
    
    const breathe = () => {
      setBreathText("Inhale...");
      setScale(1.5);
      setTimeout(() => {
        setBreathText("Hold...");
        setScale(1.5);
        setTimeout(() => {
          setBreathText("Exhale...");
          setScale(1);
        }, 3000); // Hold for 3s
      }, 4000); // Inhale for 4s
    };

    breathe();
    const interval = setInterval(breathe, 11000); // 4+3+4 = 11s loop (simplified 4-7-8)
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="panic-overlay">
      <button className="close-panic" onClick={onClose}><X size={32} /></button>

      {/* STEP 0: IMMEDIATE BREATHING */}
      {step === 0 && (
        <div className="panic-content fade-in">
          <h2>You are safe. Just breathe.</h2>
          <div 
            className="giant-breath-circle" 
            style={{ transform: `scale(${scale})` }}
          >
            <span>{breathText}</span>
          </div>
          <p>Follow the circle. Slow down your heart rate.</p>
          <button className="next-step-btn" onClick={() => setStep(1)}>I'm feeling a bit better</button>
        </div>
      )}

      {/* STEP 1: GROUNDING */}
      {step === 1 && (
        <div className="panic-content fade-in">
          <h2>Ground Yourself</h2>
          <p>Look around you. Find:</p>
          <div className="grounding-list">
            <div className="g-item">👀 5 things you can see</div>
            <div className="g-item">✋ 4 things you can touch</div>
            <div className="g-item">👂 3 things you can hear</div>
            <div className="g-item">👃 2 things you can smell</div>
            <div className="g-item">👅 1 thing you can taste</div>
          </div>
          <div className="panic-actions">
            <button className="next-step-btn" onClick={() => setStep(0)}>Go back to breathing</button>
            <button className="next-step-btn secondary" onClick={() => setStep(2)}>I need help</button>
          </div>
        </div>
      )}

      {/* STEP 2: EMERGENCY NUMBERS */}
      {step === 2 && (
        <div className="panic-content fade-in">
          <Shield size={64} color="#e53935" style={{marginBottom:'20px'}}/>
          <h2>Crisis Support</h2>
          <p>There is no shame in asking for help.</p>
          
          <div className="helpline-grid">
            <a href="tel:988" className="helpline-card">
              <Phone size={24}/>
              <div>
                <strong>988</strong>
                <span>Suicide & Crisis Lifeline (USA)</span>
              </div>
            </a>
            <a href="tel:112" className="helpline-card">
              <Phone size={24}/>
              <div>
                <strong>112</strong>
                <span>Emergency (EU/India)</span>
              </div>
            </a>
          </div>
          <button className="next-step-btn secondary" onClick={() => setStep(0)}>Back to Calm</button>
        </div>
      )}
    </div>
  );
};

export default PanicOverlay;