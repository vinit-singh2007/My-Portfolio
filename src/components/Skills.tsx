'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layers, Cpu } from 'lucide-react';

const SKILLS_DATA = [
  {
    category: 'Core Languages',
    icon: Code2,
    skills: ['HTML5 & CSS3', 'C', 'C++', 'Java', 'Python', 'JavaScript', 'NO SQL', 'SQL'],
  },
  {
    category: 'Frameworks & Libraries',
    icon: Layers,
    skills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Redux Toolkit', 'Framer Motion'],
  },
  {
    category: 'Tools & Platforms',
    icon: Cpu,
    skills: ['Git & GitHub', 'AWS', 'Vercel', 'Vite & Webpack', 'PostgreSQL', 'PostMan', 'MYSQL', 'MongoDB', 'Figma'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold mb-4"
        >
          Skills & Expertise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light"
        >
          A comprehensive overview of the programming languages, architectural frameworks, and modern developer tools in my tech stack.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {SKILLS_DATA.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass rounded-2xl p-8 border border-zinc-200/20 bg-white/40 dark:bg-zinc-950/40 shadow-sm flex flex-col hover:border-indigo-500/20 dark:hover:border-cyan-500/20 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold tracking-wide">{item.category}</h3>
              </div>

              {/* Chips Grid */}
              <div className="flex flex-wrap gap-2.5">
                {item.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/60 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border border-zinc-200/10 dark:border-zinc-800/80 shadow-sm cursor-default hover:border-indigo-500/30 dark:hover:border-cyan-500/30 hover:text-indigo-600 dark:hover:text-cyan-400 hover:shadow-md dark:hover:shadow-cyan-500/5 transition-all duration-200"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
