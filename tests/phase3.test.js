import { Pitch } from '../src/core/Pitch';
import { isStepAllowed } from '../src/core/rules/ConstraintEngine';
import { STYLES } from '../src/core/rules/StyleDefinitions';

describe('Phase 3: Constraint Engine', () => {
  
  const C4 = new Pitch('C', 4);
  const D4 = new Pitch('D', 4);
  const E4 = new Pitch('E', 4);
  const F4 = new Pitch('F', 4);
  const G4 = new Pitch('G', 4);
  const A4 = new Pitch('A', 4);
  const B4 = new Pitch('B', 4);
  
  // Test Context
  const getContext = (chantPitch, prevOrganum = null, index = 0, length = 10) => ({
    chantPitch,
    prevOrganum,
    index,
    totalLength: length
  });

  test('Vertical Consonance: Enchiriadis (Strict)', () => {
    // Chant: G4. Organum: C4 (Perfect 5th). Allowed.
    let result = isStepAllowed(getContext(G4), C4, STYLES.ENCHIRIADIS, 'G');
    expect(result.passed).toBe(true);

    // Chant: G4. Organum: E4 (Major 3rd). Forbidden in Enchiriadis.
    result = isStepAllowed(getContext(G4), E4, STYLES.ENCHIRIADIS, 'G');
    expect(result.passed).toBe(false);
    expect(result.reason).toBe('FORBIDDEN_INTERVAL_SIZE');
  });

  test('Vertical Consonance: Micrologus (Allows 3rds)', () => {
    // Chant: G4. Organum: E4 (Major 3rd). Allowed in Micrologus.
    let result = isStepAllowed(getContext(G4), E4, STYLES.MICROLOGUS, 'G');
    expect(result.passed).toBe(true);
  });

  test('Vertical Tritone Check (Always Forbidden)', () => {
    // Chant: B4. Organum: F4. Tritone.
    let result = isStepAllowed(getContext(B4), F4, STYLES.AD_ORGANUM, 'G');
    expect(result.passed).toBe(false);
    expect(result.reason).toBe('VERTICAL_TRITONE');
  });

  test('Cadence Rules (Must end on Final)', () => {
    // Mode G. Last Note. Chant is G4.
    // Candidate Organum: G3 (Octave). Allowed.
    const G3 = new Pitch('G', 3);
    const F3 = new Pitch('F', 3);

    let ctx = getContext(G4, null, 9, 10); // Last note

    let result = isStepAllowed(ctx, G3, STYLES.MICROLOGUS, 'G');
    expect(result.passed).toBe(true);

    // Candidate Organum: F3 (Second). Forbidden at cadence.
    result = isStepAllowed(ctx, F3, STYLES.MICROLOGUS, 'G');
    expect(result.passed).toBe(false);
    expect(result.reason).toBe('CADENCE_MUST_BE_U_OR_8');
  });

  test('Melodic Jump Check', () => {
    // Prev: C4. Curr: C5. Octave jump allowed (borderline but technically allowed).
    const C5 = new Pitch('C', 5);
    let result = isStepAllowed(getContext(G4, C4), C5, STYLES.AD_ORGANUM, 'G');
    // We set limits to >5th in code, let's see. 8ve is strict size 8.
    // Code says: if (interval.size > 5 && interval.size !== 8)
    expect(result.passed).toBe(true);

    // Prev: C4. Curr: B4 (Major 7th leap). Forbidden.
    result = isStepAllowed(getContext(G4, C4), B4, STYLES.AD_ORGANUM, 'G');
    expect(result.passed).toBe(false);
    expect(result.reason).toBe('LEAP_TOO_LARGE');
  });
});
