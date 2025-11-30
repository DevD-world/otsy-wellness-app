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

  // 1. RESPONSE LOGIC
  const generateResponse = (text) => {
    const lower = text.toLowerCase();
    
    if (lower.includes('anxi') || lower.includes('panic') || lower.includes('scared') || lower.includes('fear')) 
      return "I hear you. Anxiety is tough. Have you tried the 4-7-8 breathing exercise in the Tools section? It lowers cortisol instantly.";
    
    if (lower.includes('sad') || lower.includes('depress') || lower.includes('cry') || lower.includes('lonely')) 
      return "I'm sorry you're feeling this way. Emotions are like weather—they come and go. Would you like to journal about what's triggering this?";
    
    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) 
      return "Rest is vital. Try listening to the 'Brown Noise' or 'Rain' soundscapes in the Tools tab. They are great for quieting a racing mind.";
    
    if (lower.includes('angry') || lower.includes('mad')) 
      return "It sounds like you're frustrated. Try the 'Box Breathing' technique or write a 'burn letter' (write it and delete it) in the Journal.";

    if (lower.includes('hello') || lower.includes('hi')) 
      return "Hello! I'm here. How is your mental space today?";

    return "Thank you for sharing that. I'm listening. How does that make you feel?";
  };

  // 2. SETUP LISTENERS (Load Chat)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // --- LOGGED IN: FIREBASE LISTENER ---
        const docRef = doc(db, "chats", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          // Create chat if doesn't exist
          const welcomeMsg = { id: 1, text: "Hi! I'm Otsy. I'm here to listen. How was your day?", sender: 'bot', timestamp: Date.now() };
          await setDoc(docRef, { history: [welcomeMsg] });
        }

        // Real-time listener: THIS UPDATES THE UI AUTOMATICALLY
        const unsubChat = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            setMessages(snapshot.data().history || []);
          }
        });
        return () => unsubChat();

      } else {
        // --- GUEST: LOCAL STORAGE ---
        const localChat = JSON.parse(localStorage.getItem('otsy_guest_chat') || '[]');
        if (localChat.length === 0) {
          const welcomeMsg = { id: 1, text: "Hi! I'm Otsy (Guest Mode). How are you?", sender: 'bot', timestamp: Date.now() };
          setMessages([welcomeMsg]);
          localStorage.setItem('otsy_guest_chat', JSON.stringify([welcomeMsg]));
        } else {
          setMessages(localChat);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 4. HANDLE SEND
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setIsTyping(true);

    const userMsg = { id: Date.now(), text: userText, sender: 'user', timestamp: Date.now() };
    
    // --- BRANCH LOGIC ---
    if (user) {
      // A. LOGGED IN USER (Save to DB, Listener updates UI)
      const chatRef = doc(db, "chats", user.uid);
      await updateDoc(chatRef, { history: arrayUnion(userMsg) });

      // Bot Reply
      setTimeout(async () => {
        const botText = generateResponse(userText);
        const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot', timestamp: Date.now() };
        
        await updateDoc(chatRef, { history: arrayUnion(botMsg) });
        setIsTyping(false); 
      }, 1500);

    } else {
      // B. GUEST USER (Manual UI Update)
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      localStorage.setItem('otsy_guest_chat', JSON.stringify(newHistory));

      // Bot Reply
      setTimeout(() => {
        const botText = generateResponse(userText);
        const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot', timestamp: Date.now() };
        
        const updatedHistory = [...newHistory, botMsg];
        setMessages(updatedHistory);
        localStorage.setItem('otsy_guest_chat', JSON.stringify(updatedHistory));
        setIsTyping(false);
      }, 1500);
    }
  };

  const clearChat = async () => {
    if(window.confirm("Clear conversation history?")) {
      const resetMsg = [{ id: Date.now(), text: "Chat cleared. How can I help?", sender: 'bot', timestamp: Date.now() }];
      if(user) {
        await setDoc(doc(db, "chats", user.uid), { history: resetMsg });
      } else {
        setMessages(resetMsg);
        localStorage.setItem('otsy_guest_chat', JSON.stringify(resetMsg));
      }
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-top-bar">
        <div className="chat-info">
          <div className="bot-avatar-header">O</div>
          <div><h3>Otsy</h3><span className="status">Always here to listen</span></div>
        </div>
        <button className="clear-chat-btn" onClick={clearChat} title="Clear History"><Trash2 size={20} /></button>
      </div>

      <div className="chat-messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-row ${msg.sender}`}>
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