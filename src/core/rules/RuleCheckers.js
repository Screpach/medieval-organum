import { getInterval, isTritone, QUALITIES } from '../Interval';
import { ALLOWED_VERTICALS, STYLE_CONFIG } from './StyleDefinitions';

/**
 * Checks if the vertical interval is permitted in the current style.
 */
export const checkVerticalConsonance = (chantPitch, organumPitch, style) => {
  const interval = getInterval(organumPitch, chantPitch); // Direction matters for crossing check?
  
  // 1. Hard fail on Tritones (vertical)
  if (isTritone(organumPitch, chantPitch)) {
    return { passed: false, reason: 'VERTICAL_TRITONE' };
  }

  // 2. Check allowed generic sizes
  const allowedSizes = ALLOWED_VERTICALS[style];
  // Simple check using simpleSize (mod 7 mapping from Phase 2)
  if (!allowedSizes.includes(interval.simpleSize)) {
    return { passed: false, reason: 'FORBIDDEN_INTERVAL_SIZE' };
  }

  // 3. Quality check
  // In this era, only Perfect, Major, Minor are generally structurally valid.
  // Augmented/Diminished (even non-tritone ones) are usually errors.
  if (interval.quality === QUALITIES.A || interval.quality === QUALITIES.d) {
    return { passed: false, reason: 'BAD_INTERVAL_QUALITY' };
  }

  return { passed: true };
};

/**
 * Checks melodic validity of the organal voice (horizontal motion).
 */
export const checkHorizontalMotion = (prevOrganum, currOrganum) => {
  if (!prevOrganum) return { passed: true }; // First note is always melodically valid

  const interval = getInterval(prevOrganum, currOrganum);

  // 1. No melodic tritones
  if (isTritone(prevOrganum, currOrganum)) {
    return { passed: false, reason: 'MELODIC_TRITONE' };
  }

  // 2. Leaps larger than a fifth are generally rare/forbidden in this era
  // Exception: Octave leaps are sometimes theoretical possibilities, but usually bad practice 
  // in organum. We'll set a hard limit at 5th for safety, or 8ve.
  if (interval.size > 5 && interval.size !== 8) {
    return { passed: false, reason: 'LEAP_TOO_LARGE' };
  }

  // 3. Chromatic Semitones (e.g., F to F#) - Augmented Unison
  if (interval.simpleSize === 1 && interval.semitones > 0) {
     return { passed: false, reason: 'CHROMATIC_SEMISTEP' };
  }

  return { passed: true };
};

/**
 * Checks constraints related to voice crossing and range.
 */
export const checkRangeAndCrossing = (chantPitch, organumPitch, style) => {
  const config = STYLE_CONFIG[style];
  const chantMidi = chantPitch.toMidi();
  const organumMidi = organumPitch.toMidi();

  // Voice Crossing: Organum is historically BELOW Chant (Vox Principalis) in early styles
  // unless crossing is explicitly allowed.
  if (!config.allowVoiceCrossing) {
    if (organumMidi > chantMidi) {
      return { passed: false, reason: 'VOICE_CROSSING_FORBIDDEN' };
    }
  }

  // Range limit: Organum shouldn't generally go more than an octave + 5th from chant
  if (Math.abs(chantMidi - organumMidi) > 19) {
    return { passed: false, reason: 'EXCESSIVE_DISTANCE' };
  }

  return { passed: true };
};
