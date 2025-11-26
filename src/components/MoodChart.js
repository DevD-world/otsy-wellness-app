import React, { useState, useEffect } from 'react';
import './MoodChart.css';

const MoodChart = () => {
  const [data, setData] = useState([
    { day: 'S', level: 0 }, { day: 'M', level: 0 }, { day: 'T', level: 0 }, 
    { day: 'W', level: 0 }, { day: 'T', level: 0 }, { day: 'F', level: 0 }, { day: 'S', level: 0 }
  ]);

  useEffect(() => {
    // 1. Load data from storage
    const stored = localStorage.getItem('otsy_mood_history');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      // Default / Placeholder data if empty
      setData([
        { day: 'Mon', level: 3 }, { day: 'Tue', level: 4 }, { day: 'Wed', level: 2 },
        { day: 'Thu', level: 4 }, { day: 'Fri', level: 5 }, { day: 'Sat', level: 3 }, { day: 'Sun', level: 4 }
      ]);
    }
  }, []); // Run once on mount

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Weekly Overview</h3>
        <div className="chart-legend">
           <span className="legend-dot"></span> Mood Level
        </div>
      </div>

      <div className="bar-chart-area">
        <div className="y-axis">
          <span>High</span>
          <span>Mid</span>
          <span>Low</span>
        </div>

        <div className="bars-container">
          {data.map((item, index) => (
            <div key={index} className="bar-group">
              <div 
                className="visual-bar" 
                style={{ height: `${(item.level / 5) * 100}%` }} // Dynamic Height
              >
                <div className="tooltip">{item.level}/5</div>
              </div>
              <span className="day-label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodChart;