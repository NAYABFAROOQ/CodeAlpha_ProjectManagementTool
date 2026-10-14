import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const NotificationPopover = ({ isOpen, onClose }) => {
  const { activityLog } = useProject();

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-11 z-50 w-80 bg-white dark:bg-[#111827] rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-800 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-brand-500" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Audit Feed</h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Live WebSocket</span>
      </div>

      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
        {activityLog.map((act) => (
          <div key={act.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors">
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-tight mb-1">
              {act.text}
            </p>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
