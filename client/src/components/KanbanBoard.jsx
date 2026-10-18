import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
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
    <div className="w-full overflow-x-auto pb-12">
      {/* Kanban Columns Container with 3D Perspective Context */}
      <div className="flex items-start gap-5 min-w-max px-6">
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
              {/* Column Header: Clean title with glowing status indicator dot (NO task availability count) */}
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
                </div>

                <button
                  onClick={() => handleOpenAdd(column.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                  title="Add task"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List inside 3D Perspective Container */}
              <div className="flex-1 space-y-3 min-h-[380px] kanban-column-perspective py-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-xs text-stone-400 gap-1.5 p-4 text-center">
                    <Sparkles className="w-4 h-4 text-emerald-400/50" />
                    <span className="text-[11px] text-stone-400">Empty stage</span>
                    <button
                      onClick={() => handleOpenAdd(column.id)}
                      className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold text-[11px] mt-0.5"
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
                className="mt-3 w-full py-2 px-3 rounded-2xl border border-dashed border-emerald-500/20 hover:border-emerald-500/50 text-xs font-medium text-stone-400 hover:text-emerald-200 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 transition-all group"
              >
                <Plus className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400 transition-colors" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
