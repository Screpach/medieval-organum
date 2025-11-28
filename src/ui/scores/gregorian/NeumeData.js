/**
 * Types of Gregorian Neumes supported.
 */
export const NEUME_TYPES = {
  PUNCTUM: 'punctum',   // Single note
  PODATUS: 'podatus',   // Two notes ascending (stacked)
  CLIVIS: 'clivis',     // Two notes descending (stepped)
  TORCULUS: 'torculus', // Down-Up-Down (not fully implemented in Ph1, placeholder)
  PORRECTUS: 'porrectus'// Up-Down-Up
};

/**
 * A Neume object specifically formatted for the renderer.
 */
export class Neume {
  constructor(type, pitches, sourceIndex) {
    this.type = type; // e.g., 'punctum'
    this.pitches = pitches; // [Pitch, Pitch, ...]
    this.sourceIndex = sourceIndex; // Index in the original note array (for sync)
    this.isLigature = pitches.length > 1; // Flag for playback glissando
  }
}
