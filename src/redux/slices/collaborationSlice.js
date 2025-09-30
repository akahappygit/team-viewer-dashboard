import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  // User presence tracking
  onlineUsers: [],
  userPresence: {},
  // Real-time notifications
  notifications: [],
  unreadCount: 0,
  // Live cursors and collaboration
  cursors: {},
  typingUsers: [],
  // Task updates
  recentTaskUpdates: [],
  // Connection status
  isConnected: false,
  connectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
  // Room management
  currentRoom: null,
  roomMembers: []
};
const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    // Connection management
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
      state.isConnected = action.payload === 'connected';
    },
    // User presence
    updateUserPresence: (state, action) => {
      const { id, name, status, lastSeen } = action.payload;
      const sanitizedLastSeen = typeof lastSeen === 'string' ? lastSeen : new Date(lastSeen).toISOString(); state.userPresence[id] = { name, status, lastSeen: sanitizedLastSeen };
      // Update online users list
      if (status === 'online' || status === 'away' || status === 'busy') {
        const existingIndex = state.onlineUsers.findIndex(user => user.id === id);
        if (existingIndex >= 0) {
          state.onlineUsers[existingIndex] = { id, name, status, lastSeen: sanitizedLastSeen };
        } else {
          state.onlineUsers.push({ id, name, status, lastSeen: sanitizedLastSeen });
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter(user => user.id !== id);
      }
    },
    removeUserPresence: (state, action) => {
      const userId = action.payload;
      delete state.userPresence[userId];
      state.onlineUsers = state.onlineUsers.filter(user => user.id !== userId);
    },
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        ...action.payload,
        id: action.payload.id || Date.now(),
        timestamp: (action.payload.timestamp ? new Date(action.payload.timestamp).toISOString() : new Date().toISOString()),
        read: false
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const index = state.notifications.findIndex(n => n.id === notificationId);
      if (index >= 0) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    // Live cursors
    updateCursor: (state, action) => {
      const { userId, position, color } = action.payload;
      state.cursors[userId] = { position, color, timestamp: Date.now() };
    },
    removeCursor: (state, action) => {
      const userId = action.payload;
      delete state.cursors[userId];
    },
    // Typing indicators
    setTypingUser: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        if (!state.typingUsers.includes(userId)) {
          state.typingUsers.push(userId);
        }
      } else {
        state.typingUsers = state.typingUsers.filter(id => id !== userId);
      }
    },
    // Task updates
    updateTaskStatus: (state, action) => {
      const update = {
        ...action.payload,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      state.recentTaskUpdates.unshift(update);
      // Keep only last 20 updates
      if (state.recentTaskUpdates.length > 20) {
        state.recentTaskUpdates = state.recentTaskUpdates.slice(0, 20);
      }
    },
    // Room management
    joinRoom: (state, action) => {
      const { roomId, members } = action.payload;
      state.currentRoom = roomId;
      state.roomMembers = members || [];
    },
    leaveRoom: (state) => {
      state.currentRoom = null;
      state.roomMembers = [];
      state.cursors = {};
      state.typingUsers = [];
    },
    updateRoomMembers: (state, action) => {
      state.roomMembers = action.payload;
    },
    // Bulk operations
    resetCollaboration: (state) => {
      return {
        ...initialState,
        notifications: state.notifications, // Keep notifications
        unreadCount: state.unreadCount
      };
    }
  }
});
export const {
  setConnectionStatus,
  updateUserPresence,
  removeUserPresence,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  updateCursor,
  removeCursor,
  setTypingUser,
  updateTaskStatus,
  joinRoom,
  leaveRoom,
  updateRoomMembers,
  resetCollaboration
} = collaborationSlice.actions;
// Selectors
export const selectOnlineUsers = (state) => state.collaboration.onlineUsers;
export const selectUserPresence = (state) => state.collaboration.userPresence;
export const selectNotifications = (state) => state.collaboration.notifications;
export const selectUnreadCount = (state) => state.collaboration.unreadCount;
export const selectIsConnected = (state) => state.collaboration.isConnected;
export const selectConnectionStatus = (state) => state.collaboration.connectionStatus;
export const selectCursors = (state) => state.collaboration.cursors;
export const selectTypingUsers = (state) => state.collaboration.typingUsers;
export const selectRecentTaskUpdates = (state) => state.collaboration.recentTaskUpdates;
export const selectCurrentRoom = (state) => state.collaboration.currentRoom;
export const selectRoomMembers = (state) => state.collaboration.roomMembers;
export default collaborationSlice.reducer;

