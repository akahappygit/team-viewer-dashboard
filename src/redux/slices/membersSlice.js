import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Mock API call to fetch team members
export const fetchTeamMembers = createAsyncThunk(
  'members/fetchTeamMembers',
  async () => {
    // Check if we have saved data in localStorage
    const savedMembers = localStorage.getItem('teamMembers');
    if (savedMembers) {
      return JSON.parse(savedMembers);
    }
    // Fetch members from randomuser.me API
    const res = await fetch('https://randomuser.me/api/?results=8&inc=name,picture,email,login&noinfo');
    if (!res.ok) {
      throw new Error('Failed to fetch team members');
    }
    const data = await res.json();
    const roles = ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'DevOps Engineer', 'Product Manager'];
    const members = data.results.map((u, idx) => ({
      id: u.login.uuid,
      name: `${u.name.first} ${u.name.last}`,
      role: roles[idx % roles.length],
      status: 'offline',
      avatar: u.picture.medium,
      lastActive: new Date().toISOString(),
      tasks: generateRandomTasks(u.login.uuid)
    }));
    return members;
  }
);
// Reset inactive users (users who haven't been active for more than 1 hour)
export const resetInactiveUsers = createAsyncThunk(
  'members/resetInactiveUsers',
  async (_, { getState }) => {
    const { members } = getState().members;
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const updatedMembers = members.map(member => {
      const lastActive = new Date(member.lastActive);
      if (lastActive < tenMinutesAgo && member.status !== 'offline') {
        return { ...member, status: 'offline' };
      }
      return member;
    });
    // Save to localStorage
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    return updatedMembers;
  }
);
// Helper function to generate random tasks for members
const generateRandomTasks = (memberId) => {
  const taskTemplates = [
    'Review code changes',
    'Update documentation',
    'Fix bug in authentication',
    'Implement new feature',
    'Write unit tests',
    'Optimize database queries',
    'Design UI components',
    'Conduct code review'
  ];
  const numTasks = Math.floor(Math.random() * 4) + 1;
  const tasks = [];
  for (let i = 0; i < numTasks; i++) {
    const randomTemplate = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7) + 1);
    tasks.push({
      id: `${memberId}-${i + 1}`,
      title: `${randomTemplate} #${i + 1}`,
      dueDate: dueDate.toISOString().split('T')[0],
      progress: Math.floor(Math.random() * 10) * 10,
      assignedBy: 'Team Lead',
      createdAt: new Date().toISOString()
    });
  }
  return tasks;
};
const membersSlice = createSlice({
  name: 'members',
  initialState: {
    members: [],
    loading: false,
    error: null,
    filters: {
      status: 'all',
      sortBy: 'name'
    },
    darkMode: false,
    lastActivity: new Date().toISOString()
  },
  reducers: {
    updateMemberStatus: (state, action) => {
      const { memberId, status } = action.payload;
      const member = state.members.find(m => m.id === memberId);
      if (member) {
        member.status = status;
        member.lastActive = new Date().toISOString();
        // Save to localStorage
        localStorage.setItem('teamMembers', JSON.stringify(state.members));
      }
      state.lastActivity = new Date().toISOString();
    },
    assignTask: (state, action) => {
      const { memberId, task } = action.payload;
      const member = state.members.find(m => m.id === memberId);
      if (member) {
        const newTask = {
          id: `${memberId}-${Date.now()}`,
          title: task.title,
          dueDate: task.dueDate,
          progress: 0,
          assignedBy: 'Team Lead',
          createdAt: new Date().toISOString()
        };
        member.tasks.push(newTask);
      }
    },
    updateTaskProgress: (state, action) => {
      const { memberId, taskId, progress } = action.payload;
      const member = state.members.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.progress = Math.max(0, Math.min(100, progress));
          if (task.progress === 100) {
            task.completedAt = new Date().toISOString();
          } else {
            delete task.completedAt;
          }
        }
      }
    },
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
        state.error = null;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(resetInactiveUsers.fulfilled, (state, action) => {
        state.members = action.payload;
      });
  }
});
export const {
  updateMemberStatus,
  assignTask,
  updateTaskProgress,
  setFilter,
  toggleDarkMode
} = membersSlice.actions;
export default membersSlice.reducer;
