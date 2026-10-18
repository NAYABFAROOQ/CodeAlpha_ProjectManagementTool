import React from 'react';
import {
  ArrowRight,
  Box,
  Kanban,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

/**
 * Pulse PM - Entry Screen & Landing View
 * Featuring dark-mode glassmorphism, rich emerald and green gradients,
 * 3D feature highlights, and prominent "Launch Workspace" transition.
 */
export const LandingPage = ({ onLaunchWorkspace }) => {
  const { setViewMode } = useProject();

  const handleLaunch3D = () => {
    setViewMode('space3d');
    onLaunchWorkspace();
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

        <button
          onClick={onLaunchWorkspace}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
        >
          <span>Enter App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Content Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-5xl mx-auto z-20">
        {/* Glowing Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-emerald-glow backdrop-blur-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Next-Gen Spatial Task Orchestration</span>
        </div>

        {/* Main Branding Title with Emerald-to-Gold Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-white">Pulse PM </span>
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
            Task Management
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-normal">
          Orchestrate workflows with hardware-accelerated 3D spatial stages, fluid Kanban physics,
          and real-time velocity analytics — built for modern engineering teams.
        </p>

        {/* Action Buttons: Primary "Launch Workspace" + Secondary "Explore 3D Space" */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={onLaunchWorkspace}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-500/60 hover:scale-105 active:scale-95 transition-all border border-white/20 group cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-200" />
          </button>

          <button
            onClick={handleLaunch3D}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl glass-card text-stone-200 hover:text-white hover:border-emerald-400/50 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>Open 3D Space View</span>
          </button>
        </div>

        {/* 3D Glass Feature Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left kanban-column-perspective">
          {/* Card 1 */}
          <div className="glass-card task-card-3d rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3D Spatial Workspace</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Explore your project backlogs in 3D orbit space. Rotate, pan, zoom, and inspect tasks
              as floating spatial nodes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card task-card-3d rounded-3xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Interactive Agile Kanban</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Smooth drag-and-drop mechanics with 3D card tilt and 180° flip inspection for fast
              subtask tracking.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card task-card-3d rounded-3xl p-6 border border-teal-500/20 hover:border-teal-500/40 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Velocity & Metrics</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Real-time pipeline distribution and team workload tracking with high-contrast glass
              visualizations.
            </p>
          </div>
        </div>

        {/* Micro Badges / Tech Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-stone-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>WebGL Hardware Acceleration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Real-Time Local Persistence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Fluid Micro-Interactions</span>
          </div>
        </div>
      </main>

      {/* Clean Glassmorphic Footer */}
      <footer className="w-full py-4 px-6 border-t border-white/[0.06] text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-300">Pulse PM</span>
          <span>•</span>
          <span className="text-emerald-400">Collaborative Project Management</span>
        </div>
        <div className="font-mono text-[11px] text-stone-400">
          60 FPS 3D Engine • Clean Dark Glassmorphism
        </div>
      </footer>
    </div>
  );
};
