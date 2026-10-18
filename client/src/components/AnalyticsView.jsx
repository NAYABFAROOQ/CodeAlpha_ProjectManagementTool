import React from 'react';
import { Layers, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const AnalyticsView = () => {
  const { tasks, columns } = useProject();
  const { teamMembers } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.columnId.includes('done')).length;
  const inProgressTasks = tasks.filter((t) => t.columnId.includes('progress')).length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.columnId.includes('done')
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-full px-6 pb-12 space-y-6">
      {/* 3D Glass KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 kanban-column-perspective">
        <div className="glass-card task-card-3d rounded-3xl p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Total Tasks</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{totalTasks}</div>
          <div className="text-[11px] text-stone-400 mt-1">Project scope items</div>
        </div>

        <div className="glass-card task-card-3d rounded-3xl p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{completionRate}%</div>
          <div className="text-[11px] text-stone-400 mt-1">{completedTasks} tasks resolved</div>
        </div>

        <div className="glass-card task-card-3d rounded-3xl p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{inProgressTasks}</div>
          <div className="text-[11px] text-stone-400 mt-1">Actively moving forward</div>
        </div>

        <div className="glass-card task-card-3d rounded-3xl p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Attention Needed</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tracking-tight">{overdueTasks}</div>
          <div className="text-[11px] text-stone-400 mt-1">Overdue items</div>
        </div>
      </div>

      {/* Distribution by Column & Team Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
            Pipeline Distribution
          </h3>
          <div className="space-y-4">
            {columns.map((col) => {
              const count = tasks.filter((t) => t.columnId === col.id).length;
              const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
              const colColor = col.color || '#10b981';

              return (
                <div key={col.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="flex items-center gap-2 text-stone-200">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: colColor,
                          boxShadow: `0 0 8px ${colColor}`,
                        }}
                      />
                      {col.name}
                    </span>
                    <span className="text-stone-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
            Team Allocation & Velocity
          </h3>
          <div className="space-y-3">
            {teamMembers.map((member) => {
              const assignedCount = tasks.filter((t) => t.assignees?.includes(member.id)).length;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-emerald-500/[0.06] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/30"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{member.name}</div>
                      <div className="text-[10px] text-stone-400">{member.role}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {assignedCount} tasks
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
