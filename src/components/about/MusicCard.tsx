'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AboutMe.module.css';

/**
 * ── SONG LIST (supports 20 or more songs) ──
 * Add, remove or edit tracks here.
 * Optional fields per song:
 *   src: "/audio/song-name.mp3"        (plays full-length file from public/audio/)
 *   cover: "/audio/covers/cover.jpg"   (custom album art from public/audio/covers/)
 *   color: "#7a1a1a"                   (fallback hex color if canvas extraction fails)
 */
export interface SongDefinition {
  artist: string;
  title: string;
  src?: string;
  cover?: string;
  color?: string;
  startTime?: number;
}

export const SONGS: SongDefinition[] = [
  { artist: 'The Weeknd', title: 'Starboy' },
  { artist: 'Arctic Monkeys', title: 'I Wanna Be Yours' },
  {
    artist: 'Ed Sheeran',
    title: 'Shape of You',
    src: '/audio/shape-of-you.mp3',
    cover:
      'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg',
    startTime: 0,
  },
  { artist: 'Karan Aujla', title: 'Winning Speech' },
  { artist: 'Shubh', title: 'Cheques' },
  { artist: 'Imagine Dragons', title: 'Believer' },
  { artist: 'Sidhu Moose Wala', title: '295' },
  { artist: 'Travis Scott', title: 'FE!N' },
  { artist: 'Shubh', title: 'We Rollin' },
  { artist: 'The Weeknd', title: 'Popular' },
  {
    artist: 'Dhanda Nyoliwala',
    title: 'Knife Brows (Remix)',
  },
  // [MORE SONGS I WILL ADD HERE]
];

interface ResolvedSong {
  artist: string;
  title: string;
  audioUrl: string;
  coverUrl: string;
  colorHex?: string;
  startTime?: number;
  h: number;
  s: number;
}

interface MusicCardProps {
  reducedMotion?: boolean;
}

/* ── RGB / HEX to HSL Helpers ── */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  let r = 31,
    g = 31,
    b = 34;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }
  return rgbToHsl(r, g, b);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/* ── Dominant Color Extraction from 24x24 Canvas ── */
function extractDominantColor(
  coverUrl: string,
  fallbackHex?: string
): Promise<{ h: number; s: number }> {
  return new Promise((resolve) => {
    const defaultCharcoal = hexToHsl('#1f1f22');

    const resolveFallback = () => {
      if (fallbackHex) {
        try {
          const [h, s] = hexToHsl(fallbackHex);
          resolve({ h, s });
          return;
        } catch {
          // ignore
        }
      }
      resolve({ h: defaultCharcoal[0], s: defaultCharcoal[1] });
    };

    if (!coverUrl) {
      resolveFallback();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolveFallback();
          return;
        }

        ctx.drawImage(img, 0, 0, 24, 24);
        const { data } = ctx.getImageData(0, 0, 24, 24);

        // 12 hue buckets of 30deg
        const buckets: { hList: number[]; sList: number[] }[] = Array.from(
          { length: 12 },
          () => ({ hList: [], sList: [] })
        );

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const [h, s, l] = rgbToHsl(r, g, b);

          // Ignore pixels: lightness < 8%, lightness > 92%, saturation < 12%
          if (l < 8 || l > 92 || s < 12) {
            continue;
          }

          const bucketIdx = Math.floor(h / 30) % 12;
          buckets[bucketIdx].hList.push(h);
          buckets[bucketIdx].sList.push(s);
        }

        let bestBucket = -1;
        let maxCount = 0;
        for (let b = 0; b < buckets.length; b++) {
          if (buckets[b].hList.length > maxCount) {
            maxCount = buckets[b].hList.length;
            bestBucket = b;
          }
        }

        if (bestBucket === -1 || maxCount === 0) {
          resolveFallback();
          return;
        }

        const hList = buckets[bestBucket].hList;
        const sList = buckets[bestBucket].sList;
        let sinSum = 0;
        let cosSum = 0;
        let sSum = 0;

        for (let j = 0; j < hList.length; j++) {
          const rad = (hList[j] * Math.PI) / 180;
          sinSum += Math.sin(rad);
          cosSum += Math.cos(rad);
          sSum += sList[j];
        }

        let avgH = (Math.atan2(sinSum / hList.length, cosSum / hList.length) * 180) / Math.PI;
        if (avgH < 0) avgH += 360;
        const avgS = sSum / sList.length;

        resolve({ h: Math.round(avgH), s: Math.round(avgS) });
      } catch {
        resolveFallback();
      }
    };

    img.onerror = () => {
      resolveFallback();
    };

    img.src = coverUrl;
  });
}

