import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers, Users, TrendingUp } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const AnalyticsView = () => {
  const { tasks, columns, activeProject } = useProject();
  const { teamMembers } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.columnId === 'col-done').length;
  const inProgressTasks = tasks.filter((t) => t.columnId === 'col-progress').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.columnId !== 'col-done'
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Tasks
            </span>
            <Layers className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {totalTasks}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across {columns.length} workflow stages</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {completionRate}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Active Sprint
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {inProgressTasks}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tasks being developed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overdue Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {overdueTasks}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires team attention</p>
        </div>
      </div>

      {/* Team Workload Breakdown */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-brand-500" />
          Team Member Workload
        </h3>

        <div className="space-y-4">
          {teamMembers.map((member) => {
            const memberTasks = tasks.filter((t) => t.assignees?.includes(member.id));
            const memberCompleted = memberTasks.filter((t) => t.columnId === 'col-done').length;
            const pct = memberTasks.length > 0 ? Math.round((memberCompleted / memberTasks.length) * 100) : 0;

            return (
              <div key={member.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-slate-400">({member.role})</span>
                  </div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {memberCompleted} / {memberTasks.length} tasks ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500"
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
