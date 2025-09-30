import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { fetchDashboardMetrics } from '../../redux/slices/dashboardSlice';
import { fetchAnalytics } from '../../redux/slices/analyticsSlice';
const TeamLeadDashboard = () => {
  const dispatch = useDispatch();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const { currentUser } = useSelector(state => state.auth);
  const { 
    metrics, 
    isLoading: metricsLoading,
    timeRange 
  } = useSelector(state => state.dashboard);
  const { 
    dailyMetrics, 
    performanceByMember,
    categoryBreakdown,
    burnoutRisk,
    isLoading: analyticsLoading 
  } = useSelector(state => state.analytics);
  useEffect(() => {
    dispatch(fetchDashboardMetrics({ timeRange: selectedTimeRange }));
    dispatch(fetchAnalytics({ timeRange: selectedTimeRange }));
  }, [dispatch, selectedTimeRange]);
  const executiveCards = [
    {
      id: 'team-performance',
      title: 'Team Performance',
      value: metrics?.teamPerformance || 87,
      unit: '%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      description: 'Overall team productivity score'
    },
    {
      id: 'active-projects',
      title: 'Active Projects',
      value: metrics?.activeProjects || 12,
      unit: '',
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      description: 'Currently running projects'
    },
    {
      id: 'team-members',
      title: 'Team Members',
      value: metrics?.teamMembers || 24,
      unit: '',
      change: '+3',
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      description: 'Active team members'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: metrics?.completionRate || 92,
      unit: '%',
      change: '+3.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      description: 'Tasks completed on time'
    }
  ];
  const quickStats = [
    {
      label: 'Tasks Due Today',
      value: metrics?.tasksDueToday || 8,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      label: 'Overdue Tasks',
      value: metrics?.overdueTasks || 3,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Completed Today',
      value: metrics?.completedToday || 15,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Team Meetings',
      value: metrics?.teamMeetings || 4,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    }
  ];
  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];
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
            Executive Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {currentUser?.name}. Here's your team overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
            <Download className="w-5 h-5" />
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
        {executiveCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? ArrowUp : ArrowDown;
          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {}
              <div className={`absolute inset-0 ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400">
                      {card.unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-4 h-4 ${
                      card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      vs last period
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                Team Performance Trend
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily productivity metrics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
          {}
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Performance Chart Component
              </p>
            </div>
          </div>
        </motion.div>
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
                Task Distribution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By category and status
              </p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          {}
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distribution Chart Component
              </p>
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
              Team Members Performance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Individual productivity and engagement scores
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {performanceByMember.slice(0, 5).map((member, index) => (
            <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {member.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {member.score}% productivity
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${member.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{member.tasksCompleted} tasks completed</span>
                  <span>{member.hoursWorked}h this week</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {member.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  member.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {member.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
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
              Action Items & Alerts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Items requiring your attention
            </p>
          </div>
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
            {burnoutRisk.length} alerts
          </span>
        </div>
        <div className="space-y-3">
          {burnoutRisk.slice(0, 3).map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {alert.type === 'burnout' ? 'Burnout Risk Detected' : 'Performance Alert'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {alert.member} shows signs of {alert.risk}. Consider scheduling a check-in.
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
                    Schedule Check-in
                  </button>
                  <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default TeamLeadDashboard;
