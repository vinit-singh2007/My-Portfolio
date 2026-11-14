'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem } from './ProjectData';
import TechStackIcon from './TechStackIcon';

interface ProjectTileProps {
  project: ProjectItem;
  gridSpanClass: string;
  staggerIndex: number;
  isMatch: boolean;
  onOpenDetail: (project: ProjectItem) => void;
}

export default function ProjectTile({
  project,
  gridSpanClass,
  staggerIndex,
  isMatch,
  onOpenDetail,
}: ProjectTileProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--mx', '-300px');
    cardRef.current.style.setProperty('--my', '-300px');
  };

  const chips = project.techStack.slice(0, 3);
  const remainingCount = project.techStack.length - chips.length;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 34, scale: 0.97, filter: 'blur(6px)' }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, delay: staggerIndex * 0.13, ease: [0.2, 0.8, 0.2, 1] }}
      className={`${gridSpanClass} transition-all duration-400 min-h-[190px] flex`}
      style={{
        opacity: isMatch ? 1 : 0.18,
        filter: isMatch ? 'none' : 'grayscale(100%)',
        transform: isMatch ? 'scale(1)' : 'scale(0.975)',
        pointerEvents: isMatch ? 'auto' : 'none',
      }}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        suppressHydrationWarning
        onClick={() => onOpenDetail(project)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenDetail(project);
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bento-glow-card w-full p-5 sm:p-6 flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] rounded-2xl cursor-pointer"
        aria-label={`View case study for ${project.title}`}
      >
        {/* Top-Right Faint Colored Radial Glow that grows on hover */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-[#FF6A1A]/20 via-[#FF6A1A]/5 to-transparent blur-2xl pointer-events-none opacity-40 group-hover:opacity-95 group-hover:scale-125 transition-all duration-500" />

        {/* Top Row: Number & Category + Animated Circular Arrow Badge */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium">
              {String(project.id).padStart(2, '0')} — {project.category.toUpperCase()}
            </span>

            {/* Circular Arrow Badge */}
            <div className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center relative overflow-hidden group-hover:bg-[#FF6A1A] group-hover:border-[#FF6A1A] transition-colors duration-300 flex-shrink-0">
              <ArrowUpRight className="w-4 h-4 text-white absolute transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full" />
              <ArrowUpRight className="w-4 h-4 text-black absolute transition-transform duration-300 ease-out -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0" />
            </div>
          </div>

          {/* Project Title (20px, semibold, tight letter spacing) */}
          <h3 className="text-xl sm:text-[20px] font-semibold text-white tracking-tight leading-snug group-hover:text-[#FF6A1A] transition-colors duration-200 relative z-10 mb-2">
            {project.title}
          </h3>

          {/* Clean 2-Line Description (concise, no extra void) */}
          {project.description && (
            <p className="text-xs text-zinc-400 font-light leading-relaxed relative z-10 line-clamp-2 mb-3">
              {project.description}
            </p>
          )}
        </div>

        {/* Bottom Area: Tech Chips + Case Study Indicator Button */}
        <div className="pt-2 mt-auto relative z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {chips.map((tech, i) => (
              <motion.span
                key={tech}
                initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
                whileInView={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors"
              >
                <TechStackIcon name={tech} className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200" />
                <span>{tech}</span>
              </motion.span>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono text-zinc-400">
                +{remainingCount}
              </span>
            )}
          </div>

          {/* Dedicated "Case study ↗" trigger button */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Read Details
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#FF6A1A] group-hover:translate-x-1 transition-transform duration-200">
              Case study ↗
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
