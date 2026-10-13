import React from 'react';
import { Bell, Check, Clock, MessageSquare, PlusCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const NotificationPopover = ({ isOpen, onClose }) => {
  const { activityLog } = useProject();

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-12 z-50 w-80 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-500" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Activity Updates</h4>
        </div>
        <span className="text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full">
          Live Sync
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
        {activityLog.map((act) => (
          <div key={act.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors">
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-tight mb-1">
              {act.text}
            </p>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
