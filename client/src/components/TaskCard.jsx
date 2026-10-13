import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Clock,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const TaskCard = ({ task, isDragging }) => {
  const { setSelectedTask, moveTask, deleteTask, columns } = useProject();
  const { teamMembers } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Priority Styles
  const priorityConfig = {
    urgent: { label: 'Urgent', bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' },
    high: { label: 'High', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    medium: { label: 'Medium', bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    low: { label: 'Low', bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  // Checklist completion
  const totalSubtasks = task.checklist?.length || 0;
  const completedSubtasks = task.checklist?.filter((item) => item.completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Assigned members
  const assignedUsers = teamMembers.filter((m) => task.assignees?.includes(m.id));

  // Due Date calculation
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.columnId !== 'col-done';

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedTask(task)}
      className="group relative bg-white dark:bg-[#131b2e] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/60 dark:hover:border-brand-500/60 shadow-sm hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Header: Priority Badge & Quick Action Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priority.bg}`}>
          {priority.label}
        </span>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowQuickMenu((prev) => !prev)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors opacity-0 group-hover:opacity-100"
            title="Task actions"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 top-6 z-20 w-44 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Move to:</div>
              {columns.map((col) => (
                <button
                  key={col.id}
                  disabled={col.id === task.columnId}
                  onClick={() => {
                    moveTask(task.id, col.id);
                    setShowQuickMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between disabled:opacity-40"
                >
                  <span>{col.name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                onClick={() => {
                  deleteTask(task.id);
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Progress Bar (if checklist exists) */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-brand-500" />
              {completedSubtasks}/{totalSubtasks} subtasks
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Due Date & Member Avatars */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs">
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                isOverdue
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title={isOverdue ? 'Task is overdue!' : 'Due date'}
            >
              <Calendar className="w-3 h-3" />
              {task.dueDate}
            </span>
          )}

          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}

          {task.attachments > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Paperclip className="w-3 h-3" />
              {task.attachments}
            </span>
          )}
        </div>

        {/* Assigned Users Avatar Stack */}
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {assignedUsers.map((user) => (
            <img
              key={user.id}
              src={user.avatar}
              alt={user.name}
              title={user.name}
              className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#131b2e] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
