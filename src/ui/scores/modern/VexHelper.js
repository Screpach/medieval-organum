import Vex from 'vexflow';

const VF = Vex.Flow;

/**
 * Converts a Phase 2 Pitch object to VexFlow key string.
 * e.g., Pitch(C, 4, 1) -> "c/4"
 * Note: VexFlow expects lower case steps.
 */
export const toVexKey = (pitch) => {
  return `${pitch.step.toLowerCase()}/${pitch.octave}`;
};

/**
 * Creates a VexFlow StaveNote from a Pitch object.
 * Applies accidentals explicitly based on Pitch.alter.
 * * @param {Pitch} pitch 
 * @param {string} duration - 'w', 'h', 'q', etc.
 * @param {string} clef - 'treble' or 'bass' (needed for formatting)
 */
export const createVexNote = (pitch, duration = 'w', clef = 'treble') => {
  const note = new VF.StaveNote({
    clef: clef,
    keys: [toVexKey(pitch)],
    duration: duration,
    auto_stem: true
  });

  // Apply Accidental if alter != 0
  if (pitch.alter === 1) {
    note.addModifier(new VF.Accidental('#'));
  } else if (pitch.alter === -1) {
    note.addModifier(new VF.Accidental('b'));
  }

  // Store the original pitch data on the note for hit-testing/callbacks later
  note.sourcePitch = pitch;

  return note;
};

/**
 * Calculates the required width of the stave based on note count.
 */
export const calculateStaveWidth = (noteCount) => {
  const minWidth = 400;
  const noteWidth = 50; // pixels per note approx
  return Math.max(minWidth, noteCount * noteWidth + 50);
};
