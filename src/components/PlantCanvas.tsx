"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Dev Doodles: Click anywhere on landing hero -> tech shapes draw   */
/*  live (code tags, terminal, brackets, coffee, git graph, etc.)      */
/* ------------------------------------------------------------------ */

const CONFIG = {
  ink: "130, 130, 130",   // base stroke colour (dark grey)
  acc: "#f07a1f",         // accent stroke colour (warm orange)
  pen: "205, 205, 205",   // pen tip dot colour
  lineWidth: 1.4,
  buildMs: 1500,          // time to sketch the shape
  holdMs: 2400,           // time it stays fully visible
  fadeMs: 1400,           // fade-out time
  maxItems: 18,
  zIndex: 30,             // above background (z-0), below nav (z-50)
  rotRange: 0.1,          // random tilt in radians
};

type Pt = [number, number];
type RawPath = Pt[] & { acc?: number };
type PreparedPath = { pts: Pt[]; cum: number[]; total: number; acc?: number };
type DoodleItem = {
  x: number;
  y: number;
  rot: number;
  born: number;
  paths: PreparedPath[];
};

const PI = Math.PI;
const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

/* ---------- Geometry & Path Helpers ---------- */

function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): RawPath {
  const n = Math.max(10, Math.round((Math.abs(a1 - a0) / TAU) * 40));
  const p: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return p as RawPath;
}

// Mark a path as having the accent colour
function A(p: Pt[]): RawPath {
  const raw = p as RawPath;
  raw.acc = 1;
  return raw;
}

// Center all paths around their bounding box center
function center(P: RawPath[]): RawPath[] {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  P.forEach((p) => {
    p.forEach(([x, y]) => {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    });
  });
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return P.map((p) => {
    const r = p.map(([x, y]) => [x - cx, y - cy] as Pt) as RawPath;
    r.acc = p.acc;
    return r;
  });
}

// Subdivide points every ~2.5px for smooth hand-drawn wobble and progressive stroke
function dense(p: Pt[]): Pt[] {
  const out: Pt[] = [p[0]];
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    const n = Math.max(1, Math.ceil(d / 2.5));
    for (let k = 1; k <= n; k++) {
      out.push([
        p[i - 1][0] + ((p[i][0] - p[i - 1][0]) * k) / n,
        p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * k) / n,
      ]);
    }
  }
  return out;
}

// Hand-drawn sine wobble with random phases
function wob(p: Pt[]): Pt[] {
  const a = rnd(0, TAU);
  const b = rnd(0, TAU);
  return p.map(([x, y], i) => [
    x + 0.45 * Math.sin(i * 0.35 + a),
    y + 0.45 * Math.sin(i * 0.29 + b),
  ]);
}

function prep(paths: RawPath[]): PreparedPath[] {
  return paths.map((p) => {
    const q = wob(dense(p));
    const cum = [0];
    let total = 0;
    for (let i = 1; i < q.length; i++) {
      total += Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
      cum.push(total);
    }
    return { pts: q, cum, total, acc: p.acc };
  });
}

// Draw the first fraction f (0..1) of a path and return current pen tip
function strokePartial(ctx: CanvasRenderingContext2D, s: PreparedPath, f: number): Pt {
  const target = s.total * f;
  const p = s.pts;
  const c = s.cum;
  let tip = p[0];
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) {
    if (c[i] <= target) {
      ctx.lineTo(p[i][0], p[i][1]);
      tip = p[i];
    } else {
      const k = (target - c[i - 1]) / (c[i] - c[i - 1] || 1);
      tip = [
        p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k,
        p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k,
      ];
      ctx.lineTo(tip[0], tip[1]);
      break;
    }
  }
  ctx.stroke();
  return tip;
}

/* ---------- 10 Developer & Tech Shapes ---------- */

