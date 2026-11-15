'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, X } from 'lucide-react';
import { onOpeningDone } from '@/lib/openingState';

const STORAGE_KEY = 'axevin_desktop_notice_dismissed';

export default function DesktopSuggestionModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only target mobile screens (< 768px)
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 768) return;

    // Check if previously dismissed in this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        return;
      }
    } catch {
      // ignore storage errors
    }

    let timer: NodeJS.Timeout | null = null;

    // Wait until the opening sequence finishes, then show modal after a 1.2s delay
    const unsub = onOpeningDone(() => {
      timer = setTimeout(() => {
        if (window.innerWidth < 768) {
          setIsOpen(true);
        }
      }, 1200);
    });

    // Safety fallback: reveal after 5s if onOpeningDone doesn't fire
    const fallbackTimer = setTimeout(() => {
      if (window.innerWidth < 768) {
        try {
          if (sessionStorage.getItem(STORAGE_KEY) !== 'true') {
            setIsOpen(true);
          }
        } catch {
          setIsOpen(true);
        }
      }
    }, 5000);

    return () => {
      unsub();
      if (timer) clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] md:hidden flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none select-none">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/75 backdrop-blur-md pointer-events-auto"
            aria-hidden="true"
          />

          {/* Modal Card (Strict Black & White Monochrome Aesthetic) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-2xl bg-[#09090b] border border-white/20 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] pointer-events-auto text-left"
            role="dialog"
            aria-modal="true"
            aria-labelledby="desktop-notice-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Icon + Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center text-white shrink-0">
                <Monitor className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-zinc-400 font-semibold block leading-tight">
                  Recommendation
                </span>
                <h3
                  id="desktop-notice-title"
                  className="text-base font-semibold text-white tracking-tight leading-snug"
                >
                  Best Viewed on Desktop
                </h3>
              </div>
            </div>

            {/* Message */}
            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
              This portfolio was crafted with interactive 3D physics, sound design, and custom layouts tailored for a wider screen. For the intended experience, consider opening it on your desktop or laptop.
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              Continue on Mobile
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
