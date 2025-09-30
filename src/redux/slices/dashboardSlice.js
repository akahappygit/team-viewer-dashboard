import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Async thunk for fetching dashboard metrics
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (_, { getState }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const { members } = getState();
    const teamMembers = members.members || [];
    // Calculate metrics based on current team data
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status !== 'offline').length;
    const completedTasks = teamMembers.reduce((acc, member) => 
      acc + (member.tasks?.filter(task => task.progress === 100).length || 0), 0
    );
    const totalTasks = teamMembers.reduce((acc, member) => 
      acc + (member.tasks?.length || 0), 0
    );
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const teamUtilization = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;
    return {
      totalMembers,
      activeMembers,
      completedTasks,
      totalTasks,
      productivityScore,
      teamUtilization,
      weeklyTrend: [65, 72, 68, 75, 82, 78, productivityScore], // Mock weekly data
      statusDistribution: {
        available: teamMembers.filter(m => m.status === 'available').length,
        busy: teamMembers.filter(m => m.status === 'busy').length,
        meeting: teamMembers.filter(m => m.status === 'in-meeting').length,
        offline: teamMembers.filter(m => m.status === 'offline').length
      }
    };
  }
);
// Generate productivity heatmap data
export const generateHeatmapData = createAsyncThunk(
  'dashboard/generateHeatmap',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
    const heatmapData = [];
    days.forEach((day, dayIndex) => {
      hours.forEach((hour, hourIndex) => {
        heatmapData.push({
          day,
          hour: `${hour}:00`,
          value: Math.floor(Math.random() * 100) + 1,
          dayIndex,
          hourIndex
        });
      });
    });
    return heatmapData;
  }
);
const initialState = {
  metrics: {
    totalMembers: 0,
    activeMembers: 0,
    completedTasks: 0,
    totalTasks: 0,
    productivityScore: 0,
    teamUtilization: 0,
    weeklyTrend: [],
    statusDistribution: {
      available: 0,
      busy: 0,
      meeting: 0,
      offline: 0
    }
  },
  heatmapData: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  viewMode: 'overview', // overview, analytics, reports
  timeRange: '7d', // 1d, 7d, 30d, 90d
  selectedMetrics: ['productivity', 'utilization', 'tasks'],
  chartSettings: {
    showAnimations: true,
    colorScheme: 'default',
    showDataLabels: true
  }
};
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
    toggleMetric: (state, action) => {
      const metric = action.payload;
      if (state.selectedMetrics.includes(metric)) {
        state.selectedMetrics = state.selectedMetrics.filter(m => m !== metric);
      } else {
        state.selectedMetrics.push(metric);
      }
    },
    updateChartSettings: (state, action) => {
      state.chartSettings = { ...state.chartSettings, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(generateHeatmapData.fulfilled, (state, action) => {
        state.heatmapData = action.payload;
      });
  }
});
export const { 
  setViewMode, 
  setTimeRange, 
  toggleMetric, 
  updateChartSettings, 
  clearError 
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
