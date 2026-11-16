'use client';

/**
 * Navbar tap sound engine — Web Audio API, no sound files, no libraries.
 * Canonical JS implementation lives in src/utils/uiSound.js.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastSoundTime = 0;

// ── Sound ON by default ───────────────────────────────────────────────────
let isSoundMuted = false;
const listeners = new Set<(muted: boolean) => void>();

export function getSoundMuted(): boolean {
  return isSoundMuted;
}

export function setSoundMuted(muted: boolean) {
  isSoundMuted = muted;
  if (!muted) {
    const c = getContext();
    if (c && c.ctx.state === 'suspended') {
      c.ctx.resume().catch(() => {});
    }
  }
  listeners.forEach((fn) => fn(isSoundMuted));
}

export function toggleSoundMuted(): boolean {
  setSoundMuted(!isSoundMuted);
  return isSoundMuted;
}

export function subscribeSoundMuted(fn: (muted: boolean) => void): () => void {
  listeners.add(fn);
  fn(isSoundMuted);
  return () => {
    listeners.delete(fn);
  };
}

// ── Create / return the shared AudioContext + master gain ──────────────────
function getContext(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.9; // master volume
    masterGain.connect(audioCtx.destination);
  }

  if (!masterGain) return null;
  return { ctx: audioCtx!, master: masterGain };
}

// ── Unlock on FIRST pointerdown or keydown (once each) ────────────────────
if (typeof window !== 'undefined') {
  const unlock = () => {
    const c = getContext();
    if (c && c.ctx.state === 'suspended') c.ctx.resume().catch(() => {});
  };
  window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  window.addEventListener('keydown',     unlock, { once: true, passive: true });
}

// ── Opening-animation guard ────────────────────────────────────────────────
let isOpeningActive = true;

export function setOpeningActive(active: boolean) {
  isOpeningActive = active;
}

export function isOpeningRunning(): boolean {
  return isOpeningActive;
}

// ── Shared tap-sound builder ───────────────────────────────────────────────
function playTap(kind: 'hover' | 'click') {
  if (isSoundMuted) return; // Silent by default / when closed
  if (kind === 'click') return; // Absolutely NO click sound under any circumstance
  if (typeof window === 'undefined') return;
  if (isOpeningActive) return;

  // No hover sound on touch-only devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  // 60 ms debounce
  const nowMs = performance.now();
  if (nowMs - lastSoundTime < 60) return;
  lastSoundTime = nowMs;

  const c = getContext();
  if (!c) return;
  const { ctx, master } = c;

  if (ctx.state === 'suspended') { ctx.resume().catch(() => {}); return; }
  if (ctx.state !== 'running') return;

  try {
    // Base pitch 1360 Hz, shifted randomly ±7% so every tap differs
    const base = 1360 * (1 + (Math.random() - 0.5) * 0.14);
    const freq = base;
    const peak = 0.2;

    const t    = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // 0.5 ms attack, fast exponential decay (~10 ms total)
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.0005);
    gain.gain.setTargetAtTime(0, t + 0.0005, 0.0016);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.03);
  } catch {
    // Silently ignore audio errors
  }
}

// ── Public API (called by Navbar.tsx) ─────────────────────────────────────
export function playNavHoverSound() {
  playTap('hover');
}

export function playNavClickSound() {
  // Intentionally completely disabled — no sound on click
}
