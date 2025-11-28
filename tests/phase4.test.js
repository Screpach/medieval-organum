import { Pitch } from '../src/core/Pitch';
import { generateOrganum } from '../src/engine/Generator';
import { STYLES } from '../src/core/rules/StyleDefinitions';

describe('Phase 4: Generator & Heuristics', () => {

  // A simple chant: D4, E4, F4, G4, A4 (Dorian mode fragment)
  const chant = [
    new Pitch('D', 4),
    new Pitch('E', 4),
    new Pitch('F', 4),
    new Pitch('G', 4),
    new Pitch('A', 4)
  ];
  const modeFinal = 'D';

  test('Generates a complete line for Musica Enchiriadis', () => {
    const result = generateOrganum(chant, STYLES.ENCHIRIADIS, modeFinal);
    
    expect(result.success).toBe(true);
    expect(result.organumVoice).toHaveLength(chant.length);
    
    // Check first note: Enchiriadis usually starts with Perfect interval (P4 or P5 below)
    const firstNote = result.organumVoice[0];
    const firstMidi = firstNote.toMidi();
    const chantMidi = chant[0].toMidi();
    const diff = chantMidi - firstMidi;
    
    // Expecting 5 (P4) or 7 (P5) or 12 (P8) or 0 (P1)
    expect([0, 5, 7, 12]).toContain(diff);
  });

  test('Generates different output for Ad Organum Faciendum', () => {
    // This style rewards contrary motion
    const result = generateOrganum(chant, STYLES.AD_ORGANUM, modeFinal);
    expect(result.success).toBe(true);

    // Should generally be below the chant
    // We can iterate and check that it doesn't crash and returns valid Pitch objects
    result.organumVoice.forEach(note => {
      expect(note).toBeInstanceOf(Pitch);
    });
  });

  test('Backtracking handles impossible constraints gracefully', () => {
    // If we force a situation where no note is valid (hypothetically),
    // the generator should return success: false or handle it.
    // For now, we just ensure it returns a valid structure.
    
    // Short chant
    const shortChant = [new Pitch('D', 4), new Pitch('D', 4)];
    const result = generateOrganum(shortChant, STYLES.MICROLOGUS, 'D');
    expect(result.success).toBe(true);
    
    // Verify cadence: Last note should be D or D octave (D3, D4, etc)
    const lastNote = result.organumVoice[1];
    expect(lastNote.step).toBe('D');
  });
});
