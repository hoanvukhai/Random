/**
 * Web Audio API sound effects — no external files needed
 */
const audioCtx = typeof window !== 'undefined' ? new AudioContext() : null;

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  delay = 0
) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration);
}

export function playFlipSound() {
  // Quick ascending beeps like a card swipe
  playTone(400, 0.08, 'square', 0.15);
  playTone(600, 0.1, 'square', 0.2, 0.06);
  playTone(800, 0.12, 'sine', 0.25, 0.12);
}

export function playRevealSound(isTeamA: boolean) {
  // Different tone per team for instant audio feedback
  const freq = isTeamA ? 523 : 659; // C5 for team A, E5 for team B
  playTone(freq, 0.15, 'sine', 0.35);
  playTone(freq * 1.5, 0.2, 'sine', 0.2, 0.1);
}

export function playWhistleSound() {
  // Referee whistle: two quick high-pitched tones
  playTone(1200, 0.2, 'sawtooth', 0.3);
  playTone(1400, 0.25, 'sawtooth', 0.3, 0.25);
  playTone(1200, 0.3, 'sawtooth', 0.2, 0.55);
}

export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
