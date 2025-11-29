import React from 'react';
import { Heart, MessageSquare, Tag } from 'lucide-react';

const posts = [
  { id: 1, author: "Sarah M.", tag: "Anxiety", title: "Does anyone else feel anxious in the morning?", content: "I wake up with a racing heart almost every day. Looking for tips on how to calm down immediately.", likes: 24, comments: 8 },
  { id: 2, author: "Mike T.", tag: "Wins", title: "I meditated for 7 days straight!", content: "Just wanted to share a small win. It wasn't easy but I feel so much clearer.", likes: 156, comments: 23 },
  { id: 3, author: "Anon", tag: "Sleep", title: "Brown noise is a game changer.", content: "If you have ADHD or racing thoughts, try the Brown Noise in the tools section. It saved my sleep.", likes: 42, comments: 5 },
];

const Community = () => {
  return (
    <div style={{padding: '30px', maxWidth:'800px', margin:'0 auto'}}>
      <div style={{textAlign:'center', marginBottom:'40px'}}>
        <h2>Community Feed</h2>
        <p>You are not alone. Connect with others on the same journey.</p>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
        {posts.map(post => (
          <div key={post.id} style={{background:'white', padding:'25px', borderRadius:'20px', border:'1px solid #f1f5f9', boxShadow:'0 2px 5px rgba(0,0,0,0.02)'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
              <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <div style={{width:'35px', height:'35px', background:'#e3f2fd', color:'#1565c0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{post.author.charAt(0)}</div>
                <span style={{fontWeight:'bold', color:'#333'}}>{post.author}</span>
              </div>
              <span style={{background:'#f1f5f9', padding:'5px 12px', borderRadius:'15px', fontSize:'0.8rem', color:'#64748b', display:'flex', alignItems:'center', gap:'5px'}}><Tag size={12}/> {post.tag}</span>
            </div>
            
            <h3 style={{margin:'0 0 10px 0', fontSize:'1.2rem', color:'#1e293b'}}>{post.title}</h3>
            <p style={{color:'#64748b', lineHeight:'1.5', marginBottom:'20px'}}>{post.content}</p>
            
            <div style={{display:'flex', gap:'20px', borderTop:'1px solid #f1f5f9', paddingTop:'15px', color:'#94a3b8', fontSize:'0.9rem'}}>
              <span style={{display:'flex', gap:'5px', alignItems:'center', cursor:'pointer'}}><Heart size={16}/> {post.likes}</span>
              <span style={{display:'flex', gap:'5px', alignItems:'center', cursor:'pointer'}}><MessageSquare size={16}/> {post.comments} Comments</span>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign:'center', marginTop:'30px', color:'#999'}}>
        <p>Log in to create a post.</p>
      </div>
    </div>
  );
};
export default Community;