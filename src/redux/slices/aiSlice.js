import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';
// Async thunks for AI operations
export const generateTaskSuggestions = createAsyncThunk(
  'ai/generateTaskSuggestions',
  async ({ members, tasks, currentUser }, { rejectWithValue }) => {
    try {
      const suggestions = aiService.generateTaskSuggestions(members, tasks, currentUser);
      return suggestions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const balanceWorkload = createAsyncThunk(
  'ai/balanceWorkload',
  async ({ members, tasks }, { rejectWithValue }) => {
    try {
      const recommendations = aiService.balanceWorkload(members, tasks);
      return recommendations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const predictTaskCompletion = createAsyncThunk(
  'ai/predictTaskCompletion',
  async ({ task, assignee, historicalData }, { rejectWithValue }) => {
    try {
      const prediction = aiService.predictTaskCompletion(task, assignee, historicalData);
      return { taskId: task.id, prediction };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const generateAutoAssignments = createAsyncThunk(
  'ai/generateAutoAssignments',
  async ({ tasks, members }, { rejectWithValue }) => {
    try {
      const assignments = aiService.generateAutoAssignments(tasks, members);
      return assignments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const analyzeProductivityPatterns = createAsyncThunk(
  'ai/analyzeProductivityPatterns',
  async ({ members, tasks, timeframe }, { rejectWithValue }) => {
    try {
      const analysis = aiService.analyzeProductivityPatterns(members, tasks, timeframe);
      return analysis;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const generateSmartNotifications = createAsyncThunk(
  'ai/generateSmartNotifications',
  async ({ members, tasks }, { rejectWithValue }) => {
    try {
      const notifications = aiService.generateSmartNotifications(null, { members, tasks });
      return notifications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Initial state
const initialState = {
  // Task suggestions
  taskSuggestions: [],
  suggestionsLoading: false,
  suggestionsError: null,
  // Workload balancing
  workloadRecommendations: [],
  workloadLoading: false,
  workloadError: null,
  // Task predictions
  taskPredictions: {},
  predictionsLoading: false,
  predictionsError: null,
  // Auto assignments
  autoAssignments: [],
  assignmentsLoading: false,
  assignmentsError: null,
  // Productivity analysis
  productivityAnalysis: {
    patterns: {},
    suggestions: [],
    insights: []
  },
  analysisLoading: false,
  analysisError: null,
  // Smart notifications
  smartNotifications: [],
  notificationsLoading: false,
  notificationsError: null,
  // AI configuration
  aiConfig: {
    autoSuggestionsEnabled: true,
    autoAssignmentsEnabled: false,
    smartNotificationsEnabled: true,
    workloadBalancingEnabled: true,
    predictionAccuracy: 0.85,
    suggestionFrequency: 'daily', // daily, weekly, real-time
    notificationThreshold: 0.6
  },
  // AI insights and learning
  aiInsights: {
    teamEfficiency: 0,
    automationSavings: 0,
    predictionAccuracy: 0,
    suggestionAcceptanceRate: 0
  },
  // AI automation status
  automationStatus: {
    isActive: false,
    lastUpdate: null,
    processedTasks: 0,
    automatedActions: 0
  }
};
// AI slice
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Configuration actions
    updateAIConfig: (state, action) => {
      state.aiConfig = { ...state.aiConfig, ...action.payload };
    },
    toggleAutoSuggestions: (state) => {
      state.aiConfig.autoSuggestionsEnabled = !state.aiConfig.autoSuggestionsEnabled;
    },
    toggleAutoAssignments: (state) => {
      state.aiConfig.autoAssignmentsEnabled = !state.aiConfig.autoAssignmentsEnabled;
    },
    toggleSmartNotifications: (state) => {
      state.aiConfig.smartNotificationsEnabled = !state.aiConfig.smartNotificationsEnabled;
    },
    // Suggestion management
    dismissSuggestion: (state, action) => {
      const suggestionId = action.payload;
      state.taskSuggestions = state.taskSuggestions.filter(s => s.id !== suggestionId);
    },
    acceptSuggestion: (state, action) => {
      const suggestionId = action.payload;
      const suggestion = state.taskSuggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        suggestion.status = 'accepted';
        suggestion.acceptedAt = new Date().toISOString();
        // Update acceptance rate
        state.aiInsights.suggestionAcceptanceRate = Math.min(
          state.aiInsights.suggestionAcceptanceRate + 0.05,
          1.0
        );
      }
    },
    // Notification management
    dismissNotification: (state, action) => {
      const notificationId = action.payload;
      state.smartNotifications = state.smartNotifications.filter(n => n.id !== notificationId);
    },
    markNotificationRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.smartNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
      }
    },
    // Workload management
    applyWorkloadRecommendation: (state, action) => {
      const recommendationId = action.payload;
      const recommendation = state.workloadRecommendations.find(r => r.id === recommendationId);
      if (recommendation) {
        recommendation.status = 'applied';
        recommendation.appliedAt = new Date().toISOString();
        state.automationStatus.automatedActions += 1;
      }
    },
    // Auto assignment management
    applyAutoAssignment: (state, action) => {
      const assignmentId = action.payload;
      const assignment = state.autoAssignments.find(a => a.id === assignmentId);
      if (assignment) {
        assignment.status = 'applied';
        assignment.appliedAt = new Date().toISOString();
        state.automationStatus.automatedActions += 1;
      }
    },
    // AI insights updates
    updateAIInsights: (state, action) => {
      state.aiInsights = { ...state.aiInsights, ...action.payload };
    },
    // Automation status updates
    updateAutomationStatus: (state, action) => {
      state.automationStatus = { ...state.automationStatus, ...action.payload };
      state.automationStatus.lastUpdate = new Date().toISOString();
    },
    // Clear data
    clearSuggestions: (state) => {
      state.taskSuggestions = [];
    },
    clearNotifications: (state) => {
      state.smartNotifications = [];
    },
    clearRecommendations: (state) => {
      state.workloadRecommendations = [];
    },
    // Reset AI state
    resetAIState: (state) => {
      return { ...initialState, aiConfig: state.aiConfig };
    }
  },
  extraReducers: (builder) => {
    // Task suggestions
    builder
      .addCase(generateTaskSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
        state.suggestionsError = null;
      })
      .addCase(generateTaskSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.taskSuggestions = action.payload.map((suggestion, index) => ({
          ...suggestion,
          id: `suggestion_${Date.now()}_${index}`,
          createdAt: new Date().toISOString(),
          status: 'pending'
        }));
        // Update automation status
        state.automationStatus.processedTasks += action.payload.length;
        state.automationStatus.isActive = true;
      })
      .addCase(generateTaskSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestionsError = action.payload;
      });
    // Workload balancing
    builder
      .addCase(balanceWorkload.pending, (state) => {
        state.workloadLoading = true;
        state.workloadError = null;
      })
      .addCase(balanceWorkload.fulfilled, (state, action) => {
        state.workloadLoading = false;
        state.workloadRecommendations = action.payload.map((rec, index) => ({
          ...rec,
          id: `workload_${Date.now()}_${index}`,
          createdAt: new Date().toISOString(),
          status: 'pending'
        }));
        // Generate insights
        if (action.payload.length > 0) {
          state.aiInsights.teamEfficiency = Math.min(
            state.aiInsights.teamEfficiency + 0.1,
            1.0
          );
        }
      })
      .addCase(balanceWorkload.rejected, (state, action) => {
        state.workloadLoading = false;
        state.workloadError = action.payload;
      });
    // Task predictions
    builder
      .addCase(predictTaskCompletion.pending, (state) => {
        state.predictionsLoading = true;
        state.predictionsError = null;
      })
      .addCase(predictTaskCompletion.fulfilled, (state, action) => {
        state.predictionsLoading = false;
        const { taskId, prediction } = action.payload;
        state.taskPredictions[taskId] = {
          ...prediction,
          createdAt: new Date().toISOString()
        };
        // Update prediction accuracy insights
        state.aiInsights.predictionAccuracy = prediction.confidence;
      })
      .addCase(predictTaskCompletion.rejected, (state, action) => {
        state.predictionsLoading = false;
        state.predictionsError = action.payload;
      });
    // Auto assignments
    builder
      .addCase(generateAutoAssignments.pending, (state) => {
        state.assignmentsLoading = true;
        state.assignmentsError = null;
      })
      .addCase(generateAutoAssignments.fulfilled, (state, action) => {
        state.assignmentsLoading = false;
        state.autoAssignments = action.payload.map((assignment, index) => ({
          ...assignment,
          id: `assignment_${Date.now()}_${index}`,
          createdAt: new Date().toISOString(),
          status: 'pending'
        }));
        // Calculate automation savings
        const potentialSavings = action.payload.length * 0.5; // 30 minutes saved per auto-assignment
        state.aiInsights.automationSavings += potentialSavings;
      })
      .addCase(generateAutoAssignments.rejected, (state, action) => {
        state.assignmentsLoading = false;
        state.assignmentsError = action.payload;
      });
    // Productivity analysis
    builder
      .addCase(analyzeProductivityPatterns.pending, (state) => {
        state.analysisLoading = true;
        state.analysisError = null;
      })
      .addCase(analyzeProductivityPatterns.fulfilled, (state, action) => {
        state.analysisLoading = false;
        state.productivityAnalysis = action.payload;
        // Update team efficiency insights
        if (action.payload.patterns.collaborationEfficiency) {
          state.aiInsights.teamEfficiency = action.payload.patterns.collaborationEfficiency.score;
        }
      })
      .addCase(analyzeProductivityPatterns.rejected, (state, action) => {
        state.analysisLoading = false;
        state.analysisError = action.payload;
      });
    // Smart notifications
    builder
      .addCase(generateSmartNotifications.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(generateSmartNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        // Filter notifications based on threshold and add metadata
        const filteredNotifications = action.payload
          .filter(notification => notification.priority >= state.aiConfig.notificationThreshold)
          .map((notification, index) => ({
            ...notification,
            id: `notification_${Date.now()}_${index}`,
            createdAt: new Date().toISOString(),
            read: false
          }));
        // Merge with existing notifications, avoiding duplicates
        const existingIds = state.smartNotifications.map(n => n.type + n.title);
        const newNotifications = filteredNotifications.filter(
          n => !existingIds.includes(n.type + n.title)
        );
        state.smartNotifications = [...state.smartNotifications, ...newNotifications]
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 10); // Keep only top 10 notifications
      })
      .addCase(generateSmartNotifications.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.payload;
      });
  }
});
// Export actions
export const {
  updateAIConfig,
  toggleAutoSuggestions,
  toggleAutoAssignments,
  toggleSmartNotifications,
  dismissSuggestion,
  acceptSuggestion,
  dismissNotification,
  markNotificationRead,
  applyWorkloadRecommendation,
  applyAutoAssignment,
  updateAIInsights,
  updateAutomationStatus,
  clearSuggestions,
  clearNotifications,
  clearRecommendations,
  resetAIState
} = aiSlice.actions;
export const markNotificationAsRead = aiSlice.actions.markNotificationRead;
// Selectors
export const selectTaskSuggestions = (state) => state.ai.taskSuggestions;
export const selectWorkloadRecommendations = (state) => state.ai.workloadRecommendations;
export const selectTaskPredictions = (state) => state.ai.taskPredictions;
export const selectAutoAssignments = (state) => state.ai.autoAssignments;
export const selectProductivityAnalysis = (state) => state.ai.productivityAnalysis;
export const selectSmartNotifications = (state) => state.ai.smartNotifications;
export const selectAIConfig = (state) => state.ai.aiConfig;
export const selectAIInsights = (state) => state.ai.aiInsights;
export const selectAutomationStatus = (state) => state.ai.automationStatus;
// Loading selectors
export const selectAILoading = (state) => ({
  suggestions: state.ai.suggestionsLoading,
  workload: state.ai.workloadLoading,
  predictions: state.ai.predictionsLoading,
  assignments: state.ai.assignmentsLoading,
  analysis: state.ai.analysisLoading,
  notifications: state.ai.notificationsLoading
});
// Error selectors
export const selectAIErrors = (state) => ({
  suggestions: state.ai.suggestionsError,
  workload: state.ai.workloadError,
  predictions: state.ai.predictionsError,
  assignments: state.ai.assignmentsError,
  analysis: state.ai.analysisError,
  notifications: state.ai.notificationsError
});
export default aiSlice.reducer;


