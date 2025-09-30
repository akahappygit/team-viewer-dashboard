import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { 
  Card, 
  StatsCard, 
  GlassCard, 
  Button, 
  IconButton, 
  Select, 
  Badge 
} from '../components/ui';
import { StaggeredList, FloatingElements } from '../components/animations';
import { PerformanceChart, TaskDistributionChart, TeamPerformanceChart } from '../components/charts';
import { fetchAnalytics, setDateRange, setMetricType } from '../redux/slices/analyticsSlice';
const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const {
    metrics,
    charts,
    trends,
    loading,
    error,
    dateRange,
    metricType
  } = useSelector(state => state.analytics);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  useEffect(() => {
    dispatch(fetchAnalytics({ dateRange, metricType }));
  }, [dispatch, dateRange, metricType]);
  const handleDateRangeChange = (range) => {
    setSelectedPeriod(range);
    dispatch(setDateRange(range));
  };
  const handleMetricTypeChange = (type) => {
    dispatch(setMetricType(type));
  };
  const handleRefresh = () => {
    dispatch(fetchAnalytics({ dateRange, metricType }));
  };
  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting analytics data...');
  };
  const periodOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];
  const metricOptions = [
    { value: 'performance', label: 'Performance' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'quality', label: 'Quality' }
  ];
  // Mock chart data for demonstration
  const performanceData = [
    { name: 'Mon', value: 85, target: 80 },
    { name: 'Tue', value: 92, target: 80 },
    { name: 'Wed', value: 78, target: 80 },
    { name: 'Thu', value: 88, target: 80 },
    { name: 'Fri', value: 95, target: 80 },
    { name: 'Sat', value: 82, target: 80 },
    { name: 'Sun', value: 90, target: 80 }
  ];
  const taskDistribution = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#3B82F6' },
    { name: 'Pending', value: 8, color: '#F59E0B' },
    { name: 'Blocked', value: 2, color: '#EF4444' }
  ];
  const teamPerformance = [
    { name: 'Alice Johnson', score: 95, tasks: 24, efficiency: 92 },
    { name: 'Bob Smith', score: 88, tasks: 19, efficiency: 85 },
    { name: 'Carol Davis', score: 91, tasks: 22, efficiency: 89 },
    { name: 'David Wilson', score: 87, tasks: 18, efficiency: 83 },
    { name: 'Eva Brown', score: 93, tasks: 26, efficiency: 91 }
  ];
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {}
      <FloatingElements />
      <div className="relative z-10 p-6 space-y-6">
        {}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track performance metrics and team insights
            </p>
          </div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Select
              value={selectedPeriod}
              onValueChange={handleDateRangeChange}
              options={periodOptions}
              className="w-40"
            />
            <Select
              value={metricType}
              onValueChange={handleMetricTypeChange}
              options={metricOptions}
              className="w-36"
            />
            <IconButton
              icon={<RefreshCw />}
              onClick={handleRefresh}
              variant="outline"
            />
            <Button
              icon={<Download />}
              onClick={handleExport}
              variant="outline"
            >
              Export
            </Button>
          </motion.div>
        </motion.div>
        {}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Team Performance"
            value="89.2%"
            icon={<TrendingUp />}
            trend={{ value: 5.2, isPositive: true }}
            className="border-green-200 dark:border-green-800"
          />
          <StatsCard
            title="Task Completion"
            value="94.7%"
            icon={<CheckCircle />}
            trend={{ value: 2.1, isPositive: true }}
            className="border-blue-200 dark:border-blue-800"
          />
          <StatsCard
            title="Avg Response Time"
            value="2.4h"
            icon={<Clock />}
            trend={{ value: -0.3, isPositive: true }}
            className="border-purple-200 dark:border-purple-800"
          />
          <StatsCard
            title="Team Efficiency"
            value="87.5%"
            icon={<Activity />}
            trend={{ value: 3.8, isPositive: true }}
            className="border-orange-200 dark:border-orange-800"
          />
        </StaggeredList>
      {}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {}
        <PerformanceChart
          title="Performance Trends"
          type="line"
          height={300}
          showControls={true}
          className="col-span-1"
        />
        {}
        <TaskDistributionChart
          title="Task Distribution"
          type="pie"
          height={300}
          showLegend={true}
          showStats={true}
          className="col-span-1"
        />
      </div>
      {}
      <div className="mb-8">
        <TeamPerformanceChart
          title="Team Performance Overview"
          type="bar"
          height={400}
          showComparison={true}
          timeframe={dateRange}
        />
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Team performance has improved by <strong>5.2%</strong> this week
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Task completion rate is <strong>94.7%</strong>, exceeding target
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Average response time decreased by <strong>0.3 hours</strong>
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recommendations
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Consider recognizing top performers to maintain motivation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Focus on reducing blocked tasks to improve overall efficiency
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Schedule team training to maintain high performance levels
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default AnalyticsPage;
