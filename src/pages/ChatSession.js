import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Trash2 } from 'lucide-react';
import './ChatSession.css';

// FIREBASE
import { auth, db } from '../firebase';
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ChatSession = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- 1. OTSY'S BRAIN ---
  const generateResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('anxi') || lower.includes('panic') || lower.includes('fear')) return "I hear you. Anxiety is tough. Have you tried the 4-7-8 breathing exercise in the Tools section? It lowers cortisol instantly.";
    if (lower.includes('sad') || lower.includes('depress') || lower.includes('cry')) return "I'm sorry you're feeling this way. Emotions are like weather—they come and go. Would you like to journal about it?";
    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) return "Rest is vital. Try listening to the 'Brown Noise' or 'Rain' soundscapes in the Tools tab.";
    if (lower.includes('angry') || lower.includes('mad')) return "It sounds like you're frustrated. Try the 'Box Breathing' technique or write a 'burn letter' in the Journal.";
    if (lower.includes('hello') || lower.includes('hi')) return "Hello! I'm here. How is your mental space today?";
    return "Thank you for sharing that. I'm listening. How does that make you feel?";
  };

  // --- 2. LOAD CHAT HISTORY ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // LOGGED IN: Try to fetch from Firebase
        const docRef = doc(db, "chats", currentUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMessages(docSnap.data().history || []);
          } else {
            // New user, generic welcome
            setMessages([{ id: 1, text: "Hi! I'm Otsy. How are you feeling?", sender: 'bot' }]);
          }
        } catch (error) {
          console.error("Database Error (Read):", error);
          // Fallback if DB fails
          setMessages([{ id: 1, text: "Hi! I'm Otsy (Offline Mode).", sender: 'bot' }]);
        }
      } else {
        // GUEST: Local Storage
        const local = JSON.parse(localStorage.getItem('otsy_guest_chat') || '[]');
        setMessages(local.length ? local : [{ id: 1, text: "Hi! I'm Otsy. (Guest Mode)", sender: 'bot' }]);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 3. AUTO SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- 4. HANDLE SEND (The "Bulletproof" Version) ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setIsTyping(true);

    // 1. UPDATE UI IMMEDIATELY (Don't wait for DB)
    const userMsg = { id: Date.now(), text: userText, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    // 2. SAVE USER MSG (Background)
    saveToBackground(userMsg, user);

    // 3. TRIGGER BOT REPLY
    setTimeout(() => {
      const botText = generateResponse(userText);
      const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot', timestamp: Date.now() };

      // Update UI
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Save Bot Msg (Background)
      saveToBackground(botMsg, user);
    }, 1500);
  };

  // Helper: Saves data but won't crash the app if it fails
  const saveToBackground = async (msg, currentUser) => {
    if (currentUser) {
      try {
        const chatRef = doc(db, "chats", currentUser.uid);
        // Try to update, if fails (doc doesn't exist), set it
        try {
          await updateDoc(chatRef, { history: arrayUnion(msg) });
        } catch (e) {
          await setDoc(chatRef, { history: [msg] }, { merge: true });
        }
      } catch (error) {
        console.error("Database Write Error (Check Permissions):", error);
      }
    } else {
      // Local Storage
      const current = JSON.parse(localStorage.getItem('otsy_guest_chat') || '[]');
      localStorage.setItem('otsy_guest_chat', JSON.stringify([...current, msg]));
    }
  };

  const clearChat = () => {
    if(window.confirm("Clear history?")) {
      const reset = [{ id: Date.now(), text: "Chat cleared. I'm listening.", sender: 'bot' }];
      setMessages(reset);
      if(user) setDoc(doc(db, "chats", user.uid), { history: reset });
      else localStorage.setItem('otsy_guest_chat', JSON.stringify(reset));
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-top-bar">
        <div className="chat-info">
          <div className="bot-avatar-header">O</div>
          <div><h3>Otsy</h3><span className="status">Always here to listen</span></div>
        </div>
        <button className="clear-chat-btn" onClick={clearChat} title="Clear"><Trash2 size={20}/></button>
      </div>

      <div className="chat-messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-row ${msg.sender}`}>
            {msg.sender === 'bot' && <div className="chat-avatar"><Bot size={18}/></div>}
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-row bot">
            <div className="chat-avatar"><Bot size={18}/></div>
            <div className="chat-bubble typing"><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input type="text" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit" disabled={!input.trim()}><Send size={20}/></button>
      </form>
    </div>
  );
};

export default ChatSession;

