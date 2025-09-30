import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Mock authentication API calls
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock user data
      const mockUsers = {
        'lead@company.com': {
          id: '1',
          name: 'Sarah Johnson',
          email: 'lead@company.com',
          role: 'Team Lead',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          department: 'Engineering',
          joinDate: '2023-01-15'
        },
        'member@company.com': {
          id: '2',
          name: 'Alex Chen',
          email: 'member@company.com',
          role: 'Team Member',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          department: 'Engineering',
          joinDate: '2023-03-20'
        }
      };
      const user = mockUsers[email];
      if (!user || password !== 'password') {
        throw new Error('Invalid credentials');
      }
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('teamPulseUser');
    return null;
  }
);
const initialState = {
  currentUser: JSON.parse(localStorage.getItem('teamPulseUser')) || null,
  isAuthenticated: !!localStorage.getItem('teamPulseUser'),
  isLoading: false,
  error: null,
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  }
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    switchRole: (state, action) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload;
        localStorage.setItem('teamPulseUser', JSON.stringify(state.currentUser));
      }
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('teamPulseUser', JSON.stringify(action.payload));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('teamPulseUser', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  }
});
export const { switchRole, updatePreferences, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
