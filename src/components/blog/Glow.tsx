"use client";
import { useEffect, useRef } from "react";

// Warm glow that eases toward the cursor.
export default function Glow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let gx = -999, gy = -999, tx = -999, ty = -999, raf = 0;
    const el = ref.current!;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; el.style.opacity = "1"; };
    const loop = () => {
      gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08;
      el.style.transform = `translate(${gx}px, ${gy}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    loop();
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div id="glow" ref={ref} aria-hidden />;
}
