'use client';

type Callback = () => void;
const revealCallbacks = new Set<Callback>();
const doneCallbacks = new Set<Callback>();

let isOpeningActive = true;
let isOpeningSplitting = false;
let isOpeningDone = false;

export function setOpeningState(state: {
  active?: boolean;
  splitting?: boolean;
  done?: boolean;
}) {
  if (state.active !== undefined) {
    isOpeningActive = state.active;
  }
  if (state.splitting !== undefined) {
    isOpeningSplitting = state.splitting;
  }
  if (state.done !== undefined) {
    isOpeningDone = state.done;
  } else if (state.active === false) {
    isOpeningDone = true;
  }

  if (state.splitting || !isOpeningActive) {
    revealCallbacks.forEach((cb) => {
      try {
        cb();
      } catch {
        // ignore callback error
      }
    });
  }

  if (isOpeningDone || !isOpeningActive) {
    doneCallbacks.forEach((cb) => {
      try {
        cb();
      } catch {
        // ignore callback error
      }
    });
  }
}

export function isOpeningActiveNow(): boolean {
  return isOpeningActive;
}

export function isOpeningSplittingNow(): boolean {
  return isOpeningSplitting;
}

export function isOpeningDoneNow(): boolean {
  return isOpeningDone;
}

/**
 * Register a listener to execute right when the opening sequence begins
 * to split (or immediately if there is no opening sequence running).
 */
export function onOpeningReveal(callback: Callback): () => void {
  // If opening has already started splitting or is inactive, execute immediately!
  if (isOpeningSplitting || !isOpeningActive) {
    callback();
    return () => {};
  }

  revealCallbacks.add(callback);
  return () => {
    revealCallbacks.delete(callback);
  };
}

/**
 * Register a listener to execute right after the opening sequence is fully complete
 * (prerendering overlay completely finished/cleared), or immediately if completed.
 */
export function onOpeningDone(callback: Callback): () => void {
  if (
    isOpeningDone ||
    !isOpeningActive ||
    (typeof window !== 'undefined' && window.__OPENING_DONE__)
  ) {
    callback();
    return () => {};
  }

  const handler = () => {
    callback();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('opening-done', handler, { once: true });
  }

  doneCallbacks.add(callback);
  return () => {
    doneCallbacks.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('opening-done', handler);
    }
  };
}

