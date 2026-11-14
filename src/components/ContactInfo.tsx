'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ContactInfo() {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('vinitsingh.builds@gmail.com');
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--mx', '-300px');
    e.currentTarget.style.setProperty('--my', '-300px');
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : custom * 0.1,
        ease: [0.2, 0.8, 0.2, 1] as const,
      },
    }),
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* 1. Title */}
        <motion.h3
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={itemVariants}
          className="text-2xl font-bold text-white tracking-tight"
        >
          Contact Information
        </motion.h3>

        {/* 2. Status Pill (Open to work) */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={itemVariants}
          className="mt-3 mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.14] bg-white/[0.03] text-xs font-medium text-[#d4d4de] select-none">
            <span
              className="w-2 h-2 rounded-full bg-[#22c55e] animate-status-beacon flex-shrink-0"
              aria-hidden="true"
            />
            <span>Open to work</span>
          </div>
        </motion.div>

        {/* 3. Intro Paragraph */}
        <motion.p
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={itemVariants}
          className="text-zinc-400 font-light text-sm leading-relaxed mb-6"
        >
          I am open to discuss interesting freelance roles, remote contract opportunities, or full-time engagements.
        </motion.p>

        {/* 4. Email Card */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={itemVariants}
          className="mb-3"
        >
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={
              {
                '--card-color': '#f97316',
                '--card-glow': 'rgba(249, 115, 22, 0.14)',
              } as React.CSSProperties
            }
            className="contact-glow-card rounded-[16px] p-[14px_16px] flex items-center gap-[14px] relative"
          >
            {/* Orange gradient icon tile */}
            <div
              className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-sm relative z-10"
              style={{
                background:
                  'linear-gradient(135deg, #f97316, color-mix(in srgb, #f97316 45%, white))',
              }}
            >
              <Mail className="w-5 h-5 text-[#0a0a0a] stroke-[2.2]" />
            </div>

            {/* Label and Value */}
            <div className="min-w-0 flex-1 relative z-10">
              <span className="block font-mono text-[11px] tracking-[0.1em] uppercase font-semibold text-[#f97316]">
                EMAIL
              </span>
              <a
                href="mailto:vinitsingh.builds@gmail.com"
                className="text-sm font-semibold text-white hover:text-orange-200 transition-colors block [overflow-wrap:anywhere] break-all leading-snug"
              >
                vinitsingh.builds@gmail.com
              </a>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className={`ml-auto flex-shrink-0 self-center text-xs font-medium px-[13px] py-[5px] rounded-full transition-all duration-200 relative z-10 select-none ${
                copied
                  ? 'bg-[#f97316] text-[#0a0a0a] border border-[#f97316] font-semibold'
                  : 'border border-white/[0.18] text-[#d4d4de] hover:border-[#f97316] hover:text-white bg-transparent'
              }`}
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </motion.div>

        {/* 5. Location Card */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={itemVariants}
        >
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={
              {
                '--card-color': '#38bdf8',
                '--card-glow': 'rgba(56, 189, 248, 0.14)',
              } as React.CSSProperties
            }
            className="contact-glow-card rounded-[16px] p-[14px_16px] flex items-center gap-[14px] relative"
          >
            {/* Sky blue gradient icon tile */}
            <div
              className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-sm relative z-10"
              style={{
                background:
                  'linear-gradient(135deg, #38bdf8, color-mix(in srgb, #38bdf8 45%, white))',
              }}
            >
              <MapPin className="w-5 h-5 text-[#0a0a0a] stroke-[2.2]" />
            </div>

            {/* Label and Value */}
            <div className="min-w-0 flex-1 relative z-10">
              <span className="block font-mono text-[11px] tracking-[0.1em] uppercase font-semibold text-[#38bdf8]">
                LOCATION
              </span>
              <span className="text-sm font-semibold text-white block leading-snug">
                Mumbai, India
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. Social Buttons (GitHub & LinkedIn) */}
      <motion.div
        custom={5}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={itemVariants}
        className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-3 mt-6"
      >
        {/* GitHub Button */}
        <a
          href="https://github.com/vinit-singh2007"
          target="_blank"
          rel="noopener noreferrer"
          style={{ '--social-color': '#a78bfa' } as React.CSSProperties}
          className="contact-social-btn p-[14px_16px] flex items-center gap-3 text-white group"
        >
          <span className="relative z-10 flex items-center gap-3 w-full">
            <GithubIcon className="w-5 h-5 transition-colors duration-300 group-hover:text-[#0a0a0a] group-focus-visible:text-[#0a0a0a]" />
            <span className="text-sm font-medium transition-colors duration-300 group-hover:text-[#0a0a0a] group-focus-visible:text-[#0a0a0a]">
              GitHub
            </span>
            <span
              className="ml-auto text-base leading-none font-medium transition-all duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px] group-hover:text-[#0a0a0a] group-focus-visible:text-[#0a0a0a]"
              aria-hidden="true"
            >
              ↗
            </span>
          </span>
        </a>

        {/* LinkedIn Button */}
        <a
          href="https://linkedin.com/in/vinitsi-2043-"
          target="_blank"
          rel="noopener noreferrer"
          style={{ '--social-color': '#0a66c2' } as React.CSSProperties}
          className="contact-social-btn p-[14px_16px] flex items-center gap-3 text-white group"
        >
          <span className="relative z-10 flex items-center gap-3 w-full">
            <LinkedinIcon className="w-5 h-5 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white" />
            <span className="text-sm font-medium transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
              LinkedIn
            </span>
            <span
              className="ml-auto text-base leading-none font-medium transition-all duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px] group-hover:text-white group-focus-visible:text-white"
              aria-hidden="true"
            >
              ↗
            </span>
          </span>
        </a>
      </motion.div>
    </div>
  );
}
