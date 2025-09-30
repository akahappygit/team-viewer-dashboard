import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
// Memoized Member Card Component
export const MemoizedMemberCard = memo(({ 
  member, 
  onStatusChange, 
  onTaskUpdate,
  darkMode = false 
}) => {
  const handleStatusChange = useCallback((newStatus) => {
    onStatusChange?.(member.id, newStatus);
  }, [member.id, onStatusChange]);
  const handleTaskUpdate = useCallback((taskId, updates) => {
    onTaskUpdate?.(member.id, taskId, updates);
  }, [member.id, onTaskUpdate]);
  const statusColor = useMemo(() => {
    switch (member.status) {
      case 'working': return 'bg-green-500';
      case 'break': return 'bg-yellow-500';
      case 'meeting': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  }, [member.status]);
  const activeTasks = useMemo(() => 
    member.tasks?.filter(task => !task.completed) || [], 
    [member.tasks]
  );
  const completedTasks = useMemo(() => 
    member.tasks?.filter(task => task.completed) || [], 
    [member.tasks]
  );
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={member.avatar}
            alt={member.name}
            className="h-12 w-12 rounded-full object-cover"
            loading="lazy"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-white dark:border-gray-800`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {member.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {member.role}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activeTasks.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Active Tasks
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {completedTasks.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Completed
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {activeTasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {task.title}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.priority === 'high' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {task.priority}
            </span>
          </div>
        ))}
        {activeTasks.length > 3 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            +{activeTasks.length - 3} more tasks
          </div>
        )}
      </div>
    </motion.div>
  );
});
MemoizedMemberCard.displayName = 'MemoizedMemberCard';
// Memoized Task Item Component
export const MemoizedTaskItem = memo(({ 
  task, 
  onUpdate, 
  onDelete, 
  showAssignee = true 
}) => {
  const handleStatusToggle = useCallback(() => {
    onUpdate?.(task.id, { completed: !task.completed });
  }, [task.id, task.completed, onUpdate]);
  const handleDelete = useCallback(() => {
    onDelete?.(task.id);
  }, [task.id, onDelete]);
  const priorityColor = useMemo(() => {
    switch (task.priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  }, [task.priority]);
  const isOverdue = useMemo(() => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completed;
  }, [task.dueDate, task.completed]);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`border-l-4 p-4 rounded-r-lg ${priorityColor} ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleStatusToggle}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.completed && <CheckCircle className="w-3 h-3" />}
          </button>
          <div className="flex-1">
            <h4 className={`font-medium ${
              task.completed 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-red-500' : ''
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  {isOverdue && <AlertCircle className="w-3 h-3" />}
                </div>
              )}
              {showAssignee && task.assignedTo && (
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{task.assignedTo}</span>
                </div>
              )}
              {task.estimatedHours && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});
MemoizedTaskItem.displayName = 'MemoizedTaskItem';
// Memoized Stats Card Component
export const MemoizedStatsCard = memo(({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend,
  subtitle 
}) => {
  const colorClasses = useMemo(() => {
    const colors = {
      blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      green: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      yellow: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
      indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
    };
    return colors[color] || colors.blue;
  }, [color]);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <div className={`flex items-center text-sm ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-3 h-3 mr-1 ${
                  trend < 0 ? 'transform rotate-180' : ''
                }`} />
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});
MemoizedStatsCard.displayName = 'MemoizedStatsCard';
// Memoized Chart Container
export const MemoizedChartContainer = memo(({ 
  title, 
  children, 
  loading = false,
  error = null,
  actions = null 
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-8 h-8 mr-2" />
          <span>Error loading chart: {error}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
});
MemoizedChartContainer.displayName = 'MemoizedChartContainer';
