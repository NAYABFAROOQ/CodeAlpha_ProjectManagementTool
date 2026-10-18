import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const INITIAL_PROJECTS = [
  {
    id: 'proj-enterprise-cloud',
    name: 'Core Product Roadmap',
    key: 'PLN',
    description: 'Next-generation SaaS platform features, payments infrastructure, and collaborative workflows.',
    columns: [
      { id: 'col-todo', name: 'To Do', color: '#78716c' },
      { id: 'col-progress', name: 'In Progress', color: '#f59e0b' },
      { id: 'col-review', name: 'In Review', color: '#f97316' },
      { id: 'col-done', name: 'Done', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'task-onboarding',
        title: 'Design Mobile Onboarding Flow',
        description: 'Create an intuitive 3-step onboarding walkthrough with social login, workspace invitations, and permission prompts.',
        columnId: 'col-todo',
        priority: 'high',
        dueDate: '2026-10-24',
        assignees: ['user-sarah', 'user-nayab'],
        tags: ['UI/UX', 'Mobile', 'Design'],
        checklist: [
          { id: 'c-1', text: 'Create high-fidelity Figma components', completed: true },
          { id: 'c-2', text: 'User interview testing & feedback synthesis', completed: false },
          { id: 'c-3', text: 'Export responsive SVG assets', completed: false },
        ],
        comments: [
          {
            id: 'comm-1',
            author: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
            text: 'Figma mockups are ready for team review in the Design channel.',
            createdAt: '2 hours ago',
          },
        ],
        attachments: 3,
      },
      {
        id: 'task-stripe',
        title: 'Integrate Stripe Checkout',
        description: 'Implement Stripe Elements, subscription billing tiers, coupon validation, and real-time webhook event listeners.',
        columnId: 'col-todo',
        priority: 'urgent',
        dueDate: '2026-10-21',
        assignees: ['user-marcus'],
        tags: ['Payments', 'Billing', 'API'],
        checklist: [
          { id: 'c-4', text: 'Configure Stripe test webhook signing secrets', completed: true },
          { id: 'c-5', text: 'Build customer portal redirect endpoint', completed: false },
          { id: 'c-6', text: 'Handle invoice payment failure fallbacks', completed: false },
        ],
        comments: [],
        attachments: 1,
      },
      {
        id: 'task-darkmode',
        title: 'Launch 3D Interactive Ecosystem',
        description: 'Interactive 3D space workspace, WebGL background constellation, and real-time 3D card tilt & flip inspection.',
        columnId: 'col-progress',
        priority: 'urgent',
        dueDate: '2026-10-18',
        assignees: ['user-nayab'],
        tags: ['ThreeJS', '3D', 'Frontend'],
        checklist: [
          { id: 'c-7', text: 'Build Three.js interactive 3D particle universe', completed: true },
          { id: 'c-8', text: 'Develop 3D Spatial Orbit stage with camera controls', completed: true },
          { id: 'c-9', text: 'Implement 3D card flip inspection mode', completed: true },
        ],
        comments: [
          {
            id: 'comm-2',
            author: 'Nayab Farooq',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            text: 'The 3D space view and particle universe are running smoothly at 60 FPS!',
            createdAt: '15 mins ago',
          },
        ],
        attachments: 2,
      },
      {
        id: 'task-cursors',
        title: 'Real-Time Collaboration Cursors',
        description: 'Broadcast live teammate cursor positions and active board viewports with low-latency WebSockets.',
        columnId: 'col-progress',
        priority: 'medium',
        dueDate: '2026-10-22',
        assignees: ['user-alex', 'user-marcus'],
        tags: ['WebSockets', 'RealTime'],
        checklist: [
          { id: 'c-10', text: 'Emit socket cursor coordinate payloads', completed: true },
          { id: 'c-11', text: 'Smooth cursor interpolation on peer clients', completed: false },
        ],
        comments: [],
        attachments: 0,
      },
      {
        id: 'task-pipeline',
        title: 'Optimize Asset Pipeline & CDN',
        description: 'Implement automatic WebP image compression, edge caching rules, and asset tree-shaking for sub-second page loads.',
        columnId: 'col-review',
        priority: 'medium',
        dueDate: '2026-10-19',
        assignees: ['user-alex'],
        tags: ['Performance', 'DevOps'],
        checklist: [
          { id: 'c-12', text: 'Configure Cloudflare edge cache-control headers', completed: true },
          { id: 'c-13', text: 'Audit bundle chunks & vendor split points', completed: true },
        ],
        comments: [],
        attachments: 1,
      },
      {
        id: 'task-kanban',
        title: 'Interactive Kanban Drag & Drop',
        description: 'Hardware-accelerated card reordering with smooth physics, drag previews, and optimistic UI state transitions.',
        columnId: 'col-done',
        priority: 'medium',
        dueDate: '2026-10-15',
        assignees: ['user-nayab', 'user-sarah'],
        tags: ['Frontend', 'UX'],
        checklist: [
          { id: 'c-14', text: 'HTML5 drag events with stage indicators', completed: true },
          { id: 'c-15', text: 'Celebration confetti in Emerald and Gold', completed: true },
        ],
        comments: [
          {
            id: 'comm-3',
            author: 'Nayab Farooq',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            text: 'Fluid physics tested across modern desktop browsers.',
            createdAt: 'Yesterday',
          },
        ],
        attachments: 0,
      },
    ],
  },
  {
    id: 'proj-mobile-app',
    name: 'Mobile Native & Tablet Ecosystem',
    key: 'MOB',
    description: 'React Native iOS & Android companion apps with offline sync and push notifications.',
    columns: [
      { id: 'col-mob-todo', name: 'Backlog', color: '#78716c' },
      { id: 'col-mob-dev', name: 'In Development', color: '#f59e0b' },
      { id: 'col-mob-qa', name: 'Testing & QA', color: '#f97316' },
      { id: 'col-mob-shipped', name: 'Shipped', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'task-offline-sync',
        title: 'Offline WatermelonDB Local Cache',
        description: 'Enable offline draft creation and background sync queue when network reconnects.',
        columnId: 'col-mob-dev',
        priority: 'high',
        dueDate: '2026-10-25',
        assignees: ['user-alex'],
        tags: ['Mobile', 'Offline', 'Database'],
        checklist: [],
        comments: [],
        attachments: 0,
      },
    ],
  },
];

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('pulsepm_projects_v4');
      if (saved) return JSON.parse(saved);
      // Clean up outdated storage
      localStorage.removeItem('pulsepm_projects');
      localStorage.removeItem('pulsepm_projects_v2');
      localStorage.removeItem('pulsepm_projects_v3');
    } catch (e) {
      console.warn('Failed to parse saved projects', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem('pulsepm_active_project_v4') || INITIAL_PROJECTS[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'space3d' | 'list' | 'analytics'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskColumnId, setCreateTaskColumnId] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Landing vs Workspace screen state (Default to Landing screen on root URL)
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#workspace' || window.location.search.includes('view=workspace')) {
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    if (isWorkspaceOpen) {
      if (window.location.hash !== '#workspace') {
        window.history.pushState(null, '', '#workspace');
      }
    } else {
      if (window.location.hash === '#workspace') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }, [isWorkspaceOpen]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsWorkspaceOpen(window.location.hash === '#workspace');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dark mode (Default to sleek deep forest pine)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pulsepm_theme');
    if (saved) return saved === 'dark';
    return true; // Default dark
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

  // Active project helper
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECTS[0];
  const columns = activeProject.columns || [];
  const tasks = activeProject.tasks || [];

  // Persist projects
  useEffect(() => {
    localStorage.setItem('pulsepm_projects_v4', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pulsepm_active_project_v4', activeProjectId);
  }, [activeProjectId]);

  // Task actions
  const moveTask = (taskId, newColumnId) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map((task) => {
            if (task.id === taskId) {
              if (newColumnId.includes('done') && !task.columnId.includes('done')) {
                // Celebratory Confetti in Emerald, Gold, Mint, Coral (NO blue, NO purple)
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.8 },
                  colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#f97316'],
                });
              }
              return { ...task, columnId: newColumnId };
            }
            return task;
          }),
        };
      })
    );
  };

  const createTask = (newTaskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskData.title,
      description: newTaskData.description || '',
      columnId: newTaskData.columnId || columns[0]?.id || 'col-todo',
      priority: newTaskData.priority || 'medium',
      dueDate: newTaskData.dueDate || '',
      assignees: newTaskData.assignees || [],
      tags: newTaskData.tags || [],
      checklist: newTaskData.checklist || [],
      comments: [],
      attachments: 0,
      createdAt: 'Just now',
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          tasks: [newTask, ...proj.tasks],
        };
      })
    );
  };

  const updateTask = (updatedTask) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        };
      })
    );
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const deleteTask = (taskId) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          tasks: proj.tasks.filter((t) => t.id !== taskId),
        };
      })
    );
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const addComment = (taskId, comment) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map((task) => {
            if (task.id === taskId) {
              const newComments = [
                ...(task.comments || []),
                {
                  id: `comm-${Date.now()}`,
                  author: comment.author,
                  avatar: comment.avatar,
                  text: comment.text,
                  createdAt: 'Just now',
                },
              ];
              const updated = { ...task, comments: newComments };
              if (selectedTask?.id === taskId) {
                setSelectedTask(updated);
              }
              return updated;
            }
            return task;
          }),
        };
      })
    );
  };

  const createProject = (arg1, arg2, arg3) => {
    let name = 'New Workspace';
    let key = 'WSP';
    let description = '';

    if (typeof arg1 === 'object' && arg1 !== null) {
      name = arg1.name || name;
      key = (arg1.key || name.substring(0, 3)).toUpperCase();
      description = arg1.description || '';
    } else {
      name = arg1 || name;
      key = (arg2 || name.substring(0, 3)).toUpperCase();
      description = arg3 || '';
    }

    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      key,
      description,
      columns: [
        { id: `col-${Date.now()}-1`, name: 'To Do', color: '#78716c' },
        { id: `col-${Date.now()}-2`, name: 'In Progress', color: '#f59e0b' },
        { id: `col-${Date.now()}-3`, name: 'In Review', color: '#f97316' },
        { id: `col-${Date.now()}-4`, name: 'Done', color: '#10b981' },
      ],
      tasks: [],
    };

    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProjectId,
        columns,
        tasks,
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
        isWorkspaceOpen,
        setIsWorkspaceOpen,
        isDarkMode,
        toggleDarkMode,
        moveTask,
        createTask,
        updateTask,
        deleteTask,
        addComment,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
