import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const CreateTaskModal = () => {
  const { isCreateTaskOpen, setIsCreateTaskOpen, createTaskColumnId, columns, createTask } =
    useProject();
  const { teamMembers, currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(createTaskColumnId || columns[0]?.id || 'col-todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [tagInput, setTagInput] = useState('Feature');

  if (!isCreateTaskOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title: title.trim(),
      description: description.trim(),
      columnId: createTaskColumnId || columnId,
      priority,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      assignees: [assigneeId],
      tags: tagInput ? tagInput.split(',').map((t) => t.trim()) : ['Feature'],
      checklist: [],
    });

    setTitle('');
    setDescription('');
    setIsCreateTaskOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1a14]/75 backdrop-blur-md"
      onClick={() => setIsCreateTaskOpen(false)}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-stone-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-500/20 p-4 sm:p-6 text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Create New Task
          </h3>
          <button
            onClick={() => setIsCreateTaskOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design Mobile Onboarding Flow"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of requirements..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div>
              <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
                Stage
              </label>
              <select
                value={createTaskColumnId || columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-800 border border-white/10 text-xs font-medium text-stone-200 outline-none cursor-pointer focus:border-emerald-500"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id} className="bg-stone-900 text-stone-200">
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-800 border border-white/10 text-xs font-medium text-stone-200 outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="urgent" className="bg-stone-900">🔴 Urgent</option>
                <option value="high" className="bg-stone-900">🟠 High</option>
                <option value="medium" className="bg-stone-900">🟡 Medium</option>
                <option value="low" className="bg-stone-900">🟢 Normal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div>
              <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-800 border border-white/10 text-xs font-medium text-stone-200 outline-none cursor-pointer focus:border-emerald-500"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id} className="bg-stone-900 text-stone-200">
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-800 border border-white/10 text-xs font-medium text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="UI/UX, Frontend, Billing"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
