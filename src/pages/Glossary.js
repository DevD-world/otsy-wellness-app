import React, { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import './Glossary.css'; // You can reuse LandingPage.css or create new

const terms = [
  { term: "Anxiety", def: "A feeling of worry, nervousness, or unease, typically about an imminent event or something with an uncertain outcome." },
  { term: "CBT", def: "Cognitive Behavioral Therapy. A type of talk therapy that helps people understand how thoughts affect emotions and behaviors." },
  { term: "Cortisol", def: "Often called the 'stress hormone'. High levels of cortisol over time can lead to health issues." },
  { term: "Dopamine", def: "A type of neurotransmitter. Your body makes it, and your nervous system uses it to send messages between nerve cells. Known as the 'feel-good' chemical." },
  { term: "Grounding", def: "A set of simple strategies that can help you detach from emotional pain (e.g., anxiety, anger, sadness, flashbacks)." },
  { term: "Mindfulness", def: "The quality or state of being conscious or aware of something. A mental state achieved by focusing one's awareness on the present moment." },
  { term: "Serotonin", def: "A chemical that has a wide variety of functions in the human body. It is sometimes called the happy chemical, because it contributes to wellbeing and happiness." }
];

const Glossary = () => {
  const [filter, setFilter] = useState('');
  const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{padding: '30px'}}>
      <div style={{marginBottom: '30px'}}>
        <h2><BookOpen style={{marginRight:'10px', verticalAlign:'middle'}}/>Mental Health Glossary</h2>
        <p>Understand the terms that shape your mind.</p>
        <div style={{position: 'relative', maxWidth: '400px', marginTop: '20px'}}>
          <Search size={20} style={{position:'absolute', top:'12px', left:'15px', color:'#999'}}/>
          <input 
            type="text" 
            placeholder="Search term..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{width:'100%', padding:'12px 15px 12px 45px', borderRadius:'25px', border:'1px solid #ddd', outline:'none'}}
          />
        </div>
      </div>

      <div style={{display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
        {filteredTerms.map((t, i) => (
          <div key={i} style={{background:'white', padding:'25px', borderRadius:'15px', border:'1px solid #eee', boxShadow:'0 4px 10px rgba(0,0,0,0.03)'}}>
            <h3 style={{color:'#1565c0', marginTop:0}}>{t.term}</h3>
            <p style={{color:'#555', lineHeight:'1.6'}}>{t.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Glossary;