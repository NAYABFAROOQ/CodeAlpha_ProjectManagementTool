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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      {/* Subheader Project Title and Stats */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {activeProject.name}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {activeProject.key}
            </span>
          </div>
          {activeProject.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeProject.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">
            {activeProject.tasks?.length || 0} Total Tasks
          </span>
          <span>•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {activeProject.tasks?.filter((t) => t.columnId === 'col-done').length || 0} Completed
          </span>
        </div>
      </div>

      {/* Active Main View */}
      <main className="flex-1 flex flex-col">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'list' && <ListView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </main>

      {/* Footer attribution */}
      <footer className="py-2.5 px-6 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>CodeAlpha Full Stack Web Development Internship — Task 3</span>
        <span>Crafted with ❤️ by <strong>Nayab Farooq</strong></span>
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
