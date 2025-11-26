import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import './ChatSession.css';

const ChatSession = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi again. I'm listening. How can I support you right now?" }
  ]);

  // Quick Chips
  const quickTopics = [
    "I feel anxious", 
    "I can't sleep", 
    "I lack motivation", 
    "I'm just sad",
    "Tell me a joke"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- EXPANDED AI LOGIC ---
  const getBotResponse = (text) => {
    const lower = text.toLowerCase();
    
    // 1. Anxiety / Stress
    if (lower.includes('anx') || lower.includes('panic') || lower.includes('stress')) {
      return "I hear you. Anxiety can feel overwhelming, but it will pass. Try this: Look around and name 3 things you can see. Grounding yourself helps stop the cycle.";
    }
    // 2. Sleep
    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('awake')) {
      return "Racing thoughts often keep us awake. Have you tried the 4-7-8 breathing exercise in the Tools section? It signals your nervous system to rest.";
    }
    // 3. Sadness
    if (lower.includes('sad') || lower.includes('lonely') || lower.includes('cry')) {
      return "It's okay to feel this way. You don't always have to be strong. I'm here sitting with you in this feeling. You are not alone.";
    }
    // 4. Motivation
    if (lower.includes('motivation') || lower.includes('stuck') || lower.includes('lazy')) {
      return "Motivation follows action, not the other way around. Don't worry about the big picture. Just do one tiny thing for 2 minutes. What's one small step you can take?";
    }
    // 5. Jokes / Light
    if (lower.includes('joke') || lower.includes('laugh')) {
      const jokes = [
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
        "What do you call a fake noodle? An impasta! 🍝",
        "Why don't skeletons fight each other? They don't have the guts. 💀"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Default Fallback
    return "Thank you for sharing that with me. Writing it down is the first step to processing it. Tell me more.";
  };

  const handleSend = (textOverride) => {
    // Check if we are sending text from input or a clicked chip
    const textToSend = typeof textOverride === 'string' ? textOverride : input;

    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI Delay
    setTimeout(() => {
      const botText = getBotResponse(textToSend);
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: botText };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="chat-session-container">
      
      {/* Messages Area */}
      <div className="chat-feed">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-row ${msg.sender}`}>
            <div className="chat-avatar">
              {msg.sender === 'bot' ? <Bot size={20}/> : <User size={20}/>}
            </div>
            <div className="chat-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-row bot">
            <div className="chat-avatar"><Bot size={20}/></div>
            <div className="chat-bubble typing"><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {!isTyping && (
        <div className="chips-container">
          {quickTopics.map((topic, i) => (
            <button key={i} className="chip-btn" onClick={() => handleSend(topic)}>
              <Sparkles size={12}/> {topic}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <input 
          type="text" 
          placeholder="Type your message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={!input.trim()}>
          <Send size={20} />
        </button>
      </form>

    </div>
  );
};

export default ChatSession;