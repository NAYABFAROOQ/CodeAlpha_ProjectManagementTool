import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { CreateProjectModal } from './components/CreateProjectModal';

const DashboardContent = () => {
  const { viewMode, activeProject } = useProject();

  const total = activeProject.tasks?.length || 0;
  const done = activeProject.tasks?.filter((t) => t.columnId.includes('done')).length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      {/* Project Subheader */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {activeProject.name}
            </h1>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {activeProject.key}
            </span>
          </div>
          {activeProject.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
              {activeProject.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{total} Total Tasks</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {done} Resolved
          </span>
        </div>
      </div>

      {/* Main Views Sitting Naturally in Document Flow */}
      <main className="flex-1">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'list' && <ListView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </main>

      {/* Clean Enterprise Workspace Status Bar */}
      <footer className="mt-auto py-3 px-6 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Pulse PM Enterprise Edition</span>
          <span>•</span>
          <span className="text-emerald-500 font-mono">60 FPS Hardware Acceleration</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          Production Build • Real-Time Engine Active
        </div>
      </footer>

      {/* Modals */}
      <TaskDetailModal />
      <CreateTaskModal />
      <CreateProjectModal />
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
