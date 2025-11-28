import * as Tone from 'tone';
import { createVoiceSynth } from './SynthSetup';

// Singletons for the synths (initialized on first play to respect browser autoplay policies)
let chantSynth = null;
let organumSynth = null;

// Track the current scheduling ID to allow cancellation
let scheduledEvents = [];

/**
 * Initializes Audio Context (must be called after user gesture in Phase 9).
 */
export const initAudio = async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
  if (!chantSynth) chantSynth = createVoiceSynth(-0.3); // Pan slightly left
  if (!organumSynth) organumSynth = createVoiceSynth(0.3); // Pan slightly right
};

/**
 * Schedules and plays the score.
 * * @param {Object} scoreData - { chantNeumes, organumNeumes }
 * @param {number} bpm - Beats per minute (default 120)
 * @param {Function} onTick - Callback(index) for UI highlighting
 * @param {Function} onComplete - Callback when playback finishes
 */
export const playScore = async (scoreData, bpm = 120, onTick, onComplete) => {
  await initAudio();
  stopPlayback(); // Clear previous

  const { chantNeumes, organumNeumes } = scoreData;
  
  // Determine length based on chant
  const totalSteps = chantNeumes.length;
  const beatDuration = 60 / bpm; // Duration of one "tactus" (beat) in seconds

  Tone.Transport.bpm.value = bpm;
  
  // Iterate through steps (time slices)
  for (let i = 0; i < totalSteps; i++) {
    const time = i * beatDuration;

    // Schedule UI Highlight
    const eventId = Tone.Transport.schedule((t) => {
      // Use Tone.Draw to sync visual updates with audio thread
      Tone.Draw.schedule(() => {
        if (onTick) onTick(i);
      }, t);
    }, time);
    scheduledEvents.push(eventId);

    // Schedule Chant Voice
    scheduleNeume(chantSynth, chantNeumes[i], time, beatDuration);

    // Schedule Organum Voice (if exists)
    if (organumNeumes && organumNeumes[i]) {
      scheduleNeume(organumSynth, organumNeumes[i], time, beatDuration);
    }
  }

  // Schedule Stop/Complete
  const endId = Tone.Transport.schedule(() => {
    if (onComplete) onComplete();
    Tone.Transport.stop();
  }, totalSteps * beatDuration + 1); // +1s buffer
  scheduledEvents.push(endId);

  Tone.Transport.start();
};

/**
 * Helper to schedule a single Neume (which might contain multiple pitches/glissando).
 */
const scheduleNeume = (synth, neume, startTime, duration) => {
  if (!neume || !neume.pitches.length) return;

  const pitches = neume.pitches;
  const startFreq = Tone.Frequency(pitches[0].toMidi(), "midi");

  // Trigger attack for the first note of the neume
  synth.triggerAttack(startFreq, startTime);

  if (pitches.length === 1) {
    // Standard Punctum (Static note)
    synth.triggerRelease(startTime + duration - 0.05); // Short release for articulation
  } else {
    // Ligature (Glissando) behavior
    // Divide the duration among the segments
    // e.g., Podatus (C -> D): Slide C to D over the full duration
    const segmentDuration = duration / (pitches.length - 1);
    
    // We are already at pitches[0]. 
    // We schedule ramps to subsequent pitches.
    // Note: Audio ramps usually need linearRampTo or exponentialRampTo.
    
    let currentTime = startTime;
    
    for (let j = 1; j < pitches.length; j++) {
      const nextFreq = Tone.Frequency(pitches[j].toMidi(), "midi");
      // Ramp from current freq to next freq
      // We schedule the ramp to *finish* at the end of the segment
      synth.frequency.setValueAtTime(
        Tone.Frequency(pitches[j-1].toMidi(), "midi"), 
        currentTime
      );
      
      synth.frequency.linearRampToValueAtTime(
        nextFreq, 
        currentTime + segmentDuration
      );
      
      currentTime += segmentDuration;
    }
    
    // Release at the end of the full duration
    synth.triggerRelease(startTime + duration - 0.05);
  }
};

/**
 * Stops playback and clears schedule.
 */
export const stopPlayback = () => {
  Tone.Transport.stop();
  Tone.Transport.cancel(); // Clears all scheduled events
  scheduledEvents = [];
  
  // Release synths just in case
  if (chantSynth) chantSynth.releaseAll();
  if (organumSynth) organumSynth.releaseAll();
};
