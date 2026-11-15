'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AboutMe.module.css';
import MusicCard, { SONGS } from './MusicCard';

/* ── CONFIGURABLE USER CONSTANTS (Edit as needed) ── */
export { SONGS };
export const LINKEDIN_URL = 'https://www.linkedin.com/in/vinitsi-2043-';
export const BLOG_URL = 'https://github.com/vinit-singh2007';
export const GITHUB_USERNAME = 'vinit-singh2007';

/**
 * Latest build card — update this whenever you ship something new.
 * `tag` is a small label shown above the title (e.g. "Project", "Blog", "Side build").
 */
export const LATEST_BUILD = {
  tag: 'Project',
  title: 'Day 0',
  description:
    'A career simulation platform that helps students and freshers experience real work before their first job.',
  url: 'https://day-0-delta.vercel.app/',
};

/**
 * Array of food image paths in /images/food/ (e.g. ['/images/food/food-1.jpg', ...]).
 * If empty, the Photos card displays a clean neutral gradient with zero text.
 */
export const FOOD_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=85&auto=format&fit=crop',
];

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      {/* Dot */}
      <circle cx="4.98" cy="5.01" r="2.48" />
      {/* Left bar */}
      <rect x="3" y="9.5" width="4" height="13.5" />
      {/* Right column */}
      <path d="M13.32 9.5h-4v13.5h4v-7.1c0-1.9 1.56-3.44 3.5-3.44s3.5 1.54 3.5 3.44v7.1h4v-7.86C24.32 11.6 20.9 9 17.18 9c-1.6 0-3.07.57-4.18 1.5V9.5z" />
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

  // Books auto-advance every 4s (paused when tab hidden or reduced motion)
  useEffect(() => {
    if (reducedMotion || BOOKS.length <= 1) return;

    let timer: NodeJS.Timeout | null = null;
    const startTimer = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setBookIndex((prev) => (prev + 1) % BOOKS.length);
      }, 4000);
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
          // Normalize to exactly 371 days (53 weeks), keeping start of year on the left and future days on the right
          const days = [...data.days];
          while (days.length < 371) {
            days.push({ level: 0 });
          }
          setHeatmapDays(days.slice(0, 371));
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
                <p className={styles.sectionText}>MUMBAI,INDIA</p>
              </div>

              {/* 2. What I do */}
              <div>
                <div className={styles.sectionLabel}>What I do</div>
                <p className={styles.sectionText}>
                  I build things end to end. I started with C and C++, then learned HTML, CSS and
                  JavaScript, and moved on to the MERN stack and beyond. Now I work across
                  full-stack, backend and AI/ML projects like Day 0, Delivr-X and DeepShield. I also
                  build hardware, like an ESP32 RFID reader, and ocean data pipelines for ORCA.
                </p>
              </div>

              {/* 3. How I think */}
              <div>
                <div className={styles.sectionLabel}>How I think</div>
                <p className={styles.sectionText}>
                  I learn by building. Every project on my GitHub is numbered because each one was
                  the next step up from the last. I&apos;d rather ship something rough and fix it
                  than wait until I understand everything. These days I build with AI as a teammate,
                  not a shortcut.
                </p>
              </div>

              {/* 4. Outside work */}
              <div>
                <div className={styles.sectionLabel}>Outside work</div>
                <p className={styles.sectionText}>
                  I&apos;m most at home in a hackathon, where a team, a deadline and a half-formed
                  idea turn into a working product overnight. I enter them often, and it&apos;s
                  where I learn fastest. Away from the screen, I play cricket and volleyball, and
                  BGMI when I want to switch off. I cook, I travel whenever I get the chance, and
                  music is how I unwind once the code is done.
                </p>
              </div>

              {/* 5. What's next */}
              <div>
                <div className={styles.sectionLabel}>What&apos;s next</div>
                <p className={styles.sectionText}>
                  Next, I&apos;m going deeper into AI and ML, building products where a model solves
                  a real problem and a full-stack app puts it in people&apos;s hands. I&apos;m already
                  working on this with DeepShield and ORCA, and I want to keep building from the
                  first dataset to the finished product.
                </p>
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
              <div className={styles.avatarCircle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/vinit-avatar.jpg"
                  alt="Vinit Singh"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    display: 'block',
                  }}
                />
              </div>
              <div>
                <div className="font-bold text-base text-zinc-100 dark:text-white leading-tight">
                  Vinit Singh
                </div>
                <div className="text-xs text-zinc-400 font-mono">@vinitsi-2043-</div>
              </div>
            </div>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              suppressHydrationWarning
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
            suppressHydrationWarning
            className={`${styles.pillButton} ${styles.focusOrange}`}
          >
            <span>View LinkedIn</span>
          </a>
        </div>

        {/* ══════════════════════════════════════════
            CARD 3: MUSIC (Column 3, row 1)
           ══════════════════════════════════════════ */}
        <MusicCard reducedMotion={reducedMotion} />

        {/* ══════════════════════════════════════════
            CARD 4: FOOD PHOTOS — full bleed slideshow
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardPhotos}`} aria-label="Food hobby">
          {FOOD_IMAGES.map((src, idx) => (
            <div
              key={src}
              className={styles.photoSlide}
              style={{ opacity: idx === photoIndex ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Food photo ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }}
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            CARD 5: LATEST BUILD (Column 3, row 2)
           ══════════════════════════════════════════ */}
        <div className={`${styles.cardBase} ${styles.cardBlog}`}>
          {/* Tag pill */}
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#FF6A1A',
              background: 'rgba(255,106,26,0.1)',
              border: '1px solid rgba(255,106,26,0.25)',
              borderRadius: '9999px',
              padding: '3px 10px',
            }}
          >
            {LATEST_BUILD.tag}
          </div>

          {/* Title link */}
          <a
            href={LATEST_BUILD.url}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className={`${styles.blogLink} ${styles.focusOrange}`}
          >
            <span>{LATEST_BUILD.title}</span>
            <ArrowRightIcon />
          </a>

          {/* Description */}
          <p className={styles.blogNote}>
            {LATEST_BUILD.description}
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
              <span>contributions this year</span>
            </div>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
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
