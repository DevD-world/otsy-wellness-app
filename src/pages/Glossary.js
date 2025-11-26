import React, { useState } from 'react';
import { Search, Book } from 'lucide-react';
import './Glossary.css';

const Glossary = () => {
  const [search, setSearch] = useState('');

  const terms = [
    { term: "CBT (Cognitive Behavioral Therapy)", def: "A type of therapy that helps you change negative thought patterns to improve how you feel." },
    { term: "Serotonin", def: "A chemical in the brain (neurotransmitter) that helps regulate mood, sleep, and digestion. Often called the 'feel-good' chemical." },
    { term: "Dopamine", def: "A brain chemical associated with pleasure, motivation, and reward." },
    { term: "Panic Attack", def: "A sudden episode of intense fear that triggers severe physical reactions when there is no real danger." },
    { term: "Mindfulness", def: "The practice of being fully present in the moment, aware of where we are and what we’re doing." },
    { term: "SSRI", def: "Selective Serotonin Reuptake Inhibitors. A common class of medication used to treat depression and anxiety." },
    { term: "Burnout", def: "A state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress." }
  ];

  const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glossary-container">
      <div className="gloss-header">
        <h2>Mental Health A-Z</h2>
        <p>Simple explanations for complex terms.</p>
        
        <div className="gloss-search">
          <Search size={18} color="#999" />
          <input 
            type="text" 
            placeholder="Search for a term (e.g., CBT)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="terms-list">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((t, index) => (
            <div key={index} className="term-card">
              <div className="term-icon"><Book size={20}/></div>
              <div className="term-content">
                <h3>{t.term}</h3>
                <p>{t.def}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No terms found. Try a different search.</div>
        )}
      </div>
    </div>
  );
};

export default Glossary;