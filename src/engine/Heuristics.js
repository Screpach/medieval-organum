import { getInterval, isTritone, QUALITIES } from '../core/Interval';
import { getMotionType, MOTION } from '../core/TheoryUtils';
import { STYLES } from '../core/rules/StyleDefinitions';

// Configurable weights for different behaviors
const WEIGHTS = {
  [STYLES.ENCHIRIADIS]: {
    parallel: 0,        // Loves parallel
    contrary: 10,       // Dislikes contrary (except at ends)
    crossing: 100,      // Hates crossing
    semitoneVice: 0,    // Indifferent
    parallelPerfectPenalty: 0 // No penalty for chains
  },
  [STYLES.MICROLOGUS]: {
    parallel: 5,
    contrary: 0,        // Likes contrary
    crossing: 20,       // Tolerates crossing sparingly
    semitoneVice: 50,   // Guido dislikes B-flat/semitone adjustments
    parallelPerfectPenalty: 10 // Mild penalty for chains
  },
  [STYLES.AD_ORGANUM]: {
    parallel: 10,
    contrary: -5,       // Strongly rewards contrary (negative cost)
    crossing: 5,        // Crossing is fine
    semitoneVice: 10,
    parallelPerfectPenalty: 20 // Chains of 5ths discouraged
  }
};

/**
 * Calculates the heuristic cost of a specific step.
 * Lower is better.
 */
export const scoreStep = (context, candidatePitch, style) => {
  const { chantPitch, prevOrganum, prevChant } = context;
  const weights = WEIGHTS[style];
  let cost = 0;

  // 1. Motion Scoring (requires previous note)
  if (prevOrganum && prevChant) {
    const prevDyad = { cantus: prevChant, organum: prevOrganum };
    const currDyad = { cantus: chantPitch, organum: candidatePitch };
    const motion = getMotionType(prevDyad, currDyad);

    if (motion === MOTION.CONTRARY) cost += weights.contrary;
    if (motion === MOTION.PARALLEL) cost += weights.parallel;
    
    // Penalty for chains of parallel perfects (Style dependent)
    if (motion === MOTION.PARALLEL && weights.parallelPerfectPenalty > 0) {
        // Check if previous interval was also perfect 5th/4th/8ve
        const prevInt = getInterval(prevChant, prevOrganum);
        const currInt = getInterval(chantPitch, candidatePitch);
        if (prevInt.simpleSize === currInt.simpleSize && 
           (prevInt.simpleSize === 5 || prevInt.simpleSize === 4)) {
           cost += weights.parallelPerfectPenalty;
        }
    }
  }

  // 2. Voice Crossing Preference
  // (Phase 3 handles the hard prohibition, this handles preference/frequency)
  if (candidatePitch.toMidi() > chantPitch.toMidi()) {
    cost += weights.crossing;
  }

  // 3. "Vice" Semitones (Accidentals)
  // Penalize usage of accidentals (flat/sharp) unless absolutely necessary
  if (candidatePitch.alter !== 0) {
    // Exception: B-flat is often accepted in this era ("soft b"), 
    // but sharps (F#, C#) are "vices" (penalized heavily).
    if (candidatePitch.step === 'B' && candidatePitch.alter === -1) {
      cost += 5; // Mild penalty for Bb
    } else {
      cost += weights.semitoneVice; // Heavy penalty for others
    }
  }

  // 4. Interval Preference
  const interval = getInterval(candidatePitch, chantPitch);
  
  // Preference for Perfect Consonances at the start of the line
  if (!prevOrganum && interval.quality === QUALITIES.P) {
    cost -= 10; // Reward starting on P1, P5, P8
  }

  return cost;
};
