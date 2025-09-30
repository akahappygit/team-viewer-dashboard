import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { updateUserPresence, addNotification, updateTaskStatus } from '../redux/slices/collaborationSlice';
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }
  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }
    // For demo purposes, we'll simulate WebSocket with mock data
    // In production, replace with actual WebSocket server URL
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      // Mock WebSocket for development
      this.simulateWebSocket(userId);
    } else {
      // Real WebSocket connection for production
      this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
        auth: {
          userId,
          token: localStorage.getItem('authToken')
        },
        transports: ['websocket', 'polling']
      });
      this.setupEventListeners();
    }
  }
  simulateWebSocket(userId) {
    this.isConnected = true;
    // Simulate user presence updates
    setInterval(() => {
      const mockUsers = [
        { id: '1', name: 'Alice Johnson', status: 'online', lastSeen: new Date().toISOString() },
        { id: '2', name: 'Bob Smith', status: 'away', lastSeen: new Date(Date.now() - 300000).toISOString() },
        { id: '3', name: 'Carol Davis', status: 'busy', lastSeen: new Date().toISOString() },
        { id: '4', name: 'David Wilson', status: 'offline', lastSeen: new Date(Date.now() - 3600000).toISOString() }
      ];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      store.dispatch(updateUserPresence(randomUser));
    }, 5000);
    // Simulate real-time notifications
    setInterval(() => {
      const notifications = [
        'New task assigned to you',
        'Project deadline approaching',
        'Team meeting in 15 minutes',
        'Code review requested',
        'Sprint planning scheduled'
      ];
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      store.dispatch(addNotification({
        id: Date.now(),
        message: randomNotification,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      }));
    }, 15000);
    // Simulate task status updates
    setInterval(() => {
      const taskUpdates = [
        { taskId: '1', status: 'in-progress', updatedBy: 'Alice Johnson' },
        { taskId: '2', status: 'completed', updatedBy: 'Bob Smith' },
        { taskId: '3', status: 'review', updatedBy: 'Carol Davis' }
      ];
      const randomUpdate = taskUpdates[Math.floor(Math.random() * taskUpdates.length)];
      store.dispatch(updateTaskStatus(randomUpdate));
    }, 20000);
  }
  setupEventListeners() {
    if (!this.socket) return;
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    });
    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('WebSocket disconnected');
      this.handleReconnect();
    });
    this.socket.on('user-presence', (data) => {
      store.dispatch(updateUserPresence(data));
    });
    this.socket.on('notification', (data) => {
      store.dispatch(addNotification(data));
    });
    this.socket.on('task-update', (data) => {
      store.dispatch(updateTaskStatus(data));
    });
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });
  }
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        if (this.socket) {
          this.socket.connect();
        }
      }, delay);
    }
  }
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }
  // Real-time collaboration methods
  joinRoom(roomId) {
    this.emit('join-room', { roomId });
  }
  leaveRoom(roomId) {
    this.emit('leave-room', { roomId });
  }
  sendCursorPosition(position) {
    this.emit('cursor-position', position);
  }
  sendTypingIndicator(isTyping) {
    this.emit('typing', { isTyping });
  }
  updateTaskStatus(taskId, status) {
    this.emit('task-status-update', { taskId, status });
  }
  sendMessage(message) {
    this.emit('message', message);
  }
}
export const websocketService = new WebSocketService();
export default websocketService;

