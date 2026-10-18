import React, { useState } from 'react';
import {
  X,
  Calendar,
  CheckSquare,
  Plus,
  Trash2,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const TaskDetailModal = () => {
  const { selectedTask, setSelectedTask, updateTask, deleteTask, columns, moveTask, addComment } =
    useProject();
  const { currentUser, teamMembers } = useAuth();

  const [commentInput, setCommentInput] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');

  if (!selectedTask) return null;

  const totalSubtasks = selectedTask.checklist?.length || 0;
  const completedSubtasks = selectedTask.checklist?.filter((item) => item.completed).length || 0;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleChecklist = (itemId) => {
    const updated = selectedTask.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateTask(selectedTask.id, { checklist: updated });
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    const newItem = {
      id: 'sub-' + Date.now(),
      text: newSubtask.trim(),
      completed: false,
    };
    updateTask(selectedTask.id, {
      checklist: [...(selectedTask.checklist || []), newItem],
    });
    setNewSubtask('');
  };

  const handleDeleteSubtask = (itemId) => {
    const updated = selectedTask.checklist.filter((item) => item.id !== itemId);
    updateTask(selectedTask.id, { checklist: updated });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const current = selectedTask.tags || [];
    if (!current.includes(newTag.trim())) {
      updateTask(selectedTask.id, { tags: [...current, newTag.trim()] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = selectedTask.tags.filter((t) => t !== tagToRemove);
    updateTask(selectedTask.id, { tags: updated });
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(selectedTask.id, {
      text: commentInput.trim(),
      author: currentUser.name,
      avatar: currentUser.avatar,
    });
    setCommentInput('');
  };

  const priorityConfig = {
    urgent: { label: 'Urgent', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    high: { label: 'High Priority', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    medium: { label: 'Medium', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    low: { label: 'Normal', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  };
  const priority = priorityConfig[selectedTask.priority] || priorityConfig.medium;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1a14]/75 backdrop-blur-md"
      onClick={() => setSelectedTask(null)}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] bg-stone-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-500/20 flex flex-col overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${priority.badge}`}
            >
              {priority.label}
            </span>

            <select
              value={selectedTask.columnId}
              onChange={(e) => moveTask(selectedTask.id, e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-800/80 border border-emerald-500/30 text-stone-200 focus:border-emerald-500 outline-none cursor-pointer"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id} className="bg-stone-900 text-stone-200">
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => deleteTask(selectedTask.id)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <input
              type="text"
              value={selectedTask.title}
              onChange={(e) => updateTask({ ...selectedTask, title: e.target.value })}
              className="w-full text-lg font-bold bg-transparent border-none text-white focus:outline-none focus:ring-0 px-0 placeholder-stone-500"
              placeholder="Task title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={selectedTask.description || ''}
              onChange={(e) => updateTask({ ...selectedTask, description: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Add detailed task context..."
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-[11px] text-stone-400 font-medium block mb-1">Priority</span>
              <select
                value={selectedTask.priority}
                onChange={(e) => updateTask({ ...selectedTask, priority: e.target.value })}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-stone-800 border border-white/10 text-stone-200 outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="urgent" className="bg-stone-900">Urgent</option>
                <option value="high" className="bg-stone-900">High</option>
                <option value="medium" className="bg-stone-900">Medium</option>
                <option value="low" className="bg-stone-900">Normal</option>
              </select>
            </div>

            <div>
              <span className="text-[11px] text-stone-400 font-medium block mb-1">Due Date</span>
              <input
                type="date"
                value={selectedTask.dueDate || ''}
                onChange={(e) => updateTask({ ...selectedTask, dueDate: e.target.value })}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-stone-800 border border-white/10 text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider">
                Checklist ({completedSubtasks}/{totalSubtasks})
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-1.5">
              {selectedTask.checklist?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between group p-2 rounded-xl hover:bg-white/[0.04]"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="rounded border-emerald-500/40 text-emerald-500 focus:ring-0 bg-transparent"
                    />
                    <span
                      className={item.completed ? 'line-through text-stone-500' : 'text-stone-300'}
                    >
                      {item.text}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-semibold text-emerald-300 border border-emerald-500/30"
              >
                Add
              </button>
            </form>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedTask.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 text-stone-400 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-semibold text-emerald-300 border border-emerald-500/30"
              >
                Tag
              </button>
            </form>
          </div>

          {/* Activity Comments */}
          <div>
            <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-2">
              Activity & Comments
            </label>

            <div className="space-y-3 mb-3">
              {selectedTask.comments?.map((c) => (
                <div key={c.id} className="flex gap-3 text-xs">
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="flex-1 p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{c.author}</span>
                      <span className="text-[10px] text-stone-500">{c.createdAt}</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write an update..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
