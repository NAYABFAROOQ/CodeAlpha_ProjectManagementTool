import React, { useState } from 'react';
import {
  Kanban,
  Table,
  BarChart3,
  Search,
  Filter,
  Plus,
  Moon,
  Sun,
  Bell,
  FolderKanban,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { NotificationPopover } from './NotificationPopover';

export const Navbar = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    setIsCreateTaskOpen,
    setIsCreateProjectOpen,
    isDarkMode,
    toggleDarkMode,
  } = useProject();

  const { currentUser, teamMembers, switchUser } = useAuth();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-[#0b101c]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 transition-colors">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Project Dropdown */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
                PlanPulse
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                CodeAlpha Task 3
              </span>
            </div>
          </div>

          {/* Project Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-brand-500 transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeProject.color || '#8b5cf6' }}
              />
              <span className="max-w-[140px] truncate">{activeProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProjectMenu && (
              <div
                className="absolute left-0 top-10 z-40 w-56 py-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 text-xs"
                onClick={() => setShowProjectMenu(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                  Switch Workspace:
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      p.id === activeProject.id ? 'font-bold text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{p.key}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="w-full text-left px-3 py-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Create New Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: View Switcher Tabs */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </div>

        {/* Right: Search, Notification, Theme, User Switcher & New Task */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden lg:block w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="hidden sm:block text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">⚪ Low</option>
          </select>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-2 rounded-xl text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>
            <NotificationPopover
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-brand-500 transition-all text-xs font-bold"
            >
              <img
                src={currentUser.avatar}
                alt=""
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-brand-500"
              />
              <span className="hidden xl:inline text-slate-800 dark:text-slate-200 truncate max-w-[90px]">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-11 z-40 w-56 py-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 text-xs"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                  Collaborate As:
                </div>
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => switchUser(m.id)}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      m.id === currentUser.id ? 'font-bold text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img src={m.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <div>
                      <div className="font-bold">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{m.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Task Button */}
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
