'use client';

import React, { useEffect, useState, useRef } from 'react';
import { onOpeningDone } from '@/lib/openingState';

/**
 * HangingBug
 * Drops down from the ceiling on a silk thread after the opening prerender completes.
 * When hovered, the bug and thread swing dynamically left and right like a pendulum.
 */
export default function HangingBug() {
  const [ready, setReady] = useState(false);
  const [swingState, setSwingState] = useState<'intro' | 'idle' | 'swinging' | 'settling'>('intro');
  const [swingKey, setSwingKey] = useState(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Trigger drop-down animation after opening sequence / prerendering finishes
    const unsub = onOpeningDone(() => {
      timer = setTimeout(() => {
        setReady(true);
      }, 300);
    });

    // Safety fallback: ensure bug reveals even if opening event is skipped
    const fallbackTimer = setTimeout(() => {
      setReady(true);
    }, 4500);

    return () => {
      unsub();
      if (timer) clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Transition from initial drop swing to calm idle sway after intro finishes
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      setSwingState((curr) => (curr === 'intro' ? 'idle' : curr));
    }, 3200);
    return () => clearTimeout(t);
  }, [ready]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setSwingKey((k) => k + 1);
    setSwingState('swinging');
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setSwingState('settling');
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'bug-pendulum-settle') {
      if (isHoveredRef.current) {
        setSwingKey((k) => k + 1);
        setSwingState('swinging');
      } else {
        setSwingState('idle');
      }
    }
  };

  const handleClick = () => {
    isHoveredRef.current = true;
    setSwingKey((k) => k + 1);
    setSwingState('swinging');
    setTimeout(() => {
      isHoveredRef.current = false;
      setSwingState('settling');
    }, 2600);
  };

  if (!ready) return null;

  return (
    <>
      <style>{`
        /* Initial drop from above the screen */
        @keyframes bug-drop {
          0%   { transform: translateY(-130px); opacity: 0; }
          10%  { opacity: 1; }
          60%  { transform: translateY(0px);    opacity: 1; }
          100% { transform: translateY(0px);    opacity: 1; }
        }

        /* Initial settling swings upon entrance */
        @keyframes bug-intro-swing {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(14deg); }
          30%  { transform: rotate(-10deg); }
          45%  { transform: rotate(7deg); }
          60%  { transform: rotate(-4deg); }
          75%  { transform: rotate(2deg); }
          90%  { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }

        /* Subtle ambient idle sway */
        @keyframes bug-idle {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(1.5deg); }
        }

        /* Active pendulum swing while hovered (swings left and right around ceiling pivot) */
        @keyframes bug-pendulum-swing {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(22deg); }
          50%  { transform: rotate(0deg); }
          75%  { transform: rotate(-22deg); }
          100% { transform: rotate(0deg); }
        }

        /* Natural pendulum damping when cursor leaves */
        @keyframes bug-pendulum-settle {
          0%   { transform: rotate(0deg); }
          18%  { transform: rotate(16deg); }
          38%  { transform: rotate(-12deg); }
          58%  { transform: rotate(7deg); }
          78%  { transform: rotate(-3deg); }
          90%  { transform: rotate(1.2deg); }
          100% { transform: rotate(0deg); }
        }

        .bug-wrapper {
          animation: bug-drop 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0s both;
          transform-origin: top center;
        }

        /* Pendulum arm: pivots directly from the top where thread connects to the ceiling */
        .bug-pendulum-arm {
          transform-origin: top center;
          will-change: transform;
        }

        .bug-pendulum-arm.is-intro {
          animation: bug-intro-swing 1.8s ease-in-out 1.4s both;
        }

        .bug-pendulum-arm.is-idle {
          animation: bug-idle 4s ease-in-out infinite;
        }

        .bug-pendulum-arm.is-swinging {
          animation: bug-pendulum-swing 1.35s ease-in-out infinite;
        }

        .bug-pendulum-arm.is-settling {
          animation: bug-pendulum-settle 1.6s ease-in-out forwards;
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .bug-wrapper,
          .bug-pendulum-arm {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }

        /* Mobile (<= 768px): positioned cleanly right after the GitHub icon */
        .bug-fixed-root {
          top: 0;
          left: clamp(126px, 34vw, 142px);
        }

        /* Desktop (> 768px): anchored in the open top-left area */
        @media (min-width: 769px) {
          .bug-fixed-root {
            left: clamp(60px, 8vw, 110px);
          }
        }
      `}</style>

      {/* Fixed container anchored to top-left */}
      <div
        className="bug-fixed-root fixed z-[9999] pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="bug-wrapper flex flex-col items-center">
          {/* Pendulum arm pivoting from top center (ceiling) */}
          <div
            key={swingState === 'swinging' ? `swing-${swingKey}` : swingState}
            className={`bug-pendulum-arm flex flex-col items-center ${
              swingState === 'swinging'
                ? 'is-swinging'
                : swingState === 'settling'
                ? 'is-settling'
                : swingState === 'idle'
                ? 'is-idle'
                : 'is-intro'
            }`}
            onAnimationEnd={handleAnimationEnd}
          >
            {/* Silk thread dangling from top */}
            <div className="w-px bg-zinc-400/60" style={{ height: '72px' }} />

            {/* Interactive Bug with generous hitbox */}
            <div
              className="pointer-events-auto cursor-pointer relative flex items-center justify-center transition-transform active:scale-95"
              style={{
                padding: '14px 22px',
                margin: '-14px -22px 0 -22px',
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              title="Poke me!"
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="22" cy="26" rx="12" ry="14" fill="#1a1a1a" stroke="#e5e5e5" strokeWidth="1.2" />
                <circle cx="22" cy="12" r="6" fill="#1a1a1a" stroke="#e5e5e5" strokeWidth="1.2" />
                <circle cx="19.5" cy="11" r="1.3" fill="white" />
                <circle cx="24.5" cy="11" r="1.3" fill="white" />
                <circle cx="19.8" cy="11.3" r="0.6" fill="#1a1a1a" />
                <circle cx="24.8" cy="11.3" r="0.6" fill="#1a1a1a" />
                <line x1="22" y1="12" x2="22" y2="39" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                <circle cx="17" cy="22" r="2.2" fill="#e5e5e5" opacity="0.8" />
                <circle cx="27" cy="22" r="2.2" fill="#e5e5e5" opacity="0.8" />
                <circle cx="16.5" cy="30" r="1.8" fill="#e5e5e5" opacity="0.6" />
                <circle cx="27.5" cy="30" r="1.8" fill="#e5e5e5" opacity="0.6" />
                <line x1="19" y1="7" x2="15" y2="2" stroke="#e5e5e5" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="14.5" cy="1.5" r="1.2" fill="#e5e5e5" />
                <line x1="25" y1="7" x2="29" y2="2" stroke="#e5e5e5" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="29.5" cy="1.5" r="1.2" fill="#e5e5e5" />
                <line x1="10" y1="20" x2="6"  y2="17" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="25" x2="5"  y2="25" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="30" x2="6"  y2="34" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" />
                <line x1="34" y1="20" x2="38" y2="17" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" />
                <line x1="34" y1="25" x2="39" y2="25" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" />
                <line x1="34" y1="30" x2="38" y2="34" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

