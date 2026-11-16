'use client';

/**
 * Single source of truth sound manager — Web Audio API & HTMLAudioElement.
 * Manages enabled state, master volume, and browser autoplay unlock lifecycle.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let hoverAudio: HTMLAudioElement | null = null;
let lastSoundTime = 0;

// ── State: Single Source of Truth ──────────────────────────────────────────
let soundEnabled = false; // Sound is OFF (muted) by default
let isUnlocked = false; // Starts locked until user interaction satisfies autoplay policy
let masterVolume = 0.9;

const listeners = new Set<(muted: boolean) => void>();

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function getSoundMuted(): boolean {
  return !soundEnabled;
}

export function isAudioUnlocked(): boolean {
  return isUnlocked;
}

function getHoverAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!hoverAudio) {
    hoverAudio = new Audio('/audio/tap.wav');
    hoverAudio.preload = 'auto';
    hoverAudio.volume = masterVolume;
    hoverAudio.muted = !soundEnabled;
    hoverAudio.load();
  }
  return hoverAudio;
}

export function setSoundMuted(muted: boolean) {
  soundEnabled = !muted;
  const audio = getHoverAudio();
  if (audio) {
    audio.muted = muted;
    audio.volume = muted ? 0 : masterVolume;
  }
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : masterVolume;
  }
  if (soundEnabled) {
    unlockAudio().catch(() => {});
  }
  listeners.forEach((fn) => fn(!soundEnabled));
}

export function toggleSoundMuted(): boolean {
  setSoundMuted(soundEnabled);
  return !soundEnabled;
}

export function subscribeSoundMuted(fn: (muted: boolean) => void): () => void {
  listeners.add(fn);
  fn(!soundEnabled);
  return () => {
    listeners.delete(fn);
  };
}

export function setMasterVolume(vol: number) {
  masterVolume = Math.max(0, Math.min(1, vol));
  const audio = getHoverAudio();
  if (audio) {
    audio.volume = soundEnabled ? masterVolume : 0;
  }
  if (masterGain) {
    masterGain.gain.value = soundEnabled ? masterVolume : 0;
  }
}

// ── Shared AudioContext & Master Gain ──────────────────────────────────────
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
    masterGain.gain.value = soundEnabled ? masterVolume : 0;
    masterGain.connect(audioCtx.destination);
  }

  if (!masterGain) return null;
  return { ctx: audioCtx, master: masterGain };
}

/**
 * Resumes audio context and un-mutes HTML5 audio.
 */
export async function unlockAudio(): Promise<boolean> {
  const c = getContext();
  if (c && (c.ctx.state as AudioContextState) === 'suspended') {
    try {
      await c.ctx.resume();
    } catch {
      // Autoplay policy prevented resume
    }
  }

  const audio = getHoverAudio();
  if (audio) {
    try {
      audio.muted = true;
      const p = audio.play();
      if (p !== undefined) {
        await p;
        audio.pause();
        audio.currentTime = 0;
      }
      audio.muted = !soundEnabled;
      audio.volume = soundEnabled ? masterVolume : 0;
      isUnlocked = true;
      return true;
    } catch {
      // Autoplay blocked without user gesture
    }
  }

  if (c && (c.ctx.state as AudioContextState) === 'running') {
    isUnlocked = true;
    return true;
  }

  return false;
}

// ── Unlock proactively on first user gesture (click, keydown, touchstart) ──
if (typeof window !== 'undefined') {
  // Eagerly preload hoverAudio on client load
  getHoverAudio();

  const handleFirstUserInteraction = () => {
    unlockAudio()
      .then((unlocked) => {
        if (unlocked) {
          USER_GESTURES.forEach((evt) => {
            window.removeEventListener(evt, handleFirstUserInteraction, true);
          });
        }
      })
      .catch(() => {});
  };

  const USER_GESTURES = ['click', 'keydown', 'touchstart', 'pointerdown'] as const;

  USER_GESTURES.forEach((evt) => {
    window.addEventListener(evt, handleFirstUserInteraction, {
      capture: true,
      passive: true,
    });
  });
}

// ── Opening-animation guard ────────────────────────────────────────────────
let isOpeningActive = false;

export function setOpeningActive(active: boolean) {
  isOpeningActive = active;
  if (!active) {
    unlockAudio().catch(() => {});
  }
}

export function isOpeningRunning(): boolean {
  return isOpeningActive;
}

// ── Tone Synthesis Fallback ────────────────────────────────────────────────
function playTone(ctx: AudioContext, master: GainNode) {
  const nowMs = performance.now();
  if (nowMs - lastSoundTime < 50) return;
  lastSoundTime = nowMs;

  try {
    const base = 1360 * (1 + (Math.random() - 0.5) * 0.14);
    const peak = 0.2;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.0005);
    gain.gain.setTargetAtTime(0, t + 0.0005, 0.0016);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.03);
  } catch {
    // Silently ignore audio playback errors
  }
}

// ── Hover Sound Handler ────────────────────────────────────────────────────
function playTap(kind: 'hover' | 'click') {
  if (!soundEnabled) return; // Muted by user
  if (kind === 'click') return; // Click sound is intentionally disabled
  if (typeof window === 'undefined') return;
  if (isOpeningActive) return;

  // Support both hover and any-hover (hybrid/touchscreen laptops)
  const canHover =
    window.matchMedia('(hover: hover)').matches ||
    window.matchMedia('(any-hover: hover)').matches;
  if (!canHover) return;

  const audio = getHoverAudio();
  const c = getContext();

  if (audio) {
    // Reset currentTime to 0 for rapid hovering
    audio.currentTime = 0;
    audio.muted = !soundEnabled;
    audio.volume = masterVolume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isUnlocked = true;
        })
        .catch(() => {
          // If HTML5 Audio was blocked by autoplay before first click, fallback to Web Audio
          if (c && (c.ctx.state as AudioContextState) === 'running') {
            playTone(c.ctx, c.master);
          }
        });
      return;
    }
  }

  // Web Audio fallback
  if (c && (c.ctx.state as AudioContextState) === 'running') {
    playTone(c.ctx, c.master);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
export function playNavHoverSound() {
  playTap('hover');
}

export function playNavClickSound() {
  // Completely disabled on click
}
