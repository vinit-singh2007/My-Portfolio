'use client';

import { useEffect, useRef } from 'react';

// ─── Config ──────────────────────────────────────────────────────────────────
const CFG = {
  maxPlants: 16,
  buildTime: 1700,     // ms – total draw time
  holdTime: 2600,      // ms – pause before fade
  fadeTime: 1500,      // ms – fade-out duration
  strokeColor: 'rgb(130,130,130)',
  dotColor: 'rgb(205,205,205)',
  lineWidth: 1.3,
  resampleStep: 2.5,   // px between resampled points
  wobbleAmp: 0.45,     // px of hand-drawn wobble
  tiltRange: 7,        // ± degrees of random tilt
  plantMinH: 45,       // px
  plantMaxH: 75,       // px
  staggerFrac: 0.18,   // fraction of buildTime to stagger each path
  dotRadius: 2.2,
};

// ─── Math helpers ─────────────────────────────────────────────────────────────
function rand(a: number, b: number) { return a + Math.random() * (b - a); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function rotPt(x: number, y: number, a: number): [number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
}
function transPts(pts: [number, number][], dx: number, dy: number): [number, number][] {
  return pts.map(([x, y]) => [x + dx, y + dy]);
}
function rotPts(pts: [number, number][], a: number): [number, number][] {
  return pts.map(([x, y]) => rotPt(x, y, a));
}

// ─── Resample + wobble ────────────────────────────────────────────────────────
function resample(pts: [number, number][], step: number): [number, number][] {
  if (pts.length < 2) return pts;
  const out: [number, number][] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.hypot(dx, dy);
    if (seg === 0) continue;
    let d = carry;
    while (d < seg) {
      const t = d / seg;
      out.push([pts[i - 1][0] + dx * t, pts[i - 1][1] + dy * t]);
      d += step;
    }
    carry = d - seg;
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function wobble(pts: [number, number][], amp: number): [number, number][] {
  const phX = rand(0, Math.PI * 2);
  const phY = rand(0, Math.PI * 2);
  const frq = rand(0.4, 0.9);
  return pts.map(([x, y], i) => [
    x + amp * Math.sin(frq * i + phX),
    y + amp * Math.sin(frq * i * 1.3 + phY),
  ]);
}

function preparePaths(rawPaths: [number, number][][]): [number, number][][] {
  return rawPaths.map(p => wobble(resample(p, CFG.resampleStep), CFG.wobbleAmp));
}

// ─── Leaf helpers ─────────────────────────────────────────────────────────────
// All leaves: base at origin, tip along +x, symmetric around x-axis
function leafRound(len: number): [number, number][] {
  const w = len * 0.55;
  const pts: [number, number][] = [];
  const n = 20;
  // upper arc
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([t * len, -w * Math.sin(Math.PI * t)]);
  }
  // lower arc
  for (let i = n; i >= 0; i--) {
    const t = i / n;
    pts.push([t * len, w * Math.sin(Math.PI * t)]);
  }
  pts.push(pts[0]);
  return pts;
}

function leafLens(len: number): [number, number][] {
  const w = len * 0.38;
  const pts: [number, number][] = [];
  const n = 20;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([t * len, -w * Math.sin(Math.PI * t)]);
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n;
    pts.push([t * len, w * Math.sin(Math.PI * t)]);
  }
  pts.push(pts[0]);
  return pts;
}

function leafTeardrop(len: number): [number, number][] {
  const w = len * 0.45;
  const pts: [number, number][] = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const t = i / n; // 0..1 = base..tip
    const bulge = Math.sin(Math.PI * t) * (1 - 0.5 * t);
    pts.push([t * len, -w * bulge]);
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n;
    const bulge = Math.sin(Math.PI * t) * (1 - 0.5 * t);
    pts.push([t * len, w * bulge]);
  }
  pts.push(pts[0]);
  return pts;
}

