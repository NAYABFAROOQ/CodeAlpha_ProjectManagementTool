import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'PlanPulse SaaS Platform',
    key: 'PLN',
    description: 'Next-generation agile workspace with real-time kanban and multi-tenant collaboration.',
    color: '#8b5cf6',
    columns: [
      { id: 'col-backlog', name: 'Backlog', color: '#94a3b8' },
      { id: 'col-progress', name: 'In Progress', color: '#3b82f6' },
      { id: 'col-review', name: 'In Review', color: '#f59e0b' },
      { id: 'col-done', name: 'Completed', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'task-101',
        title: 'Architect WebSocket Real-Time Sync Pipeline',
        description: 'Design low-latency pub/sub event channels using Socket.io to synchronize board movements and member presence across connected clients.',
        columnId: 'col-progress',
        priority: 'urgent',
        dueDate: '2026-10-16',
        assignees: ['user-nayab', 'user-marcus'],
        tags: ['Backend', 'WebSockets', 'Architecture'],
        checklist: [
          { id: 'c-1', text: 'Implement task:moved event broadcast', completed: true },
          { id: 'c-2', text: 'Add optimistic UI updates on drag-and-drop', completed: true },
          { id: 'c-3', text: 'Handle reconnections and client heartbeat', completed: false },
        ],
        comments: [
          {
            id: 'comm-1',
            author: 'Nayab Farooq',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            text: 'I have finalized the event payloads for card reordering. Testing with multi-tab sessions now!',
            createdAt: '2 hours ago',
          },
          {
            id: 'comm-2',
            author: 'Marcus Vance',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            text: 'Looks great! Make sure to debounce state persistence to prevent database write spikes.',
            createdAt: '45 mins ago',
          },
        ],
        attachments: 2,
      },
      {
        id: 'task-102',
        title: 'Design Glassmorphism Kanban Card System',
        description: 'Create fluid interactive cards with micro-animations, priority glow states, assignee chips, and subtle backdrop blurs.',
        columnId: 'col-done',
        priority: 'high',
        dueDate: '2026-10-14',
        assignees: ['user-sarah'],
        tags: ['UI/UX', 'Tailwind', 'Design System'],
        checklist: [
          { id: 'c-4', text: 'Draft Figma tokens for light/dark themes', completed: true },
          { id: 'c-5', text: 'Create responsive tag overflow pill', completed: true },
          { id: 'c-6', text: 'Add interactive hover scale transition', completed: true },
        ],
        comments: [
          {
            id: 'comm-3',
            author: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
            text: 'Completed! High-contrast badges with accessibility compliance passed WCAG AAA.',
            createdAt: '1 day ago',
          },
        ],
        attachments: 3,
      },
      {
        id: 'task-103',
        title: 'Multi-User Role-Based Access & Guest Mode',
        description: 'Build fast frictionless guest demo login alongside standard JWT authentication to allow instant preview by recruiters and clients.',
        columnId: 'col-progress',
        priority: 'high',
        dueDate: '2026-10-18',
        assignees: ['user-nayab'],
        tags: ['Auth', 'Security'],
        checklist: [
          { id: 'c-7', text: 'Setup guest credential generation', completed: true },
          { id: 'c-8', text: 'Create team switcher in header', completed: true },
          { id: 'c-9', text: 'Restrict board deletion to admin roles', completed: false },
        ],
        comments: [],
        attachments: 1,
      },
      {
        id: 'task-104',
        title: 'Continuous Deployment & Netlify Build Automation',
        description: 'Configure clean production build output, client-side routing redirects via netlify.toml, and healthcheck monitors.',
        columnId: 'col-review',
        priority: 'medium',
        dueDate: '2026-10-15',
        assignees: ['user-aisha'],
        tags: ['DevOps', 'CI/CD'],
        checklist: [
          { id: 'c-10', text: 'Verify Vite production chunk splitting', completed: true },
          { id: 'c-11', text: 'Configure custom domain SSL headers', completed: false },
        ],
        comments: [],
        attachments: 0,
      },
      {
        id: 'task-105',
        title: 'Export Board Data to CSV and Markdown Report',
        description: 'Enable sprint managers to export the active board tasks, progress percentages, and assignee workload into standard formats.',
        columnId: 'col-backlog',
        priority: 'low',
        dueDate: '2026-10-25',
        assignees: ['user-marcus'],
        tags: ['Feature', 'Reporting'],
        checklist: [
          { id: 'c-12', text: 'Design export modal with date range filters', completed: false },
        ],
        comments: [],
        attachments: 0,
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Mobile App Experience v2',
    key: 'MOB',
    description: 'React Native & PWA mobile companion for sprint tracking on the go.',
    color: '#ec4899',
    columns: [
      { id: 'col-backlog-2', name: 'Backlog', color: '#94a3b8' },
      { id: 'col-progress-2', name: 'In Progress', color: '#3b82f6' },
      { id: 'col-review-2', name: 'In Review', color: '#f59e0b' },
      { id: 'col-done-2', name: 'Completed', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'task-201',
        title: 'Touch Gesture Drag & Reorder',
        description: 'Implement fluid mobile touch gestures for swipe-to-complete and long-press card reordering.',
        columnId: 'col-progress-2',
        priority: 'urgent',
        dueDate: '2026-10-20',
        assignees: ['user-nayab', 'user-sarah'],
        tags: ['Mobile', 'Gestures'],
        checklist: [
          { id: 'c-21', text: 'Support haptic feedback API', completed: true },
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
    const saved = localStorage.getItem('planpulse_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem('planpulse_active_project') || INITIAL_PROJECTS[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list' | 'analytics'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskColumnId, setCreateTaskColumnId] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('planpulse_theme');
    if (saved) return saved === 'dark';
    return true; // Default dark
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('planpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('planpulse_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Activity Log & Notifications
  const [activityLog, setActivityLog] = useState([
    { id: 'act-1', text: 'Nayab Farooq created task "Architect WebSocket Pipeline"', time: '10 mins ago', type: 'create' },
    { id: 'act-2', text: 'Sarah Chen marked "Design Glassmorphism Cards" as Completed', time: '1 hour ago', type: 'complete' },
    { id: 'act-3', text: 'Marcus Vance commented on "WebSocket Real-Time Sync"', time: '2 hours ago', type: 'comment' },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('planpulse_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('planpulse_active_project', activeProjectId);
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

  // Move task to another column or reorder
  const moveTask = (taskId, targetColumnId) => {
    setProjects((prevProjects) => {
      return prevProjects.map((proj) => {
        if (proj.id !== activeProject.id) return proj;

        const updatedTasks = proj.tasks.map((task) => {
          if (task.id === taskId) {
            // Trigger confetti if moved to completed!
            if (targetColumnId === 'col-done' && task.columnId !== 'col-done') {
              try {
                confetti({
                  particleCount: 60,
                  spread: 70,
                  origin: { y: 0.7 },
                  colors: ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'],
                });
              } catch (e) {}
              logActivity(`Completed task: "${task.title}"`, 'complete');
            } else {
              logActivity(`Moved task "${task.title}" to ${targetColumnId.replace('col-', '').toUpperCase()}`, 'move');
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
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      columnId: taskData.columnId || activeProject.columns[0].id,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
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

    logActivity(`Created new task "${newTask.title}"`, 'create');
  };

  // Update existing task
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

  // Add comment to task
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

  // Create Project
  const createProject = (projData) => {
    const newProj = {
      id: 'proj-' + Date.now(),
      name: projData.name || 'New Project',
      key: projData.key || 'NEW',
      description: projData.description || '',
      color: projData.color || '#8b5cf6',
      columns: [
        { id: 'col-backlog-' + Date.now(), name: 'Backlog', color: '#94a3b8' },
        { id: 'col-progress-' + Date.now(), name: 'In Progress', color: '#3b82f6' },
        { id: 'col-review-' + Date.now(), name: 'In Review', color: '#f59e0b' },
        { id: 'col-done-' + Date.now(), name: 'Completed', color: '#10b981' },
      ],
      tasks: [],
    };

    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    logActivity(`Created project "${newProj.name}"`, 'create');
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
