'use client';

import React, { useState, useEffect } from 'react';
import styles from './SocialRail.module.css';

/* ── CONFIGURABLE SOCIAL URL CONSTANTS (Edit as needed) ── */
export const SOCIAL_URLS = {
  LINKEDIN_URL: 'https://linkedin.com/in/vinitsi-2043-',
  GITHUB_URL: 'https://github.com/vinit-singh2007',
  X_URL: 'https://x.com/AxeVinSi',
};

// Module-level guard: ensures animation only plays on full page load, not in-app route changes
let hasAnimatedOnce = false;

/* ── 20px Brand SVG Icons (Filled with currentColor) ── */
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function SocialRail() {
  const [animState, setAnimState] = useState<'init' | 'lines' | 'split' | 'icons' | 'done'>(() => {
    return hasAnimatedOnce ? 'done' : 'init';
  });

  useEffect(() => {
    if (hasAnimatedOnce) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      hasAnimatedOnce = true;
      setAnimState('done');
      return;
    }

    // Step 1: 150ms -> both lines draw in from center outward
    const t1 = setTimeout(() => setAnimState('lines'), 150);

    // Step 2: 1250ms -> the split, middle gap expands to 204px
    const t2 = setTimeout(() => setAnimState('split'), 1250);

    // Step 3: 1900ms -> icons appear with stagger
    const t3 = setTimeout(() => setAnimState('icons'), 1900);

    // Step 4: 3000ms -> animation done, staggers cleared, pointer-events enabled
    const t4 = setTimeout(() => {
      hasAnimatedOnce = true;
      setAnimState('done');
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const stateClass =
    animState === 'lines'
      ? styles.isLines
      : animState === 'split'
      ? styles.isSplit
      : animState === 'icons'
      ? styles.isIcons
      : animState === 'done'
      ? styles.isDone
      : '';

  return (
    <aside className={`${styles.rail} ${stateClass}`} aria-label="Social links">
      {/* 1. TOP LINE: 1px wide, flex: 1, gradient transparent -> line color */}
      <div className={styles.topLine} aria-hidden="true" />

      {/* 2. MIDDLE GAP: 48px wide box holding the icons */}
      <div className={styles.gapBox}>
        <div className={styles.iconList}>
          {/* LinkedIn */}
          <a
            href={SOCIAL_URLS.LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            suppressHydrationWarning
            className={styles.iconLink}
          >
            <LinkedInIcon />
          </a>

          {/* GitHub */}
          <a
            href={SOCIAL_URLS.GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            suppressHydrationWarning
            className={styles.iconLink}
          >
            <GitHubIcon />
          </a>

          {/* X */}
          <a
            href={SOCIAL_URLS.X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            suppressHydrationWarning
            className={styles.iconLink}
          >
            <XIcon />
          </a>
        </div>
      </div>

      {/* 3. BOTTOM LINE: 1px wide, flex: 1, gradient line color -> transparent */}
      <div className={styles.bottomLine} aria-hidden="true" />
    </aside>
  );
}
