'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, BookOpen, Mail } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',     label: 'Home',     icon: Home },
  { id: 'about',    label: 'About',    icon: User },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'blog',     label: 'Blog',     icon: BookOpen },
  { id: 'contact',  label: 'Contact',  icon: Mail },
];

/**
 * Reliable scroll-spy for a stacked/sticky layout.
 * Uses getBoundingClientRect() so positions are always current, even for
 * sticky elements. Active = last section whose top ≤ 55 % of viewport height.
 */
function getActiveSection(): string {
  const scrollY = window.scrollY;
  const winH    = window.innerHeight;
  const docH    = document.documentElement.scrollHeight;

  if (scrollY <= 40)               return 'home';
  if (scrollY + winH >= docH - 40) return 'contact';

  const trigger = winH * 0.55; // 55 % — generous so tall sections register
  let   active  = 'home';

  for (const item of NAV_ITEMS) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= trigger) active = item.id;
  }

  return active;
}

export default function MobileNavbar() {
  const pathname = usePathname();
  const isBlog = pathname?.startsWith('/blog') || pathname !== '/';

  const [activeId, setActiveId] = useState<string>('home');
  // While this ref holds an id, scroll events keep showing that id
  // (prevents smooth-scroll intermediate positions from overriding a tap)
  const scrollLockRef = useRef<string | null>(null);
  const lockTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isBlog) return;

    const onScroll = () => {
      if (scrollLockRef.current !== null) {
        // Keep showing the tapped target while scroll animation runs
        setActiveId(scrollLockRef.current);
        return;
      }
      setActiveId(getActiveSection());
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set immediately on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [isBlog]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();

      // Set marker immediately and lock it during scroll animation
      setActiveId(id);
      scrollLockRef.current = id;
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(() => {
        scrollLockRef.current = null;
        // After lock expires, re-evaluate real position
        setActiveId(getActiveSection());
      }, 1400); // slightly longer than smooth-scroll duration

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';

      if (id === 'home') {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const el = document.getElementById(id);
      if (el) {
        // offset > 0  → land N px before the section top (more space above)
        // offset < 0  → land N px into the section (skips top padding, heading comes up)
        const OFFSETS: Record<string, number> = {
          about:    0,    // about slides up naturally
          projects: -24,  // skip pt-8 (32px) so heading is near top
          blog:     -72,  // skip most of py-24 (96px) so heading is near top
          contact:  -72,  // skip most of py-24 (96px) so "Let's Connect" is near top
        };
        const offset    = OFFSETS[id] ?? 70;
        const absTop    = el.getBoundingClientRect().top + window.scrollY;
        const targetTop = Math.max(0, absTop - offset);
        window.scrollTo({ top: targetTop, behavior });
      }
    },
    []
  );

  if (isBlog) {
    return null;
  }

  return (
    <nav
      aria-label="Main"
      className="fixed left-1/2 -translate-x-1/2 z-50 md:hidden bg-[rgba(255,255,255,0.88)] dark:bg-[rgba(20,20,20,0.88)] backdrop-blur-[14px] border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.16)] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-[18px] p-[3px] select-none"
      style={{
        bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        width: 'min(85%, 270px)',
      }}
    >
      <div className="flex items-center justify-between w-full">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-[3.5px] px-[2px] rounded-[15px] transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] ${
                isActive
                  ? 'border border-[#FF6A1A] text-[#FF6A1A] bg-[#FF6A1A]/[0.07]'
                  : 'border border-transparent text-[#737373] dark:text-[#888888] hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon size={15} strokeWidth={1.8} className="shrink-0" />
              <span className="text-[0.55rem] leading-none mt-[2px] tracking-tight font-sans">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
