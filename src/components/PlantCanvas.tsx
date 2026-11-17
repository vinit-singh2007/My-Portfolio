"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Click anywhere -> a small potted plant draws itself at that point  */
/*  Active only on landing page.                                       */
/*  Add data-no-doodle to any element that should NOT trigger a plant. */
/* ------------------------------------------------------------------ */

const CONFIG = {
  ink: "130,130,130", // stroke colour (dark grey)
  pen: "205,205,205", // little dot that rides the pen tip
  lineWidth: 1.3,
  buildMs: 1700, // time to draw the plant
  holdMs: 2600, // time it stays visible
  fadeMs: 1500, // fade-out time
  maxPlants: 16,
  zIndex: 40, // above background and hero (z-10), below nav (z-50)
};

type Pt = [number, number];
type Path = Pt[];
type Prepared = { pts: Pt[]; cum: number[]; total: number };
type Item = { x: number; y: number; rot: number; born: number; paths: Prepared[] };
type LeafType = "round" | "lens" | "teardrop";

const PI = Math.PI;
const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

/* ---------- geometry helpers ---------- */

function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): Path {
  const n = Math.max(10, Math.round((Math.abs(a1 - a0) / TAU) * 48));
  const p: Path = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return p;
}

// rotate by `ang`, then move to (bx, by)
function place(p: Path, ang: number, bx: number, by: number): Path {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return p.map(([x, y]) => [x * c - y * s + bx, x * s + y * c + by]);
}

// leaf outlines: base at the origin, pointing along +x
function leafPaths(type: LeafType, len: number): Path[] {
  if (type === "round") return [arc(len * 0.5, 0, len * 0.5, len * 0.5, PI, PI + TAU)];
  const p: Path = [];
  const w = type === "lens" ? len * 0.28 : len * 0.3;
  const shape = (x: number) => (type === "lens" ? Math.sin(PI * x) : Math.sin(PI * Math.pow(x, 0.6)));
  for (let i = 0; i <= 20; i++) {
    const x = i / 20;
    p.push([len * x, -w * shape(x)]);
  }
  for (let i = 20; i >= 0; i--) {
    const x = i / 20;
    p.push([len * x, w * shape(x)]);
  }
  return [p];
}

/* ---------- the plants ---------- */

const TOP_COUNT = 6;

function makePlant(lastTop: number): { paths: Path[]; top: number } {
  const u = rnd(10, 14); // base unit, whole plant is roughly 4-5 units tall
  const w = u * 0.9;
  const h = u * 0.9;
  const H = u * rnd(2.2, 3);
  const lean = rnd(-0.5, 0.5) * u;
  const P: Path[] = [];

  // pot (3 variants)
  const pot = Math.floor(rnd(0, 3));
  if (pot === 0) P.push([...arc(0, 0, w, h, 0, PI), [w, 0]]); // bowl
  else if (pot === 1) P.push([[-w, 0], [w, 0], [w * 0.7, h], [-w * 0.7, h], [-w, 0]]); // trapezoid
  else P.push([[-w * 0.8, 0], [w * 0.8, 0], [w * 0.8, h], [-w * 0.8, h], [-w * 0.8, 0]]); // box

  const stem = (hh: number, l: number) => {
    const s: Path = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      s.push([l * t * t, -hh * t]);
    }
    P.push(s);
  };
  const leaf = (type: LeafType, len: number, ang: number, bx: number, by: number) =>
    leafPaths(type, len).forEach((p) => P.push(place(p, ang, bx, by)));

  let top = 0;
  do {
    top = Math.floor(rnd(0, TOP_COUNT));
  } while (top === lastTop);

  switch (top) {
    case 0: // sprout: two round leaves
      stem(H * 0.8, lean);
      [-1, 1].forEach((s) => leaf("round", u * 0.9, -PI / 2 + s * 0.9, lean, -H * 0.8));
      break;
    case 1: // oval plant: three lens leaves
      stem(H, lean);
      [0.45, 0.7, 1].forEach((t, k) =>
        leaf("lens", u * 1.1, k === 2 ? -PI / 2 : -PI / 2 + (k % 2 ? 1 : -1), lean * t * t, -H * t)
      );
      break;
    case 2: {
      // tulip
      stem(H * 0.8, lean);
      const b = u * 0.6;
      const cy = -H * 0.8;
      P.push([
        [lean - b, cy - b * 1.5],
        [lean - b, cy - b * 0.5],
        ...arc(lean, cy - b * 0.5, b, b, PI, 0),
        [lean + b, cy - b * 1.5],
        [lean + b * 0.5, cy - b],
        [lean, cy - b * 1.5],
        [lean - b * 0.5, cy - b],
        [lean - b, cy - b * 1.5],
      ]);
      break;
    }
    case 3: // succulent: three pointed petals, no stem
      [-0.75, 0, 0.75].forEach((a) => leaf("lens", u * 1.7, -PI / 2 + a, 0, 0));
      break;
    case 4: // grass tuft: three curved blades
      [-1, 0, 1].forEach((s) => {
        const hh = u * rnd(1.8, 3);
        const bx = s * u * 0.35;
        const p: Path = [];
        for (let i = 0; i <= 16; i++) {
          const t = i / 16;
          p.push([bx + s * u * 0.55 * t * t, -hh * t]);
        }
        P.push(p);
      });
      break;
    default: // teardrop pair on a Y stem
      stem(H * 0.55, 0);
      P.push([[0, -H * 0.55], [-u * 0.9, -H * 0.8]], [[0, -H * 0.55], [u * 0.9, -H * 0.8]]);
      leaf("teardrop", u * 1.2, -PI / 2 - 0.5, -u * 0.9, -H * 0.8);
      leaf("teardrop", u * 1.2, -PI / 2 + 0.5, u * 0.9, -H * 0.8);
  }

  // shift down so the click point sits near the middle of the plant
  return { paths: P.map((p) => p.map(([x, y]) => [x, y + u * 1.4] as Pt)), top };
}

