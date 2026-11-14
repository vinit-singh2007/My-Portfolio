'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { TIMELINE_DATA } from './TimelineData';
import TimelineEntry from './TimelineEntry';

export default function GlowTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const shouldReduceMotion = useReducedMotion();
  const [activeNodeIds, setActiveNodeIds] = useState<Record<number, boolean>>({});
  const [isPresentActive, setIsPresentActive] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      const allActive: Record<number, boolean> = {};
      TIMELINE_DATA.forEach((item) => {
        allActive[item.id] = true;
      });
      setActiveNodeIds(allActive);
      setIsPresentActive(true);
      return;
    }

    let animationFrameId: number;
    let currentFillHeight = 0;

    const updateTimeline = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const timelineHeight = containerRect.height;
      const timelineTop = containerRect.top;

      // Find first node position to guarantee it lights up on initial load
      let firstNodeOffset = 40;
      if (nodeRefs.current[0]) {
        firstNodeOffset = nodeRefs.current[0].offsetTop + 10;
      }

      const minInitial = Math.min(firstNodeOffset + 36, timelineHeight);
      const rawTarget = Math.max(0, Math.min(viewportHeight * 0.6 - timelineTop, timelineHeight));
      const target = Math.max(minInitial, rawTarget);

      // Smooth lerp: current += (target - current) * 0.09
      currentFillHeight += (target - currentFillHeight) * 0.09;

      // Update progress line height directly for smooth 60-120fps performance
      if (fillLineRef.current) {
        fillLineRef.current.style.height = `${currentFillHeight}px`;
      }

      // Check which nodes have been reached
      const newlyActive: Record<number, boolean> = {};
      let updatedAny = false;

      nodeRefs.current.forEach((nodeEl, idx) => {
        if (!nodeEl) return;
        const entry = TIMELINE_DATA[idx];
        if (!entry) return;

        const nodeCenter = nodeEl.offsetTop + 10;
        if (currentFillHeight >= nodeCenter) {
          newlyActive[entry.id] = true;
          updatedAny = true;
        }
      });

      // Check final present node
      if (currentFillHeight >= timelineHeight - 20) {
        setIsPresentActive(true);
      } else if (rawTarget <= 0) {
        setIsPresentActive(false);
      }

      if (updatedAny) {
        setActiveNodeIds((prev) => {
          let hasChange = false;
          const merged = { ...prev };
          Object.keys(newlyActive).forEach((idKey) => {
            const numId = Number(idKey);
            if (!merged[numId]) {
              merged[numId] = true;
              hasChange = true;
            }
          });
          return hasChange ? merged : prev;
        });
      } else if (rawTarget <= 0) {
        setActiveNodeIds({});
      }

      animationFrameId = requestAnimationFrame(updateTimeline);
    };

    animationFrameId = requestAnimationFrame(updateTimeline);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto py-10 px-0 overflow-hidden"
    >
      {/* ── Background Detail 1: Subtle Drifting Ambient Glows ── */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
          <div className="absolute -top-10 left-1/4 w-[360px] h-[360px] rounded-full bg-[#f97316]/[0.07] blur-[90px] animate-timeline-drift-a" />
          <div className="absolute top-1/2 right-1/4 w-[340px] h-[340px] rounded-full bg-rose-500/[0.05] blur-[90px] animate-timeline-drift-b" />
        </div>
      )}

      {/* ── Background Detail 2: Faint Dot Grid with Radial Ellipse Mask ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none -z-10 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* ── THE AXIS AND CLEAN PROGRESS LINE (Exact dead-center alignment) ── */}
      {/* 
        Desktop: exact center (left-1/2 -translate-x-1/2)
        Mobile (<720px): left-6 -translate-x-1/2 (24px from edge)
      */}
      {/* Base Track Line (2px wide, white/8) */}
      <div className="absolute top-10 bottom-16 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-white/[0.08] pointer-events-none z-10" />

      {/* Clean, Simple Progress Line (2px wide, elegant gradient, no heavy glare or white dot) */}
      <div
        ref={fillLineRef}
        className="absolute top-10 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#fdba74] to-[#f97316] origin-top transition-none pointer-events-none z-10 shadow-[0_0_8px_rgba(249,115,22,0.45)] rounded-full"
        style={{ height: shouldReduceMotion ? '100%' : '0px' }}
      />

      {/* ── Semantic Ordered List of Timeline Entries ── */}
      <ol className="relative z-10 w-full pl-0 list-none m-0">
        {TIMELINE_DATA.map((entry, index) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            index={index}
            isActive={Boolean(activeNodeIds[entry.id])}
            nodeRef={(el) => {
              nodeRefs.current[index] = el;
            }}
          />
        ))}
      </ol>

      {/* ── Final Node & PRESENT Pill at the End of the Timeline ── */}
      <div className="relative w-full mt-6 z-20">
        {/* Desktop (720px+): 3-Column Grid matching entries */}
        <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center w-full">
          {/* Left Column: Empty to keep exact 50% balance */}
          <div className="w-full min-w-0" />

          {/* Center Column: Node dead-centered on the axis */}
          <div className="flex items-center justify-center w-12 h-10">
            <div
              className="relative flex items-center justify-center w-5 h-5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: '#0a0a0a',
                borderWidth: '2px',
                borderColor: isPresentActive ? '#f97316' : 'rgba(255,255,255,0.2)',
                boxShadow: isPresentActive ? '0 0 14px rgba(249,115,22,0.45)' : 'none',
              }}
            >
              {isPresentActive && !shouldReduceMotion && (
                <span className="absolute inset-0 rounded-full border border-[#f97316] animate-timeline-ripple pointer-events-none" />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPresentActive ? 'bg-[#f97316] scale-100' : 'bg-transparent scale-0'
                }`}
              />
            </div>
          </div>

          {/* Right Column: PRESENT pill beside the node */}
          <div className="w-full flex justify-start pl-8 min-w-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#121215]/90 backdrop-blur-md shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="w-2 h-2 rounded-full bg-[#f97316] animate-timeline-pulse-dot" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
                PRESENT
              </span>
            </div>
          </div>
        </div>

        {/* Mobile (<720px): Left axis aligned */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Node Slot: 48px wide, centered at 24px */}
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-10">
            <div
              className="relative flex items-center justify-center w-5 h-5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: '#0a0a0a',
                borderWidth: '2px',
                borderColor: isPresentActive ? '#f97316' : 'rgba(255,255,255,0.2)',
                boxShadow: isPresentActive ? '0 0 14px rgba(249,115,22,0.45)' : 'none',
              }}
            >
              {isPresentActive && !shouldReduceMotion && (
                <span className="absolute inset-0 rounded-full border border-[#f97316] animate-timeline-ripple pointer-events-none" />
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPresentActive ? 'bg-[#f97316] scale-100' : 'bg-transparent scale-0'
                }`}
              />
            </div>
          </div>

          {/* Mobile PRESENT pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#121215]/90 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-timeline-pulse-dot" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
              PRESENT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
