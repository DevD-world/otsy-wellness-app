import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import './ArticleView.css';

const ArticleView = () => {
  const navigate = useNavigate();
  // In a real app, we would use 'id' to fetch specific data from a database
  // const { id } = useParams(); 

  return (
    <div className="article-view-container">
      {/* Back Navigation */}
      <button className="back-btn" onClick={() => navigate('/dashboard/library')}>
        <ArrowLeft size={20} /> Back to Library
      </button>

      {/* Article Header */}
      <div className="article-header">
        <span className="category-pill">Anxiety</span>
        <h1>Understanding High-Functioning Anxiety</h1>
        <div className="article-meta">
          <span><Clock size={16}/> 5 min read</span>
          <span><Calendar size={16}/> Nov 26, 2025</span>
          <button className="share-btn"><Share2 size={16}/></button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="article-hero-image">
        <img src="https://picsum.photos/800/400" alt="Article Hero" />
      </div>

      {/* Article Content */}
      <div className="article-content-body">
        <p className="intro-text">
          On the surface, high-functioning anxiety can look like success. You might be the person who always arrives early, meets every deadline, and helps everyone else. But internally, the engine never stops running.
        </p>

        <h3>What it feels like</h3>
        <p>
          Unlike crippling anxiety that might keep you in bed, high-functioning anxiety propels you forward—but at a cost. It is driven by a fear of failure, a fear of disappointing others, or a feeling that you are never doing "enough."
        </p>
        
        <p>Common signs include:</p>
        <ul>
          <li>Overthinking past conversations.</li>
          <li>Inability to say "no" to requests.</li>
          <li>Insomnia or trouble quieting your mind at night.</li>
          <li>Physical symptoms like muscle tension or nail-biting.</li>
        </ul>

        <h3>How to find balance</h3>
        <p>
          The first step is acknowledgment. Validating your own feelings is crucial. Techniques like the 4-7-8 breathing method (available in our Tools section) can help reset your nervous system when you feel the pressure building.
        </p>
      </div>
    </div>
  );
};

export default ArticleView;