const SHAPES: ((s: number) => RawPath[])[] = [
  // 1. Code tags: < / > with accent slash
  (s) => [
    [[-0.35 * s, -0.45 * s], [-0.9 * s, 0], [-0.35 * s, 0.45 * s]],
    A([[0.15 * s, -0.6 * s], [-0.15 * s, 0.6 * s]]),
    [[0.35 * s, -0.45 * s], [0.9 * s, 0], [0.35 * s, 0.45 * s]],
  ],

  // 2. Curly brackets { • } with accent center dot
  (s) => {
    const L: Pt[] = [
      [0.25 * s, -0.8 * s],
      [0.05 * s, -0.65 * s],
      [0.05 * s, -0.15 * s],
      [-0.2 * s, 0],
      [0.05 * s, 0.15 * s],
      [0.05 * s, 0.65 * s],
      [0.25 * s, 0.8 * s],
    ];
    const leftBrace = L.map(([x, y]) => [x - 0.4 * s, y] as Pt);
    const rightBrace = L.map(([x, y]) => [-x + 0.4 * s, y] as Pt);
    return [leftBrace, rightBrace, A(arc(0, 0, 0.07 * s, 0.07 * s, 0, TAU))];
  },

  // 3. Terminal box with accent prompt > and underline _
  (s) => [
    [[-s, -0.7 * s], [s, -0.7 * s], [s, 0.7 * s], [-s, 0.7 * s], [-s, -0.7 * s]],
    A([[-0.6 * s, -0.2 * s], [-0.25 * s, 0.05 * s], [-0.6 * s, 0.3 * s]]),
    A([[0, 0.3 * s], [0.5 * s, 0.3 * s]]),
  ],

  // 4. Laptop / screen with keyboard base and code lines
  (s) => [
    [[-0.7 * s, -0.6 * s], [0.7 * s, -0.6 * s], [0.7 * s, 0.35 * s], [-0.7 * s, 0.35 * s], [-0.7 * s, -0.6 * s]],
    [[-s, 0.35 * s], [s, 0.35 * s], [0.85 * s, 0.62 * s], [-0.85 * s, 0.62 * s], [-s, 0.35 * s]],
    A([[-0.4 * s, -0.25 * s], [0.15 * s, -0.25 * s]]),
    [[-0.4 * s, -0.05 * s], [0.35 * s, -0.05 * s]],
  ],

  // 5. Coffee cup with handle and steam lines
  (s) => {
    function steam(x: number): RawPath {
      const p: Pt[] = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        p.push([x + Math.sin(t * TAU) * 0.08 * s, -0.3 * s - t * 0.6 * s]);
      }
      return A(p);
    }
    return [
      [[-0.6 * s, -0.1 * s], [-0.45 * s, 0.7 * s], [0.45 * s, 0.7 * s], [0.6 * s, -0.1 * s], [-0.6 * s, -0.1 * s]],
      arc(0.6 * s, 0.25 * s, 0.3 * s, 0.3 * s, -PI / 2, PI / 2),
      steam(-0.2 * s),
      steam(0.15 * s),
    ];
  },

  // 6. Lightbulb with bulb outline, screw base, and filament
  (s) => [
    arc(0, -0.15 * s, 0.55 * s, 0.55 * s, PI * 0.8, PI * 2.2),
    [[-0.3 * s, 0.17 * s], [-0.25 * s, 0.6 * s]],
    [[0.3 * s, 0.17 * s], [0.25 * s, 0.6 * s]],
    [[-0.25 * s, 0.6 * s], [0.25 * s, 0.6 * s]],
    [[-0.2 * s, 0.82 * s], [0.2 * s, 0.82 * s]],
    A([[-0.2 * s, 0.05 * s], [0, -0.15 * s], [0.2 * s, 0.05 * s]]),
  ],

  // 7. Rocket with fins, porthole, and accent thrust plume
  (s) => [
    [[0, -s], [0.3 * s, -0.4 * s], [0.3 * s, 0.4 * s], [-0.3 * s, 0.4 * s], [-0.3 * s, -0.4 * s], [0, -s]],
    [[-0.3 * s, 0.1 * s], [-0.6 * s, 0.5 * s], [-0.3 * s, 0.4 * s]],
    [[0.3 * s, 0.1 * s], [0.6 * s, 0.5 * s], [0.3 * s, 0.4 * s]],
    arc(0, -0.2 * s, 0.12 * s, 0.12 * s, 0, TAU),
    A([[-0.15 * s, 0.4 * s], [0, 0.85 * s], [0.15 * s, 0.4 * s]]),
  ],

  // 8. Cog / gear with outer teeth and accent center circle
  (s) => {
    const p: Pt[] = [];
    const n = 8;
    const ro = 0.9 * s;
    const ri = 0.68 * s;
    for (let i = 0; i < n; i++) {
      const a = (i * TAU) / n;
      [[ri, -0.2], [ro, -0.12], [ro, 0.12], [ri, 0.2]].forEach(([rad, offset]) => {
        p.push([rad * Math.cos(a + offset), rad * Math.sin(a + offset)]);
      });
    }
    p.push(p[0]);
    return [p, A(arc(0, 0, 0.3 * s, 0.3 * s, 0, TAU))];
  },

  // 9. CPU Chip with circuit core and outer pins
  (s) => {
    const P: RawPath[] = [
      [[-0.5 * s, -0.5 * s], [0.5 * s, -0.5 * s], [0.5 * s, 0.5 * s], [-0.5 * s, 0.5 * s], [-0.5 * s, -0.5 * s]],
      A([[-0.2 * s, -0.2 * s], [0.2 * s, -0.2 * s], [0.2 * s, 0.2 * s], [-0.2 * s, 0.2 * s], [-0.2 * s, -0.2 * s]]),
    ];
    [-1, 0, 1].forEach((k) => {
      const o = k * 0.28 * s;
      P.push(
        [[o, -0.5 * s], [o, -0.82 * s]],
        [[o, 0.5 * s], [o, 0.82 * s]],
        [[-0.5 * s, o], [-0.82 * s, o]],
        [[0.5 * s, o], [0.82 * s, o]]
      );
    });
    return P;
  },

  // 10. Git commit graph with main line, branch curve, and commit nodes
  (s) => [
    [[0, -0.62 * s], [0, 0.62 * s]],
    [[0, 0.35 * s], [0.5 * s, 0.05 * s], [0.5 * s, -0.15 * s]],
    arc(0, -0.75 * s, 0.13 * s, 0.13 * s, 0, TAU),
    arc(0, 0.75 * s, 0.13 * s, 0.13 * s, 0, TAU),
    A(arc(0.5 * s, -0.28 * s, 0.13 * s, 0.13 * s, 0, TAU)),
  ],
];

