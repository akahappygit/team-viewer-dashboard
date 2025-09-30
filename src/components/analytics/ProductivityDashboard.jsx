import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Clock, 
  Users,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  Award
} from 'lucide-react';
import { 
  calculateProductivityScores, 
  assessBurnoutRisks, 
  predictTeamPerformance,
  trackGoals,
  analyzeTimeTracking
} from '../../redux/slices/analyticsSlice';
const ProductivityDashboard = () => {
  const dispatch = useDispatch();
  const { members } = useSelector(state => state.members);
  const { 
    productivityScores, 
    burnoutAssessments, 
    teamPerformance, 
    goals,
    timeTracking,
    advancedInsights,
    loading 
  } = useSelector(state => state.analytics);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    if (members.length > 0) {
      dispatch(calculateProductivityScores(members));
      dispatch(assessBurnoutRisks(members));
      dispatch(predictTeamPerformance({ team: members, timeframe: 30 }));
      // Mock goals data
      const mockGoals = [
        {
          id: 'goal-1',
          title: 'Q4 Sprint Completion',
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          keyResults: [
            { id: 'kr-1', title: 'Complete 50 user stories', target: 50, current: 38 },
            { id: 'kr-2', title: 'Achieve 95% test coverage', target: 95, current: 87 }
          ]
        },
        {
          id: 'goal-2',
          title: 'Team Performance Excellence',
          startDate: '2024-11-01',
          endDate: '2024-12-31',
          keyResults: [
            { id: 'kr-3', title: 'Maintain 90% satisfaction', target: 90, current: 88 },
            { id: 'kr-4', title: 'Reduce bug rate to <2%', target: 2, current: 3.2 }
          ]
        }
      ];
      dispatch(trackGoals(mockGoals));
      // Analyze time tracking for each member
      members.forEach(member => {
        dispatch(analyzeTimeTracking({ member, period: 7 }));
      });
    }
  }, [dispatch, members]);
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  const getRiskColor = (risk) => {
    if (risk < 25) return 'text-green-600 bg-green-100';
    if (risk < 50) return 'text-yellow-600 bg-yellow-100';
    if (risk < 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'productivity', label: 'Productivity', icon: TrendingUp },
    { id: 'burnout', label: 'Burnout Risk', icon: AlertTriangle },
    { id: 'goals', label: 'Goals & OKRs', icon: Target },
    { id: 'insights', label: 'AI Insights', icon: Brain }
  ];
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Productivity
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {productivityScores.length > 0 
                ? Math.round(productivityScores.reduce((sum, s) => sum + s.score, 0) / productivityScores.length)
                : 0}%
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              High Risk Members
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {burnoutAssessments.filter(a => a.assessment.risk > 70).length}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Goals On Track
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {goals.filter(g => g.onTrack).length}/{goals.length}
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Team Efficiency
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {teamPerformance ? Math.round(teamPerformance.productivity) : 0}%
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
  const renderProductivity = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Individual Productivity Scores
        </h3>
        <div className="space-y-4">
          {productivityScores.map((score, index) => (
            <motion.div
              key={score.memberId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {score.member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {score.member.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {score.member.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(score.score)}`}>
                    {Math.round(score.score)}%
                  </p>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${score.score}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
  const renderBurnoutRisk = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Burnout Risk Assessment
        </h3>
        <div className="space-y-4">
          {burnoutAssessments.map((assessment, index) => (
            <motion.div
              key={assessment.memberId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {assessment.member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {assessment.member.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Risk Level: {assessment.assessment.level}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(assessment.assessment.risk)}`}>
                  {Math.round(assessment.assessment.risk)}%
                </div>
              </div>
              {assessment.assessment.recommendations.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Recommendations:
                  </p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {assessment.assessment.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-yellow-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
  const renderGoals = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Goals & OKRs Tracking
        </h3>
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {goal.title}
                </h4>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  goal.onTrack ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {goal.onTrack ? 'On Track' : 'Behind'}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(goal.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      goal.onTrack ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              {goal.keyResults && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Results:
                  </p>
                  {goal.keyResults.map((kr) => (
                    <div key={kr.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{kr.title}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {kr.current}/{kr.target}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
  const renderInsights = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI-Powered Insights
        </h3>
        <div className="space-y-4">
          {advancedInsights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No insights available yet. Analytics are being processed...
              </p>
            </div>
          ) : (
            advancedInsights.slice(0, 10).map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'critical' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'critical' 
                      ? 'bg-red-100 dark:bg-red-800'
                      : insight.type === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-800'
                      : 'bg-blue-100 dark:bg-blue-800'
                  }`}>
                    {insight.type === 'critical' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : insight.type === 'warning' ? (
                      <TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {insight.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(insight.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
  if (loading.productivity || loading.burnout || loading.performance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights into team productivity and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enterprise Analytics
          </span>
        </div>
      </div>
      {}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'productivity' && renderProductivity()}
          {activeTab === 'burnout' && renderBurnoutRisk()}
          {activeTab === 'goals' && renderGoals()}
          {activeTab === 'insights' && renderInsights()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default ProductivityDashboard;
