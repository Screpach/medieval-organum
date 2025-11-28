import { Pitch } from '../core/Pitch';
import { isStepAllowed } from '../core/rules/ConstraintEngine';
import { scoreStep } from './Heuristics';

/**
 * Main entry point for generation.
 * @param {Pitch[]} chant - Array of Pitch objects
 * @param {string} style - Style constant
 * @param {string} modeFinal - 'D', 'E', 'F', 'G'
 * @param {Object} options - { allowThirds, etc. } (passed to rules if needed)
 */
export const generateOrganum = (chant, style, modeFinal, options = {}) => {
  const resultLog = [];
  
  // 1. Define search range (Voice range relative to chant)
  // In Phase 1 styles, organum is mostly below, but can cross.
  // We'll scan +/- 12 semitones around the chant note.
  const rangeRadius = 15; 

  /**
   * Recursive Solver
   * @param {number} index - Current chant note index
   * @param {Pitch[]} builtOrganum - Array of generated pitches so far
   */
  const solve = (index, builtOrganum) => {
    // Base Case: Success
    if (index >= chant.length) {
      return builtOrganum;
    }

    const currentChant = chant[index];
    const prevOrganum = index > 0 ? builtOrganum[index - 1] : null;
    const prevChant = index > 0 ? chant[index - 1] : null;

    // 1. Enumerate Candidates
    // We iterate generic steps relative to chant to ensure we cover specific intervals
    const candidates = [];
    const baseMidi = currentChant.toMidi();

    // Scan reasonable range (e.g. from octave below to 5th above)
    // We construct pitches explicitly.
    for (let offset = -14; offset <= 7; offset++) {
      // Create a candidate pitch (roughly)
      // Note: This is a simplification. A real solver might iterate diatonic steps.
      // Here we iterate semitones and map to closest diatonic + Bflat.
      
      const candidateMidi = baseMidi + offset;
      const pitchName = midiToPitch(candidateMidi); // Helper needed
      if (!pitchName) continue;
      
      candidates.push(pitchName);
    }
    
    // Also add explicit B-flats if near B natural, and F# if near F (for transpos)
    // For this era, we stick primarily to White Keys + Bb.

    // 2. Filter & Score Candidates
    const validMoves = [];

    for (const cand of candidates) {
      const context = {
        chantPitch: currentChant,
        prevOrganum,
        prevChant, // Needed for motion heuristic
        index,
        totalLength: chant.length
      };

      // Check Hard Constraints (Phase 3)
      const allowed = isStepAllowed(context, cand, style, modeFinal);
      
      if (allowed.passed) {
        // Check Soft Constraints (Phase 4 Heuristics)
        const cost = scoreStep(context, cand, style);
        validMoves.push({ pitch: cand, cost, log: allowed });
      }
    }

    // 3. Sort by Cost (Best first)
    validMoves.sort((a, b) => a.cost - b.cost);

    // 4. Recurse
    for (const move of validMoves) {
      const result = solve(index + 1, [...builtOrganum, move.pitch]);
      if (result) {
        return result; // Solution found!
      }
    }

    // Backtrack if no moves work
    return null;
  };

  // Start Search
  const organum = solve(0, []);

  if (!organum) {
    return { 
      success: false, 
      error: "No valid counterpoint could be generated." 
    };
  }

  return { 
    success: true, 
    organumVoice: organum 
  };
};

// -- Helper: Midi to Pitch Object --
// (Simple converter for white keys + Bb)
const midiToPitch = (midi) => {
  const steps = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const stepIndex = midi % 12;
  const stepStr = steps[stepIndex];

  // For Phase 1, we mostly avoid sharps/flats except Bb.
  // If stepStr has sharp/flat that isn't Bb, we might skip or handle carefully.
  // We allow all for the solver to try, but heuristics will punish non-diatonic.
  
  if (stepStr.includes('#')) {
      // Parse sharp
      return new Pitch(stepStr[0], octave, 1);
  } 
  if (stepStr.includes('b')) {
      // Parse flat
      return new Pitch(stepStr[0], octave, -1);
  }
  return new Pitch(stepStr, octave, 0);
};
