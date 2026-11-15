'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface StackedSectionsProps {
  hero: React.ReactNode;
  sheet: React.ReactNode;
  sheetId?: string;
  className?: string;
}

export default function StackedSections({
  hero,
  sheet,
  sheetId = 'projects',
  className = '',
}: StackedSectionsProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sheetRef,
    offset: ['start end', 'start start'],
  });

  const scaleTarget = isMobile ? 0.96 : 0.92;
  const radiusTarget = isMobile ? 16 : 24;

  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, scaleTarget]);
  const opacityTransform = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const radiusTransform = useTransform(scrollYProgress, [0, 1], [0, radiusTarget]);

  const scale = shouldReduceMotion ? 1 : scaleTransform;
  const opacity = shouldReduceMotion ? 1 : opacityTransform;
  const borderRadius = shouldReduceMotion ? 0 : radiusTransform;

  return (
    <div className={`relative w-full ${className}`}>
      {/* ── 1. Pinned Sticky Hero (pinned to exact visible mobile viewport svh) ── */}
      <div
        className="sticky top-0 w-full overflow-hidden z-10"
        style={{ height: '100svh' }}
      >
        <motion.div
          style={{
            scale,
            opacity,
            borderRadius,
          }}
          className="w-full h-full origin-top overflow-hidden"
        >
          {hero}
        </motion.div>
      </div>

      {/* ── 2. Slide-Over Sheet (Selected Work) ── */}
      <div
        id={sheetId}
        ref={sheetRef}
        className="relative z-20 w-full bg-[#0A0A0A] border-t border-white/10 rounded-t-3xl md:rounded-t-[2rem] shadow-[0_-30px_80px_rgba(0,0,0,0.6)] pt-6 md:pt-8"
      >
        {/* ── 3. Top Center Handle Bar (40px wide, 4px tall, rounded, white/25, 16px bottom space) ── */}
        <div className="w-full flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-white/25" />
        </div>

        {sheet}
      </div>
    </div>
  );
}

