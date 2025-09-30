import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analytics';
// Generate mock analytics data
const generateAnalyticsData = () => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      productivity: Math.floor(Math.random() * 40) + 60,
      tasksCompleted: Math.floor(Math.random() * 15) + 5,
      hoursWorked: Math.floor(Math.random() * 4) + 6,
      teamCollaboration: Math.floor(Math.random() * 30) + 70
    };
  });
  const performanceByMember = [
    { id: '1', name: 'Sarah Johnson', productivity: 92, tasksCompleted: 45, efficiency: 88 },
    { id: '2', name: 'Alex Chen', productivity: 87, tasksCompleted: 38, efficiency: 85 },
    { id: '3', name: 'Maria Garcia', productivity: 94, tasksCompleted: 52, efficiency: 91 },
    { id: '4', name: 'David Kim', productivity: 83, tasksCompleted: 34, efficiency: 79 },
    { id: '5', name: 'Emma Wilson', productivity: 89, tasksCompleted: 41, efficiency: 86 }
  ];
  const categoryBreakdown = [
    { category: 'Development', hours: 120, percentage: 45 },
    { category: 'Design', hours: 80, percentage: 30 },
    { category: 'Testing', hours: 40, percentage: 15 },
    { category: 'Documentation', hours: 27, percentage: 10 }
  ];
  return {
    dailyMetrics: last30Days,
    performanceByMember,
    categoryBreakdown,
    burnoutRisk: [
      { memberId: '4', name: 'David Kim', riskLevel: 'high', score: 85 },
      { memberId: '2', name: 'Alex Chen', riskLevel: 'medium', score: 65 }
    ],
    goalTracking: [
      { id: 'goal-1', title: 'Q4 Sprint Completion', progress: 78, target: 100 },
      { id: 'goal-2', title: 'Code Quality Score', progress: 92, target: 95 },
      { id: 'goal-3', title: 'Team Satisfaction', progress: 88, target: 90 }
    ]
  };
};
// Async thunks
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async ({ timeRange = '30d', metrics = [] }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateAnalyticsData();
  }
);
export const generateReport = createAsyncThunk(
  'analytics/generateReport',
  async ({ reportType, dateRange, includeCharts = true }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const reportData = {
      id: `report-${Date.now()}`,
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalProductivity: 87,
        tasksCompleted: 234,
        teamEfficiency: 89,
        improvementAreas: ['Code Review Process', 'Meeting Efficiency']
      },
      charts: includeCharts ? [
        { type: 'line', title: 'Productivity Trend', data: [] },
        { type: 'bar', title: 'Task Distribution', data: [] },
        { type: 'pie', title: 'Time Allocation', data: [] }
      ] : [],
      recommendations: [
        'Implement automated code review tools',
        'Reduce meeting frequency by 20%',
        'Introduce pair programming sessions'
      ]
    };
    return reportData;
  }
);
// Advanced Analytics Thunks
export const calculateProductivityScores = createAsyncThunk(
  'analytics/calculateProductivityScores',
  async (members) => {
    const scores = members.map(member => ({
      memberId: member.id,
      score: analyticsService.calculateProductivityScore(member),
      member: member
    }));
    return scores;
  }
);
export const assessBurnoutRisks = createAsyncThunk(
  'analytics/assessBurnoutRisks',
  async (members) => {
    const assessments = members.map(member => ({
      memberId: member.id,
      assessment: analyticsService.assessBurnoutRisk(member),
      member: member
    }));
    return assessments;
  }
);
export const predictTeamPerformance = createAsyncThunk(
  'analytics/predictTeamPerformance',
  async ({ team, timeframe }) => {
    const prediction = analyticsService.predictTeamPerformance(team, timeframe);
    return prediction;
  }
);
export const trackGoals = createAsyncThunk(
  'analytics/trackGoals',
  async (goals) => {
    const trackedGoals = analyticsService.trackGoals(goals);
    return trackedGoals;
  }
);
export const analyzeTimeTracking = createAsyncThunk(
  'analytics/analyzeTimeTracking',
  async ({ member, period }) => {
    const analysis = analyticsService.analyzeTimeTracking(member, period);
    return { memberId: member.id, analysis };
  }
);
const initialState = {
  dailyMetrics: [],
  performanceByMember: [],
  categoryBreakdown: [],
  burnoutRisk: [],
  goalTracking: [],
  // Advanced Analytics State
  productivityScores: [],
  burnoutAssessments: [],
  teamPerformance: null,
  goals: [],
  timeTracking: {},
  advancedInsights: [],
  // Loading States
  isLoading: false,
  error: null,
  selectedTimeRange: '30d',
  selectedMetrics: ['productivity', 'tasks', 'efficiency'],
  reports: [],
  isGeneratingReport: false,
  loading: {
    productivity: false,
    burnout: false,
    performance: false,
    goals: false,
    timeTracking: false
  },
  insights: {
    topPerformer: null,
    improvementAreas: [],
    trends: {
      productivity: 'increasing',
      collaboration: 'stable',
      burnout: 'decreasing'
    }
  },
  filters: {
    department: 'all',
    role: 'all',
    dateRange: {
      start: null,
      end: null
    }
  },
  dashboardConfig: {
    widgets: [
      'productivity-overview',
      'burnout-alerts',
      'performance-trends',
      'goal-progress',
      'time-analysis'
    ],
    refreshInterval: 300000 // 5 minutes
  }
};
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload;
    },
    setSelectedMetrics: (state, action) => {
      state.selectedMetrics = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateInsights: (state) => {
      // Calculate insights based on current data
      if (state.performanceByMember.length > 0) {
        const topPerformer = state.performanceByMember.reduce((prev, current) => 
          prev.productivity > current.productivity ? prev : current
        );
        state.insights.topPerformer = topPerformer;
      }
      // Mock improvement areas based on data
      state.insights.improvementAreas = [
        'Meeting efficiency could be improved',
        'Code review process needs optimization',
        'Documentation practices need attention'
      ];
    },
    addReport: (state, action) => {
      state.reports.unshift(action.payload);
      // Keep only last 10 reports
      if (state.reports.length > 10) {
        state.reports = state.reports.slice(0, 10);
      }
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        const { dailyMetrics, performanceByMember, categoryBreakdown, burnoutRisk, goalTracking } = action.payload;
        state.dailyMetrics = dailyMetrics;
        state.performanceByMember = performanceByMember;
        state.categoryBreakdown = categoryBreakdown;
        state.burnoutRisk = burnoutRisk;
        state.goalTracking = goalTracking;
        analyticsSlice.caseReducers.updateInsights(state);
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(generateReport.pending, (state) => {
        state.isGeneratingReport = true;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.isGeneratingReport = false;
        analyticsSlice.caseReducers.addReport(state, action);
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isGeneratingReport = false;
        state.error = action.error.message;
      })
      // Advanced Analytics Cases
      .addCase(calculateProductivityScores.pending, (state) => {
        state.loading.productivity = true;
        state.error = null;
      })
      .addCase(calculateProductivityScores.fulfilled, (state, action) => {
        state.loading.productivity = false;
        state.productivityScores = action.payload;
        // Generate insights based on productivity scores
        const lowPerformers = action.payload.filter(score => score.score < 60);
        if (lowPerformers.length > 0) {
          state.advancedInsights.unshift({
            id: Date.now(),
            type: 'warning',
            title: 'Low Productivity Alert',
            message: `${lowPerformers.length} team member(s) showing low productivity scores`,
            data: lowPerformers,
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(calculateProductivityScores.rejected, (state, action) => {
        state.loading.productivity = false;
        state.error = action.error.message;
      })
      .addCase(assessBurnoutRisks.pending, (state) => {
        state.loading.burnout = true;
        state.error = null;
      })
      .addCase(assessBurnoutRisks.fulfilled, (state, action) => {
        state.loading.burnout = false;
        state.burnoutAssessments = action.payload;
        // Generate burnout alerts
        const highRiskMembers = action.payload.filter(
          assessment => assessment.assessment.risk > 70
        );
        if (highRiskMembers.length > 0) {
          state.advancedInsights.unshift({
            id: Date.now(),
            type: 'critical',
            title: 'High Burnout Risk Detected',
            message: `${highRiskMembers.length} team member(s) at high risk of burnout`,
            data: highRiskMembers,
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(assessBurnoutRisks.rejected, (state, action) => {
        state.loading.burnout = false;
        state.error = action.error.message;
      })
      .addCase(predictTeamPerformance.pending, (state) => {
        state.loading.performance = true;
        state.error = null;
      })
      .addCase(predictTeamPerformance.fulfilled, (state, action) => {
        state.loading.performance = false;
        state.teamPerformance = action.payload;
        // Generate performance insights
        if (action.payload.riskFactors.length > 0) {
          state.advancedInsights.unshift({
            id: Date.now(),
            type: 'warning',
            title: 'Performance Risk Factors Identified',
            message: `${action.payload.riskFactors.length} risk factor(s) detected`,
            data: action.payload.riskFactors,
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(predictTeamPerformance.rejected, (state, action) => {
        state.loading.performance = false;
        state.error = action.error.message;
      })
      .addCase(trackGoals.pending, (state) => {
        state.loading.goals = true;
        state.error = null;
      })
      .addCase(trackGoals.fulfilled, (state, action) => {
        state.loading.goals = false;
        state.goals = action.payload;
        // Generate goal insights
        const offTrackGoals = action.payload.filter(goal => !goal.onTrack);
        if (offTrackGoals.length > 0) {
          state.advancedInsights.unshift({
            id: Date.now(),
            type: 'warning',
            title: 'Goals Off Track',
            message: `${offTrackGoals.length} goal(s) are behind schedule`,
            data: offTrackGoals,
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(trackGoals.rejected, (state, action) => {
        state.loading.goals = false;
        state.error = action.error.message;
      })
      .addCase(analyzeTimeTracking.pending, (state) => {
        state.loading.timeTracking = true;
        state.error = null;
      })
      .addCase(analyzeTimeTracking.fulfilled, (state, action) => {
        state.loading.timeTracking = false;
        const { memberId, analysis } = action.payload;
        state.timeTracking[memberId] = analysis;
        // Generate time tracking insights
        if (analysis.efficiency < 70) {
          state.advancedInsights.unshift({
            id: Date.now(),
            type: 'info',
            title: 'Low Time Efficiency Detected',
            message: `Time efficiency below 70% for member ${memberId}`,
            data: { memberId, efficiency: analysis.efficiency },
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(analyzeTimeTracking.rejected, (state, action) => {
        state.loading.timeTracking = false;
        state.error = action.error.message;
      });
  }
});
export const {
  setTimeRange,
  setSelectedMetrics,
  setFilters,
  clearError,
  updateInsights,
  addReport,
  deleteReport
} = analyticsSlice.actions;
export default analyticsSlice.reducer;
