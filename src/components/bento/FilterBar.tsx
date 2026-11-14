'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = useCallback(() => {
    const activeBtn = buttonRefs.current[selectedCategory];
    const container = containerRef.current;
    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        opacity: 1,
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    // Recompute after fonts load
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div className="flex justify-center mb-12 sm:mb-14">
      <div
        ref={containerRef}
        className="relative p-1.5 rounded-full bg-[#121212]/90 border border-white/10 backdrop-blur-md inline-flex items-center gap-1 shadow-xl shadow-black/40"
      >
        {/* Sliding White Indicator */}
        <motion.div
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.opacity,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1.5 bottom-1.5 bg-white rounded-full pointer-events-none shadow-sm"
        />

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              suppressHydrationWarning
              key={cat}
              ref={(el) => {
                buttonRefs.current[cat] = el;
              }}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] select-none ${
                isActive ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

