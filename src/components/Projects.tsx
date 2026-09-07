'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const CATEGORIES = ['All', 'Full-Stack', 'DSA+Backend', 'AI/Ml'];

const PROJECTS = [
  {
    id: 1,
    title: 'Day 0',
    category: 'Full-Stack',
    image: '/project_day0.png',
    description: "Built a web-based career simulation platform that helps students and freshers experience real-world job roles before entering the workforce. Users select a career path and complete daily tasks in a simulated work environment designed to mirror actual workplace pressures and expectations.",
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Machine Learning'],
    demo: 'https://day-0-delta.vercel.app/',
    repo: 'https://github.com/vinit-singh2007/Day-0',
  },
  {
    id: 2,
    title: 'Disk Scheduling Algorithm Analyzer',
    category: 'DSA+Backend',
    image: '/Project_DSA_Backend.png',
    description: "Built a  web application that visualizes and analyzes classic disk scheduling algorithms helping students and developers understand operating system concepts through interactive simulation.",
    tech: ['React', 'Node.js', 'Express.js', 'DSA', 'Algorithm'],
    demo: 'https://disk-scheduling-algorithm-analyzer-1.onrender.com',
    repo: 'https://github.com/vinit-singh2007/Disk-scheduling-Algorithm-Analyzer',
  },
  {
    id: 3,
    title: 'Coming........',
    category: 'AI/Ml',
    image: '/Project_aiml.png',
    description: '',
    tech: [],
    demo: '#',
    repo: '#',
  },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = PROJECTS.filter(
    (project) => selectedCategory === 'All' || project.category === selectedCategory
  );

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold mb-4"
        >
          Selected Work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light"
        >
          Explore a curated showcase of web projects, blending robust engineering with creative design systems.
        </motion.p>
      </div>

      {/* Categories Switch */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((category) => (
          <button
            suppressHydrationWarning
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative cursor-pointer ${selectedCategory === category
              ? 'text-white dark:text-zinc-950 font-bold'
              : 'text-zinc-600 dark:text-zinc-400 glass glass-hover hover:text-zinc-950 dark:hover:text-white'
              }`}
          >
            <span className="relative z-10">{category}</span>
            {selectedCategory === category && (
              <motion.div
                layoutId="activeCategoryBg"
                className="absolute inset-0 bg-indigo-600 dark:bg-cyan-400 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              viewport={{ once: true }}
              key={project.id}
              className="group glass rounded-2xl overflow-hidden flex flex-col h-full border border-zinc-200/20 bg-white/40 dark:bg-zinc-950/40 relative shadow-sm hover:shadow-lg dark:hover:border-cyan-500/20 hover:border-indigo-500/20 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-200/10">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Overlay Links on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                  <a
                    href={project.demo}
                    className="p-3 rounded-full bg-white text-zinc-900 hover:scale-110 transition-transform shadow-md"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a
                    href={project.repo}
                    className="p-3 rounded-full bg-zinc-900 text-white hover:scale-110 transition-transform border border-white/20 shadow-md"
                    title="Source Code"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-indigo-500 dark:text-cyan-400 mb-2">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200/5 dark:border-zinc-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
