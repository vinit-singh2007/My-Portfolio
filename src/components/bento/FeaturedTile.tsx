'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Sparkles } from 'lucide-react';
import { ProjectItem } from './ProjectData';
import TechStackIcon from './TechStackIcon';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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

interface FeaturedBentoTileProps {
  project: ProjectItem;
  gridSpanClass: string;
  staggerIndex: number;
  isMatch: boolean;
  onOpenDetail: (project: ProjectItem) => void;
}

function MagneticButton({
  children,
  href,
  className = '',
  isTouchOrReduced = false,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  isTouchOrReduced?: boolean;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouchOrReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    // 30% horizontally, 40% vertically
    setOffset({ x: dx * 0.3, y: dy * 0.4 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? 'transform 0.35s ease' : 'transform 0.08s ease-out',
      }}
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] ${className}`}
    >
      {children}
    </a>
  );
}

export default function FeaturedTile({
  project,
  gridSpanClass,
  staggerIndex,
  isMatch,
  onOpenDetail,
}: FeaturedBentoTileProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches);
    }
  }, []);

  const isTouchOrReduced = Boolean(shouldReduceMotion || isTouchDevice);

  // Cursor border glow CSS vars
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

  // 3D Tilt for Preview Area
  const handlePreviewMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchOrReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // rotateX up to 10deg, rotateY up to 12deg
    const rx = (0.5 - py) * 20;
    const ry = (px - 0.5) * 24;
    setTilt({ rx, ry });
  };

  const handlePreviewMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const chips = project.techStack;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 34, scale: 0.97, filter: 'blur(6px)' }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, delay: staggerIndex * 0.13, ease: [0.2, 0.8, 0.2, 1] }}
      className={`${gridSpanClass} transition-all duration-400 min-h-[420px] flex`}
      style={{
        opacity: isMatch ? 1 : 0.18,
        filter: isMatch ? 'none' : 'grayscale(100%)',
        transform: isMatch ? 'scale(1)' : 'scale(0.975)',
        pointerEvents: isMatch ? 'auto' : 'none',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bento-glow-card w-full p-6 sm:p-8 flex flex-col justify-between group rounded-2xl relative"
      >
        {/* Top-Right Ambient Orange Glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-[#FF6A1A]/20 via-[#FF6A1A]/5 to-transparent blur-3xl pointer-events-none opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700" />

        {/* ── 1. Large 3D Tilt Preview Area on Top ── */}
        <div
          className="w-full mb-5 cursor-pointer"
          style={{ perspective: 900 }}
          onClick={() => onOpenDetail(project)}
          onMouseMove={handlePreviewMouseMove}
          onMouseLeave={handlePreviewMouseLeave}
        >
          <div
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: 'preserve-3d',
              transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.5s ease-out' : 'transform 0.08s ease-out',
            }}
            className="w-full relative rounded-xl overflow-hidden border border-white/10 bg-[#121212] aspect-[16/9] max-h-[280px] shadow-2xl"
          >
            {project.image ? (
              <>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority
                  className="object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              /* Fallback Card with Dark Gradient, Window Dots, Skeleton Bars, and Name */
              <div className="w-full h-full bg-gradient-to-br from-[#161616] via-[#101010] to-[#0A0A0A] p-5 flex flex-col justify-between">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                {/* 3 Skeleton Bars */}
                <div className="space-y-2.5 my-auto max-w-xs">
                  <div className="h-3 w-3/4 rounded bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-bento-shimmer" />
                  </div>
                  <div className="h-3 w-full rounded bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-bento-shimmer" />
                  </div>
                  <div className="h-3 w-1/2 rounded bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-bento-shimmer" />
                  </div>
                </div>
              </div>
            )}

            {/* Extras: Thin Sweeping Orange Scan Line */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A1A] to-transparent pointer-events-none animate-bento-scanline shadow-[0_0_10px_#FF6A1A]" />

            {/* 3D Floating Project Name & Badge (translateZ(30px)) */}
            <div
              style={{ transform: 'translateZ(30px)' }}
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E0E0E]/90 border border-white/15 backdrop-blur-md shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6A1A]" />
                <span className="text-xs font-mono font-semibold tracking-wider text-white">
                  {project.title}
                </span>
              </div>
              <span className="text-[11px] font-mono tracking-widest text-[#FF6A1A] uppercase px-2.5 py-1 rounded bg-[#0E0E0E]/80 border border-[#FF6A1A]/30">
                FEATURED
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Content: Number/Category, Title (32px), Concise Description ── */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#FF6A1A] font-semibold">
              {String(project.id).padStart(2, '0')} — {project.category.toUpperCase()}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(project)}
            className="text-2xl sm:text-3xl lg:text-[28px] font-bold text-white tracking-tight leading-tight group-hover:text-[#FF6A1A] transition-colors duration-200 mb-2.5 cursor-pointer inline-block"
          >
            {project.title}
          </h3>

          {/* Clean 2-3 Line Description (not crammed) */}
          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3 max-w-2xl">
            {project.description}
          </p>

          {/* Tech Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            {chips.map((tech, i) => (
              <motion.span
                key={tech}
                initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
                whileInView={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-zinc-300 group-hover:border-white/20 transition-colors"
              >
                <TechStackIcon name={tech} raw={true} className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tech}</span>
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── 3. Action Buttons (View Case Study ↗, GitHub, Live Demo) ── */}
        <div className="flex flex-wrap items-center gap-3 mt-auto relative z-20 pt-2 border-t border-white/[0.06]">
          {/* Primary View Case Study Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => onOpenDetail(project)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6A1A] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e55a10] transition-colors shadow-lg shadow-[#FF6A1A]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A]"
          >
            <span>View Case Study ↗</span>
          </button>

          {project.demo && project.demo !== '#' && (
            <MagneticButton
              href={project.demo}
              isTouchOrReduced={isTouchOrReduced}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white font-medium text-xs uppercase tracking-wider hover:border-[#FF6A1A] hover:text-[#FF6A1A] transition-colors cursor-pointer"
            >
              <span>Live demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </MagneticButton>
          )}

          {project.repo && project.repo !== '#' && (
            <MagneticButton
              href={project.repo}
              isTouchOrReduced={isTouchOrReduced}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white font-medium text-xs uppercase tracking-wider hover:border-[#FF6A1A] hover:text-[#FF6A1A] transition-colors cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </MagneticButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}
