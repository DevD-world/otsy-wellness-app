import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, User } from 'lucide-react';
import './Community.css'; // We will create this next

// FIREBASE
import { auth, db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Community = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [tag, setTag] = useState('General');
  const [loading, setLoading] = useState(false);

  // 1. LISTEN TO AUTH & POSTS
  useEffect(() => {
    // Check User
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));

    // Listen to Posts (Real-time)
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubPosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => { unsubAuth(); unsubPosts(); };
  }, []);

  // 2. CREATE POST
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        content: newPost,
        author: user.displayName || user.email.split('@')[0],
        uid: user.uid,
        tag: tag,
        likes: [], // Array of User IDs who liked
        createdAt: new Date().toISOString()
      });
      setNewPost('');
    } catch (error) {
      console.error("Error posting:", error);
    }
    setLoading(false);
  };

  // 3. LIKE POST
  const handleLike = async (postId, likesArray) => {
    if (!user) return alert("Please log in to like posts.");

    const postRef = doc(db, "posts", postId);
    const isLiked = likesArray.includes(user.uid);

    if (isLiked) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  return (
    <div className="community-container">
      
      {/* HEADER */}
      <div className="community-header">
        <h2>Wellness Community</h2>
        <p>Share your journey, support others.</p>
      </div>

      {/* CREATE POST BOX */}
      {user ? (
        <div className="create-post-card">
          <div className="cp-header">
            <div className="avatar-small">{user.email.charAt(0).toUpperCase()}</div>
            <span>Posting as <strong>{user.displayName || 'User'}</strong></span>
          </div>
          <form onSubmit={handlePost}>
            <textarea 
              placeholder="How are you feeling today? Share a win or a worry..." 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="cp-actions">
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="tag-select">
                <option>General</option>
                <option>Anxiety</option>
                <option>Win</option>
                <option>Vent</option>
                <option>Advice</option>
              </select>
              <button type="submit" disabled={loading || !newPost.trim()}>
                {loading ? 'Posting...' : <><Send size={16}/> Post</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="login-prompt">
          <p>🔒 Log in to share your story with the community.</p>
        </div>
      )}

      {/* POSTS FEED */}
      <div className="posts-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-top">
              <div className="post-author">
                <div className="avatar-xs">{post.author.charAt(0).toUpperCase()}</div>
                <span className="author-name">{post.author}</span>
                <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`post-tag ${post.tag.toLowerCase()}`}>{post.tag}</span>
            </div>
            
            <p className="post-content">{post.content}</p>
            
            <div className="post-actions">
              <button 
                className={`action-btn ${user && post.likes.includes(user.uid) ? 'liked' : ''}`}
                onClick={() => handleLike(post.id, post.likes)}
              >
                <Heart size={18} fill={user && post.likes.includes(user.uid) ? "#e91e63" : "none"}/> 
                {post.likes.length}
              </button>
              <button className="action-btn">
                <MessageSquare size={18}/> Comment
              </button>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="empty-state">
            <p>No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Community;