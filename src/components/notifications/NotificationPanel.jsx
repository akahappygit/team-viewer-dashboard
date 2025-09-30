import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Calendar,
  Target,
  Settings,
  Filter,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  toggleNotificationPanel,
  setFilter
} from '../../redux/slices/notificationsSlice';
const NotificationPanel = () => {
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { 
    notifications, 
    unreadCount, 
    filter,
    isLoading 
  } = useSelector(state => state.notifications);
  const getNotificationIcon = (type) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
      task: Target,
      user: User,
      calendar: Calendar,
      system: Settings
    };
    return icons[type] || Bell;
  };
  const getNotificationColor = (type) => {
    const colors = {
      success: 'text-green-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
      task: 'text-purple-500',
      user: 'text-indigo-500',
      calendar: 'text-pink-500',
      system: 'text-gray-500'
    };
    return colors[type] || 'text-gray-500';
  };
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };
  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };
  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };
  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);
    dispatch(setFilter(newFilter));
  };
  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });
  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'task', label: 'Tasks', count: notifications.filter(n => n.type === 'task').length },
    { value: 'user', label: 'Team', count: notifications.filter(n => n.type === 'user').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ];
  return (
    <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl flex flex-col">
      {}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(toggleNotificationPanel())}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {}
        <div className="flex items-center justify-between">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Mark all as read
          </button>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="text-sm bg-transparent border-none focus:outline-none text-gray-600 dark:text-gray-400"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {selectedFilter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <AnimatePresence>
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {}
                      <div className={`flex-shrink-0 ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm ${
                              !notification.read 
                                ? 'font-medium text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {notification.category && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                  {notification.category}
                                </span>
                              )}
                            </div>
                          </div>
                          {}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
                                title="Mark as read"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors duration-200"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {}
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.handler}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200 ${
                                  action.primary
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
      {}
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};
export default NotificationPanel;
