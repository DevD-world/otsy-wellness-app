import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Heart, Send, MessageCircle } from 'lucide-react';
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Posts Real-time
  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Add Post
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    await addDoc(collection(db, "community_posts"), {
      text: newPost,
      author: "Anonymous Otter", // Keeping it anonymous for safety
      uid: auth.currentUser.uid,
      likes: [], // Array of user UIDs who liked
      createdAt: new Date().toISOString()
    });
    setNewPost("");
  };

  // 3. Like Post
  const handleLike = async (postId, likesArray) => {
    const uid = auth.currentUser.uid;
    const postRef = doc(db, "community_posts", postId);
    
    if (likesArray.includes(uid)) {
      await updateDoc(postRef, { likes: arrayRemove(uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(uid) });
    }
  };

  return (
    <div className="community-container">
      <header className="comm-header">
        <h2>Community Garden 🌻</h2>
        <p>Plant a seed of kindness. All posts are anonymous.</p>
      </header>

      {/* INPUT AREA */}
      <form className="comm-input-box" onSubmit={handlePost}>
        <textarea 
          placeholder="Share some positivity or vent safely..." 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          maxLength={200}
        />
        <div className="comm-actions">
          <span>{newPost.length}/200</span>
          <button type="submit" disabled={!newPost.trim()}>
            <Send size={16}/> Post
          </button>
        </div>
      </form>

      {/* POSTS GRID */}
      {loading ? <p style={{textAlign:'center'}}>Loading the garden...</p> : (
        <div className="masonry-grid">
          {posts.map(post => (
            <div key={post.id} className="sticky-note">
              <p className="note-text">{post.text}</p>
              <div className="note-footer">
                <span className="note-author">~ {post.author}</span>
                <button 
                  className={`like-btn ${post.likes?.includes(auth.currentUser?.uid) ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id, post.likes || [])}
                >
                  <Heart size={16} fill={post.likes?.includes(auth.currentUser?.uid) ? "#e91e63" : "none"} /> 
                  {post.likes?.length || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;