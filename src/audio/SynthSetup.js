import * as Tone from 'tone';

/**
 * Creates a monophonic synth optimized for vocal-like chant lines.
 * @param {string} pan - 'left' or 'right' (-1 to 1)
 */
export const createVoiceSynth = (panVal) => {
  // A simple synth with some vibrato and a filter to soften the harshness
  const synth = new Tone.MonoSynth({
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.7,
      release: 0.8
    },
    filter: {
      Q: 1,
      type: "lowpass",
      rolloff: -12
    },
    filterEnvelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 0.8,
      release: 1,
      baseFrequency: 300,
      octaves: 3
    }
  });

  const panner = new Tone.Panner(panVal);
  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
  
  // Chain: Synth -> Panner -> Reverb -> Master
  synth.connect(panner);
  panner.connect(reverb);

  return synth;
};
