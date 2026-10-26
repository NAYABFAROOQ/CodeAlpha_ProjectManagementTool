import React, { useState } from 'react';
import { Plus, Sparkles, Layers, Columns, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { TaskCard } from './TaskCard';

export const KanbanBoard = () => {
  const {
    columns,
    tasks,
    moveTask,
    searchQuery,
    filterPriority,
    filterAssignee,
    setIsCreateTaskOpen,
    setCreateTaskColumnId,
  } = useProject();

  const [activeDragCol, setActiveDragCol] = useState(null);
  // Mobile layout mode: 'stacked' (pure vertical scroll) | 'tabbed' (single stage vertical scroll) | 'horizontal' (side-by-side)
  const [mobileLayout, setMobileLayout] = useState('stacked');
  const [selectedMobileColId, setSelectedMobileColId] = useState(columns[0]?.id || 'col-todo');
  const [collapsedCols, setCollapsedCols] = useState({});

  const toggleColCollapse = (colId) => {
    setCollapsedCols((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
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

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (activeDragCol !== colId) {
      setActiveDragCol(colId);
    }
  };

  const handleDragLeave = () => {
    setActiveDragCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setActiveDragCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, colId);
    }
  };

  const handleOpenAdd = (colId) => {
    setCreateTaskColumnId(colId);
    setIsCreateTaskOpen(true);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-6 pb-28 md:pb-12">
      {/* Mobile Layout Switcher Bar (md:hidden) — Enforces Pure Vertical Scrolling ("Upside Down") */}
      <div className="md:hidden mb-4 p-2 rounded-2xl glass-panel flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-300 px-1">
          <span className="text-[11px] text-stone-400 font-mono">Mobile Board Mode:</span>
          <div className="flex items-center gap-1 bg-stone-900/60 p-0.5 rounded-xl border border-white/5 text-[10px]">
            <button
              onClick={() => setMobileLayout('stacked')}
              className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                mobileLayout === 'stacked'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Vertical Stack
            </button>
            <button
              onClick={() => setMobileLayout('tabbed')}
              className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                mobileLayout === 'tabbed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Stage Tabs
            </button>
            <button
              onClick={() => setMobileLayout('horizontal')}
              className={`px-2 py-1 rounded-lg transition-all font-bold ${
                mobileLayout === 'horizontal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Swipe
            </button>
          </div>
        </div>

        {/* Tabbed Stage Selector when in 'tabbed' mode */}
        {mobileLayout === 'tabbed' && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {columns.map((col) => {
              const count = filteredTasks.filter((t) => t.columnId === col.id).length;
              const isActive = selectedMobileColId === col.id;
              const colColor = col.color || '#10b981';
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedMobileColId(col.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-stone-400 bg-white/[0.03] hover:text-stone-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colColor, boxShadow: `0 0 6px ${colColor}` }}
                  />
                  <span>{col.name}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-stone-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE VERTICAL STACKED VIEW (Default on phone: Scrolls purely upside down!) */}
      {/* ========================================================================= */}
      <div className="md:hidden">
        {mobileLayout === 'stacked' && (
          <div className="space-y-4 w-full">
            {columns.map((column) => {
              const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
              const colColor = column.color || '#10b981';
              const isCollapsed = collapsedCols[column.id];

              return (
                <div
                  key={column.id}
                  className="w-full flex flex-col rounded-3xl p-4 glass-panel border border-emerald-500/20"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                    <div
                      onClick={() => toggleColCollapse(column.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: colColor,
                          boxShadow: `0 0 10px ${colColor}`,
                        }}
                      />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-stone-200">
                        {column.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenAdd(column.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                        title="Add task"
                      >
                        <Plus className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => toggleColCollapse(column.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-white"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Tasks List (Scrolls naturally upside down) */}
                  {!isCollapsed && (
                    <div className="space-y-3 pt-3">
                      {colTasks.length === 0 ? (
                        <div className="py-6 border border-dashed border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-xs text-stone-400 gap-1.5 text-center">
                          <Sparkles className="w-4 h-4 text-emerald-400/50" />
                          <span className="text-[11px] text-stone-400">Empty stage</span>
                          <button
                            onClick={() => handleOpenAdd(column.id)}
                            className="text-emerald-400 hover:underline font-semibold text-[11px] mt-0.5"
                          >
                            + Add Task
                          </button>
                        </div>
                      ) : (
                        colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                      )}

                      <button
                        onClick={() => handleOpenAdd(column.id)}
                        className="w-full py-2 px-3 rounded-2xl border border-dashed border-emerald-500/20 text-xs font-medium text-stone-400 hover:text-emerald-300 flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task to {column.name}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MOBILE TABBED STAGE VIEW (Shows selected stage full width, purely vertical) */}
        {/* ========================================================================= */}
        {mobileLayout === 'tabbed' && (
          <div className="w-full">
            {columns
              .filter((c) => c.id === selectedMobileColId)
              .map((column) => {
                const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
                const colColor = column.color || '#10b981';

                return (
                  <div
                    key={column.id}
                    className="w-full flex flex-col rounded-3xl p-4 glass-panel border border-emerald-500/20"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: colColor, boxShadow: `0 0 10px ${colColor}` }}
                        />
                        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-200">
                          {column.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                          {colTasks.length} tasks
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenAdd(column.id)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {colTasks.length === 0 ? (
                        <div className="py-12 border border-dashed border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-xs text-stone-400 gap-1.5 text-center">
                          <Sparkles className="w-5 h-5 text-emerald-400/50" />
                          <span className="text-xs text-stone-300">No tasks in {column.name}</span>
                          <button
                            onClick={() => handleOpenAdd(column.id)}
                            className="text-emerald-400 font-semibold text-xs mt-1"
                          >
                            + Create a new task
                          </button>
                        </div>
                      ) : (
                        colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MOBILE HORIZONTAL SWIPE VIEW (Only if user chooses 'horizontal') */}
        {/* ========================================================================= */}
        {mobileLayout === 'horizontal' && (
          <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x">
            <div className="flex items-start gap-3.5 min-w-max">
              {columns.map((column) => {
                const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
                const colColor = column.color || '#10b981';

                return (
                  <div
                    key={column.id}
                    className="w-[85vw] snap-center flex-shrink-0 flex flex-col rounded-3xl p-4 glass-panel border border-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: colColor, boxShadow: `0 0 10px ${colColor}` }}
                        />
                        <h3 className="font-semibold text-xs tracking-wider uppercase text-stone-200">
                          {column.name}
                        </h3>
                        <span className="text-[10px] font-mono text-stone-400">({colTasks.length})</span>
                      </div>
                      <button
                        onClick={() => handleOpenAdd(column.id)}
                        className="p-1 rounded text-stone-400 hover:text-emerald-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {colTasks.length === 0 ? (
                        <div className="h-28 border border-dashed border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-xs text-stone-400 text-center">
                          <span>Empty stage</span>
                        </div>
                      ) : (
                        colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP FULL MULTI-COLUMN KANBAN BOARD (hidden md:block) */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full overflow-x-auto scroll-smooth">
        <div className="flex items-start gap-5 min-w-max">
          {columns.map((column) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
            const isOver = activeDragCol === column.id;
            const colColor = column.color || '#10b981';

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-80 flex-shrink-0 flex flex-col rounded-3xl p-4 glass-panel transition-all duration-200 kanban-column-perspective ${
                  isOver
                    ? 'ring-2 ring-emerald-500/70 border-emerald-500/60 bg-emerald-500/[0.08]'
                    : ''
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3.5 px-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full transition-shadow duration-300"
                      style={{
                        backgroundColor: colColor,
                        boxShadow: `0 0 10px ${colColor}, 0 0 4px ${colColor}`,
                      }}
                    />
                    <h3 className="font-semibold text-xs tracking-wider uppercase text-stone-200">
                      {column.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAdd(column.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    title="Add task"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="flex-1 space-y-3 min-h-[380px] kanban-column-perspective py-1">
                  {colTasks.length === 0 ? (
                    <div className="h-32 border border-dashed border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-xs text-stone-400 gap-1.5 p-4 text-center">
                      <Sparkles className="w-4 h-4 text-emerald-400/50" />
                      <span className="text-[11px] text-stone-400">Empty stage</span>
                      <button
                        onClick={() => handleOpenAdd(column.id)}
                        className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold text-[11px] mt-0.5 cursor-pointer"
                      >
                        + Add Task
                      </button>
                    </div>
                  ) : (
                    colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                  )}
                </div>

                {/* Add Task Footer Button */}
                <button
                  onClick={() => handleOpenAdd(column.id)}
                  className="mt-3 w-full py-2 px-3 rounded-2xl border border-dashed border-emerald-500/20 hover:border-emerald-500/50 text-xs font-medium text-stone-400 hover:text-emerald-200 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 transition-all group cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400 transition-colors" />
                  <span>Add Task</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
