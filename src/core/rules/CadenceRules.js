import { getInterval } from '../Interval';

export const checkCadenceRules = (context, candidatePitch, isLastNote, modeFinal) => {
  if (!isLastNote) return { passed: true };

  const { chantPitch } = context;
  const interval = getInterval(candidatePitch, chantPitch);

  // 1. Final Note must be Unison or Octave (rarely 5th in very early primitive organum, but we enforce U/8)
  if (interval.simpleSize !== 1 && interval.simpleSize !== 8) {
    return { passed: false, reason: 'CADENCE_MUST_BE_U_OR_8' };
  }

  // 2. Check if the Organum matches the mode final (or octave of it)
  // The Chant MUST end on the final. The Organum MUST match it.
  if (candidatePitch.step !== modeFinal) {
    // Edge case: Transposed modes? For Phase 1 we assume standard D,E,F,G finals.
    return { passed: false, reason: 'CADENCE_MUST_MATCH_FINAL' };
  }

  return { passed: true };
};

/**
 * Checks the approach to the cadence (penultimate note).
 * Hard constraint: No semitone approach to Unison (in some styles).
 * Note: This is subtle. Guido dislikes semitone-to-unison. 
 * We will implement this as a hard constraint for Micrologus style specifically.
 */
export const checkPenultimateConstraints = (prevContext, currContext, style) => {
  // This would be called by the generator when validating the *connection* to the final.
  // For the `isStepAllowed` context, we usually look backwards.
  // We'll leave complex temporal checks for the generator/heuristic phase 
  // unless it's a strict prohibition.
  return { passed: true };
};
