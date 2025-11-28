import { checkVerticalConsonance, checkHorizontalMotion, checkRangeAndCrossing } from './RuleCheckers';
import { checkCadenceRules } from './CadenceRules';

/**
 * Master function to determine if a candidate organal note is legal.
 * * @param {Object} context 
 * { 
 * chantPitch: Pitch,       // The current chant note
 * prevOrganum: Pitch|null, // The previous organal note (if any)
 * index: number,           // Current note index
 * totalLength: number      // Total length of chant
 * }
 * @param {Pitch} candidatePitch // The note we want to place
 * @param {string} style         // 'musica_enchiriadis', etc.
 * @param {string} modeFinal     // 'D', 'E', 'F', 'G'
 */
export const isStepAllowed = (context, candidatePitch, style, modeFinal) => {
  const { chantPitch, prevOrganum, index, totalLength } = context;
  const isLastNote = index === totalLength - 1;

  // 1. Vertical Check
  const vertical = checkVerticalConsonance(chantPitch, candidatePitch, style);
  if (!vertical.passed) return vertical;

  // 2. Horizontal Check (Melodic)
  const horizontal = checkHorizontalMotion(prevOrganum, candidatePitch);
  if (!horizontal.passed) return horizontal;

  // 3. Range/Crossing Check
  const range = checkRangeAndCrossing(chantPitch, candidatePitch, style);
  if (!range.passed) return range;

  // 4. Cadence Check
  const cadence = checkCadenceRules({ chantPitch }, candidatePitch, isLastNote, modeFinal);
  if (!cadence.passed) return cadence;

  return { passed: true };
};
