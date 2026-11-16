'use client';

/**
 * Single source of truth sound manager — Web Audio API & HTMLAudioElement.
 * Manages enabled state, master volume, and browser autoplay unlock lifecycle.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let hoverAudio: HTMLAudioElement | null = null;
let lastSoundTime = 0;
let justAutoEnabledTick = 0;

// ── State: Single Source of Truth ──────────────────────────────────────────
let soundEnabled = false; // Initial state: Sound is OFF until first user interaction
let isUnlocked = false; // Initial state: Locked until first user interaction satisfies autoplay policy
let masterVolume = 0.9;

const mutedListeners = new Set<(muted: boolean) => void>();
const unlockListeners = new Set<(unlocked: boolean) => void>();

function notifySubscribers() {
  mutedListeners.forEach((fn) => {
    try {
      fn(!soundEnabled);
    } catch {}
  });
  unlockListeners.forEach((fn) => {
    try {
      fn(isUnlocked);
    } catch {}
  });
}

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
  notifySubscribers();
}

export function toggleSoundMuted(): boolean {
  // Edge case: if the first click is ON the sound toggle itself,
  // treat it as a normal toggle resulting in sound ON, not "auto-enable then toggle off".
  if (Date.now() - justAutoEnabledTick < 150) {
    setSoundMuted(false);
    return false;
  }
  setSoundMuted(soundEnabled);
  return !soundEnabled;
}

export function subscribeSoundMuted(fn: (muted: boolean) => void): () => void {
  mutedListeners.add(fn);
  fn(!soundEnabled);
  return () => {
    mutedListeners.delete(fn);
  };
}

export function subscribeSoundUnlocked(fn: (unlocked: boolean) => void): () => void {
  unlockListeners.add(fn);
  fn(isUnlocked);
  return () => {
    unlockListeners.delete(fn);
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

// ── First-Interaction Auto-Enable Listeners ─────────────────────────────────
if (typeof window !== 'undefined') {
  // Preload audio element metadata
  getHoverAudio();

  const handleFirstInteraction = async (e: Event) => {
    // Remove all first-interaction listeners immediately
    USER_GESTURES.forEach((evt) => {
      window.removeEventListener(evt, handleFirstInteraction, true);
    });

    justAutoEnabledTick = Date.now();

    // a) Resume the AudioContext
    const c = getContext();
    if (c && (c.ctx.state as AudioContextState) === 'suspended') {
      try {
        await c.ctx.resume();
      } catch {}
    }

    // b) Unlock the hover audio element (muted -> play -> pause -> currentTime=0 -> unmuted)
    const audio = getHoverAudio();
    if (audio) {
      try {
        audio.muted = true;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          audio.pause();
          audio.currentTime = 0;
        }
      } catch {}
    }

    // c) Set isUnlocked = true and soundEnabled = true
    isUnlocked = true;
    soundEnabled = true;

    // d) Update the master gain and the audio element's muted/volume
    if (audio) {
      audio.muted = false;
      audio.volume = masterVolume;
    }
    if (masterGain) {
      masterGain.gain.value = masterVolume;
    }

    // e) Notify subscribers so SoundToggle switches to ON immediately
    notifySubscribers();

    // Edge case: if first click is on a navbar link, play the tap sound once after unlocking
    if (e.target instanceof Element && e.target.closest('header nav, .nav-text-roll, [data-nav-link]')) {
      playTap('hover');
    }
  };

  const USER_GESTURES = ['pointerdown', 'click', 'keydown', 'touchstart'] as const;

  USER_GESTURES.forEach((evt) => {
    window.addEventListener(evt, handleFirstInteraction, {
      capture: true,
      once: true,
    });
  });
}

// ── Opening-animation guard ────────────────────────────────────────────────
let isOpeningActive = false;

export function setOpeningActive(active: boolean) {
  isOpeningActive = active;
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
  } catch {}
}

// ── Hover Sound Handler ────────────────────────────────────────────────────
function playTap(kind: 'hover' | 'click') {
  // Only play when soundEnabled AND audio is unlocked
  if (!soundEnabled || !isUnlocked) return;
  if (kind === 'click') return; // Absolutely NO click sound
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
      playPromise.catch(() => {
        // Fallback to Web Audio if HTML5 audio play fails
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
