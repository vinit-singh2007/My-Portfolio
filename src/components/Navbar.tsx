'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // If at or near top of the page, keep navbar visible
      if (currentScrollY <= 80) {
        setHidden(false);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> hide immediately
        setHidden(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> appear, then disappear after 2.5s
        setHidden(false);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          if (window.scrollY > 80) {
            setHidden(true);
          }
        }, 2500);
      }

      lastScrollY.current = currentScrollY;

      const scrollPosition = currentScrollY + 140;
      for (const item of NAV_ITEMS) {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setHidden(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offsetTop = element.offsetTop - 75;
        window.scrollTo({
          top: offsetTop >= 0 ? offsetTop : 0,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const isDark = mounted ? theme === 'dark' : true;
  const shouldHide = hidden && !mobileMenuOpen && !isHovered;

  return (
    <>
      {/* ── Wide Floating Navbar Header ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: shouldHide ? -90 : 0,
          opacity: shouldHide ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (window.scrollY > 80 && !mobileMenuOpen) {
            hideTimeoutRef.current = setTimeout(() => {
              if (window.scrollY > 80) setHidden(true);
            }, 2500);
          }
        }}
        className="fixed top-2 sm:top-3 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none"
      >
        <div
          className={`pointer-events-auto w-[94%] max-w-6xl flex items-center justify-between px-5 sm:px-8 py-1.5 sm:py-2 rounded-full transition-all duration-300 backdrop-blur-md border ${
            scrolled
              ? 'bg-white/40 dark:bg-black/40 border-zinc-200/50 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 backdrop-blur-xl'
              : 'bg-white/20 dark:bg-black/20 border-zinc-200/40 dark:border-white/[0.08] shadow-md shadow-black/5 dark:shadow-black/20'
          }`}
        >
          {/* Brand Logo */}
          <button
            suppressHydrationWarning
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2.5 py-0.5 rounded-full group cursor-pointer focus:outline-none"
            aria-label="Scroll to top"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-200/20 dark:border-zinc-800/80 flex items-center justify-center bg-zinc-900/50 group-hover:scale-105 group-hover:border-indigo-500/40 transition-all duration-300 shadow-sm">
              <Image
                src="/logo.png"
                alt="AxeVin Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              AxeVin
            </span>
          </button>

          {/* Simple Clean Nav Items (No inner sub-navbar container) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7 lg:gap-9">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  suppressHydrationWarning
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative py-0.5 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none ${
                    isActive
                      ? 'text-indigo-600 dark:text-cyan-400 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Mobile Trigger */}
          <div className="flex items-center gap-3">
            {/* Circular Glass Theme Switch Button */}
            <motion.button
              suppressHydrationWarning
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center border border-zinc-200/50 dark:border-white/10 bg-white/30 dark:bg-zinc-800/30 hover:bg-white/60 dark:hover:bg-zinc-800/60 shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="flex items-center justify-center text-cyan-400"
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="flex items-center justify-center text-amber-500"
                  >
                    <Sun className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <button
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 md:hidden rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu (Floating Dropdown Panel) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Floating Dropdown Card */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-16 sm:top-18 inset-x-4 max-w-sm mx-auto z-50 md:hidden glass !bg-white/95 dark:!bg-zinc-950/95 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      onClick={() => scrollTo(item.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-base transition-all duration-200 text-left cursor-pointer active:scale-98 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-zinc-800/80 text-indigo-600 dark:text-cyan-400 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400 shadow-sm" />
                      )}
                    </motion.button>
                  );
                })}

                <div className="pt-2 mt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between px-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Appearance</span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
