import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  ArrowRight,
  Trash2,
  Rotate3d,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const TaskCard = ({ task }) => {
  const { setSelectedTask, moveTask, deleteTask, columns } = useProject();
  const { teamMembers } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Luxury Curated Priorities (NO purple, NO blue, NO black)
  const priorityConfig = {
    urgent: {
      label: 'Urgent',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]',
    },
    high: {
      label: 'High Priority',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    },
    medium: {
      label: 'Medium',
      badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    },
    low: {
      label: 'Normal',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
    },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  // Subtasks progress
  const totalSubtasks = task.checklist?.length || 0;
  const completedSubtasks = task.checklist?.filter((item) => item.completed).length || 0;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Assignee members
  const assignedUsers = teamMembers.filter((m) => task.assignees?.includes(m.id));

  // Due date countdown
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.columnId.includes('done');

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="perspective-1000 select-none group"
      draggable
      onDragStart={handleDragStart}
    >
      <div
        onClick={() => setSelectedTask(task)}
        className={`glass-card task-card-3d relative rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT FACE */}
        <div className={isFlipped ? 'hidden' : 'block'}>
          {/* Card Header: Priority Pill, 3D Flip Action & Quick Move */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border ${priority.badge}`}
            >
              {priority.label}
            </span>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {/* 3D Flip Preview Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="p-1 rounded-md text-stone-400 hover:text-emerald-400 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                title="3D Flip Preview"
              >
                <Rotate3d className="w-3.5 h-3.5" />
              </button>

              {/* Quick Move Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickMenu((prev) => !prev)}
                  className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Task options"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {showQuickMenu && (
                  <div className="absolute right-0 top-6 z-30 w-44 py-1.5 rounded-xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl text-xs font-medium text-stone-200">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Move stage:
                    </div>
                    {columns.map((col) => (
                      <button
                        key={col.id}
                        disabled={col.id === task.columnId}
                        onClick={() => {
                          moveTask(task.id, col.id);
                          setShowQuickMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-emerald-500/10 hover:text-emerald-300 flex items-center justify-between disabled:opacity-40 transition-colors"
                      >
                        <span>{col.name}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400" />
                      </button>
                    ))}
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={() => {
                        deleteTask(task.id);
                        setShowQuickMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-500/20 text-rose-400 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-sm font-semibold text-stone-100 mb-1.5 leading-snug group-hover:text-emerald-300 transition-colors">
            {task.title}
          </h4>

          {/* Description Preview */}
          {task.description && (
            <p className="text-xs text-stone-400 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Checklist Progress */}
          {totalSubtasks > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1 font-medium">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-emerald-400" />
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
                <span className="font-mono text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer: Due date, comments, assignee avatars */}
          <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.08]">
            <div className="flex items-center gap-2.5 text-xs">
              {task.dueDate && (
                <span
                  className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                    isOverdue
                      ? 'bg-rose-500/20 text-rose-300 font-semibold'
                      : 'text-stone-400'
                  }`}
                  title={isOverdue ? 'Task is overdue' : 'Target due date'}
                >
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {task.dueDate}
                </span>
              )}

              {task.comments?.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-stone-400">
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  {task.comments.length}
                </span>
              )}

              {task.attachments > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Paperclip className="w-3 h-3 text-amber-400" />
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
                  className="w-5 h-5 rounded-full ring-2 ring-stone-900 object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* BACK FACE (3D Flip Quick Subtasks & Notes) */}
        {isFlipped && (
          <div className="rotate-y-180 space-y-2.5 py-1">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Quick Inspection
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-[10px] text-stone-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
              >
                Flip back
              </button>
            </div>

            {/* Subtasks checklist snippet */}
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {task.checklist && task.checklist.length > 0 ? (
                task.checklist.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 text-[11px] text-stone-300"
                  >
                    <span
                      className={`w-3 h-3 rounded flex items-center justify-center text-[9px] ${
                        c.completed ? 'bg-emerald-500 text-white' : 'border border-white/30'
                      }`}
                    >
                      {c.completed ? '✓' : ''}
                    </span>
                    <span className={c.completed ? 'line-through text-stone-500' : ''}>
                      {c.text}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-stone-400 italic">No checklist items</div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 text-right">
              <span className="text-[10px] text-emerald-300 font-medium">Click to edit details →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
