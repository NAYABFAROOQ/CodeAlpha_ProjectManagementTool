import React from 'react';
import { Calendar } from 'lucide-react';
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
    urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    high: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  return (
    <div className="w-full px-3 sm:px-6 pb-28 md:pb-12">
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto -mx-0">
          <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-[11px] uppercase font-bold text-stone-400 tracking-wider bg-white/[0.02]">
              <th className="py-3.5 px-5">Task Name</th>
              <th className="py-3.5 px-5">Stage</th>
              <th className="py-3.5 px-5">Priority</th>
              <th className="py-3.5 px-5">Target Date</th>
              <th className="py-3.5 px-5">Assignees</th>
              <th className="py-3.5 px-5 text-right">Subtasks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-xs font-medium text-stone-200">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400">
                  No records matching active criteria.
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
                    className="hover:bg-emerald-500/[0.06] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-white">
                      <span>{task.title}</span>
                    </td>

                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.columnId}
                        onChange={(e) => moveTask(task.id, e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-900/80 border border-emerald-500/30 text-stone-200 outline-none cursor-pointer hover:border-emerald-500 transition-colors"
                      >
                        {columns.map((col) => (
                          <option key={col.id} value={col.id} className="bg-stone-900 text-stone-200">
                            {col.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border ${
                          priorityBadges[task.priority] || priorityBadges.medium
                        }`}
                      >
                        {task.priority?.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-stone-400">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{task.dueDate}</span>
                        </div>
                      ) : (
                        <span className="text-stone-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center -space-x-1.5">
                        {assigned.map((user) => (
                          <img
                            key={user.id}
                            src={user.avatar}
                            alt={user.name}
                            title={user.name}
                            className="w-5 h-5 rounded-full ring-2 ring-stone-900 object-cover"
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono text-emerald-400">
                      {totalSub > 0 ? `${completedSub}/${totalSub}` : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
