'use client';

import React from 'react';
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiTailwindcss,
  SiRedux,
  SiFramer,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiVercel,
  SiFigma,
} from 'react-icons/si';
import { FaAws, FaJava } from 'react-icons/fa6';
import { TbDatabase } from 'react-icons/tb';

// ── Easy-to-Edit Marquee Item Arrays ──
export const ROW_1_ITEMS = [
  { name: 'React', icon: SiReact },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Express', icon: SiExpress },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Redux Toolkit', icon: SiRedux },
  { name: 'Framer Motion', icon: SiFramer },
];

export const ROW_2_ITEMS = [
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'Python', icon: SiPython },
  { name: 'Java', icon: FaJava },
  { name: 'C++', icon: SiCplusplus },
  { name: 'SQL', icon: TbDatabase },
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Git', icon: SiGit },
  { name: 'AWS', icon: FaAws },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Figma', icon: SiFigma },
];

function MarqueePill({
  name,
  icon: Icon,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="group/pill inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#141414] text-zinc-300 border border-white/[0.08] shadow-sm select-none transition-all duration-300 cursor-default hover:border-[#FF6A1A]/70 hover:text-[#FF6A1A] hover:bg-[#FF6A1A]/[0.08] hover:shadow-[0_0_15px_rgba(255,106,26,0.22)]">
      <Icon className="w-4 h-4 text-zinc-400 group-hover/pill:text-[#FF6A1A] transition-colors duration-300 shrink-0" />
      <span className="whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="w-full flex flex-col gap-4 overflow-hidden py-2">
      {/* Row 1: Scrolls Left (~30s loop) */}
      <div className="marquee-mask overflow-hidden w-full">
        <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] py-1">
          {/* First loop half */}
          <div className="flex shrink-0 items-center gap-3.5 pr-3.5">
            {ROW_1_ITEMS.map((item, index) => (
              <MarqueePill key={`r1-a-${index}`} name={item.name} icon={item.icon} />
            ))}
            {ROW_1_ITEMS.map((item, index) => (
              <MarqueePill key={`r1-b-${index}`} name={item.name} icon={item.icon} />
            ))}
          </div>

          {/* Second loop half (duplicate for seamless infinite loop) */}
          <div className="flex shrink-0 items-center gap-3.5 pr-3.5" aria-hidden="true">
            {ROW_1_ITEMS.map((item, index) => (
              <MarqueePill key={`r1-c-${index}`} name={item.name} icon={item.icon} />
            ))}
            {ROW_1_ITEMS.map((item, index) => (
              <MarqueePill key={`r1-d-${index}`} name={item.name} icon={item.icon} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Scrolls Right (~36s loop, opposite direction) */}
      <div className="marquee-mask overflow-hidden w-full">
        <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] py-1">
          {/* First loop half */}
          <div className="flex shrink-0 items-center gap-3.5 pr-3.5">
            {ROW_2_ITEMS.map((item, index) => (
              <MarqueePill key={`r2-a-${index}`} name={item.name} icon={item.icon} />
            ))}
            {ROW_2_ITEMS.map((item, index) => (
              <MarqueePill key={`r2-b-${index}`} name={item.name} icon={item.icon} />
            ))}
          </div>

          {/* Second loop half (duplicate for seamless infinite loop) */}
          <div className="flex shrink-0 items-center gap-3.5 pr-3.5" aria-hidden="true">
            {ROW_2_ITEMS.map((item, index) => (
              <MarqueePill key={`r2-c-${index}`} name={item.name} icon={item.icon} />
            ))}
            {ROW_2_ITEMS.map((item, index) => (
              <MarqueePill key={`r2-d-${index}`} name={item.name} icon={item.icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

