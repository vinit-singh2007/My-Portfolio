let ctx = null;
let master = null;
let last = 0;

export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
}

export function tapSound(kind = "hover") {
  if (kind === "click") return; // Completely disabled on click
  if (!ctx || ctx.state !== "running") return;
  const now = performance.now();
  if (now - last < 60) return;
  last = now;

  // Base pitch 1360 Hz, shifted randomly by up to +/-7% so every tap differs.
  const base = 1360 * (1 + (Math.random() - 0.5) * 0.14);
  const freq = base;
  const peak = 0.2;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  // 0.5 ms attack, then a fast exponential decay (about 10 ms in total).
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.0005);
  gain.gain.setTargetAtTime(0, t + 0.0005, 0.0016);

  osc.connect(gain);
  gain.connect(master);
  osc.start(t);
  osc.stop(t + 0.03);
}
