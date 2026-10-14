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
  const [tagInput, setTagInput] = useState('Backend');

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={() => setIsCreateTaskOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-500" />
            Quick Add Task
          </h3>
          <button
            onClick={() => setIsCreateTaskOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement multi-region Redis cluster..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Requirements or architectural context..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px] mb-1">
                Workflow Column
              </label>
              <select
                value={createTaskColumnId || columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px] mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px] mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Backend, Infra, Bug..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
