'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import ThreeBackground from './ThreeBackground';
import SocialRail from './SocialRail';
import SoundToggle from './SoundToggle';
import { onOpeningReveal } from '@/lib/openingState';
import dynamic from 'next/dynamic';

const HangingBug = dynamic(() => import('./HangingBug'), { ssr: false });

const FULL_HEADLINE = "YO I'M VINIT";
const FULL_SUBTITLE = 'Full Stack Engineer & AI Systems Developer';
const FULL_TEXT =
  'Architecting end-to-end web platforms, resilient backends and intelligent ML-driven applications, engineered from low-level C and C++ fundamentals up to the modern MERN stack.';
const ORANGE_WORD = 'Architecting';
const TYPING_SPEED_MS = 18;
const TYPING_START_DELAY_MS = 500;

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  /* ── Typewriter state for all 3 hero texts ── */
  const shouldReduceMotion = useReducedMotion();
  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [headlineDone, setHeadlineDone] = useState(false);
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [subtitleDone, setSubtitleDone] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Simultaneous Typewriter effect ── */
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedHeadline(FULL_HEADLINE);
      setHeadlineDone(true);
      setDisplayedSubtitle(FULL_SUBTITLE);
      setSubtitleDone(true);
      setDisplayedText(FULL_TEXT);
      setTypingDone(true);
      return;
    }

    let hInterval: NodeJS.Timeout | null = null;
    let sInterval: NodeJS.Timeout | null = null;
    let bInterval: NodeJS.Timeout | null = null;
    let started = false;

    const startTyping = () => {
      if (started) return;
      started = true;

      // 1. Headline ("YO I'M VINIT") — deliberate, readable cinematic pace
      let hIdx = 0;
      hInterval = setInterval(() => {
        hIdx++;
        setDisplayedHeadline(FULL_HEADLINE.slice(0, hIdx));
        if (hIdx >= FULL_HEADLINE.length) {
          if (hInterval) clearInterval(hInterval);
          setHeadlineDone(true);
        }
      }, 115);

      // 2. Subtitle ("Full Stack Engineer & AI Systems Developer")
      let sIdx = 0;
      sInterval = setInterval(() => {
        sIdx++;
        setDisplayedSubtitle(FULL_SUBTITLE.slice(0, sIdx));
        if (sIdx >= FULL_SUBTITLE.length) {
          if (sInterval) clearInterval(sInterval);
          setSubtitleDone(true);
        }
      }, 36);

      // 3. Body text ("Tailored engineering solutions...")
      let bIdx = 0;
      bInterval = setInterval(() => {
        bIdx++;
        setDisplayedText(FULL_TEXT.slice(0, bIdx));
        if (bIdx >= FULL_TEXT.length) {
          if (bInterval) clearInterval(bInterval);
          setTypingDone(true);
        }
      }, TYPING_SPEED_MS);
    };

    let initialTimer: NodeJS.Timeout | null = null;

    // Start typing right as the sliding panels clear the text column
    const unsubscribeReveal = onOpeningReveal(() => {
      initialTimer = setTimeout(startTyping, 420);
    });

    return () => {
      unsubscribeReveal();
      if (initialTimer) clearTimeout(initialTimer);
      if (hInterval) clearInterval(hInterval);
      if (sInterval) clearInterval(sInterval);
      if (bInterval) clearInterval(bInterval);
    };
  }, [shouldReduceMotion]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop =
        id === 'hero' || id === 'about'
          ? element.offsetTop
          : element.offsetTop - 70;
      window.scrollTo({
        top: offsetTop >= 0 ? offsetTop : 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-full min-h-screen min-h-[100dvh] flex flex-col justify-between overflow-hidden select-none bg-[#0A0A0A] text-white"
    >
      {/* ── Background: 3D Sculptural Ribbed Ribbon Canvas + Clean Dark Space ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Real-time 3D Sculptural Ribbed Ribbon */}
        <ThreeBackground />

        {/* Subtle radial shading into #0A0A0A */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />

        {/* Seamless bottom fade mask */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
      </div>

      {/* Spacer for fixed top navbar */}
      <div className="w-full h-14 sm:h-20 pointer-events-none shrink-0" />

      {/* ── Main Landing Content (Exact Layout from Video Reference) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-4 sm:py-16 md:py-24 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Prominent Clean Headline (Live simultaneous typewriter) */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] min-h-[1.1em]"
          >
            {displayedHeadline}
            {!headlineDone && (
              <span
                className="inline-block w-[3px] sm:w-[5px] h-[0.85em] bg-[#FF6A1A] ml-1.5 animate-pulse align-middle"
                aria-hidden="true"
              />
            )}
          </h1>

          {/* Subtitle & Role (Live simultaneous typewriter) */}
          <h2
            className="text-xl sm:text-2xl font-light text-zinc-300 tracking-wide min-h-[1.3em]"
          >
            {displayedSubtitle}
            {!subtitleDone && (
              <span
                className="inline-block w-[2px] h-[0.85em] bg-zinc-300 ml-1 animate-pulse align-middle"
                aria-hidden="true"
              />
            )}
          </h2>

          {/* Tailored Solutions Description — typewriter */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl min-h-[3.6em] sm:min-h-[4em]">
            {displayedText.length > 0 && (
              <>
                <span className="text-[#f97316]">
                  {displayedText.slice(0, Math.min(displayedText.length, ORANGE_WORD.length))}
                </span>
                {displayedText.slice(ORANGE_WORD.length)}
              </>
            )}
            {!typingDone && (
              <span
                className="inline-block w-[2px] h-[1em] bg-zinc-400 ml-0.5 animate-pulse align-middle"
                aria-hidden="true"
              />
            )}
          </p>

          {/* Action Link: Learn More (Matching Video Reference) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="pt-1 sm:pt-2"
          >
            <button
              suppressHydrationWarning
              onClick={() => scrollTo('about')}
              className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-white hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Animated Social Links Rail (Right Side) ── */}
      <SocialRail />

      {/* ── Bottom Section: Circular Navigation Controls & Sound Toggle ── */}
      <div className="relative z-20 w-full px-6 sm:px-12 lg:px-20 pb-5 sm:pb-12 flex items-center justify-between pointer-events-none shrink-0">
        {/* Bottom-Left: Two Circular Outline Arrow Buttons (Matching Video ( ^ ) ( v )) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <motion.button
            suppressHydrationWarning
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollTo('hero')}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
            title="Scroll to Top"
            aria-label="Previous Section"
          >
            <ArrowUp className="w-4 h-4 stroke-[1.75]" />
          </motion.button>
          <motion.button
            suppressHydrationWarning
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollTo('projects')}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
            title="Scroll to Projects"
            aria-label="Next Section"
          >
            <ArrowDown className="w-4 h-4 stroke-[1.75]" />
          </motion.button>
        </div>

        {/* Bottom-Right: Sound Toggle (in flow on mobile, precisely aligned on desktop) */}
        <div
          className="pointer-events-auto sm:absolute sm:bottom-0 sm:pb-12"
          style={{
            right: 'clamp(14px, 2.2vw, 28px)',
          }}
        >
          <SoundToggle />
        </div>
      </div>

      {/* ── Hanging Bug Easter Egg (desktop only, descends after preloader) ── */}
      <HangingBug />
    </section>
  );
}
