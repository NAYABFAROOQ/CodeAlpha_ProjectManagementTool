import React from 'react';
import { Plus } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { AnalyticsView } from './components/AnalyticsView';
import { SpaceView3D } from './components/SpaceView3D';
import { InteractiveBackground3D } from './components/InteractiveBackground3D';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { CreateProjectModal } from './components/CreateProjectModal';

const DashboardContent = () => {
  const { viewMode, activeProject, setIsCreateTaskOpen, setCreateTaskColumnId, columns } =
    useProject();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-stone-100 font-sans transition-colors relative">
      {/* Three.js Interactive 3D WebGL Background (Cursor-reactive & Click Ripples) */}
      <InteractiveBackground3D />

      {/* Main UI Header & Content sitting gracefully above the 3D Universe */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Clean Project Subheader (NO task availability display) */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] mb-6 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-white">
                {activeProject.name}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {activeProject.key}
              </span>
            </div>
            {activeProject.description && (
              <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
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

        {/* Floating "+ New Task" Action Button in Emerald & Amber */}
        <button
          onClick={() => {
            setCreateTaskColumnId(columns[0]?.id || 'col-todo');
            setIsCreateTaskOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-medium text-xs shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all backdrop-blur-md border border-white/20 group cursor-pointer"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="tracking-wide font-semibold">New Task</span>
        </button>

        {/* Workspace Footer */}
        <footer className="mt-auto py-3 px-6 border-t border-white/[0.06] text-[11px] text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-stone-300 font-semibold">Pulse PM</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Interactive 3D Engine Active</span>
          </div>
          <div className="font-mono text-[10px] text-stone-400">
            Real-Time Collaboration • 60 FPS WebGL
          </div>
        </footer>

        {/* Modals */}
        <TaskDetailModal />
        <CreateTaskModal />
        <CreateProjectModal />
      </div>
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
