'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import FooterWordmark from './FooterWordmark';

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop =
        id === 'hero' || id === 'home' || id === 'projects'
          ? element.offsetTop
          : element.offsetTop - 70;
      window.scrollTo({
        top: offsetTop >= 0 ? offsetTop : 0,
        behavior: 'smooth',
      });
    }
  };

  const getTransition = (delayMs: number) => ({
    duration: shouldReduceMotion ? 0 : 0.8,
    delay: shouldReduceMotion ? 0 : delayMs / 1000,
    ease: [0.2, 0.8, 0.2, 1] as const,
  });

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#0a0a0a] px-6 sm:px-12 lg:px-20 pt-5 sm:pt-6 pb-5 relative z-10">
      <div className="w-full mx-auto">
        {/* 1. Giant Cursive Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={getTransition(0)}
        >
          <FooterWordmark />
        </motion.div>

        {/* 2. Bottom Bar: Logo (Far Left) | Navigation (Dead Center) | Copyright (Far Right) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={getTransition(110)}
          className="relative pt-3 pb-1 flex flex-col md:flex-row items-center justify-between gap-4 w-full"
        >
          {/* Logo & Brand on Far Left */}
          <div className="flex items-center justify-center md:justify-start flex-shrink-0">
            <button
              suppressHydrationWarning
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-2.5 py-0.5 rounded-lg group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Scroll to top"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-white/15 flex items-center justify-center bg-[#0E0E0E] shadow-sm group-hover:border-[#FF6A1A]/40 group-hover:shadow-[0_0_12px_rgba(255,106,26,0.2)] transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="AxeVin Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[15px] sm:text-[16px] font-bold tracking-tight text-white font-inter">
                AxeVin
              </span>
            </button>
          </div>

          {/* Navigation Links in Mathematical Dead Center */}
          <nav
            className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center gap-7 sm:gap-9 flex-wrap"
            aria-label="Footer navigation"
          >
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => scrollTo('skills')}
              className="footer-nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1"
            >
              Skills
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => scrollTo('projects')}
              className="footer-nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1"
            >
              Projects
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => scrollTo('experience')}
              className="footer-nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1"
            >
              Work History
            </button>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => scrollTo('contact')}
              className="footer-nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1"
            >
              Contact
            </button>
          </nav>

          {/* Copyright on Far Right */}
          <div className="flex items-center justify-center md:justify-end flex-shrink-0">
            <span className="text-[12px] text-[#6b6b78] font-normal text-center md:text-right">
              &copy; {new Date().getFullYear()} AxeVin • Vinit Singh. All rights reserved.
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
