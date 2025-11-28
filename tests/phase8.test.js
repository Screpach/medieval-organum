import { playScore, stopPlayback } from '../src/audio/AudioEngine';
import * as Tone from 'tone';

// Mock Tone.js
jest.mock('tone', () => {
  return {
    MonoSynth: jest.fn().mockImplementation(() => ({
      toDestination: jest.fn(),
      connect: jest.fn(),
      triggerAttack: jest.fn(),
      triggerRelease: jest.fn(),
      releaseAll: jest.fn(),
      frequency: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn()
      }
    })),
    Panner: jest.fn().mockImplementation(() => ({ connect: jest.fn() })),
    Reverb: jest.fn().mockImplementation(() => ({ toDestination: jest.fn() })),
    Transport: {
      schedule: jest.fn().mockReturnValue(1),
      start: jest.fn(),
      stop: jest.fn(),
      cancel: jest.fn(),
      bpm: { value: 120 }
    },
    Draw: {
      schedule: jest.fn((cb) => cb())
    },
    Frequency: jest.fn((val) => val), // Passthrough
    start: jest.fn(),
    context: { state: 'suspended' }
  };
});

describe('Phase 8: Audio Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('playScore initializes Tone and schedules events', async () => {
    const mockNeume = { pitches: [{ toMidi: () => 60 }] }; // Middle C
    const scoreData = {
      chantNeumes: [mockNeume, mockNeume], // 2 steps
      organumNeumes: [mockNeume, mockNeume]
    };

    const onTick = jest.fn();
    const onComplete = jest.fn();

    await playScore(scoreData, 120, onTick, onComplete);

    // Verify Tone.start was called
    expect(Tone.start).toHaveBeenCalled();
    
    // Verify scheduling
    // 2 notes -> 2 ticks scheduled + 1 end event = 3 calls to Transport.schedule
    // Actually inside loop: schedule(tick) + schedule(end) outside.
    expect(Tone.Transport.schedule).toHaveBeenCalled();
    expect(Tone.Transport.start).toHaveBeenCalled();
  });

  test('stopPlayback cancels transport and releases synths', () => {
    stopPlayback();
    expect(Tone.Transport.stop).toHaveBeenCalled();
    expect(Tone.Transport.cancel).toHaveBeenCalled();
  });
});
