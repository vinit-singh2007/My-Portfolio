'use client';

import React, { useEffect, useRef } from 'react';

export default function FooterWordmark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    isTouchRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none)').matches;

    // Handle prefers-reduced-motion: fixed soft light at center
    if (prefersReducedMotion) {
      const rect = container.getBoundingClientRect();
      container.style.setProperty('--mx', `${rect.width * 0.5}px`);
      container.style.setProperty('--my', `${rect.height * 0.55}px`);
      return;
    }

    const startIdleDrift = () => {
      if (rafIdRef.current !== null) return;

      const animate = (timestamp: number) => {
        if (!isVisibleRef.current) {
          rafIdRef.current = null;
          return;
        }

        if ((!isHoveredRef.current || isTouchRef.current) && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const mx = ((Math.sin(timestamp / 1800) + 1) / 2) * rect.width;
            const my = rect.height * 0.55;
            containerRef.current.style.setProperty('--mx', `${mx}px`);
            containerRef.current.style.setProperty('--my', `${my}px`);
          }
        }

        rafIdRef.current = requestAnimationFrame(animate);
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const stopIdleDrift = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    // Pause the idle requestAnimationFrame loop when footer is off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!isHoveredRef.current || isTouchRef.current) {
            startIdleDrift();
          }
        } else {
          stopIdleDrift();
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      stopIdleDrift();
    };
  }, []);

  const handleMouseEnter = () => {
    if (isTouchRef.current) return;
    isHoveredRef.current = true;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    container.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current) return;
    isHoveredRef.current = false;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty('--mx', `${rect.width * 0.5}px`);
        containerRef.current.style.setProperty('--my', `${rect.height * 0.55}px`);
      }
      return;
    }

    if (isVisibleRef.current && rafIdRef.current === null) {
      const animate = (timestamp: number) => {
        if (!isVisibleRef.current || isHoveredRef.current) {
          rafIdRef.current = null;
          return;
        }

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const mx = ((Math.sin(timestamp / 1800) + 1) / 2) * rect.width;
            const my = rect.height * 0.55;
            containerRef.current.style.setProperty('--mx', `${mx}px`);
            containerRef.current.style.setProperty('--my', `${my}px`);
          }
        }

        rafIdRef.current = requestAnimationFrame(animate);
      };

      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="footer-wordmark-container relative select-none overflow-hidden text-center whitespace-nowrap my-2 sm:my-3 -mx-[6px]"
      style={
        {
          '--mx': '-400px',
          '--my': '-400px',
        } as React.CSSProperties
      }
    >
      {/* Base layer */}
      <div className="footer-wordmark-text text-white/[0.12]">
        AxeVin
      </div>

      {/* Light layer */}
      <div className="footer-wordmark-text footer-wordmark-light absolute inset-0 pointer-events-none">
        AxeVin
      </div>
    </div>
  );
}

