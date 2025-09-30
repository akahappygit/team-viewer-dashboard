import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button, IconButton } from '../ui/Button';
import { Badge } from '../ui/Badge';
const PerformanceChart = ({ 
  data = [], 
  type = 'line', 
  title = 'Performance Chart',
  height = 300,
  showControls = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  className = ''
}) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('7d');
  // Generate mock data if none provided
  const chartData = useMemo(() => {
    if (data.length > 0) return data;
    const mockData = [];
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      mockData.push({
        date: date.toISOString().split('T')[0],
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        performance: Math.floor(Math.random() * 40) + 60,
        tasks: Math.floor(Math.random() * 20) + 10,
        efficiency: Math.floor(Math.random() * 30) + 70,
        quality: Math.floor(Math.random() * 25) + 75,
        collaboration: Math.floor(Math.random() * 35) + 65
      });
    }
    return mockData;
  }, [data, timeRange]);
  // Calculate performance metrics
  const metrics = useMemo(() => {
    if (chartData.length === 0) return {};
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2] || latest;
    return {
      current: latest.performance,
      change: latest.performance - previous.performance,
      trend: latest.performance > previous.performance ? 'up' : 'down',
      average: Math.round(chartData.reduce((sum, item) => sum + item.performance, 0) / chartData.length),
      max: Math.max(...chartData.map(item => item.performance)),
      min: Math.min(...chartData.map(item => item.performance))
    };
  }, [chartData]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {entry.dataKey}:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };
    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="performance"
              stroke={colors[0]}
              fillOpacity={1}
              fill="url(#colorPerformance)"
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="performance" 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="efficiency" 
              fill={colors[1]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      case 'pie':
        const pieData = [
          { name: 'Performance', value: metrics.current, color: colors[0] },
          { name: 'Efficiency', value: chartData[chartData.length - 1]?.efficiency || 0, color: colors[1] },
          { name: 'Quality', value: chartData[chartData.length - 1]?.quality || 0, color: colors[2] },
          { name: 'Collaboration', value: chartData[chartData.length - 1]?.collaboration || 0, color: colors[3] }
        ];
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        );
      case 'radial':
        const radialData = [
          { name: 'Performance', value: metrics.current, fill: colors[0] },
          { name: 'Efficiency', value: chartData[chartData.length - 1]?.efficiency || 0, fill: colors[1] },
          { name: 'Quality', value: chartData[chartData.length - 1]?.quality || 0, fill: colors[2] }
        ];
        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
            <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadialBarChart>
        );
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="performance"
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke={colors[1]}
              strokeWidth={2}
              dot={{ fill: colors[1], strokeWidth: 2, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="quality"
              stroke={colors[2]}
              strokeWidth={2}
              dot={{ fill: colors[2], strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        );
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
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.current}%
              </span>
              <div className={`flex items-center space-x-1 ${
                metrics.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(metrics.change)}%
                </span>
              </div>
            </div>
            <Badge variant={metrics.trend === 'up' ? 'success' : 'warning'}>
              Avg: {metrics.average}%
            </Badge>
          </div>
        </div>
        {showControls && (
          <div className="flex items-center space-x-2">
            {}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            {}
            <div className="flex space-x-1">
              <IconButton
                onClick={() => setChartType('line')}
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
              >
                <Activity className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => setChartType('area')}
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
              >
                <Activity className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => setChartType('bar')}
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
              >
                <BarChart3 className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => setChartType('pie')}
                variant={chartType === 'pie' ? 'default' : 'ghost'}
                size="sm"
              >
                <PieChartIcon className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
      {}
      <motion.div
        key={chartType}
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
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Maximum</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {metrics.max}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Average</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {metrics.average}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Minimum</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {metrics.min}%
          </div>
        </div>
      </div>
    </Card>
  );
};
export default PerformanceChart;
