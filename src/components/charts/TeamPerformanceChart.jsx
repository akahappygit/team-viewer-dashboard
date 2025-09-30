import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Target,
  BarChart3,
  Activity,
  Zap,
  Star
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
const TeamPerformanceChart = ({ 
  data = [], 
  type = 'bar',
  title = 'Team Performance',
  height = 400,
  showComparison = true,
  timeframe = 'month',
  className = ''
}) => {
  const [chartType, setChartType] = useState(type);
  const [metric, setMetric] = useState('overall'); // overall, productivity, quality, collaboration
  const [period, setPeriod] = useState(timeframe);
  // Generate mock team performance data
  const teamData = useMemo(() => {
    if (data.length > 0) return data;
    const members = [
      { name: 'John Doe', avatar: '/avatars/john.jpg', role: 'Senior Developer' },
      { name: 'Jane Smith', avatar: '/avatars/jane.jpg', role: 'UI/UX Designer' },
      { name: 'Mike Johnson', avatar: '/avatars/mike.jpg', role: 'Frontend Developer' },
      { name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg', role: 'Backend Developer' },
      { name: 'Tom Brown', avatar: '/avatars/tom.jpg', role: 'DevOps Engineer' },
      { name: 'Lisa Davis', avatar: '/avatars/lisa.jpg', role: 'QA Engineer' }
    ];
    return members.map((member, index) => ({
      ...member,
      overall: Math.floor(Math.random() * 30) + 70,
      productivity: Math.floor(Math.random() * 25) + 75,
      quality: Math.floor(Math.random() * 20) + 80,
      collaboration: Math.floor(Math.random() * 35) + 65,
      tasksCompleted: Math.floor(Math.random() * 15) + 10,
      avgRating: (Math.random() * 1.5 + 3.5).toFixed(1),
      improvement: Math.floor(Math.random() * 20) - 10, // -10 to +10
      efficiency: Math.floor(Math.random() * 25) + 75,
      innovation: Math.floor(Math.random() * 30) + 70,
      leadership: Math.floor(Math.random() * 40) + 60
    }));
  }, [data]);
  // Generate time-series data for trends
  const trendData = useMemo(() => {
    const periods = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const data = [];
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        name: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        teamAverage: Math.floor(Math.random() * 20) + 75,
        topPerformer: Math.floor(Math.random() * 15) + 85,
        productivity: Math.floor(Math.random() * 25) + 70,
        quality: Math.floor(Math.random() * 20) + 80,
        collaboration: Math.floor(Math.random() * 30) + 70
      });
    }
    return data;
  }, [period]);
  // Radar chart data for skills comparison
  const radarData = useMemo(() => {
    const skills = ['Productivity', 'Quality', 'Collaboration', 'Innovation', 'Leadership', 'Efficiency'];
    return skills.map(skill => {
      const skillData = { skill };
      teamData.slice(0, 3).forEach(member => {
        skillData[member.name] = member[skill.toLowerCase()] || Math.floor(Math.random() * 30) + 70;
      });
      return skillData;
    });
  }, [teamData]);
  // Calculate team statistics
  const teamStats = useMemo(() => {
    if (teamData.length === 0) return {};
    const avgOverall = Math.round(teamData.reduce((sum, member) => sum + member.overall, 0) / teamData.length);
    const topPerformer = teamData.reduce((top, member) => 
      member.overall > top.overall ? member : top, teamData[0]);
    const totalTasks = teamData.reduce((sum, member) => sum + member.tasksCompleted, 0);
    const avgImprovement = Math.round(teamData.reduce((sum, member) => sum + member.improvement, 0) / teamData.length);
    return {
      avgOverall,
      topPerformer,
      totalTasks,
      avgImprovement,
      teamSize: teamData.length
    };
  }, [teamData]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.dataKey}:
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {typeof entry.value === 'number' ? `${entry.value}%` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  const renderChart = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" className="text-xs text-gray-600 dark:text-gray-400" />
            <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="teamAverage"
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              name="Team Average"
            />
            <Line
              type="monotone"
              dataKey="topPerformer"
              stroke={colors[1]}
              strokeWidth={2}
              dot={{ fill: colors[1], strokeWidth: 2, r: 3 }}
              name="Top Performer"
            />
          </LineChart>
        );
      case 'radar':
        return (
          <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" className="text-xs" />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            {teamData.slice(0, 3).map((member, index) => (
              <Radar
                key={member.name}
                name={member.name}
                dataKey={member.name}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        );
      case 'composed':
        return (
          <ComposedChart data={teamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Legend />
            <Bar dataKey="overall" fill={colors[0]} name="Overall Score" />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              stroke={colors[1]} 
              strokeWidth={2}
              name="Productivity"
            />
          </ComposedChart>
        );
      case 'scatter':
        return (
          <ScatterChart data={teamData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              type="number" 
              dataKey="productivity" 
              name="Productivity"
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              type="number" 
              dataKey="quality" 
              name="Quality"
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={<CustomTooltip />}
            />
            <Scatter name="Team Members" data={teamData} fill={colors[0]} />
          </ScatterChart>
        );
      default: // bar
        return (
          <BarChart data={teamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Legend />
            <Bar 
              dataKey={metric === 'overall' ? 'overall' : metric} 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
            />
            {showComparison && (
              <Bar 
                dataKey="productivity" 
                fill={colors[1]}
                radius={[4, 4, 0, 0]}
                name="Productivity"
              />
            )}
          </BarChart>
        );
    }
  };
  return (
    <Card className={`p-6 ${className}`}>
      {}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Performance metrics across team members
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['overall', 'productivity', 'quality', 'collaboration'].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                  metric === m
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {}
          <div className="flex space-x-1">
            <IconButton
              onClick={() => setChartType('bar')}
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
            >
              <BarChart3 className="h-4 w-4" />
            </IconButton>
            <IconButton
              onClick={() => setChartType('line')}
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
            >
              <Activity className="h-4 w-4" />
            </IconButton>
            <IconButton
              onClick={() => setChartType('radar')}
              variant={chartType === 'radar' ? 'default' : 'ghost'}
              size="sm"
            >
              <Target className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </div>
      {}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamStats.teamSize}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Team Members
          </div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamStats.avgOverall}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Avg Performance
          </div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamStats.totalTasks}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Tasks Completed
          </div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-5 w-5 text-orange-600" />
          </div>
          <div className={`text-2xl font-bold ${
            teamStats.avgImprovement >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {teamStats.avgImprovement > 0 ? '+' : ''}{teamStats.avgImprovement}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Improvement
          </div>
        </div>
      </div>
      {}
      <motion.div
        key={`${chartType}-${metric}`}
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
      {teamStats.topPerformer && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Top Performer
              </h4>
              <div className="flex items-center space-x-3">
                <Avatar 
                  src={teamStats.topPerformer.avatar} 
                  alt={teamStats.topPerformer.name}
                  size="sm"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {teamStats.topPerformer.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {teamStats.topPerformer.role}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {teamStats.topPerformer.overall}%
                </span>
              </div>
              <Badge variant="success" size="sm">
                {teamStats.topPerformer.tasksCompleted} tasks completed
              </Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
export default TeamPerformanceChart;
