import React, { useState } from 'react';
import {
  Kanban,
  Table,
  BarChart3,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Box,
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
    <header className="sticky top-0 z-30 bg-[#0a1a14]/85 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Workspace Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-white/20">
              <span className="font-bold text-sm text-stone-900 font-mono">P</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-white">
                Pulse<span className="text-emerald-400">PM</span>
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Project Workspace Selector */}
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu((prev) => !prev)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.06] text-xs font-semibold text-stone-200 transition-colors border border-transparent hover:border-emerald-500/30"
            >
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{activeProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {showProjectMenu && (
              <div
                className="absolute left-0 top-10 z-40 w-64 py-1.5 bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 text-xs"
                onClick={() => setShowProjectMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                  Select Workspace:
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-500/10 ${
                      p.id === activeProject.id ? 'font-bold text-emerald-400' : 'text-stone-300'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-stone-400">{p.key}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-white/10" />
                <button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="w-full text-left px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/10 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: View Switcher (Including 3D Space View!) */}
        <div className="hidden md:flex items-center p-0.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Board
          </button>

          <button
            onClick={() => setViewMode('space3d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'space3d'
                ? 'bg-gradient-to-r from-emerald-500/30 to-amber-500/30 text-amber-300 shadow-gold-glow border border-amber-500/40'
                : 'text-stone-400 hover:text-amber-300'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Space</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>

          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'analytics'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Velocity
          </button>
        </div>

        {/* Right: Search, Priority Filter, Notifications, Theme, Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="relative hidden lg:block w-44">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="hidden sm:block text-xs font-medium px-2 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-stone-300 outline-none cursor-pointer hover:border-emerald-500/40 transition-colors"
          >
            <option value="all" className="bg-stone-900 text-stone-200">All Priorities</option>
            <option value="urgent" className="bg-stone-900 text-stone-200">🔴 Urgent</option>
            <option value="high" className="bg-stone-900 text-stone-200">🟠 High</option>
            <option value="medium" className="bg-stone-900 text-stone-200">🟡 Medium</option>
            <option value="low" className="bg-stone-900 text-stone-200">🟢 Normal</option>
          </select>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-[#0a1a14]" />
            </button>
            <NotificationPopover
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Dark/Light Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white/10 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/40"
              />
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-10 z-40 w-52 py-1 bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 text-xs"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                  Active User:
                </div>
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => switchUser(m.id)}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-emerald-500/10 ${
                      m.id === currentUser.id ? 'font-bold text-emerald-400' : 'text-stone-300'
                    }`}
                  >
                    <img src={m.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-stone-200">{m.name}</div>
                      <div className="text-[10px] text-stone-400">{m.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Task Button in Header */}
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
