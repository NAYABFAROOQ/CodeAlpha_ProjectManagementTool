import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
    <div className="w-full overflow-x-auto pb-8">
      {/* Kanban Columns Container sitting naturally within page vertical flow */}
      <div className="flex items-start gap-4 min-w-max px-6">
        {columns.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
          const isOver = activeDragCol === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`w-80 flex-shrink-0 flex flex-col rounded-xl p-3 transition-colors duration-150 border ${
                isOver
                  ? 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/60 ring-2 ring-brand-500/20'
                  : 'bg-slate-100/80 dark:bg-[#0e1422] border-slate-200/90 dark:border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: column.color || '#3b82f6' }}
                  />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {column.name}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAdd(column.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Add task"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5 min-h-[380px]">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                    <span>No tasks in {column.name}</span>
                    <button
                      onClick={() => handleOpenAdd(column.id)}
                      className="mt-1.5 text-brand-600 dark:text-brand-400 hover:underline font-semibold text-[11px]"
                    >
                      + Quick Add
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>

              {/* Add Task Footer Button */}
              <button
                onClick={() => handleOpenAdd(column.id)}
                className="mt-2.5 w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/40 flex items-center justify-center gap-1.5 transition-all"
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
