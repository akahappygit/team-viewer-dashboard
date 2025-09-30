import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  CheckSquare,
  BarChart3, 
  Settings, 
  Bell, 
  Calendar,
  MessageSquare,
  FileText,
  Target,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight,
  Search,
  User
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../redux/slices/settingsSlice';
import { setCurrentPage } from '../../redux/slices/uiSlice';
const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector(state => state.settings);
  const { currentPage } = useSelector(state => state.ui);
  const { currentUser } = useSelector(state => state.auth);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500', path: '/' },
    { id: 'team', label: 'Team Members', icon: Users, color: 'text-green-500', path: '/team' },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare, color: 'text-purple-500', path: '/tasks' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-orange-500', path: '/analytics' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-red-500', path: '/calendar' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'text-indigo-500', path: '/reports' },
    { id: 'achievements', label: 'Achievements', icon: Award, color: 'text-yellow-500', path: '/achievements' }
  ];
  const bottomItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-gray-500', path: '/notifications' },
    
  ];
  const handleNavigation = (pageId) => {
    dispatch(setCurrentPage(pageId));
  };
  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: 80,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  const labelVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: { 
      opacity: 1, 
      width: "auto",
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    }
  };
  const NavItem = ({ item, isActive, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`
        w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 glass-card
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 shadow-lg' 
          : 'hover:bg-white/5 hover:backdrop-blur-lg'
        }
        group relative overflow-hidden
      `}
      variants={itemVariants}
      whileHover="hover"
      onHoverStart={() => setHoveredItem(item.id)}
      onHoverEnd={() => setHoveredItem(null)}
    >
      {}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
          layoutId="activeIndicator"
          transition={{ duration: 0.2 }}
        />
      )}
      {}
      <div className={`
        flex-shrink-0 w-6 h-6 flex items-center justify-center
        ${isActive ? item.color : 'text-gray-600 dark:text-gray-400'}
        transition-colors duration-200
      `}>
        <item.icon size={20} />
      </div>
      {}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.span
            variants={labelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`
              ml-3 font-medium text-sm
              ${isActive 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400'
              }
              transition-colors duration-200
            `}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {sidebarCollapsed && hoveredItem === item.id && (
          <motion.div
            className="nav-tooltip"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
  return (
    <motion.aside
      className="sidebar-glass h-screen flex flex-col relative"
      variants={sidebarVariants}
      animate={sidebarCollapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {}
      <div className="sidebar-header p-4 border-b border-white/10">
        <motion.div 
          className="flex items-center justify-between"
        >
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex items-center space-x-3"
              >
                <div className="logo-container w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="logo-text">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TeamPulse
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enterprise Dashboard
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {sidebarCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5 text-white" />
            </div>
          )}
          <motion.button
            className="toggle-btn p-1 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => dispatch(toggleSidebar())}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      </div>
      {}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            className="sidebar-search p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="search-container relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <label htmlFor="sidebar-search" className="sr-only">Sidebar search</label>
              <input
                id="sidebar-search"
                type="text"
                placeholder="Search..."
                aria-label="Sidebar search"
                className="search-input w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <nav className="sidebar-nav flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item, index) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={currentPage === item.id}
            onClick={() => handleNavigation(item.id)}
          />
        ))}
      </nav>
      {}
      <div className="p-4 border-t border-white/10 space-y-2">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={currentPage === item.id}
            onClick={() => handleNavigation(item.id)}
          />
        ))}
      </div>
      {}
      {currentUser && (
        <motion.div 
          className="sidebar-footer p-4 border-t border-white/10"
        >
          <div className={`user-profile flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="user-avatar w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm hidden">
                {currentUser.name.charAt(0)}
              </div>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  className="user-info flex-1 min-w-0"
                  variants={labelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <p className="user-name text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="user-role text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};
