import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isLoading: false,
  loadingMessage: '',
  modals: {
    taskForm: { isOpen: false, data: null },
    memberProfile: { isOpen: false, data: null },
    settings: { isOpen: false, data: null },
    confirmation: { isOpen: false, data: null },
    imageViewer: { isOpen: false, data: null },
    reportGenerator: { isOpen: false, data: null }
  },
  sidebarOpen: true,
  mobileMenuOpen: false,
  currentPage: 'dashboard',
  breadcrumbs: [],
  globalSearch: {
    isOpen: false,
    query: '',
    results: [],
    isSearching: false,
    recentSearches: []
  },
  toasts: [],
  dragAndDrop: {
    isDragging: false,
    draggedItem: null,
    dropZone: null
  },
  layout: {
    density: 'comfortable',
    gridView: true,
    showSidebar: true,
    showHeader: true
  },
  focus: {
    currentFocus: null,
    focusHistory: [],
    keyboardNavigation: false
  },
  animations: {
    pageTransition: false,
    cardHover: true,
    loadingSpinner: true
  },
  errors: [],
  features: {
    betaFeatures: false,
    experimentalUI: false,
    advancedAnalytics: true
  }
};
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
    openModal: (state, action) => {
      const { modalName, data = null } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName] = { isOpen: true, data };
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName] = { isOpen: false, data: null };
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalName => {
        state.modals[modalName] = { isOpen: false, data: null };
      });
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    toggleGlobalSearch: (state) => {
      state.globalSearch.isOpen = !state.globalSearch.isOpen;
      if (!state.globalSearch.isOpen) {
        state.globalSearch.query = '';
        state.globalSearch.results = [];
      }
    },
    setSearchQuery: (state, action) => {
      state.globalSearch.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.globalSearch.results = action.payload;
    },
    setSearching: (state, action) => {
      state.globalSearch.isSearching = action.payload;
    },
    addRecentSearch: (state, action) => {
      const query = action.payload;
      if (query && !state.globalSearch.recentSearches.includes(query)) {
        state.globalSearch.recentSearches.unshift(query);
        if (state.globalSearch.recentSearches.length > 10) {
          state.globalSearch.recentSearches = state.globalSearch.recentSearches.slice(0, 10);
        }
      }
    },
    clearRecentSearches: (state) => {
      state.globalSearch.recentSearches = [];
    },
    addToast: (state, action) => {
      const toast = {
        id: `toast-${Date.now()}`,
        timestamp: Date.now(),
        ...action.payload
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setDragging: (state, action) => {
      state.dragAndDrop.isDragging = action.payload.isDragging;
      state.dragAndDrop.draggedItem = action.payload.item || null;
    },
    setDropZone: (state, action) => {
      state.dragAndDrop.dropZone = action.payload;
    },
    resetDragAndDrop: (state) => {
      state.dragAndDrop = {
        isDragging: false,
        draggedItem: null,
        dropZone: null
      };
    },
    updateLayout: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
    },
    setCurrentFocus: (state, action) => {
      if (state.focus.currentFocus) {
        state.focus.focusHistory.push(state.focus.currentFocus);
        if (state.focus.focusHistory.length > 10) {
          state.focus.focusHistory = state.focus.focusHistory.slice(-10);
        }
      }
      state.focus.currentFocus = action.payload;
    },
    setKeyboardNavigation: (state, action) => {
      state.focus.keyboardNavigation = action.payload;
    },
    updateAnimations: (state, action) => {
      state.animations = { ...state.animations, ...action.payload };
    },
    addError: (state, action) => {
      const error = {
        id: `error-${Date.now()}`,
        timestamp: Date.now(),
        ...action.payload
      };
      state.errors.push(error);
      if (state.errors.length > 20) {
        state.errors = state.errors.slice(-20);
      }
    },
    removeError: (state, action) => {
      state.errors = state.errors.filter(error => error.id !== action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    updateFeatures: (state, action) => {
      state.features = { ...state.features, ...action.payload };
    },
    resetUI: (state) => {
      return { ...initialState, features: state.features };
    }
  }
});
export const {
  setLoading,
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setCurrentPage,
  setBreadcrumbs,
  toggleGlobalSearch,
  setSearchQuery,
  setSearchResults,
  setSearching,
  addRecentSearch,
  clearRecentSearches,
  addToast,
  removeToast,
  clearToasts,
  setDragging,
  setDropZone,
  resetDragAndDrop,
  updateLayout,
  setCurrentFocus,
  setKeyboardNavigation,
  updateAnimations,
  addError,
  removeError,
  clearErrors,
  updateFeatures,
  resetUI
} = uiSlice.actions;
export default uiSlice.reducer;

// Thunk: execute global search across members and tasks
export const executeGlobalSearch = (query) => async (dispatch, getState) => {
  const q = (query || '').trim();
  dispatch(setSearchQuery(q));
  dispatch(setSearching(true));
  try {
    const state = getState();
    const members = state.members?.members || [];
    const tasks = state.tasks?.tasks || [];
    const needle = q.toLowerCase();
    const results = [];

    // Search members
    members.forEach((m) => {
      const text = `${m.name || ''} ${m.role || ''} ${m.email || ''}`.toLowerCase();
      if (needle && text.includes(needle)) {
        results.push({
          type: 'member',
          id: m.id,
          title: m.name,
          subtitle: m.role || 'Team Member',
          route: '/team'
        });
      }
      // Search member tasks
      (m.tasks || []).forEach((t) => {
        const tText = `${t.title || ''} ${t.description || ''}`.toLowerCase();
        if (needle && tText.includes(needle)) {
          results.push({
            type: 'task',
            id: t.id,
            title: t.title,
            subtitle: `Assigned to ${m.name}`,
            route: '/tasks'
          });
        }
      });
    });

    // Search global tasks slice
    tasks.forEach((t) => {
      const tText = `${t.title || ''} ${t.description || ''} ${t.category || ''} ${t.priority || ''}`.toLowerCase();
      if (needle && tText.includes(needle)) {
        results.push({
          type: 'task',
          id: t.id,
          title: t.title,
          subtitle: t.category || 'Task',
          route: `/tasks/${t.id}`
        });
      }
    });

    dispatch(setSearchResults(results.slice(0, 20)));
  } finally {
    dispatch(setSearching(false));
  }
};
