// src/sounds.js

// 1. Initialize the Audio Context (The "Speaker" system)
// We handle both standard and webkit (Safari/iOS) prefixes
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Helper: Generates a single beep
 */
const playTone = (freq, type, duration) => {
  // Resume context if browser paused it (crucial for mobile)
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type; // 'sine' = smooth, 'square' = retro game, 'sawtooth' = buzzy
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Volume: Start at 10% and fade out to 0% (avoids clicking noise)
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

// --- THE SOUNDS YOU ASKED FOR ---

// 1. CLICK: A short, sharp "Tick" (Used when tapping)
export const playClick = () => {
  playTone(1200, 'sine', 0.1);
};

// 2. SUCCESS: A happy "Ding-Dong" (Used when AI finds an answer)
export const playSuccess = () => {
  playTone(800, 'sine', 0.15); // "Ding"
  setTimeout(() => {
    playTone(1200, 'sine', 0.3); // "Dong"
  }, 100);
};

// 3. ERROR: A low "Bzzzt" (Used if scan fails)
export const playError = () => {
  playTone(200, 'sawtooth', 0.2); // Low buzz
  setTimeout(() => playTone(150, 'sawtooth', 0.2), 150);
};