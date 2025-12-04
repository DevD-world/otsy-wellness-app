import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Send, Bot, Trash2, Sparkles, User, Shield, Zap } from 'lucide-react';
import './ChatSession.css';

const ChatSession = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [activeBot, setActiveBot] = useState('otsy'); // otsy | addiction | trauma
  const bottomRef = useRef(null);

  // Personas
  const personas = {
    otsy: { name: "Otsy", role: "Wellness Companion", color: "#1565c0", icon: <Bot size={24} color="white"/>, greeting: "Hi! How is your mind treating you today?" },
    addiction: { name: "Coach Will", role: "Addiction Specialist", color: "#e65100", icon: <Zap size={24} color="white"/>, greeting: "Stay strong. I'm here to help you beat the urge." },
    trauma: { name: "Dr. Calm", role: "Trauma Support", color: "#4a148c", icon: <Shield size={24} color="white"/>, greeting: "You are safe here. Take a deep breath. I'm listening." }
  };

  // Mock AI Logic
  const generateResponse = (text, botType) => {
    const t = text.toLowerCase();
    if (botType === 'addiction') {
      if (t.includes('urge')) return "The urge is a wave. It will peak and then crash. Delay for 10 minutes.";
      return "Focus on today. Don't worry about forever. Just stay clean for the next hour.";
    }
    if (botType === 'trauma') {
      if (t.includes('scared')) return "Look at your hands. You are here, in the present, and you are safe.";
      return "I hear you. Take a slow breath. Can you name 3 things you see?";
    }
    if (t.includes('sad')) return "It's okay to not be okay. Do you want to vent?";
    return "I'm listening. Tell me more about that.";
  };

  // Fetch Messages
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "chats"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, []);

  // DELETE HISTORY FUNCTION
  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire chat history?")) return;
    try {
      const q = query(collection(db, "chats"), where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((d) => deleteDoc(doc(db, "chats", d.id)));
      await Promise.all(deletePromises);
      setMessages([]); // Clear local state immediately
    } catch (e) {
      console.error("Error clearing chat:", e);
    }
  };

  // Send Message
  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    const uid = auth.currentUser.uid;
    setInput('');

    await addDoc(collection(db, "chats"), {
      userId: uid, text: textToSend, sender: 'user', createdAt: serverTimestamp()
    });

    setTyping(true);
    setTimeout(async () => {
      const botReply = generateResponse(textToSend, activeBot);
      await addDoc(collection(db, "chats"), {
        userId: uid, text: botReply, sender: 'bot', botType: activeBot, createdAt: serverTimestamp()
      });
      setTyping(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header" style={{background: personas[activeBot].color}}>
        <div className="bot-profile">
          <div className="bot-avatar">{personas[activeBot].icon}</div>
          <div>
            <h3 style={{cursor:'pointer'}} title="Click to switch">{personas[activeBot].name}</h3>
            <span className="status-dot">{personas[activeBot].role}</span>
          </div>
        </div>
        
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
          <div className="persona-switcher">
            <button onClick={()=>setActiveBot('otsy')} className={activeBot==='otsy'?'active':''}>General</button>
            <button onClick={()=>setActiveBot('addiction')} className={activeBot==='addiction'?'active':''}>Addiction</button>
            <button onClick={()=>setActiveBot('trauma')} className={activeBot==='trauma'?'active':''}>Trauma</button>
          </div>
          
          {/* DELETE BUTTON */}
          <button className="clear-chat-btn" onClick={clearHistory} title="Clear History">
            <Trash2 size={20} color="white" />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-window">
        {messages.length === 0 && (
          <div className="empty-chat">
            <Sparkles size={48} color={personas[activeBot].color}/>
            <p>{personas[activeBot].greeting}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.sender}`}>
            <div className="msg-bubble" style={msg.sender==='user' ? {background: personas[activeBot].color} : {}}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && <div className="msg-row bot"><div className="msg-bubble typing"><span>•</span><span>•</span><span>•</span></div></div>}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input 
            type="text" placeholder={`Message ${personas[activeBot].name}...`} 
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} style={{background: personas[activeBot].color}}>
            <Send size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSession;