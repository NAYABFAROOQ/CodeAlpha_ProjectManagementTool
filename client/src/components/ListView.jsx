import React from 'react';
import { Calendar, CheckSquare, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export const ListView = () => {
  const { tasks, columns, setSelectedTask, moveTask, searchQuery, filterPriority, filterAssignee } =
    useProject();
  const { teamMembers } = useAuth();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignees?.includes(filterAssignee);
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const priorityBadges = {
    urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    high: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <div className="flex-1 px-6 pb-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
              <th className="py-3 px-4">Task Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Assignees</th>
              <th className="py-3 px-4 text-right">Subtasks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No tasks found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const totalSub = task.checklist?.length || 0;
                const completedSub = task.checklist?.filter((c) => c.completed).length || 0;
                const assigned = teamMembers.filter((m) => task.assignees?.includes(m.id));

                return (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">
                          {task.id.slice(-3)}
                        </span>
                        <span>{task.title}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.columnId}
                        onChange={(e) => moveTask(task.id, e.target.value)}
                        className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                      >
                        {columns.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border capitalize ${
                          priorityBadges[task.priority] || priorityBadges.medium
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {task.dueDate || 'No date'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center -space-x-1.5">
                        {assigned.map((u) => (
                          <img
                            key={u.id}
                            src={u.avatar}
                            alt=""
                            title={u.name}
                            className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {totalSub > 0 ? (
                        <span>
                          {completedSub}/{totalSub}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
