'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AboutMe.module.css';

/* ── CONFIGURABLE USER CONSTANTS (Edit as needed) ── */
export const LINKEDIN_URL = 'https://linkedin.com/in/vinitsi-2043-';
export const BLOG_URL = 'https://github.com/vinit-singh2007';
export const GITHUB_USERNAME = 'vinit-singh2007';

/**
 * Array of food image paths in /images/food/ (e.g. ['/images/food/food-1.jpg', ...]).
 * If empty, the Photos card displays a clean neutral gradient with zero text.
 */
export const FOOD_IMAGES: string[] = [];

/**
 * Books hobby slideshow — Open Library cover CDN URLs.
 * Each cycles automatically every 4 seconds.
 */
const BOOKS: { title: string; author: string; cover: string }[] = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://covers.openlibrary.org/b/id/10309343-L.jpg',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    cover: 'https://covers.openlibrary.org/b/id/8775241-L.jpg',
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    cover: 'https://covers.openlibrary.org/b/id/9255650-L.jpg',
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    cover: 'https://covers.openlibrary.org/b/id/8229139-L.jpg',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
  },
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    cover: 'https://covers.openlibrary.org/b/id/7892303-L.jpg',
  },
];

/* ── INLINE ICONS ── */
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  );
}

function CrescentMoonIcon() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6A1A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function AboutMe() {
  /* ── 1. Music Player State (Card 3) ── */
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  /* ── 2. Photos Slideshow State (Card 4) ── */
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  /* ── 2b. Books Slideshow State (Card 4 — Books) ── */
  const [bookIndex, setBookIndex] = useState<number>(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Preload next slideshow image
  useEffect(() => {
    if (FOOD_IMAGES.length > 1) {
      const nextIndex = (photoIndex + 1) % FOOD_IMAGES.length;
      const preloadImg = new window.Image();
      preloadImg.src = FOOD_IMAGES[nextIndex];
    }
  }, [photoIndex]);

  // Slideshow interval (5s, paused when tab hidden or reduced motion)
  useEffect(() => {
    if (FOOD_IMAGES.length <= 1 || reducedMotion) return;

    let timer: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setPhotoIndex((prev) => (prev + 1) % FOOD_IMAGES.length);
      }, 5000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion]);

  /* ── 3. GitHub Contributions State (Card 6) ── */
  const [contributionsCount, setContributionsCount] = useState<number | null>(null);
  const [heatmapDays, setHeatmapDays] = useState<{ level: number; date?: string }[]>(() =>
    // Prepopulate 53 weeks * 7 days = 371 cells at level 0 (avoids layout shift)
    Array.from({ length: 371 }, () => ({ level: 0 }))
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const res = await fetch(`/api/github-contributions?username=${encodeURIComponent(GITHUB_USERNAME)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        if (typeof data.totalContributions === 'number') {
          setContributionsCount(data.totalContributions);
        }

        if (Array.isArray(data.days) && data.days.length > 0) {
          // Normalize to exactly 371 days (53 weeks)
          const days = data.days.slice(-371);
          while (days.length < 371) {
            days.unshift({ level: 0 });
          }
          setHeatmapDays(days);
        }
      } catch {
        // Leave level 0 cells and hide count
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="about" className={styles.aboutSection} aria-label="About me">
      <div className={styles.bentoGrid}>
        {/* ══════════════════════════════════════════
            CARD 1: MAIN (Column 1, spans all 3 rows)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardMain}`}>
          <div>
            <h2 className={styles.mainHeading}>What I&apos;m about.</h2>

            <div className={styles.sectionGroup}>
              {/* 1. Where I'm from */}
              <div>
                <div className={styles.sectionLabel}>Where I&apos;m from</div>
                <p className={styles.sectionText}>[REPLACE WITH MY CITY AND COUNTRY LINE]</p>
              </div>

              {/* 2. What I do */}
              <div>
                <div className={styles.sectionLabel}>What I do</div>
                <p className={styles.sectionText}>
                  I build full-stack and AI/ML projects.{' '}
                  <strong className={styles.strongText}>Day 0</strong> is a career simulation platform
                  for students and freshers.{' '}
                  <strong className={styles.strongText}>Delivr-X</strong> dispatches drone fleets
                  across dense urban airspace.{' '}
                  <strong className={styles.strongText}>DeepShield</strong> checks uploaded videos for
                  deepfakes.{' '}
                  <strong className={styles.strongText}>Mirror Memory</strong> is an ESP32 RFID asset
                  reader I built on real hardware.
                </p>
              </div>

              {/* 3. How I think */}
              <div>
                <div className={styles.sectionLabel}>How I think</div>
                <p className={styles.sectionText}>[REPLACE WITH MY OWN SHORT LINE]</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CARD 2: PROFILE (Column 2, row 1)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardProfile}`}>
          {/* Top Row: Avatar + Name + LinkedIn Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={styles.avatarCircle} aria-hidden="true">
                AV
              </div>
              <div>
                <div className="font-bold text-base text-zinc-100 dark:text-white leading-tight">
                  AxeVin
                </div>
                <div className="text-xs text-zinc-400 font-mono">@{GITHUB_USERNAME}</div>
              </div>
            </div>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className={`${styles.linkedInBadge} ${styles.focusOrange}`}
            >
              <LinkedInIcon />
            </a>
          </div>

          {/* One-line bio */}
          <p className="text-sm text-zinc-300 dark:text-zinc-300 leading-relaxed my-4">
            Full Stack Developer building web apps, AI/ML tools and hardware experiments.
          </p>

          {/* Outlined Pill Button */}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.pillButton} ${styles.focusOrange}`}
          >
            <span>View LinkedIn</span>
          </a>
        </div>

        {/* ══════════════════════════════════════════
            CARD 3: MUSIC (Column 3, row 1)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardMusic}`}>
          {/* Vinyl Record */}
          <div
            className={`${styles.vinylDisc} ${isPlaying && !reducedMotion ? styles.vinylPlaying : ''}`}
            aria-hidden="true"
          >
            <div className={styles.vinylCenterLabel}>
              <div className={styles.vinylCenterHole} />
            </div>
          </div>

          {/* Tonearm */}
          <div
            className={`${styles.tonearm} ${
              isPlaying && !reducedMotion ? styles.tonearmPlaying : styles.tonearmStopped
            }`}
            aria-hidden="true"
          >
            <svg width="32" height="72" viewBox="0 0 32 72" fill="none">
              {/* Pivot */}
              <circle cx="26" cy="6" r="5" fill="#d1d5db" />
              <circle cx="26" cy="6" r="2.5" fill="#374151" />
              {/* Arm */}
              <path d="M26 6 L12 50 L8 64" stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" />
              {/* Cartridge */}
              <rect x="3" y="60" width="8" height="10" rx="1.5" fill="#FF6A1A" transform="rotate(-15 7 65)" />
            </svg>
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-pressed={isPlaying}
            className={`${styles.musicPill} ${styles.focusOrange}`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          {/* Track Info */}
          <div className={styles.musicTrackInfo}>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Your favourite track
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">Artist name</div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CARD 4: PHOTOS (Column 2, row 2)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardPhotos}`}>
          {FOOD_IMAGES.length > 0 ? (
            <>
              {FOOD_IMAGES.map((src, idx) => (
                <div
                  key={src}
                  className={styles.photoSlide}
                  style={{
                    opacity: idx === photoIndex ? 1 : 0,
                    pointerEvents: idx === photoIndex ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 980px) 50vw, 30vw"
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Bottom gradient mask for contrast with indicator dots */}
              <div
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Indicator dots */}
              {FOOD_IMAGES.length > 1 && (
                <div className={styles.photoIndicatorRow} aria-hidden="true">
                  {FOOD_IMAGES.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={styles.photoDot}
                      style={{
                        backgroundColor: dotIdx === photoIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.33)',
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Neutral gradient fallback when folder/array is empty (Zero text) */
            <div
              className="w-full h-full min-h-[310px] bg-gradient-to-br from-[#1c1c20] via-[#151518] to-[#0c0c0e]"
              aria-hidden="true"
            />
          )}
        </div>

        {/* ══════════════════════════════════════════
            CARD 5: BLOG (Column 3, row 2)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardBlog}`}>
          {/* Crescent Moon Icon */}
          <div aria-hidden="true">
            <CrescentMoonIcon />
          </div>

          {/* Latest build link */}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.blogLink} ${styles.focusOrange}`}
          >
            <span>Latest build</span>
            <ArrowRightIcon />
          </a>

          {/* Short note */}
          <p className={styles.blogNote}>
            A short note on what you are building right now and what you learned from it.
          </p>
        </div>

        {/* ══════════════════════════════════════════
            CARD 6: GITHUB CONTRIBUTIONS (Cols 2-3, row 3)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardGithub}`}>
          {/* Header Row */}
          <div className={styles.githubHeader}>
            <div className={styles.githubCountText}>
              {contributionsCount !== null && (
                <span className={styles.githubCountBold}>
                  {contributionsCount.toLocaleString()}
                </span>
              )}
              <span>contributions in the last year</span>
            </div>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.githubProfileLink} ${styles.focusOrange}`}
            >
              <span>{GITHUB_USERNAME} on GitHub</span>
              <ArrowRightIcon />
            </a>
          </div>

          {/* Heatmap Grid (7 rows x 53 columns) */}
          <div className={styles.githubHeatmapWrapper}>
            <div
              className={styles.githubHeatmapGrid}
              role="img"
              aria-label="GitHub Contributions heatmap for the last year"
            >
              {heatmapDays.map((day, idx) => (
                <div
                  key={idx}
                  className={styles.heatmapCell}
                  style={{
                    backgroundColor: `var(--gh-level-${day.level})`,
                  }}
                  title={day.date ? `${day.date}` : undefined}
                />
              ))}
            </div>
          </div>

          {/* Legend: Less -> 5 Pink Squares -> More */}
          <div className={styles.heatmapLegend} aria-hidden="true">
            <span>Less</span>
            <span className={styles.legendSquare} style={{ backgroundColor: 'var(--gh-level-0)' }} />
            <span className={styles.legendSquare} style={{ backgroundColor: 'var(--gh-level-1)' }} />
            <span className={styles.legendSquare} style={{ backgroundColor: 'var(--gh-level-2)' }} />
            <span className={styles.legendSquare} style={{ backgroundColor: 'var(--gh-level-3)' }} />
            <span className={styles.legendSquare} style={{ backgroundColor: 'var(--gh-level-4)' }} />
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
