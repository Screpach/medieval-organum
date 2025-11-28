/**
 * Represents a musical pitch with specific spelling.
 * Fundamental for the "Split Key" requirement.
 */
export class Pitch {
  constructor(step, octave, alter = 0) {
    // step: 'C', 'D', 'E', 'F', 'G', 'A', 'B'
    // octave: integer (e.g., 3, 4, 5)
    // alter: -1 (flat), 0 (natural), 1 (sharp)
    this.step = step.toUpperCase();
    this.octave = octave;
    this.alter = alter;
  }

  // Standard MIDI note number (C4 = 60)
  // Used for audio and coarse interval math
  toMidi() {
    const stepOffsets = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    return (this.octave + 1) * 12 + stepOffsets[this.step] + this.alter;
  }

  // Returns string like "C#4", "Db4", "F4"
  toString() {
    let acc = '';
    if (this.alter === 1) acc = '#';
    if (this.alter === -1) acc = 'b';
    return `${this.step}${acc}${this.octave}`;
  }

  // Comparison for sorting/equality
  equals(otherPitch) {
    return (
      this.step === otherPitch.step &&
      this.octave === otherPitch.octave &&
      this.alter === otherPitch.alter
    );
  }

  // Helper to clone
  clone() {
    return new Pitch(this.step, this.octave, this.alter);
  }
}

// Helper to parse string "C#4" -> Pitch object
export const parsePitch = (str) => {
  const match = str.match(/^([A-G])(#|b)?(\d+)$/);
  if (!match) throw new Error(`Invalid pitch string: ${str}`);
  
  const step = match[1];
  const acc = match[2];
  const octave = parseInt(match[3], 10);
  
  let alter = 0;
  if (acc === '#') alter = 1;
  if (acc === 'b') alter = -1;

  return new Pitch(step, octave, alter);
};
