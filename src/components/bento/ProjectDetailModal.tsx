'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
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

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onNextProject: () => void;
  currentIndex: number;
  totalCount: number;
  nextProjectTitle?: string;
}

const EASING = [0.22, 1, 0.36, 1] as const;

function TypewriterHighlights({
  highlights,
  projectId,
}: {
  highlights: string[];
  projectId: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(highlights);
      setIsTyping(false);
      setCurrentLineIndex(highlights.length);
      return;
    }

    setDisplayed(['']);
    setCurrentLineIndex(0);
    setIsTyping(true);

    let line = 0;
    let char = 0;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (line >= highlights.length) {
        setIsTyping(false);
        return;
      }

      const target = highlights[line];
      if (char <= target.length) {
        const text = target.slice(0, char);
        setDisplayed((prev) => {
          const next = [...prev];
          next[line] = text;
          return next;
        });
        char++;
        timer = setTimeout(tick, 12);
      } else {
        line++;
        char = 0;
        setCurrentLineIndex(line);
        if (line < highlights.length) {
          setDisplayed((prev) => [...prev, '']);
          timer = setTimeout(tick, 140);
        } else {
          setIsTyping(false);
        }
      }
    };

    // Delay slightly after modal slide-in (~300ms)
    timer = setTimeout(tick, 300);

    return () => clearTimeout(timer);
  }, [highlights, projectId, shouldReduceMotion]);

  const handleSkip = () => {
    setDisplayed(highlights);
    setIsTyping(false);
    setCurrentLineIndex(highlights.length);
  };

  return (
    <div
      className="pt-2 cursor-pointer select-none"
      onClick={handleSkip}
      title={isTyping ? 'Click to show all' : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
          HIGHLIGHTS
        </h3>
        {isTyping && (
          <span className="text-[10px] font-mono text-[#FF6A1A] animate-pulse">
            typing...
          </span>
        )}
      </div>
      <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {displayed.map((text, idx) => (
          <li
            key={idx}
            className="py-3 flex items-start gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] mt-2 flex-shrink-0" />
            <span>
              {text}
              {isTyping && idx === currentLineIndex && (
                <span className="inline-block w-[2px] h-[1.1em] bg-[#FF6A1A] ml-1 animate-pulse align-middle" />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectDetailModal({
  project,
  onClose,
  onNextProject,
  currentIndex,
  totalCount,
  nextProjectTitle,
}: ProjectDetailModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => backBtnRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} case study`}
        initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
        animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
        transition={{ duration: 0.6, ease: EASING }}
        className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0A] text-white flex flex-col selection:bg-[#FF6A1A]/30 selection:text-white"
      >
        {/* Sticky Top Header Bar */}
        <div className="sticky top-0 z-30 px-6 sm:px-12 lg:px-20 py-4 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
          <button
            suppressHydrationWarning
            ref={backBtnRef}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#FF6A1A] hover:text-black hover:border-[#FF6A1A] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A]"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </span>
        </div>

        {/* Case Study Content (Two-Column Layout) */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 pt-6 sm:pt-8 pb-12 sm:pb-16 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left Column: Screenshot / Preview + HIGHLIGHTS */}
            <div className="space-y-6 w-full">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#151515] text-zinc-500 font-mono text-sm">
                    {project.title} Preview
                  </div>
                )}
              </div>

              {/* HIGHLIGHTS (placed on the left side to balance both columns) */}
              {project.highlights && project.highlights.length > 0 && (
                <TypewriterHighlights
                  highlights={project.highlights}
                  projectId={project.id}
                />
              )}
            </div>

            {/* Right Column: Complete Information */}
            <div className="space-y-8">
              {/* Category */}
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#FF6A1A] block">
                {project.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                {project.title}
              </h1>

              {/* Full Description (Whole text) */}
              <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                {project.description}
              </p>

              {/* BUILT WITH */}
              <div className="pt-2">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  BUILT WITH
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141414] border border-white/10 text-zinc-200"
                    >
                      <TechStackIcon name={tech} raw={true} className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {project.demo && project.demo !== '#' && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6A1A] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#e55a10] transition-colors shadow-lg shadow-[#FF6A1A]/20 cursor-pointer"
                  >
                    <span>Live demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.repo && project.repo !== '#' && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-medium text-xs tracking-wider uppercase hover:border-[#FF6A1A] hover:text-[#FF6A1A] transition-colors cursor-pointer"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Next Project Link */}
          {nextProjectTitle && (
            <div className="mt-20 pt-10 border-t border-white/[0.08] flex justify-between items-center">
              <button
                suppressHydrationWarning
                type="button"
                onClick={onNextProject}
                className="group flex flex-col text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] rounded-lg p-2"
              >
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Next project
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white group-hover:text-[#FF6A1A] transition-colors duration-300">
                    {nextProjectTitle}
                  </span>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-[#FF6A1A] group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

