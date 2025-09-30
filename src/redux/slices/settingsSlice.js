import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Async thunks for settings management
export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('teamPulseSettings', JSON.stringify(settings));
    return settings;
  }
);
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const savedSettings = localStorage.getItem('teamPulseSettings');
    return savedSettings ? JSON.parse(savedSettings) : null;
  }
);
// Profile management thunks
export const updateProfile = createAsyncThunk(
  'settings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock validation
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required');
      }
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      return {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updatePreferences = createAsyncThunk(
  'settings/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        ...preferences,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const initialState = {
  // Profile information
  profile: {
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: null
  },
  // Appearance settings
  theme: 'light', // light, dark, auto
  colorScheme: 'default', // default, blue, purple, green
  fontSize: 'medium', // small, medium, large
  sidebarCollapsed: false,
  compactMode: false,
  // Dashboard preferences
  defaultView: 'overview', // overview, analytics, tasks
  refreshInterval: 30000, // milliseconds
  showAnimations: true,
  showNotifications: true,
  autoRefresh: true,
  // Data and privacy
  dataRetention: '90d', // 30d, 90d, 1y, forever
  shareAnalytics: false,
  exportFormat: 'json', // json, csv, pdf
  // Notifications
  notifications: {
    desktop: true,
    email: false,
    sound: true,
    taskAssignments: true,
    deadlineReminders: true,
    teamUpdates: true,
    systemAlerts: true
  },
  // Performance
  performance: {
    enableAnimations: true,
    lazyLoading: true,
    cacheData: true,
    preloadImages: false
  },
  // Accessibility
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true
  },
  // Language and region
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h', // 12h, 24h
  // Advanced settings
  advanced: {
    debugMode: false,
    betaFeatures: false,
    apiTimeout: 10000,
    maxRetries: 3
  },
  isLoading: false,
  error: null,
  lastSaved: null
};
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme: (state, action) => {
      state.theme = action.payload;
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    updateColorScheme: (state, action) => {
      state.colorScheme = action.payload;
    },
    updateFontSize: (state, action) => {
      state.fontSize = action.payload;
      document.documentElement.setAttribute('data-font-size', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    updateDashboardPreferences: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updatePerformanceSettings: (state, action) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    updateAccessibilitySettings: (state, action) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
      // Apply accessibility settings
      if (action.payload.highContrast !== undefined) {
        document.documentElement.setAttribute('data-high-contrast', action.payload.highContrast);
      }
      if (action.payload.reducedMotion !== undefined) {
        document.documentElement.setAttribute('data-reduced-motion', action.payload.reducedMotion);
      }
    },
    updateLanguageSettings: (state, action) => {
      const { language, timezone, dateFormat, timeFormat } = action.payload;
      if (language) state.language = language;
      if (timezone) state.timezone = timezone;
      if (dateFormat) state.dateFormat = dateFormat;
      if (timeFormat) state.timeFormat = timeFormat;
    },
    updateAdvancedSettings: (state, action) => {
      state.advanced = { ...state.advanced, ...action.payload };
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.profile[field] = value;
    },
    toggleTheme: (state, action) => {
      state.theme = action.payload;
      // Apply theme to document
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        if (action.payload === 'dark') {
          root.classList.add('dark');
        } else if (action.payload === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemPrefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      }
    },
    resetSettings: (state) => {
      // Reset to initial state but keep loading states
      const { isLoading, error } = state;
      Object.assign(state, initialState, { isLoading, error });
      // Clear localStorage
      localStorage.removeItem('teamPulseSettings');
      // Reset document attributes
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-font-size', 'medium');
      document.documentElement.removeAttribute('data-high-contrast');
      document.documentElement.removeAttribute('data-reduced-motion');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        if (action.payload) {
          // Merge loaded settings with current state
          Object.assign(state, action.payload);
          // Apply loaded settings to document
          document.documentElement.setAttribute('data-theme', state.theme);
          document.documentElement.setAttribute('data-font-size', state.fontSize);
          if (state.accessibility.highContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
          }
          if (state.accessibility.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
          }
        }
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.lastSaved = new Date().toISOString();
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
        state.lastSaved = new Date().toISOString();
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});
export const {
  updateTheme,
  updateColorScheme,
  updateFontSize,
  toggleSidebar,
  setSidebarCollapsed,
  updateDashboardPreferences,
  updateNotificationSettings,
  updatePerformanceSettings,
  updateAccessibilitySettings,
  updateLanguageSettings,
  updateAdvancedSettings,
  updateProfileField,
  toggleTheme,
  resetSettings,
  clearError
} = settingsSlice.actions;
export default settingsSlice.reducer;
