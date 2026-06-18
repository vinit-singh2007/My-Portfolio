'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
      
      const colors = theme === 'dark' 
        ? ['#6366f1', '#06b6d4', '#4f46e5', '#0891b2'] // Indigo / Cyan shades
        : ['#6366f1', '#06b6d4', '#4f46e5', '#0891b2']; // Indigo / Cyan shades

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1.5; // Small professional nodes
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35, // Slow professional drift
          vy: (Math.random() - 0.5) * 0.35,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const maxDistance = 110;
      const length = particles.length;

      for (let i = 0; i < length; i++) {
        const p = particles[i];
        
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Lines between particles only appear near the mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = p.x - mouse.x;
          const dyMouse = p.y - mouse.y;
          const distToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distToMouse < mouse.radius) {
            for (let j = i + 1; j < length; j++) {
              const p2 = particles[j];
              const dx2Mouse = p2.x - mouse.x;
              const dy2Mouse = p2.y - mouse.y;
              const dist2ToMouse = Math.sqrt(dx2Mouse * dx2Mouse + dy2Mouse * dy2Mouse);

              if (dist2ToMouse < mouse.radius) {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                  const alpha = (1 - dist / maxDistance) * (theme === 'dark' ? 0.35 : 0.25);
                  ctx.strokeStyle = theme === 'dark'
                    ? `rgba(99, 102, 241, ${alpha})`
                    : `rgba(99, 102, 241, ${alpha})`;
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              }
            }
          }
        }

        // Connect to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * (theme === 'dark' ? 0.55 : 0.40);
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(6, 182, 212, ${alpha})` // Cyan lines to mouse in dark mode
              : `rgba(6, 182, 212, ${alpha})`; // Cyan lines to mouse in light mode
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Listeners
    window.addEventListener('resize', resizeCanvas);
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
}
