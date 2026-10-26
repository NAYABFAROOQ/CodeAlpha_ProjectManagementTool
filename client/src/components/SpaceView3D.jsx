import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  Calendar,
  CheckSquare,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

/**
 * 3D Space View (Spatial Orbit Workspace)
 * Renders the project columns and tasks in interactive 3D space with:
 * - Real 3D rotational perspective
 * - Orbit controls (drag to orbit 3D space, wheel to zoom)
 * - Auto-rotation command center mode
 * - Hover elevation and click-to-open detail modal
 * - Emerald, Amber Gold, Coral Rose palette (NO blue, NO purple, NO black)
 * - NO task availability counters
 */
export const SpaceView3D = () => {
  const { columns, tasks, setSelectedTask, searchQuery, filterPriority, filterAssignee } =
    useProject();
  const { teamMembers } = useAuth();

  const containerRef = useRef(null);

  // 3D Camera & Space State
  const [rotX, setRotX] = useState(14);
  const [rotY, setRotY] = useState(-18);
  const [zoom, setZoom] = useState(0.92);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Priority color config
  const priorityTheme = {
    urgent: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      glow: 'rgba(244, 63, 94, 0.4)',
      label: 'Urgent',
    },
    high: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glow: 'rgba(245, 158, 11, 0.4)',
      label: 'High Priority',
    },
    medium: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glow: 'rgba(16, 185, 129, 0.4)',
      label: 'Medium',
    },
    low: {
      badge: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
      glow: 'rgba(120, 113, 108, 0.3)',
      label: 'Normal',
    },
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignees?.includes(filterAssignee);

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.35) % 360);
    }, 24);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  // Drag & Touch to rotate 3D Space
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setRotY((prev) => prev + dx * 0.4);
    setRotX((prev) => Math.max(-45, Math.min(65, prev - dy * 0.3)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;

    setRotY((prev) => prev + dx * 0.5);
    setRotX((prev) => Math.max(-45, Math.min(65, prev - dy * 0.4)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((prev) => Math.min(1.4, Math.max(0.65, prev + delta)));
  };

  const resetView = () => {
    setRotX(14);
    setRotY(-18);
    setZoom(0.92);
  };

  return (
    <div className="w-full px-3 sm:px-6 pb-12 flex flex-col select-none">
      {/* 3D Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl glass-panel">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              3D Spatial Workspace
            </h2>
            <p className="text-[10px] text-stone-400">
              Interactive 3D Stage • Drag / Touch to orbit • Zoom controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isAutoRotate
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-gold-glow'
                : 'bg-white/[0.04] text-stone-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoRotate ? 'Orbiting' : 'Auto Orbit'}</span>
          </button>

          {/* Zoom Buttons */}
          <button
            onClick={() => setZoom((prev) => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded-xl bg-white/[0.04] text-stone-300 border border-white/10 hover:bg-white/10 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.65, prev - 0.1))}
            className="p-1.5 rounded-xl bg-white/[0.04] text-stone-300 border border-white/10 hover:bg-white/10 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetView}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] text-stone-300 border border-white/10 hover:bg-white/10 hover:text-white text-xs font-medium"
            title="Reset 3D Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3D Stage Viewport (Touch & Drag enabled) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative w-full h-[480px] sm:h-[620px] rounded-3xl overflow-hidden glass-panel border border-emerald-500/20 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
        style={{
          perspective: '1300px',
          background: 'radial-gradient(ellipse at center, rgba(18, 42, 33, 0.4) 0%, rgba(10, 26, 20, 0.8) 100%)',
        }}
      >
        {/* Floating 3D Ambient Dust Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), radial-gradient(rgba(245, 158, 11, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* 3D Transform Hub */}
        <div
          className="transform-style-3d transition-transform duration-75 flex items-start justify-center gap-10"
          style={{
            transform: `scale3d(${zoom}, ${zoom}, ${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {columns.map((col, colIdx) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === col.id);

            // Column stage colors
            const colColor = col.color || '#10b981';

            return (
              <div
                key={col.id}
                className="w-72 flex-shrink-0 flex flex-col rounded-3xl p-4 transition-all duration-300 relative group"
                style={{
                  transform: `translateZ(${colIdx * 15}px)`,
                  transformStyle: 'preserve-3d',
                  background: 'rgba(18, 42, 33, 0.82)',
                  border: `1.5px solid ${colColor}40`,
                  boxShadow: `0 20px 50px -10px rgba(10, 26, 20, 0.7), 0 0 25px ${colColor}25`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* 3D Stage Pedestal Header (Clean, NO task availability count) */}
                <div
                  className="flex items-center justify-between pb-3 mb-3 border-b border-white/10"
                  style={{ transform: 'translateZ(18px)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{
                        backgroundColor: colColor,
                        boxShadow: `0 0 14px ${colColor}, 0 0 4px ${colColor}`,
                      }}
                    />
                    <h3 className="font-bold text-xs uppercase tracking-widest text-stone-100">
                      {col.name}
                    </h3>
                  </div>

                  <span
                    className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      color: colColor,
                      borderColor: `${colColor}50`,
                      background: `${colColor}15`,
                    }}
                  >
                    Stage 0{colIdx + 1}
                  </span>
                </div>

                {/* 3D Floating Task Cards Stack */}
                <div
                  className="space-y-3.5 min-h-[340px] max-h-[460px] overflow-y-auto pr-1"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {colTasks.length === 0 ? (
                    <div
                      className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-xs text-stone-400 p-3 text-center"
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      <Sparkles className="w-5 h-5 text-emerald-400/60 mb-1" />
                      <span>Stage is clear</span>
                    </div>
                  ) : (
                    colTasks.map((task, tIdx) => {
                      const priority = priorityTheme[task.priority] || priorityTheme.medium;
                      const totalSub = task.checklist?.length || 0;
                      const doneSub = task.checklist?.filter((c) => c.completed).length || 0;
                      const assigned = teamMembers.filter((m) => task.assignees?.includes(m.id));

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="rounded-2xl p-4 bg-stone-900/80 hover:bg-stone-800/90 border border-white/10 hover:border-emerald-400/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-emerald-glow group/card"
                          style={{
                            transform: `translateZ(${(tIdx + 1) * 12}px)`,
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {/* Priority Pill */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priority.badge}`}
                            >
                              {priority.label}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover/card:text-emerald-400 group-hover/card:translate-x-0.5 transition-all" />
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-bold text-stone-100 group-hover/card:text-emerald-300 transition-colors leading-snug mb-1">
                            {task.title}
                          </h4>

                          {/* Description */}
                          {task.description && (
                            <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed mb-2.5">
                              {task.description}
                            </p>
                          )}

                          {/* Footer: Date & Assignees */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[10px] text-stone-400">
                            {task.dueDate ? (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-emerald-400" />
                                <span>{task.dueDate}</span>
                              </div>
                            ) : (
                              <div />
                            )}

                            {totalSub > 0 && (
                              <div className="flex items-center gap-1 font-mono">
                                <CheckSquare className="w-3 h-3 text-amber-400" />
                                <span>
                                  {doneSub}/{totalSub}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center -space-x-1.5">
                              {assigned.map((user) => (
                                <img
                                  key={user.id}
                                  src={user.avatar}
                                  alt={user.name}
                                  title={user.name}
                                  className="w-4 h-4 rounded-full ring-1 ring-emerald-500/40 object-cover"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* 3D Holographic Base Glow */}
                <div
                  className="mt-3 py-1.5 text-center text-[10px] font-mono font-bold tracking-widest uppercase rounded-xl border"
                  style={{
                    color: colColor,
                    borderColor: `${colColor}30`,
                    background: `${colColor}0a`,
                    transform: 'translateZ(6px)',
                  }}
                >
                  Anchor Node
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
