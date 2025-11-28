import { getInterval, QUALITIES } from './Interval';

// --- Motion Classification ---

export const MOTION = {
  PARALLEL: 'Parallel',
  SIMILAR: 'Similar',
  CONTRARY: 'Contrary',
  OBLIQUE: 'Oblique',
  STATIC: 'Static' // No movement in either voice
};

/**
 * Classifies motion between two successive vertical dyads.
 * Dyad 1: { cantus: Pitch, organum: Pitch }
 * Dyad 2: { cantus: Pitch, organum: Pitch }
 */
export const getMotionType = (prev, curr) => {
  const cantusDiff = curr.cantus.toMidi() - prev.cantus.toMidi();
  const organumDiff = curr.organum.toMidi() - prev.organum.toMidi();

  // 1. Check Oblique (one moves, one stays)
  if (cantusDiff === 0 && organumDiff === 0) return MOTION.STATIC;
  if (cantusDiff === 0 || organumDiff === 0) return MOTION.OBLIQUE;

  // 2. Check Direction
  const sameDir = (cantusDiff > 0 && organumDiff > 0) || (cantusDiff < 0 && organumDiff < 0);

  if (!sameDir) return MOTION.CONTRARY;

  // 3. Check Parallel vs Similar
  // Parallel requires the interval size to remain constant (perfect parallel) 
  // OR generic size constant (medieval parallel, e.g. 3rd to 3rd)
  const int1 = getInterval(prev.cantus, prev.organum);
  const int2 = getInterval(curr.cantus, curr.organum);

  if (int1.size === int2.size) return MOTION.PARALLEL;
  
  return MOTION.SIMILAR;
};

// --- Consonance Classification ---

// Medieval classification differs by style, but these are the raw data points
export const CONSONANCE = {
  PERFECT: 'Perfect', // 1, 4, 5, 8
  IMPERFECT: 'Imperfect', // 3, 6
  DISSONANT: 'Dissonant' // 2, 7, Tritone
};

export const getConsonanceType = (intervalInfo) => {
  const { simpleSize, quality } = intervalInfo;

  // Tritone check
  if (quality === QUALITIES.A || quality === QUALITIES.d) return CONSONANCE.DISSONANT;

  if ([1, 4, 5, 8].includes(simpleSize) && quality === QUALITIES.P) {
    return CONSONANCE.PERFECT;
  }
  
  if ([3, 6].includes(simpleSize) && (quality === QUALITIES.M || quality === QUALITIES.m)) {
    return CONSONANCE.IMPERFECT;
  }

  return CONSONANCE.DISSONANT;
};

// --- Mode Definitions ---

export const MODES = {
  D: { final: 'D', name: 'Protus' },
  E: { final: 'E', name: 'Deuterus' },
  F: { final: 'F', name: 'Tritus' },
  G: { final: 'G', name: 'Tetrardus' },
};

export const VALID_FINALS = ['D', 'E', 'F', 'G'];

/**
 * Checks if a pitch is a valid final for the chosen mode
 */
export const isValidFinal = (pitch, modeKey) => {
  return pitch.step === modeKey;
};
