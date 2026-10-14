import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const CreateProjectModal = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, createProject } = useProject();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreateProjectOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name: name.trim(),
      key: key.trim().toUpperCase() || name.substring(0, 3).toUpperCase(),
      description: description.trim(),
    });

    setName('');
    setKey('');
    setDescription('');
    setIsCreateProjectOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={() => setIsCreateProjectOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#111827] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-brand-500" />
            Create Workspace
          </h3>
          <button
            onClick={() => setIsCreateProjectOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Workspace Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key) setKey(e.target.value.substring(0, 3).toUpperCase());
              }}
              placeholder="e.g. Data Ingestion Pipeline"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Workspace Identifier Key
            </label>
            <input
              type="text"
              maxLength={4}
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="e.g. DIP"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase"
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
              placeholder="High-level roadmap and sprint scope..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
