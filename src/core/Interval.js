import { Pitch } from './Pitch';

export const QUALITIES = {
  P: 'Perfect',
  M: 'Major',
  m: 'Minor',
  A: 'Augmented',
  d: 'Diminished'
};

const STEP_INDICES = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/**
 * pure function to get interval info between two Pitch objects
 * @param {Pitch} p1 - lower pitch
 * @param {Pitch} p2 - higher pitch (usually)
 */
export const getInterval = (p1, p2) => {
  // 1. Calculate Generic Interval (Staff steps)
  // e.g., C4 to G4 is 5 steps (0 to 4 is dist 4, +1 = 5th)
  const octaveDiff = p2.octave - p1.octave;
  const stepIndex1 = STEP_INDICES[p1.step];
  const stepIndex2 = STEP_INDICES[p2.step];
  
  // Generic size: 1 = unison, 2 = second, etc.
  const genericSize = (stepIndex2 - stepIndex1) + (octaveDiff * 7) + 1; 
  const absGeneric = Math.abs(genericSize);

  // 2. Calculate Semitone distance
  const semitones = p2.toMidi() - p1.toMidi();
  const absSemitones = Math.abs(semitones);

  // 3. Determine Quality
  // Simplified lookup for standard intervals within reasonable range
  // We map (generic_size % 7) to expected semitones for Perfect/Major
  
  let quality = '?';
  
  // Base mapping for simple intervals (mod 7 context)
  // Unison (1) -> 0 semitones (P)
  // Second (2) -> 1 (m), 2 (M)
  // Third (3) -> 3 (m), 4 (M)
  // Fourth (4) -> 5 (P), 6 (A)
  // Fifth (5) -> 7 (P), 6 (d)
  // Sixth (6) -> 8 (m), 9 (M)
  // Seventh (7) -> 10 (m), 11 (M)
  // Octave (8) -> 12 (P)

  // Map generic size to "simple" interval 1-8 for quality check
  const simpleSize = ((absGeneric - 1) % 7) + 1;
  const simpleSemitones = absSemitones % 12;

  switch (simpleSize) {
    case 1: // Unison/Octave
      if (simpleSemitones === 0) quality = QUALITIES.P;
      break;
    case 2: // Second
      if (simpleSemitones === 1) quality = QUALITIES.m;
      if (simpleSemitones === 2) quality = QUALITIES.M;
      break;
    case 3: // Third
      if (simpleSemitones === 3) quality = QUALITIES.m;
      if (simpleSemitones === 4) quality = QUALITIES.M;
      break;
    case 4: // Fourth
      if (simpleSemitones === 5) quality = QUALITIES.P;
      if (simpleSemitones === 6) quality = QUALITIES.A; // Tritone
      break;
    case 5: // Fifth
      if (simpleSemitones === 7) quality = QUALITIES.P;
      if (simpleSemitones === 6) quality = QUALITIES.d; // Tritone
      break;
    case 6: // Sixth
      if (simpleSemitones === 8) quality = QUALITIES.m;
      if (simpleSemitones === 9) quality = QUALITIES.M;
      break;
    case 7: // Seventh
      if (simpleSemitones === 10) quality = QUALITIES.m;
      if (simpleSemitones === 11) quality = QUALITIES.M;
      break;
  }

  // Special handling for compounds
  const isCompound = absGeneric > 8;

  return {
    size: absGeneric,
    simpleSize,
    semitones: absSemitones,
    quality, // 'Perfect', 'Major', 'Minor', 'Augmented', 'Diminished', '?'
    dir: semitones >= 0 ? 1 : -1
  };
};

export const isTritone = (p1, p2) => {
  const info = getInterval(p1, p2);
  // Augmented 4th or Diminished 5th
  return (info.simpleSize === 4 && info.quality === QUALITIES.A) ||
         (info.simpleSize === 5 && info.quality === QUALITIES.d);
};
