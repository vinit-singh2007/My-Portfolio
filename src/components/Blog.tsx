'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  Clock,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Equal,
} from 'lucide-react';
import ArticleSlider from './blog/ArticleSlider';
import { articles, Article } from '@/lib/articles';

interface BlogSlide {
  title: string;
  points: string[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  slug: string;
  image?: string;
  imagePosition?: string;
  slides: BlogSlide[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Sitting on the edge of Kaldurg',
    excerpt:
      'A morning on the hill fort that keeps watch over Palghar, and why I came down quieter than I went up.',
    date: '2024-10-04',
    readTime: '6 min read',
    tag: 'TREKKING',
    slug: '/blog/kaldurg-fort',
    image: '/kaldurg.jpg',
    slides: [
      {
        title: 'Kaldurg Fort, Palghar',
        points: [
          'Some places only make sense once you stop moving. Kaldurg is one of them.',
          'The fort sits in Palghar district, roughly 75 km from Mumbai by road.',
          'I went for the climb. I stayed for the ledge at the top, where the rock simply ends.',
        ],
      },
      {
        title: 'The climb',
        points: [
          'The path winds through forest first, with shade and the smell of wet leaves.',
          'Slowly opens up onto bare rock — steady, and the rocky stretches ask for attention after rain.',
          'About two hours in, the trees thin out and you can feel the air change.',
        ],
      },
      {
        title: 'The fort at the top',
        points: [
          'What remains is quiet and weathered: water tanks cut into the rock, old fortification.',
          'From the top you look east toward the Surya river, and west toward the Arabian Sea.',
          'On a clear day it is a wide, generous view.',
        ],
      },
      {
        title: 'Doing nothing, on purpose',
        points: [
          'No phone, no plan, no next step. Just the wind, a very long drop.',
          'A town that looked like it belonged to a different world.',
          'That is the real reason I keep going back to the hills.',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'ETHGlobal Mumbai: An Experience Beyond Building',
    excerpt:
      'Three days of learning, building and meeting people from the Web3 ecosystem, and what I took away from it.',
    date: '2026-11-07',
    readTime: '4 min read',
    tag: 'HACKATHON',
    slug: '/blog/hackathon-mumbai',
    image: '/ethglobal_card_final.jpg',
    imagePosition: 'right',
    slides: [
      {
        title: 'ETHGlobal Mumbai: Stepping into the Arena',
        points: [
          'Attending ETHGlobal Mumbai was an electrifying immersion into the cutting edge of Web3 and decentralized protocols.',
          '36 hours of non-stop ideation, architecture design, and sprint development alongside global builders.',
          'Alongside my friend and teammate Shakti Singh, we took on the challenge to architect and build ORCA.',
        ],
      },
      {
        title: 'Building ORCA: Hands-on Web3 Engineering',
        points: [
          'Engineered ORCA to explore new paradigms in decentralized application workflows and user onboarding.',
          'Integrated Ethereum smart contracts with reactive frontends using ethers.js / viem and Next.js.',
          'Navigated contract security, gas optimization tradeoffs, and decentralized storage systems.',
        ],
      },
      {
        title: 'Hands-on Ethereum & Ecosystem Learnings',
        points: [
          'Gained a deep, hands-on understanding of EVM execution, state transitions, and smart contract lifecycles.',
          'Explored practical, real-world applications of decentralized tech beyond just speculative hype.',
          'Debugged asynchronous transaction states, RPC latency, and wallet signing edge cases under tight deadlines.',
        ],
      },
      {
        title: 'The Real Win: Connections & Community',
        points: [
          'Met incredible founders, core protocol developers, and passionate builders from across the globe.',
          'Received hands-on mentorship and technical feedback directly from ecosystem leaders and sponsor teams.',
          'Forged lasting friendships and experienced the collaborative open-source spirit that defines Web3.',
        ],
      },
      {
        title: 'Keep Learning. Keep Building. Keep Exploring.',
        points: [
          'Hackathons push you to ship fast, embrace ambiguity, and learn ten times faster than in isolation.',
          'True growth happens when hands-on execution meets community collaboration and high ambition.',
          'Deeply grateful for the experience, the memories, and everything learned. Ready for what comes next.',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'How I’m Learning the MERN Stack, One Layer at a Time',
    excerpt:
      'A bottom-up roadmap through MongoDB, Express, React and Node.js, plus the mistakes I made along the way.',
    date: '2026-11-15',
    readTime: '7 min read',
    tag: 'LEARNING',
    slug: '/blog/learning-mern',
    image: '/blog_mern.png',
    slides: [
      {
        title: 'Learning MERN',
        points: [
          'A full-stack journey from JavaScript to deployed app.',
          'Understanding how the database, server, and interface talk to each other.',
          'One language across every layer: MongoDB, Express, React, and Node.js all speak JavaScript.',
        ],
      },
      {
        title: 'The order that worked for me',
        points: [
          '1. Modern JavaScript first: destructuring, promises and async/await.',
          '2. Node.js and Express: a small REST API before any database.',
          '3. MongoDB with Mongoose: schemas, then create, read, update, delete.',
          '4. React for the interface: components, state, effects, fetching.',
          '5. Connect it and ship it: auth, env variables, deployment.',
        ],
      },
      {
        title: 'The first thing that made sense',
        points: [
          'One Express route talking to MongoDB showed me how the pieces fit.',
          'app.get("/api/posts", async (req, res) => { const posts = await Post.find().sort({ createdAt: -1 }); res.json(posts); });',
          'React calls fetch("/api/posts") and renders the result. That round trip is the whole stack in miniature.',
        ],
      },
      {
        title: 'Mistakes I made so you don’t have to',
        points: [
          'Jumping into React before understanding how a server responds.',
          'Skipping validation, then finding bad data in the database.',
          'Committing my .env file. Add it to .gitignore on day one.',
          'Only following tutorials. Building my own small project taught me more.',
        ],
      },
      {
        title: 'What I’m building next',
        points: [
          'My rule now: after every new concept, build something tiny with it the same day.',
          'Next up is a full CRUD app with login, then a project I can deploy and share.',
        ],
      },
    ],
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
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isStackHovered, setIsStackHovered] = useState<boolean>(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close modal on Escape key & arrow navigation & manage body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePost) return;
      if (e.key === 'Escape') {
        setActivePost(null);
      } else if (e.key === 'ArrowRight') {
        setActiveSlideIndex((prev) =>
          Math.min(activePost.slides.length - 1, prev + 1)
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };
    if (activePost) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePost]);

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
          {[0, 1, 2]
            .map((offset) => BLOG_POSTS[(startIndex + offset) % BLOG_POSTS.length])
            .map((post, index) => {
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
                  onClick={(e) => {
                    e.preventDefault();
                    // If slug is an ArticleSlider article → open the slider overlay
                    const matched = articles.find((a) => post.slug.endsWith(a.slug));
                    if (matched) {
                      setActiveArticle(matched);
                    } else if (post.slug.startsWith('/blog/')) {
                      // Real Next.js route → navigate directly to the page
                      router.push(post.slug);
                    } else {
                      // Fallback: internal slide carousel modal
                      setActivePost(post);
                      setActiveSlideIndex(0);
                    }
                  }}
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
                  className="fanned-card absolute block rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8651a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] cursor-pointer"
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
                          className="object-cover"
                          style={{ objectPosition: post.imagePosition ?? 'center' }}
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

                      {/* ── 2. Top-Right Circular Arrow Button ── */}
                      <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
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

      {/* ── Stack Navigation Dots & Arrows ── */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={() =>
            setStartIndex((prev) => (prev - 1 + BLOG_POSTS.length) % BLOG_POSTS.length)
          }
          aria-label="Previous article in stack"
          suppressHydrationWarning
          className="w-8 h-8 rounded-full border border-zinc-800/80 bg-[#141416]/90 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {BLOG_POSTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setStartIndex(i)}
              aria-label={`Show stack starting with: ${p.title}`}
              suppressHydrationWarning
              className="p-1 cursor-pointer focus:outline-none"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${i === startIndex ? 'w-6 bg-[#e8651a]' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => setStartIndex((prev) => (prev + 1) % BLOG_POSTS.length)}
          aria-label="Next article in stack"
          suppressHydrationWarning
          className="w-8 h-8 rounded-full border border-zinc-800/80 bg-[#141416]/90 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Carousel Reader Modal ── */}
      <AnimatePresence>
        {activePost && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden"
            style={{
              backgroundColor: '#0a0b0d',
            }}
            onClick={() => setActivePost(null)}
          >
            <button
              onClick={() => setActivePost(null)}
              suppressHydrationWarning
              aria-label="Back to blog"
              className="fixed left-4 top-4 z-[150] text-white text-[14px] px-4 py-2 rounded-full border border-white/20 bg-[#0a0e12]/50 backdrop-blur-md hover:border-[#e8651a] hover:text-[#e8651a] transition-colors cursor-pointer"
            >
              &larr; Blog
            </button>
            {/* Live Moving Clouds Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/cloud_backdrop.png"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
              src="/clouds.mp4"
            />

            {/* Ambient Dark Overlay */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] pointer-events-none z-0" />

            {/* Central Frosted Glass Card */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 15 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-[470px] min-h-[460px] sm:min-h-[490px] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between text-left shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
              style={{
                backgroundColor: 'rgba(26, 28, 31, 0.76)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Top Bar: '← All posts' and slide counter '4 / 5' + icon */}
              <div className="flex items-center justify-between pb-3">
                <button
                  onClick={() => setActivePost(null)}
                  suppressHydrationWarning
                  className="flex items-center gap-2 text-zinc-300 hover:text-white text-[13px] font-medium transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Blog</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-zinc-400">
                    {activeSlideIndex + 1} / {activePost.slides.length}
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 select-none"
                    title="Slide view"
                  >
                    <Equal className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Middle Slide Content */}
              <div className="py-6 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlideIndex}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <h3 className="font-bold text-[19px] sm:text-[20px] text-white tracking-tight leading-snug mb-5">
                      {activePost.slides[activeSlideIndex]?.title}
                    </h3>
                    <ul className="space-y-4">
                      {activePost.slides[activeSlideIndex]?.points.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] leading-relaxed text-zinc-300"
                        >
                          <span className="text-zinc-400 select-none mt-[1px] text-base leading-none">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation: <   ••—••   > */}
              <div className="pt-3 flex items-center justify-between border-t border-white/5">
                {/* Prev Button */}
                <button
                  onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeSlideIndex === 0}
                  aria-label="Previous slide"
                  suppressHydrationWarning
                  className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${activeSlideIndex === 0
                      ? 'opacity-25 cursor-not-allowed text-zinc-600'
                      : 'bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white cursor-pointer active:scale-95'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Pagination Dots */}
                <div className="flex items-center gap-2">
                  {activePost.slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      suppressHydrationWarning
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeSlideIndex
                            ? 'w-6 bg-[#e8651a]'
                            : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
                          }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setActiveSlideIndex((prev) =>
                      Math.min(activePost.slides.length - 1, prev + 1)
                    )
                  }
                  disabled={activeSlideIndex === activePost.slides.length - 1}
                  aria-label="Next slide"
                  suppressHydrationWarning
                  className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${activeSlideIndex === activePost.slides.length - 1
                      ? 'opacity-25 cursor-not-allowed text-zinc-600'
                      : 'bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white cursor-pointer active:scale-95'
                    }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ArticleSlider (ETHGlobal Mumbai Hero Banner & MERN Clouds) ── */}
      {activeArticle && (
        <ArticleSlider
          slides={activeArticle.slides}
          bg={activeArticle.bg}
          side={activeArticle.side}
          banner={activeArticle.banner}
          onClose={() => setActiveArticle(null)}
        />
      )}

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
