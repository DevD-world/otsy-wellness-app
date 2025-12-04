import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'; // ✅ CORRECT
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './VideoCall.css';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);

  // 1. Check Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/auth'); // Kick out if not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Initialize Video Call
  const myMeeting = async (element) => {
    if (!user) return;

    // --- PASTE YOUR KEYS HERE ---
    const appID = 1411494198; // <--- REPLACE WITH YOUR APP ID (Number)
    const serverSecret = "fb333ad416272bf5ebea4f038da49c85"; // <--- REPLACE WITH YOUR SECRET (String)
    
    // Generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomId, 
      user.uid, 
      user.displayName || "Otsy User"
    );

    // Create Instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join Room
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // Or GroupCall if needed
      },
      showScreenSharingButton: true,
      showPreJoinView: false, // Jump right in (no preview screen)
      
      // CUSTOM LEAVE BEHAVIOR
      onLeaveRoom: () => {
        // Determine where to go back based on role (simple check)
        // You can also check Firestore role here if needed
        navigate(-1); // Go back to previous page (Dashboard)
      },
    });
  };

  return (
    <div className="video-call-container">
      {user ? (
        <div
          className="myCallContainer"
          ref={myMeeting}
          style={{ width: '100vw', height: '100vh' }}
        ></div>
      ) : (
        <div className="loading-call">Connecting to Otsy Secure Line...</div>
      )}
    </div>
  );
};

export default VideoCall;