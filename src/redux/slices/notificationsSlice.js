import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Generate mock notifications
const generateMockNotifications = () => {
  const notificationTypes = [
    { type: 'task_assigned', icon: 'CheckCircle', color: 'blue' },
    { type: 'task_completed', icon: 'CheckCircle2', color: 'green' },
    { type: 'deadline_approaching', icon: 'Clock', color: 'orange' },
    { type: 'team_update', icon: 'Users', color: 'purple' },
    { type: 'system_alert', icon: 'AlertTriangle', color: 'red' },
    { type: 'achievement', icon: 'Award', color: 'yellow' }
  ];
  const messages = [
    'New task assigned: Design System Updates',
    'Task completed: API Integration',
    'Deadline approaching: User Testing Session due tomorrow',
    'Team meeting scheduled for 2:00 PM',
    'System maintenance scheduled for tonight',
    'Achievement unlocked: Task Master',
    'Code review requested for PR #123',
    'Weekly report is ready for review',
    'New team member joined: John Doe',
    'Performance metrics updated'
  ];
  return Array.from({ length: 15 }, (_, i) => {
    const notificationType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    return {
      id: `notification-${i + 1}`,
      type: notificationType.type,
      title: message,
      message: `${message} - Click to view details`,
      icon: notificationType.icon,
      color: notificationType.color,
      timestamp: timestamp.toISOString(),
      read: Math.random() > 0.6,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      actionUrl: `/tasks/${i + 1}`,
      category: ['task', 'team', 'system', 'achievement'][Math.floor(Math.random() * 4)]
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockNotifications();
  }
);
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return notificationId;
  }
);
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
);
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return notificationId;
  }
);
const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
  filters: {
    category: 'all',
    priority: 'all',
    read: 'all'
  },
  settings: {
    enablePush: true,
    enableEmail: false,
    enableSound: true,
    categories: {
      task: true,
      team: true,
      system: true,
      achievement: true
    }
  },
  isOpen: false
};
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: `notification-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    toggleNotificationPanel: (state) => {
      state.isOpen = !state.isOpen;
    },
    setNotificationPanel: (state, action) => {
      state.isOpen = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        notificationsSlice.caseReducers.updateUnreadCount(state);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
        if (notificationIndex !== -1) {
          const wasUnread = !state.notifications[notificationIndex].read;
          state.notifications.splice(notificationIndex, 1);
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      });
  }
});
export const {
  addNotification,
  setFilters,
  updateSettings,
  toggleNotificationPanel,
  setNotificationPanel,
  clearError,
  updateUnreadCount
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
