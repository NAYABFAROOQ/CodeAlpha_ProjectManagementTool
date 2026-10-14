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
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

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
    addComment(selectedTask.id, commentInput.trim(), currentUser.name, currentUser.avatar);
    setCommentInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={() => setSelectedTask(null)}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] bg-white dark:bg-[#111827] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
              {selectedTask.id}
            </span>

            <select
              value={selectedTask.columnId}
              onChange={(e) => moveTask(selectedTask.id, e.target.value)}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => deleteTask(selectedTask.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              onChange={(e) => updateTask(selectedTask.id, { title: e.target.value })}
              className="w-full text-lg font-bold bg-transparent border-none text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-0 px-0"
              placeholder="Task title..."
            />
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Priority
              </span>
              <select
                value={selectedTask.priority}
                onChange={(e) => updateTask(selectedTask.id, { priority: e.target.value })}
                className="w-full font-semibold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Due Date
              </span>
              <input
                type="date"
                value={selectedTask.dueDate || ''}
                onChange={(e) => updateTask(selectedTask.id, { dueDate: e.target.value })}
                className="w-full font-semibold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assigned Team Members
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {teamMembers.map((member) => {
                  const isAssigned = selectedTask.assignees?.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        const current = selectedTask.assignees || [];
                        const updated = isAssigned
                          ? current.filter((id) => id !== member.id)
                          : [...current, member.id];
                        updateTask(selectedTask.id, { assignees: updated });
                      }}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium transition-colors ${
                        isAssigned
                          ? 'bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <img src={member.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                      {member.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Description & Specifications
            </label>
            <textarea
              rows={3}
              value={selectedTask.description || ''}
              onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
              placeholder="Add technical specifications, acceptance criteria, or execution notes..."
              className="w-full p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Labels & Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {selectedTask.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-rose-500 ml-0.5">
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
                placeholder="Add tag (e.g. Infrastructure, UI)..."
                className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 w-56"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Subtask Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-brand-500" />
                Subtasks Checklist ({completedSubtasks}/{totalSubtasks})
              </label>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-1.5 mb-2.5">
              {selectedTask.checklist?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span
                      className={`${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(item.id)}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask item..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors"
              >
                Add Subtask
              </button>
            </form>
          </div>

          {/* Activity & Discussion */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
              Activity & Comments ({selectedTask.comments?.length || 0})
            </label>

            <div className="space-y-2.5 mb-3">
              {selectedTask.comments?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
              ) : (
                selectedTask.comments?.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <img
                      src={c.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {c.author}
                        </span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handlePostComment} className="flex gap-2">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={`Reply as ${currentUser.name}...`}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Reply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
