import React, { useState } from 'react';
import { Keyboard } from './Keyboard';
import { Pitch } from '../../core/Pitch';

const MAX_NOTES = 32;

/**
 * Main input container.
 * @param {Function} onChantChange - callback(Pitch[])
 */
export const ChantInput = ({ onChantChange }) => {
  const [chant, setChant] = useState([]);

  const handleNoteInput = (pitch) => {
    if (chant.length >= MAX_NOTES) {
      alert("Maximum chant length (32 notes) reached.");
      return;
    }
    const newChant = [...chant, pitch];
    setChant(newChant);
    if (onChantChange) onChantChange(newChant);
  };

  const handleUndo = () => {
    const newChant = chant.slice(0, -1);
    setChant(newChant);
    if (onChantChange) onChantChange(newChant);
  };

  const handleClear = () => {
    if (confirm("Clear entire chant?")) {
      setChant([]);
      if (onChantChange) onChantChange([]);
    }
  };

  // Helper to visualize current input (Temporary text list until Phase 6)
  const renderNoteList = () => {
    if (chant.length === 0) return <span style={{color: '#999'}}>Click keys to add notes...</span>;
    return chant.map((p, i) => (
      <span key={i} style={{ margin: '0 4px' }}>
        {p.toString()}
      </span>
    ));
  };

  return (
    <div style={{ padding: '20px', background: '#e0e0e0', borderBottom: '1px solid #ccc' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>Vox Principalis ({chant.length}/{MAX_NOTES})</strong>
        <div>
          <button onClick={handleUndo} disabled={chant.length === 0}>Undo</button>
          <button onClick={handleClear} disabled={chant.length === 0} style={{marginLeft: '10px'}}>Clear</button>
        </div>
      </div>
      
      {/* Note Display (Text based for now) */}
      <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          background: '#fff', 
          border: '1px solid #bbb',
          minHeight: '24px',
          fontFamily: 'monospace'
      }}>
        {renderNoteList()}
      </div>

      {/* The Keyboard */}
      <div style={{ overflowX: 'auto', textAlign: 'center' }}>
        <Keyboard onNoteClick={handleNoteInput} disabled={chant.length >= MAX_NOTES} />
      </div>
      
      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
        * Black keys are split: Left side = Flat (♭), Right side = Sharp (♯).
      </p>
    </div>
  );
};
