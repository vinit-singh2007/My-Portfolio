'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TimelineEntryItem } from './TimelineData';
import TimelineCard from './TimelineCard';

interface TimelineEntryProps {
  entry: TimelineEntryItem;
  index: number;
  isActive: boolean;
  nodeRef: (el: HTMLDivElement | null) => void;
}

export default function TimelineEntry({
  entry,
  index,
  isActive,
  nodeRef,
}: TimelineEntryProps) {
  const shouldReduceMotion = useReducedMotion();
  const entryContainerRef = useRef<HTMLLIElement>(null);

  // Even index: Card on Left (Desktop), Ghost Year on Right
  // Odd index: Ghost Year on Left (Desktop), Card on Right
  const isLeftCard = index % 2 === 0;

  return (
    <li
      ref={entryContainerRef}
      className="relative mb-20 md:mb-24 last:mb-16 list-none"
    >
      {/* ── DESKTOP LAYOUT (720px+): 3-Column Grid [Left Col] [48px Axis] [Right Col] ── */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center w-full">
        {/* Left Column: Exactly equal width with minmax(0,1fr) */}
        <div className="w-full flex justify-end pr-8 min-w-0">
          {isLeftCard ? (
            <TimelineCard entry={entry} isActive={isActive} align="left" />
          ) : (
            /* Ghost Year on Left */
            <div className="flex items-center justify-end w-full overflow-hidden select-none">
              <span
                className={`timeline-ghost-year text-right font-black tracking-[-0.05em] leading-none text-[clamp(70px,11vw,140px)] ${
                  isActive ? 'is-active' : ''
                }`}
              >
                {entry.startYear}
              </span>
            </div>
          )}
        </div>

        {/* Center Column: 48px slot with node centered at exact 50% line */}
        <div className="flex items-center justify-center relative w-12 h-full min-h-[140px]">
          {/* Node Circle (20px with 2px border) */}
          <div
            ref={nodeRef}
            data-node-id={entry.id}
            className="relative flex items-center justify-center w-5 h-5 rounded-full z-20 transition-all duration-500"
            style={{
              backgroundColor: '#0a0a0a',
              borderWidth: '2px',
              borderColor: isActive ? '#f97316' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 14px rgba(249,115,22,0.45)' : 'none',
            }}
          >
            {/* Ripple Ring Expanding and Fading when Active */}
            {isActive && !shouldReduceMotion && (
              <span className="absolute inset-0 rounded-full border border-[#f97316] animate-timeline-ripple pointer-events-none" />
            )}

            {/* Inner Orange Dot (scales in with springy ease) */}
            <motion.span
              initial={false}
              animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.3, 1.6, 0.5, 1],
              }}
              className="w-2 h-2 rounded-full bg-[#f97316]"
            />
          </div>
        </div>

        {/* Right Column: Exactly equal width with minmax(0,1fr) */}
        <div className="w-full flex justify-start pl-8 min-w-0">
          {!isLeftCard ? (
            <TimelineCard entry={entry} isActive={isActive} align="right" />
          ) : (
            /* Ghost Year on Right */
            <div className="flex items-center justify-start w-full overflow-hidden select-none">
              <span
                className={`timeline-ghost-year text-left font-black tracking-[-0.05em] leading-none text-[clamp(70px,11vw,140px)] ${
                  isActive ? 'is-active' : ''
                }`}
              >
                {entry.startYear}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE LAYOUT (Below 720px): Axis on Left, Cards on Right ── */}
      <div className="md:hidden flex items-start gap-3">
        {/* Mobile Node Slot: 48px wide, centered at exact 24px (matching left-6 axis) */}
        <div className="flex items-center justify-center pt-6 flex-shrink-0 w-12">
          <div
            ref={(el) => {
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                nodeRef(el);
              }
            }}
            data-node-id={entry.id}
            className="relative flex items-center justify-center w-5 h-5 rounded-full z-20 transition-all duration-500"
            style={{
              backgroundColor: '#0a0a0a',
              borderWidth: '2px',
              borderColor: isActive ? '#f97316' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 14px rgba(249,115,22,0.45)' : 'none',
            }}
          >
            {isActive && !shouldReduceMotion && (
              <span className="absolute inset-0 rounded-full border border-[#f97316] animate-timeline-ripple pointer-events-none" />
            )}
            <motion.span
              initial={false}
              animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.3, 1.6, 0.5, 1] }}
              className="w-2 h-2 rounded-full bg-[#f97316]"
            />
          </div>
        </div>

        {/* Mobile Card */}
        <div className="flex-1 min-w-0 pr-1">
          <TimelineCard entry={entry} isActive={isActive} align="right" />
        </div>
      </div>
    </li>
  );
}
