'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProjectsBento from './bento/ProjectsBento';

export default function Projects() {
  return (
    <section className="pt-0 pb-24 px-4 sm:px-6 max-w-7xl mx-auto relative select-none">
      {/* ── Section Heading & Subtitle ── */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6A1A] font-semibold mb-2.5"
        >
          WHAT I&apos;VE BUILT
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight"
        >
          THE WORK
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 max-w-lg mx-auto font-light text-sm md:text-base"
        >
          From concepts to functional digital experiences.
        </motion.p>
      </div>

      {/* ── Featured Bento Grid with Cursor Border Glow ── */}
      <ProjectsBento />
    </section>
  );
}