/* ---------- hand-drawn feel + progressive drawing ---------- */

// insert points every ~2.5px so wobble and partial drawing look smooth
function dense(p: Path): Path {
  const out: Path = [p[0]];
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

function wobble(p: Path): Path {
  const a = rnd(0, TAU);
  const b = rnd(0, TAU);
  return p.map(([x, y], i) => [x + 0.45 * Math.sin(i * 0.35 + a), y + 0.45 * Math.sin(i * 0.29 + b)]);
}

function prepare(paths: Path[]): Prepared[] {
  return paths.map((raw) => {
    const pts = wobble(dense(raw));
    const cum = [0];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      cum.push(total);
    }
    return { pts, cum, total };
  });
}

// strokes the first `f` (0..1) of a path and returns the pen tip
function strokePartial(ctx: CanvasRenderingContext2D, s: Prepared, f: number): Pt {
  const target = s.total * f;
  let tip = s.pts[0];
  ctx.beginPath();
  ctx.moveTo(s.pts[0][0], s.pts[0][1]);
  for (let i = 1; i < s.pts.length; i++) {
    if (s.cum[i] <= target) {
      ctx.lineTo(s.pts[i][0], s.pts[i][1]);
      tip = s.pts[i];
    } else {
      const k = (target - s.cum[i - 1]) / (s.cum[i] - s.cum[i - 1] || 1);
      tip = [
        s.pts[i - 1][0] + (s.pts[i][0] - s.pts[i - 1][0]) * k,
        s.pts[i - 1][1] + (s.pts[i][1] - s.pts[i - 1][1]) * k,
      ];
      ctx.lineTo(tip[0], tip[1]);
      break;
    }
  }
  ctx.stroke();
  return tip;
}

/* ---------- the component ---------- */

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
    let items: Item[] = [];
    let lastTop = -1;
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

      // ── STRICT GUARD: Must be clicked inside the landing Hero section (#hero) ──
      if (!el.closest("#hero")) return;

      // Don't trigger if curtain opening is still actively displaying
      if (typeof window !== "undefined" && window.__OPENING_ACTIVE__) return;

      // Exclude interactive elements
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

      const { paths, top } = makePlant(lastTop);
      lastTop = top;
      items.push({
        x: clickX,
        y: clickY,
        rot: rnd(-0.12, 0.12),
        born: performance.now(),
        paths: prepare(paths),
      });
      if (items.length > CONFIG.maxPlants) items.shift();
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
        ctx.strokeStyle = `rgb(${CONFIG.ink})`;

        // paths are drawn one after another, with a small overlap
        const n = it.paths.length;
        const gap = n > 1 ? 0.6 / n : 0;
        const span = 1 - (n - 1) * gap;
        const e = easeInOut(progress);
        let tip: Pt | null = null;

        it.paths.forEach((s, k) => {
          const f = Math.max(0, Math.min(1, (e - k * gap) / span));
          if (f <= 0) return;
          const t = strokePartial(ctx, s, f);
          if (f < 1) tip = t;
        });

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
        zIndex: 30,
      }}
    />
  );
}
