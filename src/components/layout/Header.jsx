import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Bell,
  Settings,
  User,
  Users,
  LogOut,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Command,
  Filter,
  X,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  toggleGlobalSearch, 
  setSearchQuery, 
  addRecentSearch,
  executeGlobalSearch
} from '../../redux/slices/uiSlice';
import { toggleNotificationPanel } from '../../redux/slices/notificationsSlice';
import { updateTheme } from '../../redux/slices/settingsSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import NotificationCenter from '../collaboration/NotificationCenter';
import { CountBadge } from '../ui/Badge';
import { switchRole } from '../../redux/slices/roleSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const { 
    globalSearchOpen, 
    searchQuery, 
    notificationPanelOpen,
    recentSearches 
  } = useSelector(state => state.ui);
  const searchResults = useSelector(state => state.ui.globalSearch.results);
  const isSearching = useSelector(state => state.ui.globalSearch.isSearching);
  const { theme } = useSelector(state => state.settings);
  const { currentUser } = useSelector(state => state.auth);
  const { currentRole } = useSelector(state => state.role);
  const { unreadCount } = useSelector(state => state.notifications);
  const navigate = useNavigate();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const themeMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        dispatch(toggleGlobalSearch());
        setTimeout(() => {
          if (searchRef.current) {
            searchRef.current.focus();
          }
        }, 100);
      }
      if (event.key === 'Escape') {
        if (globalSearchOpen) {
          dispatch(toggleGlobalSearch());
        }
        setShowUserMenu(false);
        setShowThemeMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, globalSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      dispatch(addRecentSearch(localSearchQuery));
      dispatch(executeGlobalSearch(localSearchQuery));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowUserMenu(false);
    navigate('/');
  };
  const handleRoleSwitch = () => {
    const newRole = currentRole === 'member' ? 'lead' : 'member';
    dispatch(switchRole(newRole));
  };

  const handleThemeChange = (newTheme) => {
    dispatch(updateTheme(newTheme));
    setShowThemeMenu(false);
  };

  const getPageTitle = () => {
    const path = window.location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/tasks': 'Tasks',
      '/team': 'Team',
      '/analytics': 'Analytics'
    };
    return titles[path] || 'Team Pulse';
  };

  const getBreadcrumbs = () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments.map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };

  const breadcrumbs = getBreadcrumbs();

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <motion.header 
      className="header-glass h-16 px-6 flex items-center justify-between relative z-40"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center space-x-4"
        variants={itemVariants}
      >
        <div>
          <motion.h1 
            className="text-xl font-semibold bg-gradient-to-r from-white to-gray-200 dark:from-white dark:to-gray-300 bg-clip-text text-transparent drop-shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {getPageTitle()}
          </motion.h1>
          {breadcrumbs.length > 0 && (
            <motion.nav 
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span>{crumb}</span>
                  {index < breadcrumbs.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </motion.nav>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="flex-1 max-w-2xl mx-8"
        variants={itemVariants}
      >
        <div className="relative">
          <motion.button
            onClick={() => dispatch(toggleGlobalSearch())}
            className="w-full glass-button flex items-center space-x-3 px-4 py-2 rounded-xl text-left transition-all duration-200"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-4 h-4 text-white/80 dark:text-gray-300" />
            <span className="text-white/80 dark:text-gray-300 flex-1">
              Search anything...
            </span>
            <div className="flex items-center space-x-1 text-xs text-white/90 bg-white/20 dark:bg-gray-700 px-2 py-1 rounded">
              <Command className="w-3 h-3 text-white/90" />
              <span className="text-white/90">K</span>
            </div>
          </motion.button>

          <AnimatePresence>
            {globalSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl z-50 overflow-hidden"
              >
                <form onSubmit={handleSearchSubmit} className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <label htmlFor="global-search" className="sr-only">Global search</label>
                    <input
                      ref={searchRef}
                      type="text"
                      id="global-search"
                      value={localSearchQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocalSearchQuery(v);
                        dispatch(setSearchQuery(v));
                        if (v.trim().length > 1) {
                          dispatch(executeGlobalSearch(v));
                        }
                      }}
                      placeholder="Search tasks, members, projects..."
                      aria-label="Global search"
                      className="w-full pl-10 pr-10 py-3 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => dispatch(toggleGlobalSearch())}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                
                {recentSearches.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recent Searches
                      </h3>
                      <Filter className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                          onClick={() => {
                            setLocalSearchQuery(search);
                            dispatch(setSearchQuery(search));
                            dispatch(executeGlobalSearch(search));
                          }}
                        >
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {search}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Results</h3>
                    {isSearching && (
                      <span className="text-xs text-gray-500">Searching...</span>
                    )}
                  </div>
                  {(!isSearching && (!searchResults || searchResults.length === 0)) ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <Search className="w-5 h-5 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No results yet. Try typing a query.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {searchResults.map((res, idx) => (
                        <div
                          key={`${res.type}-${res.id}-${idx}`}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                          onClick={() => {
                            dispatch(toggleGlobalSearch());
                            if (res.route) {
                              navigate(res.route);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {res.type === 'member' ? (
                              <User className="w-4 h-4 text-blue-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{res.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{res.subtitle}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex items-center space-x-3"
        variants={itemVariants}
      >
        <div className="relative" ref={themeMenuRef}>
          <motion.button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="glass-button p-2 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeIcon className="w-5 h-5 text-white dark:text-gray-200" />
          </motion.button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="dropdown-glass absolute right-0 top-full mt-2 w-48 rounded-xl z-50"
              >
                <div className="p-2">
                  {[
                    { key: 'light', label: 'Light', icon: Sun },
                    { key: 'dark', label: 'Dark', icon: Moon },
                    { key: 'system', label: 'System', icon: Monitor }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                        theme === key 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{label}</span>
                      {theme === key && <CheckCircle className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={notificationRef}>
          <motion.button
            onClick={() => dispatch(toggleNotificationPanel())}
            className="glass-button p-2 rounded-lg transition-all duration-200 relative"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Open notifications (${unreadCount} unread)`}
            aria-expanded={notificationPanelOpen}
          >
            <Bell className="w-5 h-5 text-white dark:text-gray-200" />
            <CountBadge
              count={unreadCount}
              showZero={false}
              className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 ring-2 ring-white dark:ring-gray-900"
              aria-live="polite"
              role="status"
            />
          </motion.button>
        </div>

        <motion.button
          onClick={handleRoleSwitch}
          className="glass-button flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-white"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle role"
        >
          {currentRole === 'lead' ? (
            <>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Switch to Member</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Switch to Lead</span>
            </>
          )}
        </motion.button>

        <div className="relative" ref={userMenuRef}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="glass-button flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={currentUser?.avatar || '/api/placeholder/32/32'}
              alt={currentUser?.name || 'User'}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-white dark:text-gray-300">
              {currentUser?.name || 'User'}
            </span>
            <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${
              showUserMenu ? 'rotate-180' : ''
            }`} />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="dropdown-glass absolute right-0 top-full mt-2 w-56 rounded-xl z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser?.avatar || '/api/placeholder/40/40'}
                      alt={currentUser?.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {currentUser?.name || 'User Name'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {currentUser?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
