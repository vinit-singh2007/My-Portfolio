'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import TextRollLink from './TextRollLink';
import { playNavHoverSound, playNavClickSound } from '@/lib/navSound';
import { onOpeningReveal } from '@/lib/openingState';

const NAV_LINKS = [
  { key: 'about', label: 'What I am about', targetId: 'about' },
  { key: 'what-i-do', label: 'What I do', targetId: 'projects' },
  { key: 'experience', label: 'My Experience', targetId: 'experience' },
  { key: 'expertise', label: 'Expertise', targetId: 'skills' },
  { key: 'blog', label: 'Blog', targetId: 'blog' },
  { key: 'contact', label: 'Contact', targetId: 'contact' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const [introRevealed, setIntroRevealed] = useState(false);

  const prevScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  /* ── 1. Reveal on Curtain Split ── */
  useEffect(() => {
    const unsub = onOpeningReveal(() => {
      setIntroRevealed(true);
    });
    return unsub;
  }, []);

  /* ── 2. Smart Scroll: Hide on Scroll Down, Show on Scroll Up ── */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if at the very top of the page
      if (currentScrollY <= 40) {
        setIsAtTop(true);
        setVisible(true);
      } else {
        setIsAtTop(false);

        // Threshold of 6px to avoid jitter on micro-scrolls
        if (currentScrollY > prevScrollY.current + 6) {
          // Scrolling DOWN -> hide navbar & close mobile menu
          setVisible(false);
          setMobileMenuOpen(false);
        } else if (currentScrollY < prevScrollY.current - 6) {
          // Scrolling UP -> reveal navbar
          setVisible(true);
        }
      }

      prevScrollY.current = currentScrollY;

      // ── Scroll Spy Active Key ──
      const scrollPosition = currentScrollY + 220;
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── 3. Sound Effects ── */
  useEffect(() => {
    const attachListeners = (el: HTMLElement | null) => {
      if (!el) return () => {};
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

  /* ── 4. Smooth Scroll Handler ── */
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
    <header
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition:
          'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, padding 0.3s ease, backdrop-filter 0.3s ease',
        opacity: introRevealed ? 1 : 0,
      }}
      className={`fixed top-0 inset-x-0 z-50 w-full px-6 sm:px-12 lg:px-20 flex items-center justify-center ${
        isAtTop && !mobileMenuOpen
          ? 'py-7 sm:py-8 bg-transparent border-b border-transparent'
          : 'py-4 sm:py-5 bg-[#0a0a0a]/75 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl'
      }`}
    >
      {/* Centered Navigation Links with Text Roll Hover Animation (Desktop) */}
      <nav ref={navRef} className="hidden md:flex items-center justify-center gap-10 lg:gap-12">
        {NAV_LINKS.map((link) => (
          <TextRollLink
            key={link.key}
            label={link.label}
            isActive={activeKey === link.key}
            onClick={() => scrollTo(link.targetId, link.key)}
          />
        ))}
      </nav>

      {/* Mobile Menu Trigger (Right side on mobile) */}
      <div className="flex items-center md:hidden w-full justify-end">
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-full border border-white/[0.1] bg-white/[0.05] text-zinc-300 hover:text-white cursor-pointer active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileNavRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full inset-x-4 mt-2 p-6 rounded-2xl bg-[#0f0f11]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 text-center"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.key}
                type="button"
                suppressHydrationWarning
                onClick={() => scrollTo(link.targetId, link.key)}
                className={`py-2 text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
                  activeKey === link.key ? 'text-[#FF6A1A]' : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