/* ── iTunes Lookup with Country=IN then Country=US fallback ── */
async function lookupItunes(
  song: SongDefinition
): Promise<{ trackName: string; artistName: string; cover: string; previewUrl: string } | null> {
  const cleanTitle = song.title.replace(/[!]/g, '');
  const terms = [`${song.artist} ${cleanTitle}`, `${song.artist} ${song.title}`];

  for (const country of ['IN', 'US']) {
    for (const term of terms) {
      const directUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
        term
      )}&entity=song&limit=5&country=${country}`;
      let data: any = null;

      try {
        const res = await fetch(directUrl);
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Fallback to project serverless proxy
        try {
          const fallbackRes = await fetch(
            `/api/itunes-search?term=${encodeURIComponent(term)}&limit=5&country=${country}`
          );
          if (fallbackRes.ok) {
            data = await fallbackRes.json();
          }
        } catch {
          // ignore
        }
      }

      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const aLower = song.artist.toLowerCase();
        const tLower = song.title.toLowerCase();

        // 1. Match both artist and title (including featured artist in track name)
        let match = data.results.find((r: any) => {
          if (!r.previewUrl) return false;
          const rArtist = (r.artistName || '').toLowerCase();
          const rTrack = (r.trackName || '').toLowerCase();
          return (
            (rArtist.includes(aLower) || aLower.includes(rArtist) || rTrack.includes(aLower)) &&
            (rTrack.includes(tLower) || tLower.includes(rTrack))
          );
        });

        // 2. Match artist with previewUrl
        if (!match) {
          match = data.results.find((r: any) => {
            if (!r.previewUrl) return false;
            const rArtist = (r.artistName || '').toLowerCase();
            const rTrack = (r.trackName || '').toLowerCase();
            return rArtist.includes(aLower) || aLower.includes(rArtist) || rTrack.includes(aLower);
          });
        }

        // 3. Fallback to first result with previewUrl
        if (!match) {
          match = data.results.find((r: any) => Boolean(r.previewUrl));
        }

        if (match && match.previewUrl) {
          const displayedArtist =
            match.artistName && match.artistName.toLowerCase().includes(aLower)
              ? match.artistName
              : song.artist;

          return {
            trackName: match.trackName || song.title,
            artistName: displayedArtist,
            cover: (match.artworkUrl100 || '').replace('100x100', '600x600'),
            previewUrl: match.previewUrl,
          };
        }
      }
    }
  }

  return null;
}

export default function MusicCard({ reducedMotion = false }: MusicCardProps) {
  const [resolvedSongs, setResolvedSongs] = useState<Record<number, ResolvedSong | null>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Background crossfade state
  const [currentColor, setCurrentColor] = useState<{ h: number; s: number }>({ h: 240, s: 25 });
  const [prevColor, setPrevColor] = useState<{ h: number; s: number }>({ h: 240, s: 25 });
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayOnIndexChange = useRef<boolean>(false);
  const userWantsPlay = useRef<boolean>(false);
  const fetchingIndices = useRef<Set<number>>(new Set());

  /* ── Resolve a Single Song (from cache, local src, or iTunes) ── */
  const resolveSong = useCallback(async (index: number): Promise<ResolvedSong | null> => {
    if (index < 0 || index >= SONGS.length) return null;
    const songDef = SONGS[index];
    const cacheKey = `turntable_v2_${songDef.artist}_${songDef.title}`;

    // 1. Check sessionStorage
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as ResolvedSong;
        setResolvedSongs((prev) => ({ ...prev, [index]: parsed }));
        return parsed;
      }
    } catch {
      // sessionStorage unavailable
    }

    // 2. Local src file
    if (songDef.src) {
      const cover = songDef.cover || '';
      const color = await extractDominantColor(cover, songDef.color);
      const resolved: ResolvedSong = {
        artist: songDef.artist,
        title: songDef.title,
        audioUrl: songDef.src,
        coverUrl: cover,
        colorHex: songDef.color,
        startTime: songDef.startTime,
        h: color.h,
        s: color.s,
      };

      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(resolved));
      } catch { }

      setResolvedSongs((prev) => ({ ...prev, [index]: resolved }));
      return resolved;
    }

    // 3. iTunes Search API (1 song at a time)
    if (fetchingIndices.current.has(index)) return null;
    fetchingIndices.current.add(index);

    const itunesResult = await lookupItunes(songDef);
    fetchingIndices.current.delete(index);

    if (itunesResult && itunesResult.previewUrl) {
      const color = await extractDominantColor(itunesResult.cover, songDef.color);
      const resolved: ResolvedSong = {
        artist: itunesResult.artistName,
        title: itunesResult.trackName,
        audioUrl: itunesResult.previewUrl,
        coverUrl: itunesResult.cover,
        colorHex: songDef.color,
        startTime: songDef.startTime,
        h: color.h,
        s: color.s,
      };

      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(resolved));
      } catch { }

      setResolvedSongs((prev) => ({ ...prev, [index]: resolved }));
      return resolved;
    }

    return null;
  }, []);

  /* ── 1. Initial Load: Fetch Song 0 Only ── */
  useEffect(() => {
    let isMounted = true;

    async function loadFirst() {
      const first = await resolveSong(0);
      if (first && isMounted) {
        setCurrentColor({ h: first.h, s: first.s });
        setPrevColor({ h: first.h, s: first.s });
      }
    }

    loadFirst();

    return () => {
      isMounted = false;
    };
  }, [resolveSong]);

  /* ── 2. Background Prefetch of Next Song (Rate-limit friendly) ── */
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % SONGS.length;
    if (!resolvedSongs[nextIdx]) {
      // Prefetch next song with a calm 1.5s delay to strictly avoid burst limits
      const timer = setTimeout(() => {
        resolveSong(nextIdx);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, resolvedSongs, resolveSong]);

  /* ── 3. Handle Color Transition when Current Track Changes ── */
  useEffect(() => {
    const current = resolvedSongs[currentIndex];
    if (current) {
      setPrevColor(currentColor);
      setCurrentColor({ h: current.h, s: current.s });
      setIsCrossfading(true);

      const timer = setTimeout(() => {
        setIsCrossfading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, resolvedSongs]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 4. Audio Playback on Track Change ── */
  useEffect(() => {
    const audio = audioRef.current;
    const current = resolvedSongs[currentIndex];
    if (!audio || !current?.audioUrl) return;

    if (audio.src !== current.audioUrl) {
      audio.src = current.audioUrl;
      audio.load();
      if (typeof current.startTime === 'number') {
        audio.currentTime = current.startTime;
      }
    }

    if (pendingPlayOnIndexChange.current || userWantsPlay.current) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      pendingPlayOnIndexChange.current = false;
    }
  }, [currentIndex, resolvedSongs]);

  /* ── 5. Navigation (Prev / Next with Continuous Loop) ── */
  const goToTrack = useCallback(
    async (targetIdx: number, autoPlay: boolean) => {
      const wrappedIdx = ((targetIdx % SONGS.length) + SONGS.length) % SONGS.length;

      // If single song in list: loop it seamlessly from the start
      if (SONGS.length === 1 && autoPlay) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => { });
        }
        return;
      }

      pendingPlayOnIndexChange.current = autoPlay;

      let resolved: ResolvedSong | null | undefined = resolvedSongs[wrappedIdx];
      if (!resolved) {
        resolved = await resolveSong(wrappedIdx);
      }

      // If track has no playable audio, skip forward to next valid song in continuous loop
      if (!resolved?.audioUrl && autoPlay && userWantsPlay.current) {
        const nextCandidate = (wrappedIdx + 1) % SONGS.length;
        if (nextCandidate !== wrappedIdx) {
          goToTrack(nextCandidate, true);
          return;
        }
      }

      setCurrentIndex(wrappedIdx);
    },
    [resolvedSongs, resolveSong]
  );

  const handlePrev = useCallback(() => {
    goToTrack(currentIndex - 1, userWantsPlay.current);
  }, [currentIndex, goToTrack]);

  const handleNext = useCallback(() => {
    goToTrack(currentIndex + 1, userWantsPlay.current);
  }, [currentIndex, goToTrack]);

  /* ── 6. Play / Pause Toggle ── */
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userWantsPlay.current = false;
      pendingPlayOnIndexChange.current = false;
      audio.pause();
      setIsPlaying(false);
    } else {
      userWantsPlay.current = true;
      let current = resolvedSongs[currentIndex];
      if (!current) {
        current = await resolveSong(currentIndex);
      }
      if (current?.audioUrl) {
        if (audio.src !== current.audioUrl) {
          audio.src = current.audioUrl;
          audio.load();
        }
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  /* ── 7. Automatic Advance when Song Ends (Continuous Loop until Paused) ── */
  const handleSongEnded = useCallback(() => {
    if (userWantsPlay.current) {
      goToTrack(currentIndex + 1, true);
    }
  }, [currentIndex, goToTrack]);

  const handleAudioError = useCallback(async () => {
    const songDef = SONGS[currentIndex];
    const current = resolvedSongs[currentIndex];

    // If custom local src is missing/failed, fallback gracefully to online preview
    if (songDef?.src && current?.audioUrl === songDef.src) {
      const itunesResult = await lookupItunes(songDef);
      if (itunesResult?.previewUrl && audioRef.current) {
        const color = await extractDominantColor(itunesResult.cover, songDef.color);
        const fallbackResolved: ResolvedSong = {
          artist: songDef.artist,
          title: songDef.title,
          audioUrl: itunesResult.previewUrl,
          coverUrl: itunesResult.cover,
          colorHex: songDef.color,
          startTime: songDef.startTime,
          h: color.h,
          s: color.s,
        };
        setResolvedSongs((prev) => ({ ...prev, [currentIndex]: fallbackResolved }));
        audioRef.current.src = itunesResult.previewUrl;
        audioRef.current.load();
        if (userWantsPlay.current) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        return;
      }
    }

    if (userWantsPlay.current) {
      goToTrack(currentIndex + 1, true);
    }
  }, [currentIndex, goToTrack, resolvedSongs]);

  /* ── 8. Cleanup on Unmount ── */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const currentSong = resolvedSongs[currentIndex];
  const canPlay = Boolean(currentSong?.audioUrl);

  // Compute CSS variables for the plinth
  const { h, s } = currentColor;
  const sBg1 = clamp(s * 0.55, 25, 55);
  const sBg2 = clamp(s * 0.6, 25, 55);
  const sKey1 = clamp(s * 0.4, 18, 40);
  const sKey2 = clamp(s * 0.4, 18, 40);
  const sKeyEdge = clamp(s * 0.4, 18, 40);

  const prevH = prevColor.h;
  const prevS = prevColor.s;
  const prevBg1 = `hsl(${prevH}, ${clamp(prevS * 0.55, 25, 55)}%, 17%)`;
  const prevBg2 = `hsl(${prevH}, ${clamp(prevS * 0.6, 25, 55)}%, 9%)`;
  const currBg1 = `hsl(${h}, ${sBg1}%, 17%)`;
  const currBg2 = `hsl(${h}, ${sBg2}%, 9%)`;

  const dynamicStyle = {
    '--bg1': currBg1,
    '--bg2': currBg2,
    '--key1': `hsl(${h}, ${sKey1}%, 25%)`,
    '--key2': `hsl(${h}, ${sKey2}%, 16%)`,
    '--keyEdge': `hsl(${h}, ${sKeyEdge}%, 10%)`,
    '--artist': `hsl(${h}, 15%, 60%)`,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.cardBase} ${styles.cardMusic}`}
      style={dynamicStyle}
      aria-label="Vinyl Turntable"
    >
      {/* ── Crossfading Background Layers ── */}
      <div
        className={styles.turntableBgLayer}
        style={{
          background: `linear-gradient(145deg, ${prevBg1}, ${prevBg2})`,
          opacity: isCrossfading ? 0 : 1,
          transition: reducedMotion ? 'none' : 'opacity 0.8s ease',
        }}
      />
      <div
        className={styles.turntableBgLayer}
        style={{
          background: `linear-gradient(145deg, ${currBg1}, ${currBg2})`,
          opacity: isCrossfading ? 1 : 0,
          transition: reducedMotion ? 'none' : 'opacity 0.8s ease',
        }}
      />

      {/* Hidden native HTML audio element (preload="none", NO autoplay) */}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (audioRef.current?.ended) return;
          setIsPlaying(false);
        }}
        onEnded={handleSongEnded}
        onError={handleAudioError}
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      {/* ── Circular Platter & Record (Left side) ── */}
      <div className={styles.platterContainer} aria-hidden="true">
        {/* Silver Chrome Rim (Static) */}
        <div className={styles.chromeRim} />

        {/* Vinyl Record (Rotates ONLY while playing) */}
        <div
          className={`${styles.recordDisc} ${isPlaying && !reducedMotion ? styles.recordPlaying : ''
            }`}
        >
          {/* Record Label in Centre with Cover Art */}
          <div className={styles.centerLabel}>
            {currentSong?.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSong.coverUrl}
                alt=""
                aria-hidden="true"
                className={styles.centerCoverImg}
              />
            ) : null}
            {/* Spindle hole in center */}
            <div className={styles.spindleHole} />
          </div>
        </div>

        {/* Static Specular Light Sheen Overlay (Does NOT rotate) */}
        <div className={styles.staticSheen} />
      </div>

      {/* ── Realistic Tonearm (Top Right) ── */}
      <div className={styles.speedSelectorDot} aria-hidden="true" />
      <div className={styles.tonearmPivot} aria-hidden="true">
        <div className={styles.pivotRing}>
          <div className={styles.pivotKnob} />
        </div>
      </div>
      <div
        className={`${styles.tonearmArm} ${isPlaying ? styles.armPlaying : styles.armStopped
          }`}
        style={reducedMotion ? { transition: 'none' } : undefined}
        aria-hidden="true"
      >
        <div className={styles.headshell}>
          <div className={styles.stylusTip} />
        </div>
      </div>

      {/* ── Song Title + Artist (Sitting at ~61cqw from top, left 62cqw) ── */}
      <div className={styles.trackInfoBlock}>
        <div
          className={styles.trackTitle}
          title={currentSong ? currentSong.title : SONGS[currentIndex]?.title || 'Track'}
        >
          {currentSong ? currentSong.title : SONGS[currentIndex]?.title || 'Loading track...'}
        </div>
        <div
          className={styles.trackArtist}
          title={currentSong ? currentSong.artist : SONGS[currentIndex]?.artist || ''}
        >
          {currentSong ? currentSong.artist : SONGS[currentIndex]?.artist || ''}
        </div>
      </div>

      {/* ── Turntable Bottom Controls (Row at ~87cqw from top) ── */}
      <div className={styles.turntableControls}>
        {/* Left: Play/Pause Empty Key + Warm Yellow Indicator Dot */}
        <div className={styles.leftControls}>
          <div className={styles.buttonWrapper}>
            <button
              type="button"
              suppressHydrationWarning
              onClick={togglePlay}
              disabled={!canPlay}
              aria-pressed={isPlaying}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className={`${styles.plinthButton} ${styles.playButton} ${styles.focusOrange}`}
            />
            <span className={styles.btnSubLabel}>
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </span>
          </div>

          {/* Indicator Dot */}
          <div
            className={`${styles.indicatorDot} ${isPlaying ? styles.indicatorPlaying : styles.indicatorPaused
              }`}
            aria-hidden="true"
            title={isPlaying ? 'Turntable active' : 'Turntable paused'}
          />
        </div>

        {/* Right: Previous & Next Empty Raised Pills with Sublabel Icons */}
        <div className={styles.rightControls}>
          <div className={styles.buttonWrapper}>
            <button
              type="button"
              suppressHydrationWarning
              onClick={handlePrev}
              aria-label="Previous track"
              title="Previous track"
              className={`${styles.plinthButton} ${styles.skipButton} ${styles.focusOrange}`}
            />
            <span className={styles.btnSubLabel} aria-hidden="true">
              <svg className={styles.btnSubLabelIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </span>
          </div>

          <div className={styles.buttonWrapper}>
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleNext}
              aria-label="Next track"
              title="Next track"
              className={`${styles.plinthButton} ${styles.skipButton} ${styles.focusOrange}`}
            />
            <span className={styles.btnSubLabel} aria-hidden="true">
              <svg className={styles.btnSubLabelIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
