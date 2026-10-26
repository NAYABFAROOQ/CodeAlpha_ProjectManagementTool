import React from 'react';
import { Bell, Clock, Sparkles } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const NotificationPopover = ({ isOpen, onClose }) => {
  const { activityLog } = useProject();
  const logs = activityLog || [
    { id: 'act-1', text: '3D Spatial Workspace activated', time: 'Just now' },
    { id: 'act-2', text: 'Real-time WebGL engine calibrated to 60 FPS', time: '5m ago' },
    { id: 'act-3', text: 'Interactive particle universe loaded', time: '12m ago' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="absolute -right-8 sm:right-0 top-11 z-50 w-72 sm:w-80 max-w-[88vw] bg-stone-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden text-stone-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-emerald-500/20">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <h4 className="text-xs font-bold text-white">Live Activity Feed</h4>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono">Engine Active</span>
      </div>

      <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.06]">
        {logs.map((act) => (
          <div key={act.id} className="p-3 hover:bg-emerald-500/[0.06] text-xs transition-colors">
            <p className="text-stone-200 font-medium leading-tight mb-1">
              {act.text}
            </p>
            <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
