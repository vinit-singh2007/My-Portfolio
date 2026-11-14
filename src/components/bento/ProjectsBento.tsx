'use client';

import React, { useState } from 'react';
import FeaturedTile from './FeaturedTile';
import ProjectTile from './ProjectTile';
import ProjectDetailModal from './ProjectDetailModal';
import { PROJECTS, ProjectItem } from './ProjectData';

export default function ProjectsBento() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Find each project by ID / featured flag to guarantee correct grid mapping
  const featuredProject = PROJECTS.find((p) => p.featured || p.id === 1) || PROJECTS[0]; // Day 0 (Featured)
  const deepShieldProject = PROJECTS.find((p) => p.id === 3) || PROJECTS[2]; // DeepShield (Right Top)
  const delivrXProject = PROJECTS.find((p) => p.id === 2) || PROJECTS[1]; // Delivr-X (Right Bottom)
  const dsaaProject = PROJECTS.find((p) => p.id === 4) || PROJECTS[3]; // Disk Scheduling Analyzer (Bottom Left)
  const mirrorMemoryProject = PROJECTS.find((p) => p.id === 5) || PROJECTS[4]; // Mirror Memory (Bottom Right)

  const currentModalIndex = selectedProject
    ? PROJECTS.findIndex((p) => p.id === selectedProject.id)
    : 0;
  const nextModalProject = selectedProject
    ? PROJECTS[(currentModalIndex + 1) % PROJECTS.length]
    : null;

  return (
    <div className="w-full">
      {/* ── 6-Column Bento Grid Layout ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-[14px] auto-rows-auto lg:auto-rows-[minmax(190px,auto)] w-full">
        {/* 1. Featured Tile: Day 0 (spans 4 columns, 2 rows on desktop) */}
        <FeaturedTile
          project={featuredProject}
          gridSpanClass="col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-2"
          staggerIndex={0}
          isMatch={true}
          onOpenDetail={setSelectedProject}
        />

        {/* 2. DeepShield: spans 2 columns on desktop, stacked top right of featured */}
        <ProjectTile
          project={deepShieldProject}
          gridSpanClass="col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-1"
          staggerIndex={1}
          isMatch={true}
          onOpenDetail={setSelectedProject}
        />

        {/* 3. Delivr-X: spans 2 columns on desktop, stacked bottom right of featured */}
        <ProjectTile
          project={delivrXProject}
          gridSpanClass="col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-1"
          staggerIndex={2}
          isMatch={true}
          onOpenDetail={setSelectedProject}
        />

        {/* 4. Disk Scheduling Analyzer: spans 3 columns on row below */}
        <ProjectTile
          project={dsaaProject}
          gridSpanClass="col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-1"
          staggerIndex={3}
          isMatch={true}
          onOpenDetail={setSelectedProject}
        />

        {/* 5. Mirror Memory: spans 3 columns on row below */}
        <ProjectTile
          project={mirrorMemoryProject}
          gridSpanClass="col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-1"
          staggerIndex={4}
          isMatch={true}
          onOpenDetail={setSelectedProject}
        />
      </div>

      {/* ── Full Detail Case Study View (Modal like earlier) ── */}
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

