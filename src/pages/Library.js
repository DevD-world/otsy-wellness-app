import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigation Hook
import { Clock, Tag } from 'lucide-react';
import './Library.css';

const Library = () => {
  const navigate = useNavigate(); // 2. Initialize Navigation

  // Dummy Data for Articles
  const articles = [
    { 
      id: 1, 
      title: "Grounding Techniques for Anxiety", 
      category: "Anxiety", 
      readTime: "5 min", 
      image: "https://picsum.photos/id/10/400/300" 
    },
    { 
      id: 2, 
      title: "The Science of Sleep", 
      category: "Sleep", 
      readTime: "8 min", 
      image: "https://picsum.photos/id/20/400/300" 
    },
    { 
      id: 3, 
      title: "Building Resilience", 
      category: "Self-Care", 
      readTime: "4 min", 
      image: "https://picsum.photos/id/28/400/300" 
    },
    { 
      id: 4, 
      title: "Understanding Burnout", 
      category: "Work", 
      readTime: "6 min", 
      image: "https://picsum.photos/id/42/400/300" 
    },
    { 
      id: 5, 
      title: "Meditation 101", 
      category: "Mindfulness", 
      readTime: "10 min", 
      image: "https://picsum.photos/id/56/400/300" 
    },
    { 
      id: 6, 
      title: "Social Anxiety Tips", 
      category: "Social", 
      readTime: "5 min", 
      image: "https://picsum.photos/id/65/400/300" 
    },
  ];

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>Wellness Library</h2>
        <p>Curated resources for your mind and soul.</p>
      </div>

      <div className="library-grid">
        {articles.map((art) => (
          <div 
            key={art.id} 
            className="article-card" 
            style={{ backgroundImage: `url(${art.image})` }}
            // 3. Navigate to the Article View when clicked
            onClick={() => navigate(`/dashboard/article/${art.id}`)}
          >
            <div className="article-overlay">
              <div className="article-badges">
                <span className="category-badge"><Tag size={10}/> {art.category}</span>
              </div>
              <div className="article-details">
                <h3>{art.title}</h3>
                <span className="read-time"><Clock size={12}/> {art.readTime} read</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;