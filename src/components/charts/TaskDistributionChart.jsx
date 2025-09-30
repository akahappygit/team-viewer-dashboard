import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TreemapChart,
  Treemap,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/Button';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
const TaskDistributionChart = ({ 
  data = [], 
  type = 'pie',
  title = 'Task Distribution',
  height = 300,
  showLegend = true,
  showStats = true,
  className = ''
}) => {
  const [chartType, setChartType] = useState(type);
  const [viewMode, setViewMode] = useState('status'); // status, priority, assignee
  // Task status colors and icons
  const statusConfig = {
    completed: { color: '#10B981', icon: CheckCircle, label: 'Completed' },
    'in-progress': { color: '#3B82F6', icon: Clock, label: 'In Progress' },
    pending: { color: '#F59E0B', icon: AlertCircle, label: 'Pending' },
    blocked: { color: '#EF4444', icon: XCircle, label: 'Blocked' },
    review: { color: '#8B5CF6', icon: MoreHorizontal, label: 'In Review' }
  };
  const priorityConfig = {
    high: { color: '#EF4444', label: 'High Priority' },
    medium: { color: '#F59E0B', label: 'Medium Priority' },
    low: { color: '#10B981', label: 'Low Priority' }
  };
  // Generate mock data if none provided
  const chartData = useMemo(() => {
    if (data.length > 0) return data;
    if (viewMode === 'status') {
      return [
        { name: 'Completed', value: 45, count: 18, color: statusConfig.completed.color },
        { name: 'In Progress', value: 30, count: 12, color: statusConfig['in-progress'].color },
        { name: 'Pending', value: 15, count: 6, color: statusConfig.pending.color },
        { name: 'In Review', value: 7, count: 3, color: statusConfig.review.color },
        { name: 'Blocked', value: 3, count: 1, color: statusConfig.blocked.color }
      ];
    } else if (viewMode === 'priority') {
      return [
        { name: 'High Priority', value: 25, count: 10, color: priorityConfig.high.color },
        { name: 'Medium Priority', value: 50, count: 20, color: priorityConfig.medium.color },
        { name: 'Low Priority', value: 25, count: 10, color: priorityConfig.low.color }
      ];
    } else {
      return [
        { name: 'John Doe', value: 28, count: 11, color: '#3B82F6' },
        { name: 'Jane Smith', value: 22, count: 9, color: '#10B981' },
        { name: 'Mike Johnson', value: 20, count: 8, color: '#F59E0B' },
        { name: 'Sarah Wilson', value: 18, count: 7, color: '#8B5CF6' },
        { name: 'Tom Brown', value: 12, count: 5, color: '#EF4444' }
      ];
    }
  }, [data, viewMode]);
  // Calculate statistics
  const stats = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.count, 0);
    const maxItem = chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0] || {});
    return {
      total,
      categories: chartData.length,
      highest: maxItem,
      completion: viewMode === 'status' 
        ? chartData.find(item => item.name === 'Completed')?.value || 0
        : null
    };
  }, [chartData, viewMode]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Count:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {data.count} tasks
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Percentage:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {data.value}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };
    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'radial':
        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={chartData}>
            <RadialBar 
              dataKey="value" 
              cornerRadius={10} 
              label={{ position: 'insideStart', fill: '#fff' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </RadialBar>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </RadialBarChart>
        );
      case 'treemap':
        return (
          <Treemap
            data={chartData}
            dataKey="count"
            ratio={4/3}
            stroke="#fff"
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Treemap>
        );
      default: // pie
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
    }
  };
  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'status':
        return <CheckCircle className="h-4 w-4" />;
      case 'priority':
        return <AlertCircle className="h-4 w-4" />;
      case 'assignee':
        return <Users className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };
  return (
    <Card className={`p-6 ${className}`}>
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Distribution by {viewMode.replace('-', ' ')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {}
          <Dropdown
            trigger={
              <IconButton variant="ghost" size="sm">
                {getViewModeIcon()}
              </IconButton>
            }
          >
            <DropdownItem onClick={() => setViewMode('status')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              By Status
            </DropdownItem>
            <DropdownItem onClick={() => setViewMode('priority')}>
              <AlertCircle className="h-4 w-4 mr-2" />
              By Priority
            </DropdownItem>
            <DropdownItem onClick={() => setViewMode('assignee')}>
              <Users className="h-4 w-4 mr-2" />
              By Assignee
            </DropdownItem>
          </Dropdown>
          {}
          <Dropdown
            trigger={
              <IconButton variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </IconButton>
            }
          >
            <DropdownItem onClick={() => setChartType('pie')}>
              Pie Chart
            </DropdownItem>
            <DropdownItem onClick={() => setChartType('bar')}>
              Bar Chart
            </DropdownItem>
            <DropdownItem onClick={() => setChartType('radial')}>
              Radial Chart
            </DropdownItem>
            <DropdownItem onClick={() => setChartType('treemap')}>
              Treemap
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      {}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Tasks
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.categories}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Categories
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.highest?.count || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Highest
            </div>
          </div>
          {stats.completion !== null && (
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.completion}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Completed
              </div>
            </div>
          )}
        </div>
      )}
      {}
      <motion.div
        key={`${chartType}-${viewMode}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </motion.div>
      {}
      {showLegend && chartType === 'pie' && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.count} tasks ({item.value}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
export default TaskDistributionChart;
