import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { TiltCard } from './TiltCard';

export const TaskCard = ({ task }) => {
  const { setSelectedTask, moveTask, deleteTask, columns } = useProject();
  const { teamMembers } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Enterprise Priority Configurations
  const priorityConfig = {
    urgent: { label: 'Urgent', badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    high: { label: 'High', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    medium: { label: 'Medium', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    low: { label: 'Low', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  // Subtasks progress
  const totalSubtasks = task.checklist?.length || 0;
  const completedSubtasks = task.checklist?.filter((item) => item.completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Assignee members
  const assignedUsers = teamMembers.filter((m) => task.assignees?.includes(m.id));

  // Due date countdown
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.columnId.includes('done');

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <TiltCard
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedTask(task)}
      maxTilt={6}
      scale={1.012}
      className="group bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-card hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Header: Key & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
            {task.id}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border ${priority.badge}`}>
            {priority.label}
          </span>
        </div>

        {/* Quick move dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowQuickMenu((prev) => !prev)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors opacity-0 group-hover:opacity-100"
            title="Task options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 top-6 z-30 w-44 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-dropdown text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Move status:
              </div>
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
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Checklist Progress */}
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
              className="h-full rounded-full bg-brand-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: Due date, comments count, assignee avatars */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 text-xs">
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                isOverdue
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title={isOverdue ? 'Task is overdue' : 'Target due date'}
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

        {/* Assignees */}
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {assignedUsers.map((user) => (
            <img
              key={user.id}
              src={user.avatar}
              alt={user.name}
              title={user.name}
              className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#111827] object-cover"
            />
          ))}
        </div>
      </div>
    </TiltCard>
  );
};
