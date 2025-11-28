import React from 'react';
import { Pitch } from '../../core/Pitch';
import './Keyboard.css';

const OCTAVES = [3, 4, 5]; // Range C3 to B5
const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const Keyboard = ({ onNoteClick, disabled = false }) => {

  const handleKeyClick = (step, octave, alter) => {
    if (disabled) return;
    const pitch = new Pitch(step, octave, alter);
    onNoteClick(pitch);
  };

  const renderOctave = (octaveNum) => {
    return WHITE_KEYS.map((step) => {
      // Determine if this white key owns a black key group to its right
      // C, D, F, G, A have sharps/flats after them. E and B do not.
      const hasBlackKey = ['C', 'D', 'F', 'G', 'A'].includes(step);
      
      // Determine the enharmonic spellings for the split key
      // Left side: The flattened version of the NEXT step? 
      // Or simply: C# vs Db.
      // Standard: C key has C#/Db group.
      let sharpStep = step;         // e.g., C -> C#
      let flatStep = getNextStep(step); // e.g., C -> next is D -> Db
      
      return (
        <div 
          key={`${step}${octaveNum}`} 
          className="white-key"
          onClick={() => handleKeyClick(step, octaveNum, 0)}
        >
          <span>{step}{octaveNum}</span>

          {hasBlackKey && (
            <div 
                className="black-key-group"
                // Stop propagation so clicking black key doesn't trigger white key
                onClick={(e) => e.stopPropagation()} 
            >
              {/* Left Side: Flat (e.g. Db) */}
              <div 
                className="split-key flat" 
                title={`${flatStep}b${octaveNum}`}
                onClick={() => handleKeyClick(flatStep, octaveNum, -1)}
              />
              {/* Right Side: Sharp (e.g. C#) */}
              <div 
                className="split-key sharp" 
                title={`${sharpStep}#${octaveNum}`}
                onClick={() => handleKeyClick(sharpStep, octaveNum, 1)}
              />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="keyboard-wrapper">
      {OCTAVES.map(oct => renderOctave(oct))}
      {/* Add high C (C6) just to close the range neatly? Optional. 
          For strict 3 octaves C3-B5, we stop here. */}
    </div>
  );
};

// Helper to find the "next" white key step for naming flats
const getNextStep = (current) => {
  const idx = WHITE_KEYS.indexOf(current);
  if (idx === -1 || idx === WHITE_KEYS.length - 1) return 'C'; // Wrap around (though B has no black key here)
  return WHITE_KEYS[idx + 1];
};