// Place a leaf: rotate by angle (from +y axis = "up"), translate tip base to (bx, by)
function placedLeaf(
  leafFn: (len: number) => [number, number][],
  len: number,
  bx: number, by: number,  // attachment point
  angleDeg: number          // 0 = right, 90 = up, etc.
): [number, number][] {
  const a = (angleDeg * Math.PI) / 180;
  return transPts(rotPts(leafFn(len), -a + Math.PI / 2), bx, by);
}

// ─── Pot generators (origin = middle of rim, +y = down) ──────────────────────
function potBowl(w: number, h: number): [number, number][][] {
  // rim line + bowl half-circle
  const rim: [number, number][] = [[-w / 2, 0], [w / 2, 0]];
  const bowl: [number, number][] = [];
  const n = 20;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (i / n); // 0..π
    bowl.push([(w / 2) * Math.cos(Math.PI - a), (h * 0.9) * Math.sin(a)]);
  }
  return [rim, bowl];
}

function potTrap(w: number, h: number): [number, number][][] {
  const tw = w;         // top width
  const bw = w * 0.68; // bottom width
  const path: [number, number][] = [
    [-tw / 2, 0], [tw / 2, 0], [bw / 2, h], [-bw / 2, h], [-tw / 2, 0],
  ];
  return [path];
}

function potBox(w: number, h: number): [number, number][][] {
  const path: [number, number][] = [
    [-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h], [-w / 2, 0],
  ];
  return [path];
}

const potFns = [potBowl, potTrap, potBox];

// ─── Plant top generators ─────────────────────────────────────────────────────
// All paths are in local coords, origin = middle of pot rim, up = -y

function plantSprout(h: number): [number, number][][] {
  const stemH = h * 0.5;
  const leafLen = h * 0.35;
  const stem: [number, number][] = [[rand(-3, 3), 0], [rand(-4, 4), -stemH]];
  const tipX = stem[stem.length - 1][0];
  const tipY = stem[stem.length - 1][1];
  const lLeft = placedLeaf(leafRound, leafLen, tipX, tipY, 135);
  const lRight = placedLeaf(leafRound, leafLen, tipX, tipY, 45);
  return [stem, lLeft, lRight];
}

function plantOval(h: number): [number, number][][] {
  const stemH = h * 0.72;
  const leafLen = h * 0.28;
  const stem: [number, number][] = [[0, 0], [0, -stemH]];
  const paths: [number, number][][] = [stem];
  const n = 3;
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 0.5);
    const sy = -stemH * t;
    const sx = 0;
    const isLast = i === n - 1;
    const angle = isLast ? 90 : i % 2 === 0 ? 160 : 20;
    paths.push(placedLeaf(leafLens, leafLen, sx, sy, angle));
  }
  return paths;
}

function plantTulip(h: number): [number, number][][] {
  const stemH = h * 0.6;
  const bw = h * 0.22; // bud half-width
  const bh = h * 0.32;
  const stem: [number, number][] = [[0, 0], [0, -stemH]];
  const tx = 0, ty = -stemH;
  // tulip cup outline
  const bud: [number, number][] = [
    [-bw, ty],
    [-bw * 0.4, ty - bh * 0.5],
    [0, ty - bh],         // centre petal tip
    [bw * 0.4, ty - bh * 0.5],
    [bw, ty],
    [bw * 0.6, ty - bh * 0.3], // inner curve
    [0, ty - bh * 0.55],
    [-bw * 0.6, ty - bh * 0.3],
    [-bw, ty],
  ];
  // small leaf on stem
  const lx = 0, ly = -stemH * 0.4;
  const leaf = placedLeaf(leafLens, h * 0.22, lx, ly, 155);
  return [stem, bud, leaf];
}

function plantSucculent(h: number): [number, number][][] {
  const ll = h * 0.42;
  const paths: [number, number][][] = [];
  const angles = [90, 150, 30, 60, 120];
  const lens = [ll, ll * 0.78, ll * 0.78, ll * 0.6, ll * 0.6];
  for (let i = 0; i < angles.length; i++) {
    paths.push(placedLeaf(leafLens, lens[i], 0, 0, angles[i]));
  }
  return paths;
}

