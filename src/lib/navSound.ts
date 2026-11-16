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
let isUnlocking = false; // Guard flag to guarantee single fire
let masterVolume = 0.9;

const mutedListeners = new Set<() => void>();

function notifySubscribers() {
  mutedListeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function getSoundMuted(): boolean {
  return !soundEnabled;
}

export function getSoundMutedSnapshot(): boolean {
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

export function subscribeSoundMuted(fn: () => void): () => void {
  mutedListeners.add(fn);
  return () => {
    mutedListeners.delete(fn);
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
  // Eagerly preload and decode audio on mount
  getHoverAudio();
  getContext();

  const handleFirstInteraction = (e: Event) => {
    // 2. SINGLE FIRE: Guard flag prevents duplicate runs
    if (isUnlocked || isUnlocking) return;
    isUnlocking = true;
    justAutoEnabledTick = Date.now();

    // Remove all listeners immediately
    USER_GESTURES.forEach((evt) => {
      window.removeEventListener(evt, handleFirstInteraction, true);
    });

    // 1. DEFER HEAVY WORK: Minimum synchronous execution during the gesture
    const c = getContext();
    if (c && (c.ctx.state as AudioContextState) === 'suspended') {
      c.ctx.resume().catch(() => {});
    }

    const audio = getHoverAudio();
    if (audio) {
      try {
        audio.muted = true;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.muted = false;
              audio.volume = masterVolume;
            })
            .catch(() => {});
        }
      } catch {}
    }

    const isNavLinkClick =
      e.target instanceof Element &&
      Boolean(e.target.closest('header nav, .nav-text-roll, [data-nav-link]'));

    // Move state sync, notifying subscribers, and link preview tap into requestAnimationFrame
    // so it doesn't block the click's paint frame
    requestAnimationFrame(() => {
      isUnlocked = true;
      soundEnabled = true;

      if (masterGain) {
        masterGain.gain.value = masterVolume;
      }
      if (audio) {
        audio.muted = false;
        audio.volume = masterVolume;
      }

      notifySubscribers();

      // If first click was on a navbar link, play tap sound on next frame
      if (isNavLinkClick) {
        playTap('hover');
      }
    });
  };

  // Prefer listening only to 'pointerdown' and 'keydown' for instantaneous touch/mouse unlock
  const USER_GESTURES = ['pointerdown', 'keydown'] as const;

  USER_GESTURES.forEach((evt) => {
    window.addEventListener(evt, handleFirstInteraction, {
      capture: true,
      passive: true,
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
