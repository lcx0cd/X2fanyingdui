import React, { useState } from 'react';
import './EvolutionControls.css';

function EvolutionControls({ startEvolution, isEvolving }) {
  const [generations, setGenerations] = useState(10);
  
  const handleStartEvolution = () => {
    startEvolution(generations);
  };
  
  return (
    <div className="evolution-controls">
      <h2>进化控制</h2>
      
      <div className="control-group">
        <label>进化代数:</label>
        <input 
          type="number" 
          min="1"
          max="100"
          value={generations} 
          onChange={(e) => setGenerations(parseInt(e.target.value) || 10)}
        />
      </div>
      
      <button 
        className="start-button"
        onClick={handleStartEvolution}
        disabled={isEvolving}
      >
        {isEvolving ? '进化中...' : '开始进化'}
      </button>
      
      {isEvolving && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>正在进行公式进化，请稍候...</p>
        </div>
      )}
    </div>
  );
}

export default EvolutionControls;