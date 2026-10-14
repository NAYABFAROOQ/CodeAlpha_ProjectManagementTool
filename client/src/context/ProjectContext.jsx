import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const INITIAL_PROJECTS = [
  {
    id: 'proj-enterprise-cloud',
    name: 'Core Platform & API Infrastructure',
    key: 'PLN',
    description: 'Mission-critical distributed services, multi-region event pipelines, and real-time synchronization gateway.',
    columns: [
      { id: 'col-todo', name: 'To Do', color: '#64748b' },
      { id: 'col-progress', name: 'In Progress', color: '#3b82f6' },
      { id: 'col-review', name: 'In Review', color: '#f59e0b' },
      { id: 'col-done', name: 'Done', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'PLN-101',
        title: 'Architect Distributed WebSocket Gateway & Presence Engine',
        description: 'Design low-latency pub/sub event channels using Socket.io to broadcast board movements, optimistic updates, and cursor states across distributed nodes.',
        columnId: 'col-progress',
        priority: 'urgent',
        dueDate: '2026-10-18',
        assignees: ['user-nayab', 'user-marcus'],
        tags: ['DistributedSystems', 'WebSockets', 'Architecture'],
        checklist: [
          { id: 'c-1', text: 'Implement task:move event broadcast with optimistic local state', completed: true },
          { id: 'c-2', text: 'Establish Redis adapter for multi-instance socket clustering', completed: true },
          { id: 'c-3', text: 'Configure client heartbeat telemetry & automatic reconnects', completed: false },
        ],
        comments: [
          {
            id: 'comm-1',
            author: 'Nayab Farooq',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            text: 'Benchmarked the broadcast throughput: sub-15ms latency across concurrent peer sessions.',
            createdAt: '1 hour ago',
          },
          {
            id: 'comm-2',
            author: 'Marcus Vance',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            text: 'Payload compression looks pristine. Ready for load testing on the staging cluster.',
            createdAt: '25 mins ago',
          },
        ],
        attachments: 2,
      },
      {
        id: 'PLN-102',
        title: 'Design High-Performance 3D Perspective Tilt & Micro-Interactions',
        description: 'Develop a 60 FPS hardware-accelerated 3D tilt engine with mouse tracking and dynamic radial glare to elevate UI depth without layout shifting.',
        columnId: 'col-done',
        priority: 'high',
        dueDate: '2026-10-15',
        assignees: ['user-sarah'],
        tags: ['DesignSystem', 'Animation', 'UI/UX'],
        checklist: [
          { id: 'c-4', text: 'Calculate normalized card center coordinates on mouse move', completed: true },
          { id: 'c-5', text: 'Implement smooth cubic-bezier reset on mouse leave', completed: true },
          { id: 'c-6', text: 'Verify 60fps performance profile under continuous interaction', completed: true },
        ],
        comments: [
          {
            id: 'comm-3',
            author: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
            text: 'Added perspective(800px) and will-change: transform. Zero layout thrashing verified.',
            createdAt: 'Yesterday',
          },
        ],
        attachments: 3,
      },
      {
        id: 'PLN-103',
        title: 'Refactor Authentication Pipeline to OpenID Connect & Enterprise SSO',
        description: 'Implement enterprise OAuth2/OIDC integration with SAML 2.0 federation and zero-friction guest simulation mode.',
        columnId: 'col-todo',
        priority: 'high',
        dueDate: '2026-10-22',
        assignees: ['user-nayab'],
        tags: ['Security', 'OAuth2', 'Auth'],
        checklist: [
          { id: 'c-7', text: 'Configure Okta and Azure AD identity provider endpoints', completed: false },
          { id: 'c-8', text: 'Implement cryptographically signed state tokens with PKCE', completed: false },
          { id: 'c-9', text: 'Enforce RBAC role claims in JWT verification middleware', completed: false },
        ],
        comments: [],
        attachments: 1,
      },
      {
        id: 'PLN-104',
        title: 'Automate SOC2 Type II Audit Logging & Compliance Ledger',
        description: 'Implement immutable audit trail telemetry for all resource mutations, privilege escalations, and board reorder events.',
        columnId: 'col-review',
        priority: 'medium',
        dueDate: '2026-10-17',
        assignees: ['user-aisha'],
        tags: ['Compliance', 'DevOps', 'Security'],
        checklist: [
          { id: 'c-10', text: 'Structure structured JSON event schema with ISO-8601 timestamps', completed: true },
          { id: 'c-11', text: 'Integrate CloudWatch log streaming with encrypted retention', completed: true },
          { id: 'c-12', text: 'Generate quarterly compliance export report', completed: false },
        ],
        comments: [],
        attachments: 0,
      },
      {
        id: 'PLN-105',
        title: 'Optimize Database Query Indexes & Sharding Strategy',
        description: 'Analyze slow query logs on PostgreSQL read replicas and introduce composite B-tree indices on project_id and column_id.',
        columnId: 'col-todo',
        priority: 'low',
        dueDate: '2026-10-29',
        assignees: ['user-marcus'],
        tags: ['Database', 'Postgres', 'Performance'],
        checklist: [
          { id: 'c-13', text: 'Review pg_stat_statements query execution plans', completed: false },
        ],
        comments: [],
        attachments: 0,
      },
    ],
  },
  {
    id: 'proj-mobile-suite',
    name: 'Mobile Native & Tablet Ecosystem',
    key: 'MOB',
    description: 'Cross-platform iOS and Android suite built for executive triage and offline-first sprint management.',
    columns: [
      { id: 'col-todo-m', name: 'To Do', color: '#64748b' },
      { id: 'col-progress-m', name: 'In Progress', color: '#3b82f6' },
      { id: 'col-review-m', name: 'In Review', color: '#f59e0b' },
      { id: 'col-done-m', name: 'Done', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'MOB-201',
        title: 'Touch Gestures & Haptic Feedback Engine',
        description: 'Implement fluid touch drag mechanics with native haptic pulses on task completion.',
        columnId: 'col-progress-m',
        priority: 'urgent',
        dueDate: '2026-10-21',
        assignees: ['user-nayab', 'user-sarah'],
        tags: ['Mobile', 'UX'],
        checklist: [
          { id: 'c-20', text: 'Calibrate haptic vibration patterns for drag pickup and drop', completed: true },
        ],
        comments: [],
        attachments: 1,
      },
    ],
  },
];

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('pulsepm_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem('pulsepm_active_project') || INITIAL_PROJECTS[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list' | 'analytics'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskColumnId, setCreateTaskColumnId] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Dark Mode State (Defaults to sleek dark enterprise mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pulsepm_theme');
    if (saved) return saved === 'dark';
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pulsepm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pulsepm_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Activity Log
  const [activityLog, setActivityLog] = useState([
    { id: 'act-1', text: 'Nayab Farooq synchronized WebSocket Gateway service', time: '12m ago', type: 'sync' },
    { id: 'act-2', text: 'Sarah Chen marked "3D Perspective Tilt" as Done', time: '1h ago', type: 'complete' },
    { id: 'act-3', text: 'Marcus Vance reviewed PR #402 for Gateway clustering', time: '3h ago', type: 'review' },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pulsepm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pulsepm_active_project', activeProjectId);
  }, [activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const logActivity = (text, type = 'info') => {
    const newAct = {
      id: 'act-' + Date.now(),
      text,
      time: 'Just now',
      type,
    };
    setActivityLog((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Move task
  const moveTask = (taskId, targetColumnId) => {
    setProjects((prevProjects) => {
      return prevProjects.map((proj) => {
        if (proj.id !== activeProject.id) return proj;

        const updatedTasks = proj.tasks.map((task) => {
          if (task.id === taskId) {
            const isTargetDone = targetColumnId.includes('done');
            const wasDone = task.columnId.includes('done');

            // Trigger celebratory confetti on Done column
            if (isTargetDone && !wasDone) {
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 },
                  colors: ['#2563EB', '#10B981', '#3B82F6', '#059669'],
                });
              } catch (e) {}
              logActivity(`Completed task "${task.title}"`, 'complete');
            } else {
              logActivity(`Moved "${task.title}" to ${targetColumnId.replace('col-', '').toUpperCase()}`, 'move');
            }
            return { ...task, columnId: targetColumnId };
          }
          return task;
        });

        return { ...proj, tasks: updatedTasks };
      });
    });
  };

  // Create new task
  const createTask = (taskData) => {
    const count = (activeProject.tasks?.length || 0) + 1;
    const newTask = {
      id: `${activeProject.key}-${100 + count}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      columnId: taskData.columnId || activeProject.columns[0].id,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      assignees: taskData.assignees || ['user-nayab'],
      tags: taskData.tags || ['Feature'],
      checklist: taskData.checklist || [],
      comments: [],
      attachments: 0,
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return { ...proj, tasks: [newTask, ...proj.tasks] };
      })
    );

    logActivity(`Created task "${newTask.title}"`, 'create');
  };

  // Update task
  const updateTask = (taskId, updates) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        };
      })
    );

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => ({ ...prev, ...updates }));
    }
  };

  // Delete task
  const deleteTask = (taskId) => {
    const taskToDelete = activeProject.tasks.find((t) => t.id === taskId);
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return { ...proj, tasks: proj.tasks.filter((t) => t.id !== taskId) };
      })
    );

    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    if (taskToDelete) {
      logActivity(`Deleted task "${taskToDelete.title}"`, 'delete');
    }
  };

  // Add comment
  const addComment = (taskId, text, authorName, authorAvatar) => {
    const newComment = {
      id: 'comm-' + Date.now(),
      author: authorName,
      avatar: authorAvatar,
      text,
      createdAt: 'Just now',
    };

    updateTask(taskId, {
      comments: [...(selectedTask?.comments || []), newComment],
    });

    logActivity(`${authorName} commented on task`, 'comment');
  };

  // Create Project Workspace
  const createProject = (projData) => {
    const key = (projData.key || projData.name.substring(0, 3)).toUpperCase();
    const newProj = {
      id: 'proj-' + Date.now(),
      name: projData.name || 'New Workspace',
      key,
      description: projData.description || '',
      columns: [
        { id: 'col-todo-' + Date.now(), name: 'To Do', color: '#64748b' },
        { id: 'col-progress-' + Date.now(), name: 'In Progress', color: '#3b82f6' },
        { id: 'col-review-' + Date.now(), name: 'In Review', color: '#f59e0b' },
        { id: 'col-done-' + Date.now(), name: 'Done', color: '#10b981' },
      ],
      tasks: [],
    };

    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    logActivity(`Created workspace "${newProj.name}"`, 'create');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProjectId,
        createProject,
        tasks: activeProject.tasks || [],
        columns: activeProject.columns || [],
        moveTask,
        createTask,
        updateTask,
        deleteTask,
        addComment,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        filterAssignee,
        setFilterAssignee,
        viewMode,
        setViewMode,
        selectedTask,
        setSelectedTask,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        createTaskColumnId,
        setCreateTaskColumnId,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isDarkMode,
        toggleDarkMode,
        activityLog,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
