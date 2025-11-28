// The available counterpoint styles
export const STYLES = {
  ENCHIRIADIS: 'musica_enchiriadis',   // c. 900: Strict parallel, oblique at boundaries
  MICROLOGUS: 'micrologus',            // c. 1025: Guido. Modified parallel, occursus focus
  AD_ORGANUM: 'ad_organum_faciendum'   // c. 1100: "New Organum", contrary motion, crossing
};

// Allowed vertical intervals (Generic Size) per style
// 1=Unison, 4=Fourth, 5=Fifth, 8=Octave, 3=Third, 6=Sixth
const BASE_CONSONANCES = [1, 4, 5, 8];

export const ALLOWED_VERTICALS = {
  [STYLES.ENCHIRIADIS]: BASE_CONSONANCES, 
  [STYLES.MICROLOGUS]: [...BASE_CONSONANCES, 3], // Guido allows thirds approaching cadence
  [STYLES.AD_ORGANUM]: [...BASE_CONSONANCES, 3, 6] // 12th century accepts imperfects more freely
};

// Hard rules for specific styles
export const STYLE_CONFIG = {
  [STYLES.ENCHIRIADIS]: {
    allowVoiceCrossing: false, // Strictly organum below chant
    strictParallel: true
  },
  [STYLES.MICROLOGUS]: {
    allowVoiceCrossing: true, // Occasional crossing allowed in occursus
    strictParallel: false
  },
  [STYLES.AD_ORGANUM]: {
    allowVoiceCrossing: true, // Crossing encouraged
    strictParallel: false
  }
};
