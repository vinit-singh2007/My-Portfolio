'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ThreeBackground from './ThreeBackground';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';

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

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : 'dark';

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop >= 0 ? offsetTop : 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative px-6 pt-24 overflow-hidden"
    >
      {/* Background Elements Container with smooth bottom fade-out mask */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, white calc(100% - 160px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, white calc(100% - 160px), transparent 100%)',
        }}
      >
        {/* 3D Particle Background */}
        <ThreeBackground />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
          style={{
            backgroundImage: currentTheme === 'dark'
              ? 'linear-gradient(to right, rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.03) 1px, transparent 1px)'
              : 'linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)',
            transition: 'background-image 0.5s ease',
          }}
        />

        {/* Decorative Glow Spheres */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 py-12">
        {/* Left column (Content) */}
        <div className="lg:col-span-8 space-y-6 text-left flex flex-col justify-center">
          {/* Social Icons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400"
          >
            <a
              href="https://github.com/vinit-singh2007"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-5.5 h-5.5" />
            </a>
            <a
              href="https://linkedin.com/in/vinitsi-2043-"
              className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-5.5 h-5.5" />
            </a>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.15] text-zinc-900 dark:text-white"
          >
             VINIT SINGH<span className="text-indigo-500 dark:text-cyan-400">.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-2xl md:text-4xl font-bold text-zinc-500 dark:text-zinc-400"
          >
            I&apos;m a{' '}
            <span className="text-indigo-600 dark:text-cyan-400 font-extrabold">
              Software Engineer
            </span>

          </motion.h2>

          {/* Bio Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed font-light"
          >
            Heavy on the backend, obsessed with AI/ML, and capable enough in frontend to make sure my models don&apos;t look like an Excel sheet.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <button
              suppressHydrationWarning
              onClick={() => scrollTo('contact')}
              className="px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-indigo-600 text-white dark:bg-cyan-400 dark:text-zinc-950 hover:bg-indigo-700 dark:hover:bg-cyan-300 transition-colors shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => scrollTo('projects')}
              className="px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase border border-indigo-600/20 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-600 dark:border-cyan-400/20 dark:text-cyan-400 dark:hover:bg-cyan-950/30 dark:hover:border-cyan-400 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>LEARN MORE</span>
            </button>
          </motion.div>
        </div>

        {/* Right column (Illustration) - Hidden on mobile, visible on desktop */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="hidden lg:flex lg:col-span-4 justify-center lg:justify-end"
        >
          {/* Illustration card with glow */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-[340px] md:w-[460px] lg:w-[500px]"
          >
            {/* Glow effect behind image */}
            <div
              className="absolute -inset-3 rounded-2xl blur-2xl opacity-35 transition-all duration-500"
              style={{
                background: currentTheme === 'dark'
                  ? 'linear-gradient(135deg, #0e7490 0%, #06b6d4 40%, #0891b2 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #93c5fd 100%)',
              }}
            />
            {/* Image container */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 dark:border-cyan-400/20 shadow-2xl shadow-cyan-500/10 transition-colors duration-500">
              <Image
                src={currentTheme === 'dark' ? '/final_image.png' : '/final_img_light.png'}
                alt="Tech Illustration"
                width={500}
                height={375}
                className="object-cover w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10"
        onClick={() => scrollTo('projects')}
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase opacity-40 hover:opacity-80 transition-opacity text-zinc-500 dark:text-zinc-400">
          Scroll Down
        </span>
        <div className="w-4.5 h-7 rounded-full border border-zinc-400/40 dark:border-zinc-700/40 flex justify-center p-1">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