const SHAPE_COUNT = SHAPES.length;

function makeDoodle(lastIdx: number): { paths: RawPath[]; idx: number } {
  let idx = 0;
  do {
    idx = Math.floor(rnd(0, SHAPE_COUNT));
  } while (idx === lastIdx && SHAPE_COUNT > 1);
  return { paths: center(SHAPES[idx](rnd(15, 19))), idx };
}

/* ---------- React Component ---------- */

export default function PlantCanvas() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Strictly landing page only
    if (pathname !== "/") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let items: DoodleItem[] = [];
    let lastIdx = -1;
    let raf = 0;

    const resize = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width || window.innerWidth;
      H = rect.height || window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;

      const el = e.target as HTMLElement | null;
      if (!el) return;

      // ── STRICT GUARD: Must be clicked inside the landing Hero section (#hero or #home) ──
      if (!el.closest("#hero, #home")) return;

      // Don't trigger if curtain opening is still actively displaying
      if (typeof window !== "undefined" && window.__OPENING_ACTIVE__) return;

      // Exclude clicks on interactive links, buttons, nav, rail, etc.
      if (
        el.closest(
          "a, button, nav, header, aside, input, textarea, [data-no-doodle], [data-social-rail], [data-nav-link]"
        )
      ) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Must be within the hero canvas boundaries
      if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;

      // ── SCROLL GUARD: For touch, only draw on intentional taps, not scroll gestures ──
      // Track finger movement; cancel if finger drifts more than 8px (scroll intent).
      if (e.pointerType === "touch") {
        const startX = e.clientX;
        const startY = e.clientY;
        const MOVE_THRESHOLD = 8;
        let didScroll = false;

        const onMove = (me: PointerEvent) => {
          const dx = me.clientX - startX;
          const dy = me.clientY - startY;
          if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) {
            didScroll = true;
          }
        };

        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("pointercancel", onUp);

          if (didScroll) return; // was a scroll — skip drawing

          // Intentional tap: draw the doodle
          const { paths, idx } = makeDoodle(lastIdx);
          lastIdx = idx;
          items.push({
            x: clickX,
            y: clickY,
            rot: rnd(-CONFIG.rotRange, CONFIG.rotRange),
            born: performance.now(),
            paths: prep(paths),
          });
          if (items.length > CONFIG.maxItems) items.shift();
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerup", onUp, { once: true });
        window.addEventListener("pointercancel", onUp, { once: true });
        return; // drawing happens inside onUp for touch
      }

      // ── Mouse / stylus: draw immediately as before ──
      const { paths, idx } = makeDoodle(lastIdx);
      lastIdx = idx;

      items.push({
        x: clickX,
        y: clickY,
        rot: rnd(-CONFIG.rotRange, CONFIG.rotRange),
        born: performance.now(),
        paths: prep(paths),
      });

      if (items.length > CONFIG.maxItems) items.shift();
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const life = CONFIG.buildMs + CONFIG.holdMs + CONFIG.fadeMs;
      items = items.filter((it) => now - it.born < life);

      for (const it of items) {
        const age = now - it.born;
        const progress = reduceMotion ? 1 : Math.min(1, age / CONFIG.buildMs);
        const alpha =
          age > CONFIG.buildMs + CONFIG.holdMs
            ? 1 - (age - CONFIG.buildMs - CONFIG.holdMs) / CONFIG.fadeMs
            : 1;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        ctx.lineWidth = CONFIG.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Paths are drawn sequentially with slight overlap
        const n = it.paths.length;
        const gap = n > 1 ? 0.6 / n : 0;
        const span = 1 - (n - 1) * gap;
        const e = easeInOut(progress);
        let tip: Pt | null = null;

        it.paths.forEach((s, k) => {
          const f = Math.max(0, Math.min(1, (e - k * gap) / span));
          if (f <= 0) return;
          ctx.strokeStyle = s.acc ? CONFIG.acc : `rgb(${CONFIG.ink})`;
          const t = strokePartial(ctx, s, f);
          if (f < 1) tip = t;
        });

        // Pen tip dot in lighter grey
        if (tip && progress < 1) {
          ctx.fillStyle = `rgb(${CONFIG.pen})`;
          ctx.beginPath();
          ctx.arc(tip[0], tip[1], 2, 0, TAU);
          ctx.fill();
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: CONFIG.zIndex,
      }}
    />
  );
}
