import React, { useMemo } from 'react';
import { mapToNeumes } from './NeumeMapper';
import { RenderNeume, DrawStaff } from './NeumeRenderer';
import './GregorianScore.css';

/**
 * Renders Chant and Organum in pseudo-Gregorian notation.
 */
export const GregorianScore = ({ 
  chant = [], 
  organum = [], 
  onNoteClick,
  selectedIndex = -1 
}) => {
  
  // 1. Convert Pitches to Neumes
  const chantNeumes = useMemo(() => mapToNeumes(chant), [chant]);
  const organumNeumes = useMemo(() => mapToNeumes(organum), [organum]);

  // Layout Constants
  const START_X = 40;
  const SPACING = 40;
  const STAVE_WIDTH = Math.max(500, (chant.length * SPACING) + 100);
  
  // Y positions
  const CHANT_Y = 50;   // Top Stave
  const ORGANUM_Y = 150; // Bottom Stave

  // C4 Line Positions (Where the C clef sits)
  // For top stave, let's say Top Line is C4.
  // For bottom stave, let's say Top Line is F3 or C4 depending on range.
  // For simplicity in Phase 7, we lock C4 to the top line of both staves 
  // (Standard C-clef position).
  
  return (
    <div className="gregorian-score-wrapper">
      <h3>Gregorian Notation</h3>
      <svg width={STAVE_WIDTH} height={220} className="gregorian-svg">
        {/* Draw Staves */}
        <DrawStaff x={20} y={CHANT_Y} width={STAVE_WIDTH - 40} />
        <DrawStaff x={20} y={ORGANUM_Y} width={STAVE_WIDTH - 40} />

        {/* Draw Chant Neumes */}
        {chantNeumes.map((neume, i) => (
          <RenderNeume 
            key={`chant-${i}`}
            neume={neume}
            x={START_X + (i * SPACING)}
            y={CHANT_Y} // Anchor to top line (C4)
            isSelected={i === selectedIndex}
            onClick={() => onNoteClick && onNoteClick(i, 'chant')}
          />
        ))}

        {/* Draw Organum Neumes */}
        {organumNeumes.map((neume, i) => (
          <RenderNeume 
            key={`org-${i}`}
            neume={neume}
            x={START_X + (i * SPACING)}
            y={ORGANUM_Y} 
            isSelected={i === selectedIndex}
            onClick={() => onNoteClick && onNoteClick(i, 'organum')}
          />
        ))}
        
        {/* Draw Lyrics Placeholder (Latin ipsum) */}
        {chantNeumes.map((_, i) => (
            <text 
                key={`lyric-${i}`}
                x={START_X + (i * SPACING)}
                y={ORGANUM_Y + 50}
                textAnchor="middle"
                fontSize="10"
                fill="#555"
                fontFamily="serif"
            >
                •
            </text>
        ))}

      </svg>
    </div>
  );
};
