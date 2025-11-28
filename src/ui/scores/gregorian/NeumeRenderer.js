import React from 'react';
import { NEUME_TYPES } from './NeumeData';

const STAFF_LINE_SPACING = 10; // Pixels between lines
const NOTE_SIZE = 8; // Size of the square note head

// Map Pitch Steps to relative integer positions (C4 as reference)
// 4-line staff usually has a C-clef on the top or second line.
// Let's assume C-clef on the 3rd line from bottom (typical).
// Line 1 (Bottom): D3
// Line 2: F3
// Line 3: A3
// Line 4: C4 ... this varies wildly.
// Let's Standardize: C-Clef on Top Line = C4.
const getStaffPosition = (pitch, clefLinePitch = 60) => {
  // 60 is C4 (Midi). 
  // Each diatonic step is 0.5 * STAFF_LINE_SPACING units visually.
  
  // We need a helper to get diatonic steps distance, ignoring accidentals
  const diatonicSteps = getDiatonicDist(pitch);
  return -diatonicSteps * (STAFF_LINE_SPACING / 2);
};

// Helper: Diatonic distance from C4
const getDiatonicDist = (pitch) => {
  const baseSteps = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const octDiff = pitch.octave - 4;
  return baseSteps[pitch.step] + (octDiff * 7);
};

/**
 * Renders a single Neume as an SVG Group.
 */
export const RenderNeume = ({ neume, x, y, isSelected, onClick }) => {
  const color = isSelected ? '#d00' : '#000';
  
  // Base position relative to C4 line
  // We assume the passed 'y' is the position of the C4 Line.
  
  const drawPunctum = (pitch, offsetX = 0) => {
    const dy = getStaffPosition(pitch);
    return (
      <rect
        key={pitch.toString()}
        x={offsetX - (NOTE_SIZE/2)}
        y={dy - (NOTE_SIZE/2)}
        width={NOTE_SIZE}
        height={NOTE_SIZE}
        fill={color}
      />
    );
  };

  // Dispatch based on type
  let content = null;
  
  if (neume.type === NEUME_TYPES.PUNCTUM) {
    content = drawPunctum(neume.pitches[0]);
  }
  // Logic for Clivis/Podatus would go here (drawing connected squares)
  
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
      {content}
      {/* Invisible hit target for easier clicking */}
      <rect x={-10} y={-20} width={20} height={40} fill="transparent" />
    </g>
  );
};

export const DrawStaff = ({ x, y, width }) => {
  const lines = [0, 1, 2, 3];
  return (
    <g transform={`translate(${x}, ${y})`}>
      {lines.map(i => (
        <line
          key={i}
          x1={0}
          y1={i * STAFF_LINE_SPACING}
          x2={width}
          y2={i * STAFF_LINE_SPACING}
          stroke="#000"
          strokeWidth="1"
        />
      ))}
      {/* C Clef (Simplified Graphic) on Top Line (index 0) */}
      <text x={-15} y={5} fontSize="16" fontFamily="serif" fontWeight="bold">C</text>
    </g>
  );
};
