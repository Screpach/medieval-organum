import React, { useEffect, useRef } from 'react';
import Vex from 'vexflow';
import { createVexNote, calculateStaveWidth } from './VexHelper';
import './ModernScore.css';

const VF = Vex.Flow;

/**
 * Renders two staves: Vox Principalis (Top) and Vox Organalis (Bottom).
 * * @param {Pitch[]} chant - Array of chant notes
 * @param {Pitch[]} organum - Array of organum notes (can be empty/null)
 * @param {Function} onNoteClick - callback(index, voice)
 * @param {number} selectedIndex - Currently highlighted index
 */
export const ModernScore = ({ 
  chant = [], 
  organum = [], 
  onNoteClick,
  selectedIndex = -1
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Cleanup previous render
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    if (chant.length === 0) {
      // Render empty placeholder or instructions
      container.innerHTML = "<div class='score-placeholder'>Add notes via keyboard to begin.</div>";
      return;
    }

    // 2. Setup VexFlow Renderer
    const width = calculateStaveWidth(chant.length);
    const height = 250;
    
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // 3. Create Staves
    // Top Staff (Chant)
    const staveChant = new VF.Stave(10, 20, width - 20);
    staveChant.addClef('treble').setContext(context).draw();

    // Bottom Staff (Organum)
    const staveOrganum = new VF.Stave(10, 130, width - 20);
    staveOrganum.addClef('bass').setContext(context).draw(); // Using bass for organum usually, or treble 8vb

    // Connect them with a brace/line
    const connector = new VF.StaveConnector(staveChant, staveOrganum);
    connector.setType(VF.StaveConnector.type.BRACE);
    connector.setContext(context).draw();

    const lineConnector = new VF.StaveConnector(staveChant, staveOrganum);
    lineConnector.setType(VF.StaveConnector.type.SINGLE);
    lineConnector.setContext(context).draw();

    // 4. Create Voice Notes
    const chantNotes = chant.map((p, i) => {
      const note = createVexNote(p, 'q', 'treble');
      // Highlight selection
      if (i === selectedIndex) {
        note.setStyle({ fillStyle: '#d00', strokeStyle: '#d00' });
      }
      return note;
    });

    const organumNotes = (organum || []).map((p, i) => {
      const note = createVexNote(p, 'q', 'bass');
      if (i === selectedIndex) {
        note.setStyle({ fillStyle: '#d00', strokeStyle: '#d00' });
      }
      return note;
    });

    // Fill organum with invisible rests if it's shorter than chant (generation pending)
    // This keeps spacing aligned
    while (organumNotes.length < chantNotes.length) {
      const rest = new VF.StaveNote({ keys: ["b/3"], duration: "qr" }); // Quarter rest
      organumNotes.push(rest);
    }

    // 5. Create Voices and Formatter
    const voiceChant = new VF.Voice({ num_beats: chantNotes.length, beat_value: 4 });
    voiceChant.addTickables(chantNotes);

    const voiceOrganum = new VF.Voice({ num_beats: organumNotes.length, beat_value: 4 });
    voiceOrganum.addTickables(organumNotes);

    // Format (aligns them vertically)
    new VF.Formatter()
      .joinVoices([voiceChant, voiceOrganum])
      .format([voiceChant, voiceOrganum], width - 50);

    // 6. Draw Voices
    voiceChant.draw(context, staveChant);
    voiceOrganum.draw(context, staveOrganum);

    // 7. Add Hit Testing (Interaction)
    // VexFlow SVG elements don't inherently carry the index easily, 
    // but we can map the generated SVG elements back to our data.
    // A simpler way in VexFlow 4+ is using the StaveNote's specific SVG group.
    
    // We iterate our created notes and attach DOM listeners to their SVG groups
    chantNotes.forEach((note, index) => {
      if (note.attrs && note.attrs.el) {
        note.attrs.el.addEventListener('click', () => {
           if (onNoteClick) onNoteClick(index, 'chant');
        });
        note.attrs.el.style.cursor = 'pointer';
      }
    });

    organumNotes.forEach((note, index) => {
      // Only interactive if it's a real note (not a rest/placeholder)
      if (note.sourcePitch && note.attrs && note.attrs.el) {
        note.attrs.el.addEventListener('click', () => {
           if (onNoteClick) onNoteClick(index, 'organum');
        });
        note.attrs.el.style.cursor = 'pointer';
      }
    });

  }, [chant, organum, selectedIndex]);

  return (
    <div className="modern-score-wrapper">
      <h3>Modern Notation</h3>
      <div 
        ref={containerRef} 
        className="vexflow-container"
      />
    </div>
  );
};
