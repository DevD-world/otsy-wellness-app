import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Brain, Activity, ArrowRight } from 'lucide-react';
import MoodChart from '../components/MoodChart'; 
import './DashboardHome.css';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [moodMessage, setMoodMessage] = useState('');

  const handleMoodClick = (mood) => {
    // 1. Convert text to score
    const scores = { 'Happy': 5, 'Okay': 3, 'Low': 2, 'Anxious': 1 };
    const score = scores[mood] || 3;

    // 2. Get existing history or start empty
    const history = JSON.parse(localStorage.getItem('otsy_mood_history') || '[]');
    
    // 3. Add new entry with Today's day name (e.g., "Mon")
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    
    // Create new entry
    const newEntry = { day: today, level: score, timestamp: Date.now() };
    
    // Keep only last 7 entries to fit the chart
    const updatedHistory = [...history, newEntry].slice(-7);
    
    // Save to storage
    localStorage.setItem('otsy_mood_history', JSON.stringify(updatedHistory));
    localStorage.setItem('otsy_daily_mood', mood); 

    // 4. UI Feedback
    setMoodMessage(`Tracked: ${mood}`);
    
    // Note: The chart will update on the next page refresh since we aren't using a global context yet.
    setTimeout(() => setMoodMessage(''), 2000);
  };

  return (
    <div className="dashboard-wrapper">
      
      <div className="section-header"><h2>Your Wellness Check</h2></div>
      
      {/* Top Grid: Mood, Chart, Quick Breath */}
      <div className="top-grid-expanded">
        
        {/* Mood Input */}
        <div className="card gradient-bg mood-input-card">
          <h3>How do you feel?</h3>
          {moodMessage ? <p className="mood-msg">{moodMessage}</p> : (
            <div className="mood-buttons-vertical">
              <button onClick={() => handleMoodClick('Happy')}>😊 Happy</button>
              <button onClick={() => handleMoodClick('Okay')}>😐 Okay</button>
              <button onClick={() => handleMoodClick('Low')}>😔 Low</button>
              <button onClick={() => handleMoodClick('Anxious')}>😫 Anxious</button>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <MoodChart />
        </div>

        {/* Quick Breath */}
        <div className="card breathing-card">
          <Activity size={24} color="#fff" />
          <h3>Quick Breath</h3>
          <p>3 min pause.</p>
          <button className="action-btn-light" onClick={() => navigate('/dashboard/tools')}>Start</button>
        </div>
      </div>

      {/* Professionals Section */}
      <div className="section-header">
        <h2>Find Support</h2>
        <span className="see-all" onClick={() => navigate('/dashboard/services')}>See All <ArrowRight size={16}/></span>
      </div>
      
      <div className="professionals-grid">
        <div className="prof-card">
          <div className="icon-box blue"><Stethoscope size={28}/></div>
          <h3>Psychiatrist</h3>
          <p>Medical diagnosis & treatment.</p>
          <button className="book-btn" onClick={() => navigate('/dashboard/services')}>Find</button>
        </div>
        <div className="prof-card">
          <div className="icon-box purple"><Brain size={28}/></div>
          <h3>Psychologist</h3>
          <p>Talk therapy & behavioral strategies.</p>
          <button className="book-btn" onClick={() => navigate('/dashboard/services')}>Find</button>
        </div>
        <div className="prof-card">
          <div className="icon-box green"><Activity size={28}/></div>
          <h3>Yoga Therapist</h3>
          <p>Holistic healing & movement.</p>
          <button className="book-btn" onClick={() => navigate('/dashboard/services')}>Find</button>
        </div>
      </div>

      {/* Articles Section */}
      <div className="section-header"><h2>Recommended Reading</h2></div>
      <div className="articles-list">
        <div className="article-item" onClick={() => navigate('/dashboard/library')}>
           <div className="art-color c1"></div>
           <div><span className="tag">Anxiety</span><h4>Understanding High-Functioning Anxiety</h4></div>
        </div>
        <div className="article-item" onClick={() => navigate('/dashboard/library')}>
           <div className="art-color c2"></div>
           <div><span className="tag">Sleep</span><h4>Why You Can't Sleep (And How to Fix It)</h4></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;