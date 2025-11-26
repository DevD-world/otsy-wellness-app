import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [step, setStep] = useState('welcome'); 
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // Data State
  const [userData, setUserData] = useState({ name: '', age: '', gender: '', responses: [] });
  const [chatPhase, setChatPhase] = useState(0); 
  // 0=Name, 1=Age, 2=Gender, 3-5=Compulsory Qs, 6-7=Optional Qs

  const mentalHealthQuestions = [
    { text: "How have you been sleeping lately?", optional: false },      
    { text: "Have you felt anxious without a clear reason?", optional: false }, 
    { text: "Do you have a support system to talk to?", optional: false }, 
    { text: "On a scale of 1-10, rate your daily stress?", optional: true }, 
    { text: "Is there a specific event that triggered this?", optional: true } 
  ];

  const handleStart = () => {
    setStep('chat');
    addBotMessage("Hello! I am Otsy. I'm here to listen. First, what is your name?");
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    addUserMessage(inputValue);
    const currentInput = inputValue;
    setInputValue(''); 

    if (chatPhase === 0) { // NAME
      setUserData(prev => ({ ...prev, name: currentInput }));
      setTimeout(() => {
        addBotMessage(`Hi ${currentInput}, it's nice to meet you. May I ask how old you are?`);
        setChatPhase(1);
      }, 600);
    } 
    else if (chatPhase === 1) { // AGE
      setUserData(prev => ({ ...prev, age: currentInput }));
      setTimeout(() => {
        addBotMessage("Thank you. And how do you identify?");
        setChatPhase(2); 
      }, 600);
    }
    else if (chatPhase >= 3) { // QUESTIONNAIRE
      handleQuestionResponse(currentInput);
    }
  };

  const handleGenderSelect = (gender) => {
    addUserMessage(gender);
    setUserData(prev => ({ ...prev, gender }));
    setTimeout(() => {
      addBotMessage("Thanks for sharing. I'm going to ask you 5 quick questions.");
      setTimeout(() => askNextQuestion(0), 1000); 
    }, 600);
  };

  const askNextQuestion = (qArrayIndex) => {
    const phaseIndex = qArrayIndex + 3;
    setChatPhase(phaseIndex);

    if (qArrayIndex < mentalHealthQuestions.length) {
      addBotMessage(mentalHealthQuestions[qArrayIndex].text);
    } else {
      finishOnboarding();
    }
  };

  const handleQuestionResponse = (response) => {
    const qIndex = chatPhase - 3;
    const newResponses = [...userData.responses, { q: mentalHealthQuestions[qIndex].text, a: response }];
    setUserData(prev => ({ ...prev, responses: newResponses }));
    setTimeout(() => askNextQuestion(qIndex + 1), 600);
  };

  const handleSkip = () => {
    addUserMessage("Skipped");
    const currentQIndex = chatPhase - 3;
    setTimeout(() => askNextQuestion(currentQIndex + 1), 600);
  };

  const finishOnboarding = () => {
    addBotMessage("Thank you. I've prepared your dashboard.");
    setTimeout(() => {
      localStorage.setItem('otsy_user', JSON.stringify(userData));
      navigate('/dashboard');
    }, 2000);
  };

  const addBotMessage = (text) => setMessages(prev => [...prev, { sender: 'otsy', text }]);
  const addUserMessage = (text) => setMessages(prev => [...prev, { sender: 'user', text }]);
  const handleQuickExit = () => {
  window.location.replace("https://www.google.com");
};

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="onboarding-container">
      <div className={`avatar-container ${step === 'chat' ? 'minimized' : 'full'}`}>
         <video autoPlay loop muted playsInline><source src="/ootsy-welcome.mp4" type="video/mp4" /></video>
      </div>
      <button 
      onClick={handleQuickExit} 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#d32f2f',
        color: 'white',
        border: '2px solid white',
        padding: '10px 20px',
        borderRadius: '30px',
        fontWeight: 'bold',
        zIndex: 9999,
        cursor: 'pointer'
      }}
    >
      Quick Exit
    </button>

      {step === 'welcome' && (
        <div className="welcome-overlay">
          <h1>Welcome to Otsy</h1>
          <p>Your personal companion for mental wellness.</p>
          <button onClick={handleStart} className="start-btn">Get Started</button>
        </div>
      )}

      {step === 'chat' && (
        <div className="chat-interface">
          <div className="messages-area">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}><div className="bubble">{msg.text}</div></div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="input-area">
            {chatPhase === 2 ? (
              <div className="button-group">
                <button onClick={() => handleGenderSelect('Male')}>Male</button>
                <button onClick={() => handleGenderSelect('Female')}>Female</button>
                <button onClick={() => handleGenderSelect('Other')}>Other</button>
              </div>
            ) : (
              <div className="text-group">
                 <input type={chatPhase === 1 ? "number" : "text"} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()} placeholder="Type here..." autoFocus />
                 <button onClick={handleInputSubmit} className="send-icon-btn">➤</button>
              </div>
            )}
            {(chatPhase === 6 || chatPhase === 7) && (
              <button onClick={handleSkip} className="skip-btn">Skip this question</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Onboarding;