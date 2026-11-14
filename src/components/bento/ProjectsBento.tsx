'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import ProjectDetailModal from './ProjectDetailModal';
import { PROJECTS, ProjectItem } from './ProjectData';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
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

export default function ProjectsBento() {
  // Day 0 (id: 1) is open by default
  const [openId, setOpenId] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const currentModalIndex = selectedProject
    ? PROJECTS.findIndex((p) => p.id === selectedProject.id)
    : 0;
  const nextModalProject = selectedProject
    ? PROJECTS[(currentModalIndex + 1) % PROJECTS.length]
    : null;

  const handlePanelClick = (project: ProjectItem) => {
    if (openId !== project.id) {
      // First tap expands the panel on touch devices or inactive panels
      setOpenId(project.id);
    } else {
      // Clicking the already open panel navigates to the case study
      setSelectedProject(project);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, project: ProjectItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedProject(project);
    }
  };

  return (
    <div className="w-full">
      <style>{`
        .accordion-panel {
          transition: flex 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
                      height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
          will-change: flex, height;
        }
        @media (prefers-reduced-motion: reduce) {
          .accordion-panel,
          .accordion-content,
          .accordion-collapsed-label {
            transition: none !important;
          }
        }
        @media (max-width: 767px) {
          .accordion-panel.is-collapsed {
            height: 60px;
          }
          .accordion-panel.is-open {
            height: 260px;
          }
        }
        @media (min-width: 768px) {
          .accordion-panel {
            height: 430px;
          }
          .accordion-panel.is-collapsed {
            flex: 1;
            min-width: 56px;
          }
          .accordion-panel.is-open {
            flex: 5;
            min-width: 280px;
          }
        }
      `}</style>

      {/* ── Expanding Panels Row (Horizontal on desktop 430px, Vertical on mobile) ── */}
      <div className="flex flex-col md:flex-row gap-[10px] w-full md:h-[430px]">
        {PROJECTS.map((project) => {
          const isOpen = openId === project.id;
          return (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={`${project.title}${isOpen ? ' (Expanded)' : ''}`}
              suppressHydrationWarning
              onClick={() => handlePanelClick(project)}
              onMouseEnter={() => setOpenId(project.id)}
              onFocus={() => setOpenId(project.id)}
              onKeyDown={(e) => handleKeyDown(e, project)}
              className={`accordion-panel relative rounded-[16px] overflow-hidden cursor-pointer select-none border bg-[#121214] dark:bg-[#121214] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${
                isOpen
                  ? 'is-open border-[#FF6A1A] shadow-[0_0_24px_rgba(255,106,26,0.18)]'
                  : 'is-collapsed border-white/10 dark:border-white/10 hover:border-white/20'
              }`}
            >
              {/* ── Background Screenshot Image or Dark Gradient Fallback ── */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isOpen ? 'opacity-100' : 'opacity-25'
                }`}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover object-center"
                    priority={project.id === 1}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1c1917] via-[#141416] to-[#0A0A0A]" />
                )}
              </div>

              {/* ── Bottom Gradient Overlay for High Text Contrast ── */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/30 transition-opacity duration-300 pointer-events-none ${
                  isOpen ? 'opacity-100' : 'opacity-40'
                }`}
              />

              {/* ── Collapsed Vertical Label (Rotated vertically on desktop, horizontal on mobile) ── */}
              <div
                className={`accordion-collapsed-label absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="text-zinc-400 dark:text-zinc-400 font-medium tracking-wider text-xs md:text-sm uppercase select-none md:[writing-mode:vertical-rl] [writing-mode:horizontal-tb] truncate px-3">
                  {project.title}
                </span>
              </div>

              {/* ── Open Content Panel (Fades in ~0.2s after panel begins expanding) ── */}
              <div
                className={`accordion-content absolute inset-x-0 bottom-0 p-5 md:p-7 z-20 flex flex-col justify-end gap-3 transition-all duration-350 ${
                  isOpen
                    ? 'opacity-100 pointer-events-auto delay-200 translate-y-0'
                    : 'opacity-0 pointer-events-none translate-y-2'
                }`}
              >
                {/* Project Name (Large) */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                  {project.title}
                </h3>

                {/* Existing Short Description (max 2 lines) */}
                <p className="text-xs sm:text-sm text-zinc-300 font-light line-clamp-2 leading-relaxed max-w-xl">
                  {project.description}
                </p>

                {/* Tech Stack as Simple Text (Not boxed chips) */}
                <p className="text-xs text-zinc-400 font-mono tracking-wide line-clamp-1">
                  {project.techStack.join(' • ')}
                </p>

                {/* Actions: View Case Study (Orange) + Outlined Demo / GitHub */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6A1A] hover:bg-[#e55a10] text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>View case study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      suppressHydrationWarning
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/20 hover:border-white/50 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer bg-black/40 backdrop-blur-sm active:scale-95"
                      aria-label={`Live demo for ${project.title}`}
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </a>
                  )}

                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      suppressHydrationWarning
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/20 hover:border-white/50 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer bg-black/40 backdrop-blur-sm active:scale-95"
                      aria-label={`GitHub repository for ${project.title}`}
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Case Study Detail Modal (Existing Modal Component) ── */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNextProject={() => setSelectedProject(nextModalProject)}
        currentIndex={currentModalIndex}
        totalCount={PROJECTS.length}
        nextProjectTitle={nextModalProject?.title}
      />
    </div>
  );
}
