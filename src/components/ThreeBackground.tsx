'use client';

import React, { useEffect, useRef } from 'react';
import { onOpeningReveal } from '@/lib/openingState';

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Scroll state tracking
    let scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let smoothScrollY = scrollY;
    let isAnimating = true;

    // Intro open animation tracking (runs for ~2.6s right as opening reveals)
    let introStartTime = performance.now();
    const introDuration = 2600; // ms

    const unsubscribeReveal = onOpeningReveal(() => {
      introStartTime = performance.now();
      wakeUp();
    });

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      wakeUp();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      wakeUp();
    };

    const wakeUp = () => {
      if (!isAnimating) {
        isAnimating = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const isMobile = window.innerWidth < 768;
    const numSlats = isMobile ? 180 : 320;

    const render = () => {
      const now = performance.now();
      const introElapsed = now - introStartTime;
      const isIntroActive = introElapsed < introDuration;

      // 1. Intro progress: 0 on open -> 1 after introDuration
      const introT = Math.min(1, introElapsed / introDuration);
      // Smooth cubic ease-out
      const introEase = 1 - Math.pow(1 - introT, 3);
      // Dynamic motion flourish during opening
      const introFlourish = (1 - introEase) * Math.sin(introT * Math.PI * 1.5);

      // 2. Scroll interpolation: smoothly tracks scroll movement
      const scrollDiff = scrollY - smoothScrollY;
      smoothScrollY += scrollDiff * 0.08;
      const scrollVelocity = Math.abs(scrollDiff);
      const isScrolling = scrollVelocity > 0.05;

      ctx.clearRect(0, 0, width, height);

      // Scroll phase drives the ribbon's 3D wave only when scrolled
      const scrollPhase = smoothScrollY * 0.0022;
      // Scroll momentum creates an organic elevation shift
      const scrollElevationShift = scrollDiff * 0.25;

      // Render the 3D Sculptural Ribbed Ribbon
      for (let i = 0; i < numSlats; i++) {
        const t = i / (numSlats - 1); // 0 (bottom-left) to 1 (depth/right)

        // Trajectory across canvas
        const baseX = -120 + t * (width * 1.15);

        // 3D wave elevation formula:
        // - Steady resting curve when idle
        // - Flourishes during opening
        // - Shifts dynamically with scroll position and velocity
        const baseWave =
          Math.sin(t * Math.PI * 1.12 + scrollPhase) * (height * 0.46) -
          Math.sin(t * Math.PI * 2.2 + scrollPhase * 1.4) * 85;

        const openingWaveOffset =
          introFlourish * Math.sin(t * Math.PI * 2.5 + introT * 3.5) * (height * 0.18);

        // Gentle continuous ambient breathing wave so the background never feels frozen
        const ambientFloat = Math.sin((now * 0.0008) + t * Math.PI * 1.3) * 12;

        const scrollFlex =
          (scrollElevationShift / (height || 1)) * 40 * Math.sin(t * Math.PI);

        const y = height * 0.98 - baseWave - openingWaveOffset + scrollFlex + ambientFloat;
        const x = baseX;

        // Expanded ribbon width: spans a much broader, sculptural area across canvas
        const ribbonW =
          (520 * (1.0 - t * 0.45) + Math.sin(t * Math.PI) * 220) *
          (isMobile ? 0.75 : 1.0);

        // Slat angle: twists along curve and reacts subtly to scroll velocity
        const angle =
          -Math.PI * 0.22 +
          Math.sin(t * Math.PI * 1.15 + scrollPhase * 0.5) * 0.18 +
          (scrollDiff / 500) * 0.08 * Math.sin(t * Math.PI);

        const dx = Math.cos(angle) * (ribbonW * 0.5);
        const dy = Math.sin(angle) * (ribbonW * 0.5);

        // Stepped extrusion edge on bottom-left (physical 3D slat look)
        const stepExtrude = Math.max(0.0, (0.42 - t) * 110.0 * introEase);

        const p1x = x - dx - stepExtrude;
        const p1y = y - dy;
        const p2x = x + dx;
        const p2y = y + dy;

        // Lighting model (chiaroscuro):
        // Bright silver highlight on crest, velvety shadow in crevices
        const crest = Math.exp(-Math.pow((t - 0.35) / 0.24, 2));
        const fadeTail = t > 0.75 ? Math.exp(-Math.pow((t - 1.0) / 0.24, 2)) : 1.0;

        const rimAlpha = Math.min(1.0, (0.18 + 0.78 * crest) * fadeTail * (0.6 + 0.4 * introEase));
        const shadeAlpha = Math.min(1.0, (0.08 + 0.38 * crest) * fadeTail);

        // 1. Shadow gap between slats
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // 2. Dark silver slat body
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.strokeStyle = `rgba(140, 145, 155, ${shadeAlpha.toFixed(3)})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // 3. Razor-sharp luminous silver rim light on top edge
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.strokeStyle = `rgba(235, 240, 250, ${rimAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // 4. 3D stepped end caps on bottom edge
        if (stepExtrude > 6) {
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p1x + stepExtrude, p1y + 4);
          ctx.strokeStyle = `rgba(180, 185, 195, ${(rimAlpha * 0.75).toFixed(3)})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Start initial intro render
    animationFrameId = requestAnimationFrame(render);

    return () => {
      unsubscribeReveal();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0"
    />
  );
}
