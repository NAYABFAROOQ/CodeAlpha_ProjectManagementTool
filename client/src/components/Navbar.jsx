import React, { useState } from 'react';
import {
  Kanban,
  Table,
  BarChart3,
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  Layers,
  Radio,
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
    <header className="bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 sticky top-0 z-30 transition-colors">
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand & Workspace Switcher */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Pulse PM
              </span>
              {/* Real-time indicator badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu((prev) => !prev)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="max-w-[150px] truncate">{activeProject.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showProjectMenu && (
              <div
                className="absolute left-0 top-9 z-40 w-60 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-800 text-xs"
                onClick={() => setShowProjectMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Select Workspace:
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      p.id === activeProject.id ? 'font-bold text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{p.key}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="w-full text-left px-3 py-1.5 text-brand-600 dark:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean View Switcher */}
        <div className="hidden md:flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Velocity
          </button>
        </div>

        {/* Right: Search, Filter, Notification, Theme, User Switcher, Quick Add */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="relative hidden lg:block w-44">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="hidden sm:block text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">⚪ Low</option>
          </select>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#0B0F17]" />
            </button>
            <NotificationPopover
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Dark/Light Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-10 z-40 w-52 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-800 text-xs"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Active User:
                </div>
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => switchUser(m.id)}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      m.id === currentUser.id ? 'font-bold text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img src={m.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Task Button */}
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
