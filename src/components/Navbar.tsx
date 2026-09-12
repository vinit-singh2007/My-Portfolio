'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 120;
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    // Small delay so menu closes before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
          top: offsetTop >= 0 ? offsetTop : 0,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  return (
    <>
      {/* ── Navbar header ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'py-3.5 glass shadow-lg !bg-white/90 dark:!bg-black/90'
          : 'py-6 bg-transparent border-b border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            suppressHydrationWarning
            onClick={() => scrollTo('hero')}
            className="text-2xl font-bold tracking-wider cursor-pointer group flex items-center gap-2.5"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-200/20 dark:border-zinc-800/80 flex items-center justify-center bg-zinc-900/50 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Image src="/logo.png" alt="AxeVin Logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              AxeVin
            </span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                suppressHydrationWarning
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors duration-300 cursor-pointer ${activeSection === item.id
                  ? 'text-indigo-600 dark:text-cyan-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu button */}
          <div className="flex items-center gap-4">
            {/* Custom Theme Switch Toggle */}
            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${theme === 'dark' ? 'bg-zinc-800 justify-end' : 'bg-zinc-200 justify-start'
                }`}
              aria-label="Toggle theme"
            >
              <motion.div
                layout
                className="w-6 h-6 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center shadow-md"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </motion.div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu — rendered OUTSIDE header to avoid stacking context issues ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop — blocks all clicks on content behind menu */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 998, pointerEvents: 'all' }}
            />

            {/* Menu panel — slides down from below navbar */}
            <motion.div
              key="mobile-menu"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: '64px',
                left: 0,
                right: 0,
                zIndex: 999,
                pointerEvents: 'all',
              }}
              className="md:hidden glass !bg-white/98 dark:!bg-zinc-950/98 shadow-2xl"
            >
              <div className="px-6 py-5 flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    onClick={() => scrollTo(item.id)}
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                    className={`text-left py-4 px-2 w-full font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors active:opacity-70 ${activeSection === item.id
                      ? 'text-indigo-600 dark:text-cyan-400'
                      : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
