'use client';

import Image from 'next/image';

export default function Footer() {
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
    <footer className="w-full border-t border-zinc-200/10 dark:border-zinc-800/50 py-12 px-6 bg-white/20 dark:bg-slate-950/20 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <button
          suppressHydrationWarning
          onClick={() => scrollTo('hero')}
          className="text-lg font-bold tracking-wider cursor-pointer group flex items-center gap-2"
        >
          <div className="relative w-6 h-6 rounded-md overflow-hidden border border-zinc-200/20 dark:border-zinc-800/80 flex items-center justify-center bg-zinc-900/50 group-hover:scale-105 transition-transform duration-300 shadow-sm">
            <Image src="/logo.png" alt="AxeVin Logo" width={24} height={24} className="w-full h-full object-cover" />
          </div>
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            AxeVin
          </span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <button suppressHydrationWarning onClick={() => scrollTo('projects')} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors cursor-pointer">
            Projects
          </button>
          <button suppressHydrationWarning onClick={() => scrollTo('skills')} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors cursor-pointer">
            Skills
          </button>
          <button suppressHydrationWarning onClick={() => scrollTo('experience')} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors cursor-pointer">
            Experience
          </button>
          <button suppressHydrationWarning onClick={() => scrollTo('contact')} className="hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors cursor-pointer">
            Contact
          </button>
        </div>

        {/* Copyright */}
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-light">
          &copy; {new Date().getFullYear()} AxeVin. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