function plantGrass(h: number): [number, number][][] {
  const paths: [number, number][][] = [];
  const heights = [h * 0.9, h * 0.65, h * 0.75];
  const xs = [-h * 0.1, 0, h * 0.1];
  const leans = [-12, 5, 18];
  for (let i = 0; i < 3; i++) {
    const stemH = heights[i];
    const leanRad = (leans[i] * Math.PI) / 180;
    const blade: [number, number][] = [
      [xs[i], 0],
      [xs[i] + stemH * 0.15 * Math.sin(leanRad), -stemH * 0.5],
      [xs[i] + stemH * Math.sin(leanRad) * 0.5, -stemH],
    ];
    paths.push(blade);
  }
  return paths;
}

function plantTeardrop(h: number): [number, number][][] {
  const stemH = h * 0.42;
  const branchH = h * 0.26;
  const ll = h * 0.3;
  const stem: [number, number][] = [[0, 0], [0, -stemH]];
  const tx = 0, ty = -stemH;
  const brL: [number, number][] = [[tx, ty], [tx - branchH * 0.5, ty - branchH]];
  const brR: [number, number][] = [[tx, ty], [tx + branchH * 0.5, ty - branchH]];
  const tipL = brL[brL.length - 1];
  const tipR = brR[brR.length - 1];
  const leafL = placedLeaf(leafTeardrop, ll, tipL[0], tipL[1], 115);
  const leafR = placedLeaf(leafTeardrop, ll, tipR[0], tipR[1], 65);
  return [stem, brL, brR, leafL, leafR];
}

const plantFns = [
  plantSprout, plantOval, plantTulip, plantSucculent, plantGrass, plantTeardrop,
];

// ─── Path length ──────────────────────────────────────────────────────────────
function pathLength(pts: [number, number][]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return len;
}

