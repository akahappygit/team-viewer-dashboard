import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// Import all slices
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import membersReducer from './slices/membersSlice';
import tasksReducer from './slices/tasksSlice';
import analyticsReducer from './slices/analyticsSlice';
import aiReducer from './slices/aiSlice';
import notificationsReducer from './slices/notificationsSlice';
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';
import roleReducer from './slices/roleSlice';
import collaborationReducer from './slices/collaborationSlice';
// Import middleware
import { analyticsMiddleware, performanceMiddleware } from './middleware/analyticsMiddleware';
// Import RTK Query APIs
import { membersApi } from './api/membersApi';
export const store = configureStore({
  reducer: {
    // Core slices
    auth: authReducer,
    dashboard: dashboardReducer,
    members: membersReducer,
    tasks: tasksReducer,
    analytics: analyticsReducer,
    ai: aiReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
    ui: uiReducer,
    role: roleReducer,
    collaboration: collaborationReducer,
    // RTK Query APIs
    [membersApi.reducerPath]: membersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(membersApi.middleware)
    .concat(analyticsMiddleware)
    .concat(performanceMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});
// Setup RTK Query listeners
setupListeners(store.dispatch);
export default store;
