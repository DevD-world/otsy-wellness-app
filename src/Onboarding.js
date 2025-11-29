import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, MessageCircle } from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  
  // UI State
  const [showChat, setShowChat] = useState(false); // Toggle between Video and Chat
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const hasStartedRef = useRef(false); // FIX: Prevents double posting

  const questions = [
    "Hi! I'm Otsy. What should I call you?",
    "Nice to meet you. How are you feeling today?",
    "What brings you here? (e.g. Anxiety, Sleep, Just curious)"
  ];

  // 1. Start Chat Trigger
  const startChat = () => {
    setShowChat(true);
    
    // Only send the first message if we haven't already
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      addBotMessage(questions[0]);
    }
  };

  // 2. Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message
    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');

    // Logic for next step
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
      addBotMessage(questions[step + 1]);
    } else {
      // Finished
      addBotMessage("Thanks! Taking you to the home page...");
      setTimeout(() => navigate('/home'), 2000);
    }
  };

  // --- RENDER ---
  return (
    <div className="onboarding-container">
      
      {/* 1. BACKGROUND VIDEO (Always visible) */}
      <video autoPlay loop muted playsInline className="bg-video">
        {/* Make sure 'ootsy-welcome.mp4' is in your PUBLIC folder, or use 'rain.mp4' */}
        <source src="/ootsy-welcome.mp4" type="video/mp4" />
        <source src="/rain.mp4" type="video/mp4" /> 
      </video>

      {/* Dark Overlay */}
      <div className="video-overlay"></div>

      {/* 2. WELCOME SCREEN (Visible only if Chat is NOT active) */}
      {!showChat && (
        <div className="welcome-content">
          <h1 className="logo-large">Otsy.</h1>
          <p className="subtitle">Your personal AI wellness companion.</p>
          <button className="get-started-btn" onClick={startChat}>
            Get Started <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* 3. CHAT INTERFACE (Visible when Get Started is clicked) */}
      {showChat && (
        <div className="chat-layer">
          {/* Small Otsy Header */}
          <div className="chat-header-small">
            <div className="otsy-avatar-small">O</div>
            <span>Chatting with Otsy</span>
            <button className="skip-text" onClick={() => navigate('/home')}>Skip</button>
          </div>

          <div className="chat-box">
            <div className="messages-area">
              {messages.map(msg => (
                <div key={msg.id} className={`message-row ${msg.sender}`}>
                  {msg.sender === 'bot' && <div className="bot-avatar">O</div>}
                  <div className="message-bubble">{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="message-row bot">
                  <div className="bot-avatar">O</div>
                  <div className="message-bubble typing"><span></span><span></span><span></span></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type your answer..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={!input.trim()}><Send size={20}/></button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Onboarding;