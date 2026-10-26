import React, { useState } from 'react';
import { Plus, Kanban, Box, Table, BarChart3, ShieldCheck } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { AnalyticsView } from './components/AnalyticsView';
import { SpaceView3D } from './components/SpaceView3D';
import { InteractiveBackground3D } from './components/InteractiveBackground3D';
import { LandingPage } from './components/LandingPage';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { DesktopAppModal } from './components/DesktopAppModal';
import { ExportReadyDashboard } from './components/exportready/ExportReadyDashboard';

const DashboardContent = () => {
  const [appMode, setAppMode] = useState('pulse'); // 'pulse' (PulsePM) | 'exportready' (FYP)
  const {
    isWorkspaceOpen,
    setIsWorkspaceOpen,
    viewMode,
    setViewMode,
    activeProject,
    setIsCreateTaskOpen,
    setCreateTaskColumnId,
    columns,
  } = useProject();

  if (appMode === 'exportready') {
    return (
      <ExportReadyDashboard onBackToPulse={() => setAppMode('pulse')} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-stone-100 font-sans transition-colors relative">
      {/* Floating Switcher to ExportReady FYP Prototype */}
      <div className="fixed top-16 right-3 sm:top-20 sm:right-6 z-50">
        <button
          onClick={() => setAppMode('exportready')}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-[11px] sm:text-xs shadow-xl shadow-emerald-950/60 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span className="hidden sm:inline">Launch ExportReady FYP SaaS</span>
          <span className="sm:hidden">ExportReady</span>
        </button>
      </div>

      {/* Three.js Interactive 3D WebGL Background (Shared across landing and workspace with Touch Support) */}
      <InteractiveBackground3D />

      {/* Conditional Screen Rendering: Welcome Landing Screen vs Full Agile Workspace */}
      {!isWorkspaceOpen ? (
        <LandingPage onLaunchWorkspace={() => setIsWorkspaceOpen(true)} />
      ) : (
        <div className="relative z-10 flex flex-col min-h-screen animate-workspace-enter pb-16 md:pb-0">
          <Navbar />

          {/* Clean Project Subheader (NO task availability display) */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-white/[0.06] mb-4 sm:mb-6 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {activeProject.name}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {activeProject.key}
                </span>
              </div>
              {activeProject.description && (
                <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {activeProject.description}
                </p>
              )}
            </div>
          </div>

          {/* Main Views */}
          <main className="flex-1">
            {viewMode === 'kanban' && <KanbanBoard />}
            {viewMode === 'space3d' && <SpaceView3D />}
            {viewMode === 'list' && <ListView />}
            {viewMode === 'analytics' && <AnalyticsView />}
          </main>

          {/* Floating "+ New Task" Action Button (Elevated above mobile dock) */}
          <button
            onClick={() => {
              setCreateTaskColumnId(columns[0]?.id || 'col-todo');
              setIsCreateTaskOpen(true);
            }}
            className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-medium text-xs shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all backdrop-blur-md border border-white/20 group cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span className="tracking-wide font-semibold">New Task</span>
          </button>

          {/* Workspace Footer (Desktop) */}
          <footer className="hidden md:flex mt-auto py-3 px-6 border-t border-white/[0.06] text-[11px] text-stone-400 items-center justify-between gap-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-stone-300 font-semibold">Pulse PM</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Interactive 3D Engine Active</span>
            </div>
            <div className="font-mono text-[10px] text-stone-400">
              Real-Time Collaboration • 60 FPS WebGL
            </div>
          </footer>

          {/* Mobile Bottom Navigation Dock (Native iOS/Android feel on phones) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1a14]/95 backdrop-blur-2xl border-t border-emerald-500/25 px-2 py-1.5 flex items-center justify-around text-stone-400 shadow-2xl safe-area-pb">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 shadow-emerald-glow'
                  : 'hover:text-stone-200'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="text-[10px]">Board</span>
            </button>

            <button
              onClick={() => setViewMode('space3d')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                viewMode === 'space3d'
                  ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 shadow-gold-glow'
                  : 'hover:text-stone-200'
              }`}
            >
              <Box className="w-4 h-4 text-amber-400" />
              <span className="text-[10px]">3D Space</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 shadow-emerald-glow'
                  : 'hover:text-stone-200'
              }`}
            >
              <Table className="w-4 h-4" />
              <span className="text-[10px]">Table</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                viewMode === 'analytics'
                  ? 'text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 shadow-emerald-glow'
                  : 'hover:text-stone-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px]">Velocity</span>
            </button>
          </nav>

          {/* Modals */}
          <TaskDetailModal />
          <CreateTaskModal />
          <CreateProjectModal />
        </div>
      )}

      {/* Global Desktop App Download Modal */}
      <DesktopAppModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <DashboardContent />
      </ProjectProvider>
    </AuthProvider>
  );
}
