'use client';

import React, { useState, useEffect } from 'react';
import { setOpeningActive } from '@/lib/navSound';

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

function formatLocalTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? '0' + hours : '' + hours;
  const strMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
  const strSeconds = seconds < 10 ? '0' + seconds : '' + seconds;
  return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
}

function formatLocalDate(date: Date): string {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default function Opening() {
  const [timeStr, setTimeStr] = useState<string>(() => formatLocalTime(new Date()));
  const [dateStr, setDateStr] = useState<string>(() => formatLocalDate(new Date()));
  const [textOpacity, setTextOpacity] = useState<number>(0);
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    // Respect prefers-reduced-motion: skip opening entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsDone(true);
      setOpeningActive(false);
      return;
    }

    // Only run on homepage
    if (window.location.pathname !== '/') {
      setIsDone(true);
      setOpeningActive(false);
      return;
    }

    // Lock scrolling while opening sequence plays
    document.body.style.overflow = 'hidden';
    setOpeningActive(true);

    // Initial update with accurate visitor local time
    const now = new Date();
    setTimeStr(formatLocalTime(now));
    setDateStr(formatLocalDate(now));

    // Live clock ticking every 200ms
    const clockInterval = setInterval(() => {
      setTimeStr(formatLocalTime(new Date()));
    }, 200);

    // 1. Text fades in over ~0.9s
    const fadeInTimer = setTimeout(() => {
      setTextOpacity(1);
    }, 40);

    // 2 & 3. Hold for 2.6s in total, then split from middle
    const splitTimer = setTimeout(() => {
      setIsSplitting(true);
    }, 2600);

    // 4 & 5. After split finishes (1.3s duration), remove overlay and restore scroll
    const doneTimer = setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = '';
      setOpeningActive(false);
      clearInterval(clockInterval);
    }, 3950);

    return () => {
      clearInterval(clockInterval);
      clearTimeout(fadeInTimer);
      clearTimeout(splitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
      setOpeningActive(false);
    };
  }, []);

  if (isDone) return null;

  return (
    <>
      {/* Load Instrument Serif font from Google Fonts with Georgia fallback */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
      />

      <div
        className="opening-sequence-root"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          pointerEvents: isSplitting ? 'none' : 'auto',
          overflow: 'hidden',
        }}
      >
        {/* ── LEFT PANEL (50.3% wide, moves left: translateX(-101%)) ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '50.3%',
            backgroundColor: '#111111',
            overflow: 'hidden',
            transform: isSplitting ? 'translateX(-101%)' : 'translateX(0)',
            transition: isSplitting
              ? 'transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)'
              : 'none',
            willChange: 'transform',
          }}
        >
          {/* Inner container anchored to the screen's center line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '50vw',
                textAlign: 'right',
                paddingRight: '0.14em',
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 'clamp(24px, 5vw, 58px)',
                color: '#f3f3f3',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                opacity: textOpacity,
                transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'opacity',
              }}
            >
              <span suppressHydrationWarning>{timeStr}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (50.3% wide, moves right: translateX(101%)) ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '50.3%',
            backgroundColor: '#111111',
            overflow: 'hidden',
            transform: isSplitting ? 'translateX(101%)' : 'translateX(0)',
            transition: isSplitting
              ? 'transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)'
              : 'none',
            willChange: 'transform',
          }}
        >
          {/* Inner container anchored to the screen's center line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '50vw',
                textAlign: 'left',
                paddingLeft: '0.14em',
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 'clamp(24px, 5vw, 58px)',
                color: '#f3f3f3',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                opacity: textOpacity,
                transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'opacity',
              }}
            >
              <span suppressHydrationWarning>{dateStr}</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER LINE AT BOTTOM CENTRE ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            fontSize: '12px',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: isSplitting ? 0 : textOpacity,
            transition: isSplitting
              ? 'opacity 0.4s ease'
              : 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          <span style={{ color: '#888888' }}>The exact time you visited</span>{' '}
          <span style={{ color: '#555555' }}>AxeVin</span>
        </div>
      </div>
    </>
  );
}
