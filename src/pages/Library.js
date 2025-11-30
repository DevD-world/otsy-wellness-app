import React, { useState } from 'react';
import { Search, BookOpen, PlayCircle, Headphones, X, ChevronRight } from 'lucide-react';
import './Library.css';

const contentData = [
  // SLEEP
  { id: 1, type: 'audio', category: 'Sleep', title: "Rain on a Tin Roof", duration: "30 min", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600", url: "#" },
  { id: 2, type: 'article', category: 'Sleep', title: "The 10-3-2-1-0 Sleep Rule", duration: "4 min read", image: "https://images.unsplash.com/photo-1541781777631-fa182f37722c?w=600", body: "No caffeine 10 hours before bed. No food 3 hours before. No work 2 hours before..." },
  { id: 3, type: 'audio', category: 'Sleep', title: "Deep Delta Waves", duration: "60 min", image: "https://images.unsplash.com/photo-1517174637854-f597950273c6?w=600", url: "#" },

  // ANXIETY
  { id: 4, type: 'article', category: 'Anxiety', title: "5 Ways to Ground Yourself", duration: "3 min read", image: "https://images.unsplash.com/photo-1499209974431-2761e20178d2?w=600", body: "5-4-3-2-1 Method: Name 5 things you see, 4 you feel..." },
  { id: 5, type: 'article', category: 'Anxiety', title: "Understanding Cortisol", duration: "4 min read", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600", body: "Cortisol is the stress hormone. High levels over long periods can damage your health..." },
  { id: 6, type: 'video', category: 'Anxiety', title: "10 Min Yoga for Stress", duration: "10 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600", url: "#" },

  // NUTRITION & GUT HEALTH
  { id: 7, type: 'article', category: 'Nutrition', title: "The Gut-Brain Connection", duration: "5 min read", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600", body: "90% of serotonin is produced in your gut. Eating fermented foods can improve mood..." },
  { id: 8, type: 'article', category: 'Nutrition', title: "Foods That Fight Anxiety", duration: "3 min read", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600", body: "Magnesium-rich foods like spinach and almonds can help calm the nervous system." },

  // WORK & BURNOUT
  { id: 9, type: 'article', category: 'Work', title: "Setting Boundaries", duration: "4 min read", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", body: "Learn to say no without guilt. Your mental health is more important than a deadline." },
  { id: 10, type: 'audio', category: 'Work', title: "Lo-Fi Beats for Focus", duration: "∞", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=600", url: "#" },

  // RELATIONSHIPS
  { id: 11, type: 'article', category: 'Social', title: "Active Listening 101", duration: "4 min read", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600", body: "Listen to understand, not to reply. This simple shift can heal relationships." },
];

const Library = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredContent = contentData.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>Wellness Library</h2>
        <p>Expert resources for every aspect of your life.</p>
        <div className="lib-search-bar">
          <Search size={18} className="search-icon"/>
          <input type="text" placeholder="Search topics..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        <div className="category-tabs">
          {['All', 'Anxiety', 'Sleep', 'Nutrition', 'Work', 'Social'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="library-grid">
        {filteredContent.map(item => (
          <div key={item.id} className="lib-card" onClick={() => setSelectedItem(item)}>
            <div className="lib-card-img">
              <img src={item.image} alt={item.title} />
              <div className="type-badge">
                {item.type === 'article' ? <BookOpen size={14}/> : item.type === 'audio' ? <Headphones size={14}/> : <PlayCircle size={14}/>}
                <span>{item.type}</span>
              </div>
            </div>
            <div className="lib-card-info">
              <span className="lib-category">{item.category}</span>
              <h3>{item.title}</h3>
              <div className="lib-meta"><span>{item.duration}</span><ChevronRight size={16}/></div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="lib-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="lib-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-lib" onClick={() => setSelectedItem(null)}><X/></button>
            <img src={selectedItem.image} alt="Cover" className="modal-cover"/>
            <div className="modal-body">
              <span className="modal-cat">{selectedItem.category} • {selectedItem.type}</span>
              <h2>{selectedItem.title}</h2>
              {selectedItem.type === 'article' ? (
                <p className="article-text">{selectedItem.body} <br/><br/> (Full content would appear here in production.)</p>
              ) : (
                <div className="media-placeholder"><PlayCircle size={48}/><p>Media Player</p></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;