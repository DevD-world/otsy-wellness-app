import React, { useState } from 'react';
import { Search, Book, X, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import './Glossary.css';

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // To track clicked card

  const terms = [
    { 
      term: "Anxiety", 
      def: "A feeling of worry, nervousness, or unease about an imminent event or uncertain outcome.",
      solutions: [
        "Practice the 4-7-8 Breathing technique immediately.",
        "Use the '5-4-3-2-1' Grounding method to reset your senses.",
        "Limit caffeine intake and screen time before bed."
      ]
    },
    { 
      term: "Burnout", 
      def: "Physical and emotional exhaustion caused by excessive and prolonged stress.",
      solutions: [
        "Set strict boundaries: No work emails after 6 PM.",
        "Take 'Micro-Breaks' every hour (even just 5 minutes).",
        "Prioritize sleep over productivity for the next 3 days."
      ]
    },
    { 
      term: "CBT", 
      def: "Cognitive Behavioral Therapy. A method to change unhelpful cognitive distortions.",
      solutions: [
        "Identify the 'Automatic Negative Thought' (ANT).",
        "Write down evidence FOR and AGAINST that thought.",
        "Replace the thought with a more realistic, neutral one."
      ]
    },
    { 
      term: "Dissociation", 
      def: "Disconnecting from one's thoughts, feelings, memories, or sense of identity.",
      solutions: [
        "Hold an ice cube in your hand (The shock brings you back).",
        "Stomp your feet on the ground firmly.",
        "Name 3 things you can see in the room out loud."
      ]
    },
    { 
      term: "Dopamine", 
      def: "The 'motivation chemical'. It drives you to seek rewards.",
      solutions: [
        "Do a 'Dopamine Fast': Avoid social media for 24 hours.",
        "Celebrate small wins (ticking off a checklist).",
        "Get sunlight immediately after waking up."
      ]
    },
    { 
      term: "Imposter Syndrome", 
      def: "Doubting your abilities and fearing you will be exposed as a 'fraud'.",
      solutions: [
        "Keep a 'Hype File': Screenshots of praise/compliments.",
        "Separate feelings from facts.",
        "Talk to a mentor; you'll realize they feel it too."
      ]
    },
    { 
      term: "Panic Attack", 
      def: "Sudden intense fear triggering severe physical reactions with no real danger.",
      solutions: [
        "Repeat a mantra: 'I am safe. This will pass.'",
        "Splash cold water on your face (Dive Reflex).",
        "Focus on your exhale, making it longer than your inhale."
      ]
    },
    { 
      term: "Neuroplasticity", 
      def: "The brain's ability to reorganize itself by forming new connections.",
      solutions: [
        "Learn a new skill (language, instrument) to build pathways.",
        "Disrupt routines: Brush teeth with your non-dominant hand.",
        "Practice gratitude to strengthen positive neural loops."
      ]
    }
  ];

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glossary-container">
      <div className="glossary-header">
        <h2><Book size={28} style={{verticalAlign:'middle', marginRight:'10px'}}/> Mind Pedia</h2>
        <p>Click on any term to find actionable solutions.</p>
        
        <div className="glossary-search">
          <Search size={20} color="#666"/>
          <input 
            type="text" 
            placeholder="Search for a feeling..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glossary-grid">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <div key={index} className="term-card" onClick={() => setSelectedItem(item)}>
              <div className="card-top-row">
                <h3>{item.term}</h3>
                <ArrowRight size={18} color="#1565c0" className="arrow-icon"/>
              </div>
              <p>{item.def}</p>
            </div>
          ))
        ) : (
          <div className="no-results">No terms found matching "{searchTerm}"</div>
        )}
      </div>

      {/* --- SOLUTION MODAL --- */}
      {selectedItem && (
        <div className="glossary-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="glossary-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedItem(null)}>
              <X size={24}/>
            </button>
            
            <div className="modal-content-glossary">
              <h2 className="modal-title">{selectedItem.term}</h2>
              <p className="modal-def">{selectedItem.def}</p>
              
              <div className="solution-box">
                <h4><Lightbulb size={20} color="#f9a825"/> How to cope:</h4>
                <ul>
                  {selectedItem.solutions.map((sol, i) => (
                    <li key={i}>
                      <CheckCircle size={18} className="check-icon"/>
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-footer-note">
                <small>Remember: These are tools, not medical advice.</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default Glossary;