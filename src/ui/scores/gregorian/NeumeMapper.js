import { Neume, NEUME_TYPES } from './NeumeData';

/**
 * Converts a linear array of Pitches into an array of Neumes.
 * For Phase 1 (Note-against-Note), this defaults to 1 Pitch -> 1 Punctum.
 * * If 'grouping' is enabled (e.g. for melismas), it would group 
 * consecutive pitches based on direction.
 */
export const mapToNeumes = (pitchArray) => {
  const neumes = [];

  // Current logic: 1-to-1 Mapping (Punctum)
  // This matches the "Note-against-Note" style of Ad Organum / Enchiriadis.
  // If we had lyric data, we would group by syllable.
  
  pitchArray.forEach((pitch, index) => {
    // Basic Punctum
    neumes.push(new Neume(NEUME_TYPES.PUNCTUM, [pitch], index));
  });

  return neumes;
};

/**
 * (Future Extension)
 * Logic to detect potential ligatures based on melodic contour
 * e.g., if we had a melisma of D4 -> C4, we could return a CLIVIS.
 */
export const groupLigatures = (pitchArray) => {
  // Placeholder for Phase 9 "Melisma" toggle logic.
  // For now, returns simple mapping.
  return mapToNeumes(pitchArray);
};
