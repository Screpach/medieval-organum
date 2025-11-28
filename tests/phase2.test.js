import { Pitch, parsePitch } from '../src/core/Pitch';
import { getInterval, isTritone } from '../src/core/Interval';
import { getMotionType, MOTION } from '../src/core/TheoryUtils';

describe('Phase 2: Core Domain', () => {
  
  test('Pitch parsing and MIDI conversion', () => {
    const c4 = parsePitch('C4');
    const cSharp4 = parsePitch('C#4');
    const dFlat4 = parsePitch('Db4');

    expect(c4.toMidi()).toBe(60);
    expect(cSharp4.toMidi()).toBe(61);
    expect(dFlat4.toMidi()).toBe(61); // Enharmonically equal in MIDI
    expect(cSharp4.alter).toBe(1);    // But distinct in structure
    expect(dFlat4.alter).toBe(-1);
  });

  test('Interval calculation', () => {
    const c4 = parsePitch('C4');
    const g4 = parsePitch('G4');
    const f4 = parsePitch('F4');
    const b4 = parsePitch('B4');

    const fifth = getInterval(c4, g4);
    expect(fifth.size).toBe(5);
    expect(fifth.quality).toBe('Perfect');

    // Tritone check
    const tritone = getInterval(f4, b4);
    expect(tritone.simpleSize).toBe(4);
    expect(tritone.quality).toBe('Augmented');
    expect(isTritone(f4, b4)).toBe(true);
  });

  test('Motion classification', () => {
    // Parallel 5ths: (C4, G4) -> (D4, A4)
    const dyad1 = { cantus: parsePitch('C4'), organum: parsePitch('G4') };
    const dyad2 = { cantus: parsePitch('D4'), organum: parsePitch('A4') };
    
    expect(getMotionType(dyad1, dyad2)).toBe(MOTION.PARALLEL);

    // Contrary: (C4, E4) -> (D4, C4)
    // Cantus up (C->D), Organum down (E->C)
    const dyad3 = { cantus: parsePitch('C4'), organum: parsePitch('E4') };
    const dyad4 = { cantus: parsePitch('D4'), organum: parsePitch('C4') };
    expect(getMotionType(dyad3, dyad4)).toBe(MOTION.CONTRARY);

    // Oblique: (C4, G4) -> (D4, G4)
    // Cantus moves, Organum stays
    const dyad5 = { cantus: parsePitch('C4'), organum: parsePitch('G4') };
    const dyad6 = { cantus: parsePitch('D4'), organum: parsePitch('G4') };
    expect(getMotionType(dyad5, dyad6)).toBe(MOTION.OBLIQUE);
  });
});
