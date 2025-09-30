import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectOnlineUsers, selectConnectionStatus } from '../../redux/slices/collaborationSlice';
import { Users, Wifi, WifiOff } from 'lucide-react';
const UserPresence = () => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const connectionStatus = useSelector(selectConnectionStatus);
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Team Presence
          </h3>
        </div>
        {}
        <div className="flex items-center space-x-2">
          {connectionStatus === 'connected' ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            connectionStatus === 'connected' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {connectionStatus === 'connected' ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>
      {}
      <div className="mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {onlineUsers.length} {onlineUsers.length === 1 ? 'member' : 'members'} online
        </span>
      </div>
      {}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {onlineUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                {}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.status)}`} />
              </div>
              {}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getStatusText(user.status)}
                </p>
              </div>
              {}
              {user.lastSeen && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(user.lastSeen).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {}
        {onlineUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No team members online
            </p>
          </div>
        )}
      </div>
      {}
      {connectionStatus !== 'connected' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Connection lost. Retrying...'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default UserPresence;
