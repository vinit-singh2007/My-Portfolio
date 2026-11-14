'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowUp, ArrowDown, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import ThreeBackground from './ThreeBackground';
import TextRollLink from './TextRollLink';
import SocialRail from './SocialRail';
import { playNavHoverSound, playNavClickSound } from '@/lib/navSound';

const NAV_LINKS = [
  { key: 'about', label: 'What I Am About', targetId: 'about' },
  { key: 'what-i-do', label: 'What I Do', targetId: 'projects' },
  { key: 'experience', label: 'My Experience', targetId: 'experience' },
  { key: 'expertise', label: 'Expertise', targetId: 'skills' },
  { key: 'blog', label: 'Blog', targetId: 'blog' },
  { key: 'contact', label: 'Contact', targetId: 'contact' },
];

const FULL_TEXT =
  'Tailored engineering solutions in high-performance web applications, scalable distributed backend architecture, and intelligent machine learning models.';
const ORANGE_WORD = 'Tailored';
const TYPING_SPEED_MS = 18;
const TYPING_START_DELAY_MS = 500;

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('');

  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  /* ── Soft Navbar Sound Listeners ── */
  useEffect(() => {
    const attachListeners = (el: HTMLElement | null) => {
      if (!el) return () => { };
      const handleMouseOver = (e: MouseEvent) => {
        const btn = (e.target as HTMLElement).closest('button, a');
        if (btn && el.contains(btn)) {
          playNavHoverSound();
        }
      };
      const handleFocusIn = (e: FocusEvent) => {
        const btn = (e.target as HTMLElement).closest('button, a');
        if (btn && el.contains(btn)) {
          playNavHoverSound();
        }
      };
      const handleClick = (e: MouseEvent) => {
        const btn = (e.target as HTMLElement).closest('button, a');
        if (btn && el.contains(btn)) {
          playNavClickSound();
        }
      };

      el.addEventListener('mouseover', handleMouseOver);
      el.addEventListener('focusin', handleFocusIn);
      el.addEventListener('click', handleClick);

      return () => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('focusin', handleFocusIn);
        el.removeEventListener('click', handleClick);
      };
    };

    const cleanupDesktop = attachListeners(navRef.current);
    const cleanupMobile = attachListeners(mobileNavRef.current);

    return () => {
      cleanupDesktop();
      cleanupMobile();
    };
  }, [mobileMenuOpen]);

  /* ── Typewriter ── */
  const shouldReduceMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Typewriter effect ── */
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedText(FULL_TEXT);
      setTypingDone(true);
      return;
    }
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayedText(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, TYPING_SPEED_MS);
      return () => clearInterval(interval);
    }, TYPING_START_DELAY_MS);
    return () => clearTimeout(startTimer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      const contactEl = document.getElementById('contact');
      const blogEl = document.getElementById('blog');
      const experienceEl = document.getElementById('experience');
      const skillsEl = document.getElementById('skills');
      const projectsEl = document.getElementById('projects');
      const aboutEl = document.getElementById('about');

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        setActiveKey('contact');
      } else if (blogEl && scrollPosition >= blogEl.offsetTop) {
        setActiveKey('blog');
      } else if (skillsEl && scrollPosition >= skillsEl.offsetTop) {
        setActiveKey('expertise');
      } else if (experienceEl && scrollPosition >= experienceEl.offsetTop) {
        setActiveKey('experience');
      } else if (projectsEl && scrollPosition >= projectsEl.offsetTop) {
        setActiveKey('what-i-do');
      } else if (aboutEl && scrollPosition >= aboutEl.offsetTop) {
        setActiveKey('about');
      } else {
        setActiveKey('');
      }
    };

    // Delay the first call so all sections have finished laying out.
    // Calling immediately on mount causes all offsetTops to read as 0,
    // which makes the scroll-spy incorrectly set activeKey to 'contact'.
    const initTimer = setTimeout(handleScroll, 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string, key?: string) => {
    if (key) setActiveKey(key);
    setMobileMenuOpen(false);
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
      className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden select-none bg-[#0A0A0A] text-white"
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

      {/* ── Top Header Navigation Bar ── */}
      <header className="relative z-30 w-full px-6 sm:px-12 lg:px-20 pt-8 sm:pt-10 flex items-center justify-between">
        {/* Brand */}
        <button
          suppressHydrationWarning
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2.5 py-0.5 rounded-lg group cursor-pointer focus:outline-none"
          aria-label="Scroll to top"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-white/15 flex items-center justify-center bg-[#0E0E0E] shadow-sm group-hover:border-[#FF6A1A]/40 group-hover:shadow-[0_0_12px_rgba(255,106,26,0.2)] transition-all duration-300">
            <Image
              src="/logo.png"
              alt="AxeVin Logo"
              width={36}
              height={36}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            AxeVin
          </span>
        </button>

        {/* Centered / Right Navigation Links with Text Roll Hover Animation */}
        <nav ref={navRef} className="hidden md:flex items-center gap-10 lg:gap-12">
          {NAV_LINKS.map((link) =>
            link.key === 'contact' ? (
              <button
                key={link.key}
                type="button"
                suppressHydrationWarning
                onClick={() => scrollTo(link.targetId, link.key)}
                className="text-xs uppercase tracking-[0.2em] font-medium cursor-pointer focus:outline-none text-[#FF6A1A] hover:text-[#e55a10] transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <TextRollLink
                key={link.key}
                label={link.label}
                isActive={activeKey === link.key}
                onClick={() => scrollTo(link.targetId, link.key)}
              />
            )
          )}
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center md:hidden">
          <button
            suppressHydrationWarning
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileNavRef}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-24 inset-x-6 z-50 p-6 rounded-2xl bg-[#111111]/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-4 text-center"
          >
            <button onClick={() => scrollTo('about')} className="py-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-300 hover:text-white">
              WHAT I AM ABOUT
            </button>
            <button onClick={() => scrollTo('projects')} className="py-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-300 hover:text-white">
              WHAT I DO
            </button>
            <button onClick={() => scrollTo('experience')} className="py-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-300 hover:text-white">
              MY EXPERIENCE
            </button>
            <button onClick={() => scrollTo('skills')} className="py-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-300 hover:text-white">
              EXPERTISE
            </button>
            <button onClick={() => scrollTo('blog')} className="py-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-300 hover:text-white">
              BLOG
            </button>
            <button onClick={() => scrollTo('contact')} className="py-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#FF6A1A] hover:text-[#e55a10] transition-colors">
              CONTACT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Landing Content (Exact Layout from Video Reference) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          {/* Prominent Clean Headline (Matching Video Headline) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]"
          >
            YO I'M VINIT
          </motion.h1>

          {/* Subtitle & Role */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-xl sm:text-2xl font-light text-zinc-300 tracking-wide"
          >
            Full Stack Engineer & AI Systems Developer
          </motion.h2>

          {/* Tailored Solutions Description — typewriter */}
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-xl min-h-[4em]">
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
            className="pt-2"
          >
            <button
              suppressHydrationWarning
              onClick={() => scrollTo('projects')}
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

      {/* ── Bottom Section: Circular Navigation Controls & Indicators (Matching Video) ── */}
      <div className="relative z-20 w-full px-6 sm:px-12 lg:px-20 pb-8 sm:pb-12 flex items-center justify-between">
        {/* Bottom-Left: Two Circular Outline Arrow Buttons (Matching Video ( ^ ) ( v )) */}
        <div className="flex items-center gap-3">
          <motion.button
            suppressHydrationWarning
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollTo('hero')}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
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
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
            title="Scroll to Projects"
            aria-label="Next Section"
          >
            <ArrowDown className="w-4 h-4 stroke-[1.75]" />
          </motion.button>
        </div>

        {/* Bottom-Right: Section Counter */}
        <div className="flex items-center">
          {/* Section Indicator */}
          <div className="text-xs font-mono tracking-[0.25em] text-zinc-400">
            <span className="text-white font-bold">01</span> &nbsp;/&nbsp; 05
          </div>
        </div>
      </div>
    </section>
  );
}
