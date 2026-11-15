'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  slug: string;
  image?: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Building Scalable Full-Stack Apps with React & Node.js',
    excerpt:
      'A deep dive into architecting production-ready web applications — from component design patterns on the frontend to RESTful API structuring and database optimization on the backend.',
    date: '2025-10-28',
    readTime: '8 min read',
    tag: 'Full-Stack',
    slug: '#',
    image: '/project_day0.png',
  },
  {
    id: 2,
    title: 'How I Built a Real-Time Deepfake Detection Pipeline',
    excerpt:
      'Exploring the AI/ML pipeline behind DeepShield — frame-by-frame lip-sync verification, facial landmark analysis with PyTorch and OpenCV, and temporal anomaly detection across video timelines.',
    date: '2025-09-15',
    readTime: '12 min read',
    tag: 'AI/ML',
    slug: '#',
    image: '/project_deepshield.png',
  },
  {
    id: 3,
    title: 'From Concept to Deploy: Autonomous Drone Fleet Dispatch',
    excerpt:
      'Lessons learned engineering Delivr-X — dynamic 3D route planning, Scikit-Learn battery decay prediction, Google Gemini safety clearance, and real-time WebSocket telemetry at scale.',
    date: '2025-08-03',
    readTime: '10 min read',
    tag: 'Engineering',
    slug: '#',
    image: '/project_Delivr-x.png',
  },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Placeholder component when a post has no cover image:
 * A subtle dark grid pattern with an orange accent glow.
 */
function PlaceholderCover() {
  return (
    <div className="w-full h-full bg-[#141416] relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
      <div className="w-24 h-24 rounded-full bg-[#e8651a]/20 blur-xl pointer-events-none" />
      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest relative z-10 select-none">
        Article Cover
      </span>
    </div>
  );
}

