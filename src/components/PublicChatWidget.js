import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './PublicChatWidget.css';

// --- CONFIGURATION ---
// 1. Get a free key here: https://aistudio.google.com/app/apikey
// 2. Paste it below (Keep it inside quotes)
const GEMINI_API_KEY = "AIzaSyDqVC6x-4YrwtmoImHuCrZo3N6fuMirYm0"; 

const PublicChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there. I'm Otsy. I'm here to listen. How are you feeling right now?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState('support'); // support | advice | vent
  const bottomRef = useRef(null);

  // --- REAL AI HANDLER (GEMINI) ---
  const callGeminiAI = async (userText) => {
    try {
      if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_GEMINI")) throw new Error("No Key");
      
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      // Context prompt based on mode
      let systemPrompt = "You are Otsy, a comforting mental health companion. Keep answers short (max 2 sentences). Be empathetic.";
      if(mode === 'vent') systemPrompt += " The user just wants to vent. Listen, acknowledge their pain, do not give solutions yet.";
      if(mode === 'advice') systemPrompt += " Give gentle, actionable, CBT-based advice.";

      const result = await model.generateContent(systemPrompt + " User says: " + userText);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.log("Using Backup Logic (No API Key or Error)");
      return null; // Triggers fallback
    }
  };

  // --- BACKUP LOGIC (If API fails or no key) ---
  const getBackupResponse = (text) => {
    const t = text.toLowerCase();
    if (t.includes('die') || t.includes('kill') || t.includes('suicide')) 
      return "I care about you, but I am an AI. Please call 988 or go to the nearest ER immediately. You matter.";
    if (t.includes('sad') || t.includes('lonely')) return "I hear you. It takes strength to say that. I'm here with you.";
    if (t.includes('anx') || t.includes('panic')) return "Take a slow breath with me. Inhale... 2, 3, 4. Hold... Exhale. You are safe.";
    return "Thank you for sharing that with me. It helps to let it out. How does your body feel right now?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Scroll down
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    // 1. Try AI first
    let botText = await callGeminiAI(input);
    
    // 2. Use Backup if AI failed
    if (!botText) botText = getBackupResponse(input);

    const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot' };
    
    setTyping(false);
    setMessages(prev => [...prev, botMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button 
        className={`fab-chat-btn ${isOpen ? 'hide' : ''}`} 
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={28} />
        <span className="fab-tooltip">Chat with Otsy</span>
      </button>

      {/* CHAT WINDOW */}
      <div className={`public-chat-window ${isOpen ? 'open' : ''}`}>
        <div className="pc-header">
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div className="pc-avatar"><Bot size={20}/></div>
            <div>
              <h4>Otsy AI</h4>
              <span className="pc-status">Always here for you</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="pc-close"><X size={20}/></button>
        </div>

        {/* MODE TOGGLE */}
        <div className="pc-modes">
          <button className={mode==='support'?'active':''} onClick={()=>setMode('support')}>❤️ Comfort</button>
          <button className={mode==='vent'?'active':''} onClick={()=>setMode('vent')}>🗣️ Vent</button>
          <button className={mode==='advice'?'active':''} onClick={()=>setMode('advice')}>💡 Advice</button>
        </div>

        <div className="pc-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`pc-msg-row ${msg.sender}`}>
              {msg.sender === 'bot' && <div className="pc-bot-icon"><Bot size={14}/></div>}
              <div className="pc-bubble">{msg.text}</div>
            </div>
          ))}
          {typing && <div className="pc-typing"><span>•</span><span>•</span><span>•</span></div>}
          <div ref={bottomRef}></div>
        </div>

        {/* SAFETY WARNING FOR 'VENT' MODE */}
        {mode === 'vent' && (
          <div className="pc-safety-banner">
            <AlertTriangle size={12}/> <span>This chat is anonymous & not monitored by humans.</span>
          </div>
        )}

        <div className="pc-input-area">
          <input 
            type="text" 
            placeholder={mode === 'vent' ? "Let it all out..." : "Type here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={!input.trim()}><Send size={18}/></button>
        </div>
      </div>
    </>
  );
};

export default PublicChatWidget;