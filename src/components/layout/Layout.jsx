import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationPanel from '../notifications/NotificationPanel';
import { toggleSidebar, setIsMobile } from '../../redux/slices/uiSlice';
import { toggleNotificationPanel } from '../../redux/slices/notificationsSlice';
const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { 
    sidebar, 
    isMobile, 
    globalSearch,
    notificationPanel 
  } = useSelector(state => state.ui);
  const { theme } = useSelector(state => state.settings);
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      dispatch(setIsMobile(mobile));
      // Auto-collapse sidebar on mobile
      if (mobile && sidebar.isOpen) {
        dispatch(toggleSidebar());
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, sidebar.isOpen]);
  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        dispatch(toggleSidebar());
      }
      // Global search with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input (handled in Header component)
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
  const sidebarWidth = sidebar.isCollapsed ? 'w-16' : 'w-64';
  const mainMargin = sidebar.isCollapsed ? 'ml-16' : 'ml-64';
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {}
      <AnimatePresence mode="wait">
        {(!isMobile || sidebar.isOpen) && (
          <motion.div
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : false}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full z-50 ${
              isMobile ? 'w-64' : sidebarWidth
            }`}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {isMobile && sidebar.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleSidebar())}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>
      {}
      <div className={`min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0' : mainMargin
      }`}>
        {}
        <Header />
        {}
        <main className="relative">
          {}
          <div className="p-6">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-full"
            >
              {children}
            </motion.div>
          </div>
          {}
          <AnimatePresence>
            {globalSearch.isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-20 z-30"
                onClick={() => dispatch(toggleGlobalSearch())}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
      {}
      <AnimatePresence>
        {notificationPanel.isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 z-50"
          >
            <NotificationPanel />
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {notificationPanel.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleNotificationPanel())}
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
          />
        )}
      </AnimatePresence>
      {}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {}
        </AnimatePresence>
      </div>
      {}
      <AnimatePresence>
        {}
      </AnimatePresence>
      {}
      <div className="sr-only">
        <div id="skip-to-content">
          <a
            href="#main-content"
            className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 rounded-br-lg transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
          >
            Skip to main content
          </a>
        </div>
      </div>
      {}
      <div
        id="focus-trap"
        tabIndex="-1"
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
};
export default Layout;
