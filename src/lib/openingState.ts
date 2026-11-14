'use client';

type Callback = () => void;
const revealCallbacks = new Set<Callback>();

let isOpeningActive = true;
let isOpeningSplitting = false;

export function setOpeningState(state: { active?: boolean; splitting?: boolean }) {
  if (state.active !== undefined) {
    isOpeningActive = state.active;
  }
  if (state.splitting !== undefined) {
    isOpeningSplitting = state.splitting;
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
}

export function isOpeningActiveNow(): boolean {
  return isOpeningActive;
}

export function isOpeningSplittingNow(): boolean {
  return isOpeningSplitting;
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
