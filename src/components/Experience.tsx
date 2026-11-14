'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlowTimeline from './timeline/GlowTimeline';

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20 overflow-hidden relative">
      {/* Cinematic Minimal Header */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight"
        >
          Work History
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 max-w-lg mx-auto font-light text-sm md:text-base"
        >
          A linear timeline marking my career milestones, professional development, and core achievements.
        </motion.p>
      </div>

      {/* Glowing, Scroll-Driven Progress Timeline */}
      <GlowTimeline />
    </section>
  );
}
