'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TimelineEntryItem, calculateDuration, formatMonths } from './TimelineData';

interface TimelineCardProps {
  entry: TimelineEntryItem;
  isActive: boolean;
  align: 'left' | 'right';
}

export default function TimelineCard({ entry, isActive, align }: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [displayedMonths, setDisplayedMonths] = useState(0);

  const { totalMonths } = calculateDuration(entry.startDateStr, entry.endDateStr);
  const isPresent = entry.endDateStr.toLowerCase() === 'present';

  // Detect touch devices to disable tilt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = window.matchMedia('(hover: none)');
      setIsTouch(match.matches);
      const listener = (e: MediaQueryListEvent) => setIsTouch(e.matches);
      match.addEventListener('change', listener);
      return () => match.removeEventListener('change', listener);
    }
  }, []);

  // Duration counter: counts up from 0 to totalMonths over 1.5s with ease-out when card becomes active
  useEffect(() => {
    if (!isActive) return;
    if (shouldReduceMotion) {
      setDisplayedMonths(totalMonths);
      return;
    }

    let startTime: number | null = null;
    const duration = 1500; // 1.5s

    let rafId: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedMonths(Math.round(totalMonths * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animateCount);
      }
    };

    // Start counter slightly after card appears
    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(animateCount);
    }, 350);

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive, totalMonths, shouldReduceMotion]);

  // Cursor border glow tracking (direct DOM mutation, avoids re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);

    // 3D tilt calculation (rotateX up to 5deg, rotateY up to 6deg)
    if (!isTouch && !shouldReduceMotion) {
      const px = x / rect.width;
      const py = y / rect.height;
      const rx = (0.5 - py) * 10;
      const ry = (px - 0.5) * 12;
      setTilt({ rx, ry });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--mx', '-300px');
    cardRef.current.style.setProperty('--my', '-300px');
    setTilt({ rx: 0, ry: 0 });
  };

  // Entrance animation values: 3D Flip in
  const xOffset = align === 'left' ? -40 : 40;
  const initialRotateY = align === 'left' ? -60 : 60;

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              rotateY: initialRotateY,
              rotateX: 15,
              x: xOffset,
              scale: 0.88,
              filter: 'blur(6px)',
            }
      }
      animate={
        isActive
          ? {
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              x: 0,
              scale: 1,
              filter: 'blur(0px)',
            }
          : shouldReduceMotion
          ? { opacity: 1, rotateY: 0, rotateX: 0, x: 0, scale: 1, filter: 'blur(0px)' }
          : {
              opacity: 0,
              rotateY: initialRotateY,
              rotateX: 15,
              x: xOffset,
              scale: 0.88,
              filter: 'blur(6px)',
            }
      }
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className="w-full relative"
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !isTouch && !shouldReduceMotion ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` : undefined,
          transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.5s ease-out' : 'transform 0.08s ease-out',
        }}
        className="timeline-glow-card w-full p-6 sm:p-7 relative select-none rounded-[20px] shadow-2xl"
      >
        {/* Top Shimmer: 1px orange gradient line sweeping once across top edge */}
        {isActive && !shouldReduceMotion && (
          <div className="absolute top-0 inset-x-0 h-[1px] overflow-hidden pointer-events-none">
            <div className="absolute top-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent via-[#f97316] to-transparent animate-timeline-shimmer shadow-[0_0_8px_#f97316]" />
          </div>
        )}

        {/* Ambient Corner Glow on Hover */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-[#f97316]/20 via-[#f97316]/5 to-transparent blur-2xl pointer-events-none opacity-20 group-hover:opacity-70 transition-all duration-500" />

        {/* ── Staggered Content Elements ── */}
        <div className="relative z-10 space-y-4">
          {/* 1. Date Pill & Duration Counter */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Date Pill with Pulsing Orange Dot for Present */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-zinc-300">
              {isPresent && (
                <span className="relative flex h-2 w-2">
                  <span className="w-2 h-2 rounded-full bg-[#f97316] animate-timeline-pulse-dot" />
                </span>
              )}
              <time dateTime={entry.startDateStr}>{entry.duration}</time>
            </div>

            {/* Dynamic Duration Counter */}
            <span className="text-xs font-mono font-semibold tracking-wider text-[#f97316] bg-[#f97316]/10 px-2.5 py-1 rounded-md border border-[#f97316]/20">
              {formatMonths(displayedMonths)}
            </span>
          </motion.div>

          {/* 2. Role Title */}
          <motion.h3
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl font-bold tracking-tight text-white"
          >
            {entry.role}
          </motion.h3>

          {/* 3. Organization Line with Monogram */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-zinc-300"
          >
            {/* 22px Rounded Square Monogram */}
            <span className="w-[22px] h-[22px] rounded-[5px] bg-[#f97316]/15 border border-[#f97316]/40 text-[#f97316] text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">
              {entry.monogram}
            </span>
            <span className="truncate">{entry.company}</span>
          </motion.div>

          {/* 4. Description */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed"
          >
            {entry.description}
          </motion.p>

          {/* 5. Skill Chips popping in */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
            {entry.skills.map((skill, sIdx) => (
              <motion.span
                key={skill}
                initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
                animate={
                  isActive
                    ? { scale: 1, opacity: 1 }
                    : shouldReduceMotion
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.7, opacity: 0 }
                }
                transition={{ duration: 0.35, delay: 0.75 + sIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono text-zinc-300"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

