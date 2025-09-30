import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Generate mock tasks for demonstration
const generateMockTasks = () => {
  const taskTemplates = [
    { title: 'Design System Updates', category: 'Design', priority: 'high' },
    { title: 'API Integration', category: 'Development', priority: 'high' },
    { title: 'User Testing Session', category: 'Research', priority: 'medium' },
    { title: 'Code Review', category: 'Development', priority: 'medium' },
    { title: 'Documentation Update', category: 'Documentation', priority: 'low' },
    { title: 'Performance Optimization', category: 'Development', priority: 'high' },
    { title: 'UI Component Library', category: 'Design', priority: 'medium' },
    { title: 'Database Migration', category: 'Development', priority: 'high' }
  ];
  const statuses = ['todo', 'in-progress', 'review', 'done'];
  const assignees = ['1', '2', '3', '4', '5'];
  return taskTemplates.map((template, index) => ({
    id: `task-${index + 1}`,
    title: template.title,
    description: `Detailed description for ${template.title}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: template.priority,
    category: template.category,
    assigneeId: assignees[Math.floor(Math.random() * assignees.length)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    progress: Math.floor(Math.random() * 101),
    timeSpent: Math.floor(Math.random() * 40) + 1, // hours
    estimatedTime: Math.floor(Math.random() * 20) + 5, // hours
    tags: ['frontend', 'backend', 'design', 'testing'].slice(0, Math.floor(Math.random() * 3) + 1),
    comments: Math.floor(Math.random() * 10),
    attachments: Math.floor(Math.random() * 5)
  }));
};
// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateMockTasks();
  }
);
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
      progress: 0,
      timeSpent: 0,
      comments: 0,
      attachments: 0
    };
  }
);
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { taskId, updates };
  }
);
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return taskId;
  }
);
const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    category: 'all',
    search: ''
  },
  sortBy: 'dueDate',
  sortOrder: 'asc',
  viewMode: 'kanban', // kanban, list, calendar
  selectedTask: null,
  taskAnalytics: {
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    avgCompletionTime: 0,
    productivityTrend: []
  }
};
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    moveTask: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = newStatus;
        task.updatedAt = new Date().toISOString();
      }
    },
    updateTaskProgress: (state, action) => {
      const { taskId, progress } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.progress = progress;
        task.updatedAt = new Date().toISOString();
        if (progress === 100 && task.status !== 'done') {
          task.status = 'done';
        }
      }
    },
    assignTask: (state, action) => {
      const { taskId, assigneeId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.assigneeId = assigneeId;
        task.updatedAt = new Date().toISOString();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    calculateAnalytics: (state) => {
      const now = new Date();
      const totalTasks = state.tasks.length;
      const completedTasks = state.tasks.filter(t => t.status === 'done').length;
      const overdueTasks = state.tasks.filter(t => 
        new Date(t.dueDate) < now && t.status !== 'done'
      ).length;
      const completedTasksWithTime = state.tasks.filter(t => 
        t.status === 'done' && t.timeSpent > 0
      );
      const avgCompletionTime = completedTasksWithTime.length > 0
        ? Math.round(completedTasksWithTime.reduce((acc, t) => acc + t.timeSpent, 0) / completedTasksWithTime.length)
        : 0;
      state.taskAnalytics = {
        totalTasks,
        completedTasks,
        overdueTasks,
        avgCompletionTime,
        productivityTrend: [65, 72, 68, 75, 82, 78, 85] // Mock trend data
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        tasksSlice.caseReducers.calculateAnalytics(state);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        tasksSlice.caseReducers.calculateAnalytics(state);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { taskId, updates } = action.payload;
        const taskIndex = state.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
          tasksSlice.caseReducers.calculateAnalytics(state);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        tasksSlice.caseReducers.calculateAnalytics(state);
      });
  }
});
export const {
  setFilters,
  setSorting,
  setViewMode,
  setSelectedTask,
  moveTask,
  updateTaskProgress,
  assignTask,
  clearError,
  calculateAnalytics
} = tasksSlice.actions;
export default tasksSlice.reducer;
