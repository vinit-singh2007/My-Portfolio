'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building2 } from 'lucide-react';

const EXPERIENCE_DATA = [
  {
    role: 'Student',
    company: 'ST. John College Of Engineering And Management',
    duration: 'Aug 2024 - Present',
    description: "I'm a Full Stack Developer and B.Tech student at St. John College of Engineering and Management, who loves turning ideas into real, working products. I build with React and Node.js on the frontend and backend, and I'm increasingly drawn to the world of AI — exploring how it's reshaping the way we build software.",
  },
  {
    role: 'Full Stack Engineer',
    company: 'ST. John College Of Engineering And Management',
    duration: 'june 2025 - Present',
    description: "I am a Full-Stack Developer who specializes in building the brains and architecture of modern web applications. While I am fully capable of translating a design into a clean frontend interface, my true expertise lies in architecting robust backend systems and integrating intelligent AI/ML models. I don't just build websites that look good; I build data-driven ecosystems that process complex logic, automate tasks, and scale seamlessly under pressure.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto scroll-mt-20">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold mb-4"
        >
          Work History
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light"
        >
          A linear timeline marking my career milestones, professional development, and core achievements.
        </motion.p>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative pl-6 md:pl-32 border-l border-zinc-200 dark:border-zinc-800/80 max-w-3xl mx-auto">
        {EXPERIENCE_DATA.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative mb-16 last:mb-0"
          >
            {/* Timeline Node Badge */}
            <div className="absolute -left-[39px] md:-left-[147px] top-1.5 flex items-center justify-center">
              {/* Outer Glow ring */}
              <div className="absolute w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 animate-ping" />
              {/* Node Circle */}
              <div className="relative w-6 h-6 rounded-full border border-indigo-600 dark:border-cyan-400 bg-white dark:bg-zinc-950 flex items-center justify-center shadow-sm">
                <Briefcase className="w-3 h-3 text-indigo-600 dark:text-cyan-400" />
              </div>
            </div>

            {/* Desktop Date Column */}
            <div className="hidden md:block absolute -left-[300px] top-1 text-right w-[120px]">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                {exp.duration}
              </span>
            </div>

            {/* Content Card */}
            <div className="glass rounded-2xl p-6 md:p-8 border border-zinc-200/20 bg-white/40 dark:bg-zinc-950/40 relative shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-cyan-500/20 transition-all duration-300">
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                {exp.role}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-indigo-600 dark:text-cyan-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {exp.company}
                </span>
                <span className="flex items-center gap-1.5 md:hidden text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.duration}
                </span>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
