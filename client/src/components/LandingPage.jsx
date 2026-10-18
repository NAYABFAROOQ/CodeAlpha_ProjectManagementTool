import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Box,
  Kanban,
  BarChart3,
  Sparkles,
  Download,
  Monitor,
  Apple,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckSquare,
  Layers,
  X,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

/**
 * Pulse PM - Entry Screen & Landing View
 * Features:
 * - Dramatic Zoom-in entrance animation on "Pulse PM Task Management"
 * - Interactive Slideshow showcasing "Go to Workspace" and the "3D Spatial Orbit"
 * - "Get a Desktop App" section with interactive Windows/macOS/Linux download modal
 * - Dark-mode glassmorphism with luxury Emerald, Amber, and Coral gradients
 */
export const LandingPage = ({ onLaunchWorkspace }) => {
  const { setViewMode, setIsDesktopModalOpen } = useProject();

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slides definition
  const slides = [
    {
      id: 'workspace',
      badge: '✦ Agile Kanban Engine',
      title: 'Fluid Kanban Workspace',
      subtitle:
        'Drag, reorder, and prioritize issues with hardware-accelerated physics, 180° card flip inspection, custom sprint stages, and milestone celebration confetti.',
      actionLabel: 'Go to Workspace',
      viewTarget: 'kanban',
      accentColor: 'emerald',
      preview: {
        type: 'kanban',
        items: [
          { title: 'Design Mobile Flow', tag: 'UI/UX', col: 'To Do', priority: 'High' },
          { title: 'Stripe Checkout API', tag: 'Payments', col: 'In Progress', priority: 'Urgent' },
          { title: 'Interactive Drag & Drop', tag: 'Frontend', col: 'Done', priority: 'Normal' },
        ],
      },
    },
    {
      id: 'space3d',
      badge: '✦ WebGL 3D Visualization',
      title: '3D Spatial Orbit Universe',
      subtitle:
        'Step into an interactive 3D command center. Orbit around floating project stages, zoom into tasks in 3D perspective, and auto-rotate your entire development pipeline.',
      actionLabel: 'Launch 3D Space View',
      viewTarget: 'space3d',
      accentColor: 'amber',
      preview: {
        type: 'space3d',
        stages: ['To Do', 'In Progress', 'In Review', 'Done'],
      },
    },
    {
      id: 'velocity',
      badge: '✦ High-Performance Analytics',
      title: 'Live Velocity & Pipeline Analytics',
      subtitle:
        'Visualize sprint throughput, stage distribution, and team velocity in high-definition glassmorphic charts with sub-second responsiveness.',
      actionLabel: 'View Sprint Velocity',
      viewTarget: 'analytics',
      accentColor: 'teal',
      preview: {
        type: 'analytics',
        stats: [
          { label: 'Completion Rate', val: '94%' },
          { label: 'Active Scope', val: '18 Tasks' },
          { label: 'FPS Engine', val: '60 FPS' },
        ],
      },
    },
  ];

  // Auto-advance slideshow every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleLaunchSlide = (viewTarget) => {
    setViewMode(viewTarget);
    onLaunchWorkspace();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Simulated Desktop App Download
  const handleStartDownload = (platform) => {
    setDownloadingPlatform(platform);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-stone-100 select-none overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-emerald-500/15 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/20">
            <span className="font-extrabold text-base text-stone-900 font-mono">P</span>
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            Pulse<span className="text-emerald-400">PM</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 ml-2">
            v4.0 • 3D Accelerated
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Get Desktop App Trigger */}
          <button
            onClick={() => setIsDesktopModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-stone-200 hover:text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get Desktop App</span>
          </button>

          {/* Quick Enter App CTA */}
          <button
            onClick={onLaunchWorkspace}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-emerald-600/30"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Content Section with Dramatic Zoom-In Animation */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-5xl mx-auto z-20 w-full animate-zoom-in">
        {/* Glowing Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-emerald-glow backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Next-Gen Spatial Task Orchestration</span>
        </div>

        {/* Main Branding Title with Cinematic Zoom-In Animation */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-title-zoom">
          <span className="text-white">Pulse PM </span>
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
            Task Management
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mb-8 leading-relaxed font-normal">
          Orchestrate workflows with hardware-accelerated 3D spatial stages, fluid Kanban physics,
          and real-time velocity analytics — built for modern agile teams.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onLaunchWorkspace}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-500/60 hover:scale-105 active:scale-95 transition-all border border-white/20 group cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-200" />
          </button>

          <button
            onClick={() => handleLaunchSlide('space3d')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl glass-card text-stone-200 hover:text-white hover:border-emerald-400/50 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>Open 3D Space View</span>
          </button>

          <button
            onClick={() => setIsDesktopModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/10 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span>Get Desktop App</span>
          </button>
        </div>

        {/* SLIDESHOW: "Go to Workspace" and "3D Spatial Orbit" Showcase */}
        <div
          className="w-full max-w-4xl relative glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-2xl overflow-hidden mb-12 text-left"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slideshow Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 flex">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-full transition-all duration-300"
                style={{
                  background:
                    idx === currentSlide
                      ? 'linear-gradient(90deg, #10b981, #f59e0b)'
                      : idx < currentSlide
                      ? '#10b981'
                      : 'transparent',
                }}
              />
            ))}
          </div>

          {/* Active Slide Header & Controls */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {slides[currentSlide].badge}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-stone-300 hover:text-white transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Text & Action */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                {slides[currentSlide].subtitle}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => handleLaunchSlide(slides[currentSlide].viewTarget)}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                >
                  <span>{slides[currentSlide].actionLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Visual Interactive Preview */}
            <div className="lg:col-span-5 bg-stone-900/80 rounded-2xl p-4 border border-white/10 shadow-inner">
              {slides[currentSlide].id === 'workspace' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Kanban className="w-3.5 h-3.5" /> Agile Pipeline
                    </span>
                    <span>3 Stages Active</span>
                  </div>
                  {slides[0].preview.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">#{item.tag}</div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.col}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {slides[currentSlide].id === 'space3d' && (
                <div className="space-y-3 py-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Box className="w-3.5 h-3.5" /> 3D Spatial Canvas
                    </span>
                    <span>Interactive Orbit</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {slides[1].preview.stages.map((stage, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 border border-amber-500/30 text-center"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto mb-1.5 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                        <div className="text-xs font-bold text-stone-100">{stage}</div>
                        <div className="text-[9px] text-stone-400 font-mono mt-0.5">Node 0{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slides[currentSlide].id === 'velocity' && (
                <div className="space-y-3 py-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                      <BarChart3 className="w-3.5 h-3.5" /> High Velocity
                    </span>
                    <span>Real-Time Sync</span>
                  </div>
                  <div className="space-y-2">
                    {slides[2].preview.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] text-xs"
                      >
                        <span className="text-stone-300">{stat.label}</span>
                        <span className="font-mono font-bold text-emerald-400">{stat.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-gradient-to-r from-emerald-400 to-amber-400'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* "GET A DESKTOP APP" FEATURE CARD BANNER */}
        <div className="w-full max-w-4xl glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-emerald-glow flex-shrink-0">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Pulse PM Desktop Companion
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Native
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-lg leading-relaxed">
                Enjoy offline local sync, native desktop keyboard shortcuts, zero tab clutter, and
                hardware-accelerated 60 FPS graphics across Windows, macOS, and Linux.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDesktopModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Get Desktop App</span>
          </button>
        </div>
      </main>

      {/* Clean Glassmorphic Footer */}
      <footer className="w-full py-4 px-6 border-t border-white/[0.06] text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-300">Pulse PM</span>
          <span>•</span>
          <span className="text-emerald-400">Collaborative Project Management</span>
        </div>
        <div className="font-mono text-[11px] text-stone-400 flex items-center gap-3">
          <span>Windows • macOS • Linux</span>
          <span>•</span>
          <span>60 FPS WebGL Engine</span>
        </div>
      </footer>
    </div>
  );
};
