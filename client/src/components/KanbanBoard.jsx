import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
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

  // Filter tasks based on search & filters
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
    <div className="flex-1 overflow-x-auto pb-6">
      <div className="flex items-start gap-5 min-w-max px-6">
        {columns.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
          const isOver = activeDragCol === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`w-80 flex-shrink-0 flex flex-col rounded-2xl p-3.5 transition-all duration-200 border ${
                isOver
                  ? 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/30'
                  : 'bg-slate-100/70 dark:bg-[#0f1626]/80 border-slate-200/80 dark:border-slate-800/60'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: column.color || '#8b5cf6' }}
                  />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {column.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAdd(column.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Add task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3 min-h-[350px] overflow-y-auto pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                    <span>No tasks yet</span>
                    <button
                      onClick={() => handleOpenAdd(column.id)}
                      className="mt-1.5 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                    >
                      + Create task
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>

              {/* Column Bottom Add Button */}
              <button
                onClick={() => handleOpenAdd(column.id)}
                className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-500 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white/60 dark:hover:bg-slate-800/50 flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