// ─── Plant instance type ──────────────────────────────────────────────────────
interface Plant {
  x: number;
  y: number;
  paths: [number, number][][];
  lengths: number[];
  tilt: number;        // radians
  born: number;        // performance.now()
  phase: 'drawing' | 'holding' | 'fading';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PlantCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plantsRef = useRef<Plant[]>([]);
  const rafRef = useRef<number>(0);
  const lastPlantIdx = useRef<number>(-1);
  const lastPotIdx = useRef<number>(-1);
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Draw frame ───────────────────────────────────────────────────────────
    function drawFrame(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let pi = plantsRef.current.length - 1; pi >= 0; pi--) {
        const p = plantsRef.current[pi];
        const age = now - p.born;

        // phase transitions
        if (p.phase === 'drawing' && age >= CFG.buildTime) p.phase = 'holding';
        if (p.phase === 'holding' && age >= CFG.buildTime + CFG.holdTime) p.phase = 'fading';
        if (p.phase === 'fading' && age >= CFG.buildTime + CFG.holdTime + CFG.fadeTime) {
          plantsRef.current.splice(pi, 1);
          continue;
        }

        // global alpha
        let alpha = 1;
        if (p.phase === 'fading') {
          const ft = (age - CFG.buildTime - CFG.holdTime) / CFG.fadeTime;
          alpha = 1 - clamp(ft, 0, 1);
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);
        ctx.strokeStyle = CFG.strokeColor;
        ctx.lineWidth = CFG.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const totalPaths = p.paths.length;
        const totalLen = p.lengths.reduce((a, b) => a + b, 0);
        const stagger = CFG.staggerFrac * CFG.buildTime;
        // each path starts at: (pathIdx / totalPaths) * (buildTime - stagger * totalPaths) offset
        // actually distribute so last path ends exactly at buildTime
        const totalBuild = reducedMotion.current ? 0 : CFG.buildTime;
        let dotX = 0, dotY = 0, dotVisible = false;

        for (let i = 0; i < totalPaths; i++) {
          const pts = p.paths[i];
          if (pts.length < 2) continue;

          const pathStartTime = i * (totalBuild / (totalPaths + 0.5));
          const pathEndTime = pathStartTime + totalBuild * 0.6;
          const pathAge = age - pathStartTime;
          const pathT = reducedMotion.current ? 1 : clamp(pathAge / (pathEndTime - pathStartTime), 0, 1);
          const easedT = easeInOut(pathT);

          if (pathAge < 0) continue; // not started yet

          // how many points to draw
          const targetLen = p.lengths[i] * easedT;
          let drawn = 0;
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          let lx = pts[0][0], ly = pts[0][1];
          for (let j = 1; j < pts.length; j++) {
            const seg = Math.hypot(pts[j][0] - lx, pts[j][1] - ly);
            if (drawn + seg > targetLen) {
              const rem = targetLen - drawn;
              const frac = seg > 0 ? rem / seg : 0;
              const nx = lerp(lx, pts[j][0], frac);
              const ny = lerp(ly, pts[j][1], frac);
              ctx.lineTo(nx, ny);
              dotX = nx; dotY = ny;
              break;
            }
            ctx.lineTo(pts[j][0], pts[j][1]);
            lx = pts[j][0]; ly = pts[j][1];
            drawn += seg;
            if (j === pts.length - 1) {
              dotX = pts[j][0]; dotY = pts[j][1];
            }
          }
          ctx.stroke();

          // dot rides the tip of the LAST in-progress path
          if (pathT < 1 && p.phase === 'drawing') {
            dotVisible = true;
          }
        }

        // draw dot
        if (dotVisible) {
          ctx.beginPath();
          ctx.arc(dotX, dotY, CFG.dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = CFG.dotColor;
          ctx.fill();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    rafRef.current = requestAnimationFrame(drawFrame);

    // ── Click handler ─────────────────────────────────────────────────────────
    function handlePointer(e: PointerEvent) {
      // ignore interactive elements
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest('a, button, nav, [data-nav-link], [data-social-rail]')) return;
      if (target.closest('header')) return;

      // pick plant & pot (never repeat consecutively)
      let pIdx: number;
      do { pIdx = Math.floor(Math.random() * plantFns.length); }
      while (pIdx === lastPlantIdx.current && plantFns.length > 1);
      lastPlantIdx.current = pIdx;

      let potIdx: number;
      do { potIdx = Math.floor(Math.random() * potFns.length); }
      while (potIdx === lastPotIdx.current && potFns.length > 1);
      lastPotIdx.current = potIdx;

      const totalH = rand(CFG.plantMinH, CFG.plantMaxH);
      const potH = totalH * 0.32;
      const potW = totalH * 0.38;
      const plantH = totalH * 0.68;

      const potPaths = potFns[potIdx](potW, potH);
      const plantPaths = plantFns[pIdx](plantH);

      const rawPaths = [...potPaths, ...plantPaths];
      const paths = preparePaths(rawPaths);
      const lengths = paths.map(pathLength);

      const tilt = (rand(-CFG.tiltRange, CFG.tiltRange) * Math.PI) / 180;
      // shift click point to sit at ~40% from top of plant (near pot rim)
      const offsetY = -totalH * 0.1;

      const plant: Plant = {
        x: e.clientX,
        y: e.clientY + offsetY,
        paths,
        lengths,
        tilt,
        born: performance.now(),
        phase: 'drawing',
      };

      // cap at max plants
      if (plantsRef.current.length >= CFG.maxPlants) {
        plantsRef.current.shift();
      }
      plantsRef.current.push(plant);
    }

    window.addEventListener('pointerdown', handlePointer);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,  // above background (ThreeBackground is likely z-0), below nav
      }}
      aria-hidden="true"
    />
  );
}
