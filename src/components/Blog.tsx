'use client';

import React, { useRef } from 'react';
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

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--mx', '-300px');
    cardRef.current.style.setProperty('--my', '-300px');
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <a
        href={post.slug}
        target={post.slug !== '#' ? '_blank' : undefined}
        rel={post.slug !== '#' ? 'noopener noreferrer' : undefined}
        className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] rounded-2xl"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bento-glow-card w-full p-6 sm:p-7 flex flex-col justify-between gap-5 rounded-2xl cursor-pointer min-h-[220px]"
        >
          {/* Top: Tag + Arrow Badge */}
          <div className="flex items-center justify-between relative z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-[#FF6A1A]/25 bg-[#FF6A1A]/10 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#FF6A1A]">
              {post.tag}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center relative overflow-hidden group-hover:bg-[#FF6A1A] group-hover:border-[#FF6A1A] transition-colors duration-300 flex-shrink-0">
              <ArrowUpRight className="w-4 h-4 text-white absolute transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full" />
              <ArrowUpRight className="w-4 h-4 text-black absolute transition-transform duration-300 ease-out -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0" />
            </div>
          </div>

          {/* Middle: Title & Excerpt */}
          <div className="relative z-10 flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug group-hover:text-[#FF6A1A] transition-colors duration-200 mb-2.5">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* Bottom: Date & Read Time */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/[0.06] relative z-10">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
              <Calendar className="w-3 h-3" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Blog() {
  return (
    <section id="blog" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative select-none scroll-mt-20">
      {/* Section Heading */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6A1A] font-semibold mb-2.5"
        >
          INSIGHTS &amp; ARTICLES
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight"
        >
          Blog
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 max-w-lg mx-auto font-light text-sm md:text-base"
        >
          Thoughts on building, breaking, and shipping software.
        </motion.p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] w-full">
        {BLOG_POSTS.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}

