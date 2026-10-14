import React from 'react';
import { Layers, TrendingUp, Clock, AlertTriangle, Users } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { TiltCard } from './TiltCard';

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
    <div className="w-full px-6 pb-8 space-y-6">
      {/* 3D Interactive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TiltCard
          maxTilt={8}
          scale={1.02}
          className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Backlog
            </span>
            <Layers className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalTasks}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Managed workflow items</p>
        </TiltCard>

        <TiltCard
          maxTilt={8}
          scale={1.02}
          className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sprint Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completionRate}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </TiltCard>

        <TiltCard
          maxTilt={8}
          scale={1.02}
          className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Execution
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {inProgressTasks}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Actively being resolved</p>
        </TiltCard>

        <TiltCard
          maxTilt={8}
          scale={1.02}
          className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overdue Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {overdueTasks}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Requires team prioritization</p>
        </TiltCard>
      </div>

      {/* Team Workload */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-card">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-brand-500" />
          Resource Allocation & Workload Distribution
        </h3>

        <div className="space-y-3.5">
          {teamMembers.map((member) => {
            const memberTasks = tasks.filter((t) => t.assignees?.includes(member.id));
            const memberDone = memberTasks.filter((t) => t.columnId.includes('done')).length;
            const pct = memberTasks.length > 0 ? Math.round((memberDone / memberTasks.length) * 100) : 0;

            return (
              <div key={member.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-slate-400">({member.role})</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {memberDone} / {memberTasks.length} resolved ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
