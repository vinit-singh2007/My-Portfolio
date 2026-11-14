'use client';

let audioCtx: AudioContext | null = null;
let lastSoundTime = 0;
let isOpeningActive = true;

export function setOpeningActive(active: boolean) {
  isOpeningActive = active;
}

export function isOpeningRunning(): boolean {
  return isOpeningActive;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  return audioCtx;
}

// Pre-unlock on first user interaction anywhere on the page
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

/**
 * Soft hover sound:
 * Sine oscillator 420Hz sliding down to 300Hz over 50ms,
 * through lowpass filter at 900Hz,
 * gain ramping to 0.035 in 4ms and decaying to silence by 60ms.
 */
export function playNavHoverSound() {
  if (typeof window === 'undefined') return;
  if (isOpeningActive) return;

  // Do not play hover sound on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const nowMs = performance.now();
  if (nowMs - lastSoundTime < 70) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  lastSoundTime = nowMs;
  const now = ctx.currentTime;

  try {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {
    // Ignore audio error
  }
}

/**
 * Click / keyboard activation sound:
 * Sine oscillator 260Hz sliding down to 170Hz over 50ms,
 * through lowpass filter at 900Hz,
 * peak gain 0.07 ramping in 4ms and decaying to silence by 60ms.
 */
export function playNavClickSound() {
  if (typeof window === 'undefined') return;
  if (isOpeningActive) return;

  const nowMs = performance.now();
  if (nowMs - lastSoundTime < 70) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  lastSoundTime = nowMs;
  const now = ctx.currentTime;

  try {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {
    // Ignore audio error
  }
}
