// Analytics middleware for tracking user interactions and performance metrics
export const analyticsMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  // Track specific actions for analytics
  const trackedActions = [
    'members/updateMemberStatus',
    'tasks/assignTask',
    'tasks/updateTaskProgress',
    'auth/switchRole',
    'dashboard/updateMetrics'
  ];
  if (trackedActions.includes(action.type)) {
    // In a real app, this would send data to analytics service
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', {
        action: action.type,
        payload: action.payload,
        timestamp: new Date().toISOString(),
        userId: store.getState().auth?.currentUser?.id
      });
    }
    // Store analytics data in localStorage for demo purposes
    const analyticsData = JSON.parse(localStorage.getItem('teamPulseAnalytics') || '[]');
    analyticsData.push({
      action: action.type,
      payload: action.payload,
      timestamp: new Date().toISOString(),
      userId: store.getState().auth?.currentUser?.id
    });
    // Keep only last 100 events
    if (analyticsData.length > 100) {
      analyticsData.splice(0, analyticsData.length - 100);
    }
    localStorage.setItem('teamPulseAnalytics', JSON.stringify(analyticsData));
  }
  return result;
};
// Performance monitoring middleware
export const performanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  // Log slow actions (> 10ms) only in development
  if (end - start > 10 && process.env.NODE_ENV === 'development') {
    console.warn(`Slow action detected: ${action.type} took ${end - start}ms`);
  }
  return result;
};
