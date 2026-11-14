'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Marquee from './Marquee';

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Cinematic Minimal Header */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight"
        >
          Skills & Expertise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 max-w-lg mx-auto font-light text-sm md:text-base"
        >
          A comprehensive overview of programming languages, architectural frameworks, and modern developer tools in my tech stack.
        </motion.p>
      </div>

      {/* ── Skills Scrolling Marquee Strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <Marquee />
      </motion.div>
    </section>
  );
}
