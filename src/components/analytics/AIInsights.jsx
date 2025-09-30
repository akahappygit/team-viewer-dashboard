import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Users,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Bot,
  BarChart3
} from 'lucide-react';
const AIInsights = () => {
  const dispatch = useDispatch();
  const { members } = useSelector(state => state.members);
  const { tasks } = useSelector(state => state.tasks);
  const { 
    productivityScores, 
    burnoutAssessments, 
    teamPerformance,
    advancedInsights 
  } = useSelector(state => state.analytics);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({});
  useEffect(() => {
    generateAIRecommendations();
    generatePredictiveAnalytics();
  }, [productivityScores, burnoutAssessments, teamPerformance, members, tasks]);
  const generateAIRecommendations = () => {
    const recommendations = [];
    // Task Distribution Analysis
    if (members.length > 0 && tasks.length > 0) {
      const tasksByMember = members.map(member => ({
        member,
        taskCount: tasks.filter(task => task.assignedTo === member.id).length,
        completedTasks: tasks.filter(task => task.assignedTo === member.id && task.status === 'completed').length
      }));
      const avgTasks = tasksByMember.reduce((sum, m) => sum + m.taskCount, 0) / tasksByMember.length;
      const overloadedMembers = tasksByMember.filter(m => m.taskCount > avgTasks * 1.5);
      const underutilizedMembers = tasksByMember.filter(m => m.taskCount < avgTasks * 0.5);
      if (overloadedMembers.length > 0) {
        recommendations.push({
          id: 'workload-balance',
          type: 'critical',
          category: 'Workload Management',
          title: 'Workload Imbalance Detected',
          description: `${overloadedMembers.length} team member(s) are overloaded with tasks`,
          impact: 'High',
          effort: 'Medium',
          recommendation: `Redistribute tasks from ${overloadedMembers.map(m => m.member.name).join(', ')} to balance workload`,
          actions: [
            'Review current task assignments',
            'Identify tasks that can be reassigned',
            'Consider hiring additional resources',
            'Implement task prioritization framework'
          ],
          expectedOutcome: 'Improved team productivity and reduced burnout risk',
          confidence: 85
        });
      }
      if (underutilizedMembers.length > 0) {
        recommendations.push({
          id: 'resource-optimization',
          type: 'opportunity',
          category: 'Resource Optimization',
          title: 'Underutilized Team Members',
          description: `${underutilizedMembers.length} team member(s) have capacity for additional work`,
          impact: 'Medium',
          effort: 'Low',
          recommendation: `Assign additional tasks to ${underutilizedMembers.map(m => m.member.name).join(', ')}`,
          actions: [
            'Identify high-priority backlog items',
            'Assess skill alignment for task assignment',
            'Provide additional training if needed',
            'Set up mentoring opportunities'
          ],
          expectedOutcome: 'Better resource utilization and faster project delivery',
          confidence: 78
        });
      }
    }
    // Productivity Insights
    if (productivityScores.length > 0) {
      const lowPerformers = productivityScores.filter(score => score.score < 70);
      const topPerformers = productivityScores.filter(score => score.score > 90);
      if (lowPerformers.length > 0) {
        recommendations.push({
          id: 'productivity-improvement',
          type: 'warning',
          category: 'Performance Enhancement',
          title: 'Productivity Improvement Opportunities',
          description: `${lowPerformers.length} team member(s) showing below-average productivity`,
          impact: 'High',
          effort: 'Medium',
          recommendation: 'Implement targeted support and training programs',
          actions: [
            'Conduct one-on-one performance reviews',
            'Identify skill gaps and training needs',
            'Pair with high-performing mentors',
            'Review and optimize work processes'
          ],
          expectedOutcome: 'Increased individual and team productivity',
          confidence: 82
        });
      }
      if (topPerformers.length > 0) {
        recommendations.push({
          id: 'knowledge-sharing',
          type: 'opportunity',
          category: 'Knowledge Management',
          title: 'Leverage Top Performers',
          description: `${topPerformers.length} high-performing team member(s) can mentor others`,
          impact: 'Medium',
          effort: 'Low',
          recommendation: 'Create knowledge sharing and mentoring programs',
          actions: [
            'Set up peer mentoring sessions',
            'Document best practices and workflows',
            'Create internal training materials',
            'Establish regular knowledge sharing meetings'
          ],
          expectedOutcome: 'Improved team-wide performance and knowledge retention',
          confidence: 75
        });
      }
    }
    // Burnout Prevention
    if (burnoutAssessments.length > 0) {
      const highRiskMembers = burnoutAssessments.filter(assessment => assessment.assessment.risk > 70);
      if (highRiskMembers.length > 0) {
        recommendations.push({
          id: 'burnout-prevention',
          type: 'critical',
          category: 'Well-being',
          title: 'Burnout Risk Mitigation',
          description: `${highRiskMembers.length} team member(s) at high risk of burnout`,
          impact: 'Critical',
          effort: 'High',
          recommendation: 'Implement immediate burnout prevention measures',
          actions: [
            'Reduce workload for high-risk members',
            'Encourage time off and breaks',
            'Provide mental health resources',
            'Review work-life balance policies',
            'Consider flexible working arrangements'
          ],
          expectedOutcome: 'Reduced turnover risk and improved team well-being',
          confidence: 90
        });
      }
    }
    // Team Collaboration Insights
    recommendations.push({
      id: 'collaboration-enhancement',
      type: 'opportunity',
      category: 'Team Dynamics',
      title: 'Enhance Team Collaboration',
      description: 'Opportunities to improve cross-functional collaboration',
      impact: 'Medium',
      effort: 'Medium',
      recommendation: 'Implement structured collaboration frameworks',
      actions: [
        'Schedule regular cross-team sync meetings',
        'Implement pair programming sessions',
        'Create shared documentation standards',
        'Use collaborative tools and platforms'
      ],
      expectedOutcome: 'Improved communication and faster problem resolution',
      confidence: 70
    });
    setAiRecommendations(recommendations);
  };
  const generatePredictiveAnalytics = () => {
    const analytics = {
      projectCompletion: {
        probability: 78,
        estimatedDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        riskFactors: ['Resource constraints', 'Scope creep', 'Technical debt'],
        confidence: 82
      },
      teamPerformanceTrend: {
        direction: 'improving',
        rate: 12, // percentage improvement
        factors: ['Better task distribution', 'Reduced burnout risk', 'Improved processes'],
        nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      },
      resourceNeeds: {
        additionalMembers: 2,
        skillsNeeded: ['Frontend Development', 'DevOps', 'UI/UX Design'],
        timeline: '2-3 months',
        priority: 'Medium'
      },
      qualityMetrics: {
        bugPrediction: 'Low',
        codeQualityTrend: 'Stable',
        testCoverage: 87,
        technicalDebtRisk: 'Medium'
      }
    };
    setPredictiveAnalytics(analytics);
  };
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return TrendingUp;
      case 'opportunity': return Lightbulb;
      default: return Brain;
    }
  };
  const getRecommendationColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'opportunity': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };
  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400';
    }
  };
  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI-Powered Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Intelligent recommendations and predictive analytics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Sparkles className="h-4 w-4" />
          <span>Powered by Advanced ML</span>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Project Completion
            </h3>
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {predictiveAnalytics.projectCompletion?.probability}%
              </span>
              <span className="text-sm text-gray-500">
                {predictiveAnalytics.projectCompletion?.estimatedDate}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${predictiveAnalytics.projectCompletion?.probability}%` }}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Performance Trend
            </h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                +{predictiveAnalytics.teamPerformanceTrend?.rate}%
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {predictiveAnalytics.teamPerformanceTrend?.direction}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Next review: {predictiveAnalytics.teamPerformanceTrend?.nextReview}
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Resource Needs
            </h3>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                +{predictiveAnalytics.resourceNeeds?.additionalMembers}
              </span>
              <span className="text-sm text-gray-500">members</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Timeline: {predictiveAnalytics.resourceNeeds?.timeline}
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg glassmorphism"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Quality Score
            </h3>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {predictiveAnalytics.qualityMetrics?.testCoverage}%
              </span>
              <span className="text-sm text-gray-500">coverage</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bug risk: {predictiveAnalytics.qualityMetrics?.bugPrediction}
            </p>
          </div>
        </motion.div>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Bot className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Recommendations
          </h3>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-xs rounded-full">
            {aiRecommendations.length} insights
          </span>
        </div>
        <div className="space-y-4">
          {aiRecommendations.map((recommendation, index) => {
            const Icon = getRecommendationIcon(recommendation.type);
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${getRecommendationColor(recommendation.type)}`}
                onClick={() => setSelectedInsight(selectedInsight === recommendation.id ? null : recommendation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="h-5 w-5 mt-1 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {recommendation.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(recommendation.impact)}`}>
                          {recommendation.impact} Impact
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {recommendation.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Category: {recommendation.category}</span>
                        <span>Effort: {recommendation.effort}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-gray-400 transition-transform ${
                    selectedInsight === recommendation.id ? 'rotate-90' : ''
                  }`} />
                </div>
                <AnimatePresence>
                  {selectedInsight === recommendation.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Recommendation:
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {recommendation.recommendation}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Action Items:
                          </h5>
                          <ul className="space-y-1">
                            {recommendation.actions.map((action, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Expected Outcome:
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {recommendation.expectedOutcome}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AIInsights;