export default function Blog() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isStackHovered, setIsStackHovered] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="blog"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative select-none scroll-mt-20 overflow-hidden"
    >
      {/* ── Section Heading ── */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6A1A] font-semibold mb-2.5"
        >
          INSIGHTS &amp; ARTICLES
        </motion.p>
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight"
        >
          Blog
        </motion.h2>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 max-w-lg mx-auto font-light text-sm md:text-base"
        >
          Thoughts on building, breaking, and shipping software.
        </motion.p>
      </div>

      {/* ── Fanned, Overlapping Cards Stage ── */}
      <div className="w-full flex items-center justify-center py-4">
        <div
          onMouseEnter={() => setIsStackHovered(true)}
          onMouseLeave={() => {
            setIsStackHovered(false);
            setHoveredIndex(null);
          }}
          className="fanned-stack-stage relative flex items-center justify-center"
          style={{
            width: '760px',
            height: '490px',
          }}
        >
          {BLOG_POSTS.slice(0, 3).map((post, index) => {
            const isHovered = hoveredIndex === index;

            // ── Positioning & Rotation Specifications ──
            // Left card: -8deg, x: -215px, y: 16px, z: 1
            // Middle card: 0deg, x: 0px, y: -8px, z: 3
            // Right card: +8deg, x: 215px, y: 16px, z: 2
            let defaultX = 0;
            let defaultY = -8;
            let defaultRot = 0;
            let baseZ = 3;

            if (index === 0) {
              defaultX = -215;
              defaultY = 16;
              defaultRot = -8;
              baseZ = 1;
            } else if (index === 2) {
              defaultX = 215;
              defaultY = 16;
              defaultRot = 8;
              baseZ = 2;
            }

            // When stack is hovered, spread side cards ~12% further apart
            let targetX = defaultX;
            if (isStackHovered && !isHovered) {
              if (index === 0) targetX = -241; // -215 * 1.12
              if (index === 2) targetX = 241;  // +215 * 1.12
            }

            // When this card is hovered: straighten (rot: 0), lift 20px, scale 1.03, bring to front
            let transformStr = `translate3d(${targetX}px, ${defaultY}px, 0) rotate(${defaultRot}deg)`;
            let zIndexVal = baseZ;

            if (isHovered) {
              zIndexVal = 20;
              const liftedY = defaultY - 20;
              transformStr = `translate3d(${targetX}px, ${liftedY}px, 0) rotate(0deg) scale(1.03)`;
            }

            if (shouldReduceMotion) {
              transformStr = `translate3d(${defaultX}px, ${defaultY}px, 0)`;
            }

            return (
              <a
                key={post.id}
                href={post.slug}
                target={post.slug !== '#' ? '_blank' : undefined}
                rel={post.slug !== '#' ? 'noopener noreferrer' : undefined}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => {
                  setIsStackHovered(true);
                  setHoveredIndex(index);
                }}
                onBlur={() => {
                  setIsStackHovered(false);
                  setHoveredIndex(null);
                }}
                aria-label={`Read article: ${post.title}`}
                className="fanned-card absolute block rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8651a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                style={{
                  width: '330px',
                  height: '430px',
                  backgroundColor: '#101010',
                  border: isHovered ? '1px solid #e8651a' : '1px solid #262626',
                  borderRadius: '28px',
                  boxShadow: isHovered
                    ? '0 32px 70px rgba(0,0,0,0.7), 0 0 30px rgba(232,101,26,0.18)'
                    : '0 28px 60px rgba(0,0,0,0.5)',
                  transform: transformStr,
                  zIndex: zIndexVal,
                  transition: shouldReduceMotion
                    ? 'none'
                    : 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 450ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 450ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  willChange: 'transform',
                }}
              >
                <div className="w-full h-full flex flex-col overflow-hidden rounded-[28px] pointer-events-auto">
                  {/* ── 1. Cover Image Box (10px margin, 20px radius, 170px tall) ── */}
                  <div
                    className="relative overflow-hidden flex-shrink-0"
                    style={{
                      margin: '10px 10px 0 10px',
                      borderRadius: '20px',
                      height: '170px',
                    }}
                  >
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        loading="lazy"
                        sizes="330px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <PlaceholderCover />
                    )}

                    {/* Subtle dark gradient overlay at the top so badges stay crisp */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)',
                      }}
                    />

                    {/* ── 2. Top Badges: Category Tag Chip & Circular Arrow Button ── */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      {/* Category Tag Chip */}
                      <span
                        className="font-mono text-[11px] font-semibold tracking-[0.08em] px-2.5 py-1 rounded-[6px] border backdrop-blur-md select-none"
                        style={{
                          color: '#e8651a',
                          backgroundColor: 'rgba(232, 101, 26, 0.12)',
                          borderColor: 'rgba(232, 101, 26, 0.3)',
                        }}
                      >
                        {post.tag}
                      </span>

                      {/* 32px Circular Arrow Button */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isHovered ? '#e8651a' : 'rgba(0, 0, 0, 0.45)',
                          borderColor: isHovered ? '#e8651a' : 'rgba(255, 255, 255, 0.2)',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          color: isHovered ? '#000000' : '#ffffff',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                      </div>
                    </div>
                  </div>

                  {/* ── 3 & 4. Title and Excerpt ── */}
                  <div className="px-5 pt-3.5 pb-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* 3. Title: Inter, 19px, bold, tight line-height */}
                      <h3
                        className="font-bold text-white leading-[1.25] tracking-tight mb-2 line-clamp-2"
                        style={{
                          fontSize: '19px',
                        }}
                      >
                        {post.title}
                      </h3>

                      {/* 4. Excerpt: muted grey (#8a8a8a), 14px, clamped to 2 lines with ellipsis */}
                      <p
                        className="leading-relaxed line-clamp-2"
                        style={{
                          fontSize: '14px',
                          color: '#8a8a8a',
                        }}
                      >
                        {post.excerpt}
                      </p>
                    </div>

                    {/* ── 5. Footer: Thin top divider, Calendar with date, Clock with read time ── */}
                    <div
                      className="pt-3 flex items-center justify-between border-t"
                      style={{
                        borderColor: '#262626',
                      }}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8a8a8a]">
                        <Calendar className="w-3.5 h-3.5 text-[#8a8a8a]" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8a8a8a]">
                        <Clock className="w-3.5 h-3.5 text-[#8a8a8a]" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Responsive Scaling Styles ── */}
      <style jsx>{`
        .fanned-stack-stage {
          transform-origin: center center;
          transition: transform 300ms ease;
        }
        @media (max-width: 860px) {
          .fanned-stack-stage {
            transform: scale(0.7);
            margin: -40px 0;
          }
        }
        @media (max-width: 520px) {
          .fanned-stack-stage {
            transform: scale(0.5);
            margin: -90px 0;
          }
        }
      `}</style>
    </section>
  );
}
