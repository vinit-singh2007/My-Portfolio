'use client';

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

export const X_URL = "https://x.com/AxeVinSi";

interface SocialLink {
  name: string;
  url: string;
  ariaLabel: string;
  icon: (className?: string) => React.ReactNode;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function HeroSocials() {
  const shouldReduceMotion = useReducedMotion();

  const socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/vinitsi-2043-',
      ariaLabel: 'LinkedIn',
      icon: (cls) => <LinkedInIcon className={cls} />,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/vinit-singh2007',
      ariaLabel: 'GitHub',
      icon: (cls) => <GitHubIcon className={cls} />,
    },
  ];

  if (X_URL && X_URL.trim() !== '') {
    socialLinks.push({
      name: 'X',
      url: X_URL,
      ariaLabel: 'X',
      icon: (cls) => <XIcon className={cls} />,
    });
  }

  // Animation variants
  const railContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: shouldReduceMotion ? 0 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.13,
      },
    },
  };

  const lineVariantsTop: Variants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.9,
        ease: [0.7, 0, 0.2, 1] as const,
      },
    },
  };

  const lineVariantsBottom: Variants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.9,
        ease: [0.7, 0, 0.2, 1] as const,
      },
    },
  };

  const labelVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 26 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: [0.2, 0.8, 0.2, 1] as const,
      },
    },
  };

  return (
    <>
      {/* ── DESKTOP VERTICAL RAIL (768px and wider) ── */}
      <nav
        aria-label="Social links"
        className="hidden md:flex absolute right-[30px] top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-[14px]"
      >
        {/* Top Decorative Line */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={lineVariantsTop}
          style={{ originY: 0 }}
          className="w-[1px] h-10 lg:h-16 bg-gradient-to-b from-transparent to-white/50 origin-top"
          aria-hidden="true"
        />

        {/* Vertical FOLLOW Label */}
        <motion.span
          initial="hidden"
          animate="visible"
          variants={labelVariants}
          className="font-mono text-[10px] tracking-[0.3em] text-[#8b8b99] [writing-mode:vertical-rl] select-none py-1"
          aria-hidden="true"
        >
          FOLLOW
        </motion.span>

        {/* Vertical Icon Buttons List */}
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={railContainerVariants}
          className="flex flex-col items-center gap-[14px] list-none p-0 m-0"
        >
          {socialLinks.map((social) => (
            <motion.li key={social.name} variants={itemVariants} className="relative group">
              {/* Tooltip on the left */}
              <div
                role="tooltip"
                className="hidden lg:flex absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 items-center opacity-0 translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-300 pointer-events-none z-30"
              >
                <div className="relative bg-white text-[#0a0a0a] text-[12px] font-medium rounded-[8px] px-2.5 py-1 whitespace-nowrap shadow-xl">
                  {social.name}
                  {/* Tooltip pointer arrow pointing right towards the icon */}
                  <span
                    className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[4px] border-l-white"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Icon Button */}
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="relative w-[42px] h-[42px] rounded-full border border-white/[0.18] bg-[#111114]/80 backdrop-blur-sm flex items-center justify-center text-[#d4d4de] transition-all duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:bg-[#f97316] group-hover:border-[#f97316] group-hover:text-[#0a0a0a] group-hover:scale-[1.12] group-hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-[3px] focus-visible:ring-offset-[#0a0a0a] active:scale-95"
              >
                {/* Pulsing ring on hover */}
                {!shouldReduceMotion && (
                  <span
                    className="absolute inset-0 rounded-full border border-[#f97316] opacity-0 group-hover:animate-social-pulse pointer-events-none"
                    aria-hidden="true"
                  />
                )}
                {social.icon('transition-colors duration-300')}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Bottom Decorative Line */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={lineVariantsBottom}
          style={{ originY: 1 }}
          className="w-[1px] h-10 lg:h-16 bg-gradient-to-b from-white/50 to-transparent origin-bottom"
          aria-hidden="true"
        />
      </nav>

      {/* ── MOBILE HORIZONTAL ROW (below 768px) ── */}
      <nav
        aria-label="Social links"
        className="flex md:hidden absolute right-6 sm:right-12 bottom-[78px] sm:bottom-[88px] z-20"
      >
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={railContainerVariants}
          className="flex items-center gap-3 list-none p-0 m-0"
        >
          {socialLinks.map((social) => (
            <motion.li key={`mobile-${social.name}`} variants={itemVariants}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="w-10 h-10 rounded-full border border-white/[0.18] bg-[#111114]/80 backdrop-blur-sm flex items-center justify-center text-[#d4d4de] transition-colors active:bg-[#f97316] active:border-[#f97316] active:text-[#0a0a0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
              >
                {social.icon('transition-colors duration-200')}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </>
  );
}

