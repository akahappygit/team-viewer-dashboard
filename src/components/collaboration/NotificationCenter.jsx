import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  selectNotifications,
  selectUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications
} from '../../redux/slices/collaborationSlice';
import {
  Bell,
  BellRing,
  X,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const dispatch = useDispatch();
  // Show toast for new notifications
  useEffect(() => {
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.read) {
      const toastOptions = {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#363636',
          color: '#fff',
        },
      };
      switch (latestNotification.type) {
        case 'success':
          toast.success(latestNotification.message, toastOptions);
          break;
        case 'error':
          toast.error(latestNotification.message, toastOptions);
          break;
        case 'warning':
          toast(latestNotification.message, {
            ...toastOptions,
            icon: '⚠️',
          });
          break;
        default:
          toast(latestNotification.message, {
            ...toastOptions,
            icon: '📢',
          });
      }
    }
  }, [notifications]);
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };
  const getNotificationBg = (type, read) => {
    const opacity = read ? 'bg-opacity-50' : 'bg-opacity-100';
    switch (type) {
      case 'success': return `bg-green-50 dark:bg-green-900/20 ${opacity}`;
      case 'error': return `bg-red-50 dark:bg-red-900/20 ${opacity}`;
      case 'warning': return `bg-yellow-50 dark:bg-yellow-900/20 ${opacity}`;
      default: return `bg-blue-50 dark:bg-blue-900/20 ${opacity}`;
    }
  };
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'read': return notification.read;
      default: return true;
    }
  });
  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };
  const handleRemove = (notificationId) => {
    dispatch(removeNotification(notificationId));
  };
  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };
  const handleClearAll = () => {
    dispatch(clearNotifications());
    setIsOpen(false);
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="relative">
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        {}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>
      {}
      <AnimatePresence>
        {isOpen && (
          <>
            {}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 flex flex-col"
            >
              {}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {['all', 'unread', 'read'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        filter === filterType
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      {filterType === 'unread' && unreadCount > 0 && (
                        <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {}
                {notifications.length > 0 && (
                  <div className="flex space-x-2 mt-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Mark all read</span>
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear all</span>
                    </button>
                  </div>
                )}
              </div>
              {}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="p-2">
                    <AnimatePresence>
                      {filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className={`p-3 rounded-lg mb-2 border transition-all ${
                            notification.read
                              ? 'border-gray-200 dark:border-gray-600'
                              : 'border-blue-200 dark:border-blue-600 ring-1 ring-blue-100 dark:ring-blue-900/20'
                          } ${getNotificationBg(notification.type, notification.read)}`}
                        >
                          <div className="flex items-start space-x-3">
                            {}
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            {}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${
                                notification.read
                                  ? 'text-gray-600 dark:text-gray-400'
                                  : 'text-gray-900 dark:text-white font-medium'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            {}
                            <div className="flex items-center space-x-1">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemove(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {filter === 'unread' ? 'No unread notifications' : 
                       filter === 'read' ? 'No read notifications' : 
                       'No notifications yet'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default NotificationCenter;
