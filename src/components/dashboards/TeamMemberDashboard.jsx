import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Target,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  User,
  BarChart3,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Play,
  Pause,
  Square,
  ArrowUp,
  ArrowDown,
  Star,
  Flag,
  MessageSquare
} from 'lucide-react';
import { fetchTasks, updateTaskStatus } from '../../redux/slices/tasksSlice';
import { fetchAnalytics } from '../../redux/slices/analyticsSlice';
const TeamMemberDashboard = () => {
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);
  const { currentUser } = useSelector(state => state.auth);
  const { 
    tasks, 
    isLoading: tasksLoading,
    filters,
    viewMode 
  } = useSelector(state => state.tasks);
  const { 
    personalMetrics,
    goalProgress,
    isLoading: analyticsLoading 
  } = useSelector(state => state.analytics);
  useEffect(() => {
    dispatch(fetchTasks({ assignedTo: currentUser?.id }));
    dispatch(fetchAnalytics({ userId: currentUser?.id }));
  }, [dispatch, currentUser?.id]);
  const personalStats = [
    {
      id: 'tasks-completed',
      title: 'Tasks Completed',
      value: personalMetrics?.tasksCompleted || 28,
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'productivity-score',
      title: 'Productivity Score',
      value: personalMetrics?.productivityScore || 87,
      unit: '%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'hours-worked',
      title: 'Hours This Week',
      value: personalMetrics?.hoursWorked || 32,
      unit: 'h',
      change: '+2h',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 'streak',
      title: 'Current Streak',
      value: personalMetrics?.streak || 7,
      unit: 'days',
      change: '+1',
      trend: 'up',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];
  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return taskDate === today;
  });
  const upcomingTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate > today;
  }).slice(0, 5);
  const recentAchievements = [
    {
      id: 1,
      title: 'Task Master',
      description: 'Completed 25 tasks this month',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'Early Bird',
      description: 'Started work early 5 days in a row',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'Team Player',
      description: 'Helped 3 team members with their tasks',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      date: '2 weeks ago'
    }
  ];
  const handleTaskStatusUpdate = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };
  const handleStartTimer = (taskId) => {
    setActiveTimer(taskId);
    // In a real app, this would start a timer
  };
  const handleStopTimer = () => {
    setActiveTimer(null);
    // In a real app, this would stop the timer and log time
  };
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100 dark:bg-red-900/20',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      low: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    };
    return colors[priority] || colors.medium;
  };
  const getStatusColor = (status) => {
    const colors = {
      'todo': 'text-gray-600 bg-gray-100 dark:bg-gray-700',
      'in-progress': 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      'review': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      'completed': 'text-green-600 bg-green-100 dark:bg-green-900/20'
    };
    return colors[status] || colors.todo;
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {currentUser?.name}. Let's make today productive!
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>
      {}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {personalStats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          return (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`w-4 h-4 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-lg text-gray-500 dark:text-gray-400">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today's Focus
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {todayTasks.length} tasks scheduled for today
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {todayTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <button
                  onClick={() => handleTaskStatusUpdate(task.id, 
                    task.status === 'completed' ? 'todo' : 'completed'
                  )}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {task.status === 'completed' && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${
                      task.status === 'completed'
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedTime}h</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </span>
                    {task.tags && (
                      <div className="flex items-center space-x-1">
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activeTimer === task.id ? (
                    <button
                      onClick={handleStopTimer}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartTimer(task.id)}
                      className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {todayTasks.length === 0 && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No tasks scheduled for today. Great job staying on top of things!
              </p>
            </div>
          )}
        </motion.div>
        {}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Goals
            </h3>
            <div className="space-y-4">
              {goalProgress?.slice(0, 3).map((goal, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {goal.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                      <Icon className={`w-4 h-4 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
      {}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Tasks
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks scheduled for the next few days
            </p>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {task.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {task.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedTime}h</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default TeamMemberDashboard;
