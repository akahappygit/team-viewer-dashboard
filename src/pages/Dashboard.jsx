import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchTeamMembers, resetInactiveUsers } from '../redux/slices/membersSlice';
import { setUser } from '../redux/slices/roleSlice';
import MemberCard from '../components/MemberCard';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import StatusSelector from '../components/StatusSelector';
import UserPresence from '../components/collaboration/UserPresence';
import ProductivityDashboard from '../components/analytics/ProductivityDashboard';
import AIInsights from '../components/analytics/AIInsights';
// Automation tab removed (AI components folder deleted)
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Clock, CheckCircle, AlertCircle, BarChart3, Eye, EyeOff, Brain, TrendingUp, Bot, TestTube } from 'lucide-react';
import { StaggeredList, FloatingElements } from '../components/animations';
import FeatureTester from '../components/testing/FeatureTester';
import { Modal } from '../components/ui/Modal';
const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentRole, currentUser } = useSelector(state => state.role);
  const { 
    members, 
    loading, 
    error, 
    filters,
    darkMode 
  } = useSelector(state => state.members);
  const [showChart, setShowChart] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const statusFilter = filters.status;
  const sortBy = filters.sortBy;
  useEffect(() => {
    dispatch(fetchTeamMembers());
    // Auto-reset inactive users every 1 minute
    const interval = setInterval(() => {
      dispatch(resetInactiveUsers());
    }, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);
  // Ensure currentUser is a valid member
  useEffect(() => {
    if (members.length > 0 && (!currentUser || !members.find(m => m.id === currentUser.id))) {
      dispatch(setUser({ id: members[0].id, name: members[0].name }));
    }
  }, [members, currentUser, dispatch]);
  // Filter and sort members
  const filteredMembers = members.filter(member => 
    statusFilter === 'all' || member.status === statusFilter
  );
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === 'tasks') {
      const aActiveTasks = a.tasks.filter(task => !task.completed).length;
      const bActiveTasks = b.tasks.filter(task => !task.completed).length;
      return bActiveTasks - aActiveTasks;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
  // Get status counts for summary
  const statusCounts = members.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {});
  // Chart data
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: {
      working: '#10B981',
      break: '#F59E0B',
      meeting: '#3B82F6',
      offline: '#6B7280'
    }[status]
  }));
  // Get current user's tasks
  const currentUserMember = members.find(member => member.id === currentUser.id);
  const userTasks = currentUserMember?.tasks || [];
  const [isMemberDetailOpen, setIsMemberDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="loading-spinner-glass mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading dashboard...
          </p>
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center dashboard-card max-w-md"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(fetchTeamMembers())}
            className="btn-glass-primary px-6 py-3"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'lead' ? (
          // Team Lead View
          <div className="space-y-8">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gradient mb-2">
                    Team Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Monitor your team's activity and performance
                  </p>
                </div>
                
                <div className="flex space-x-1 glass-nav p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-white/80 text-gray-900 shadow-lg backdrop-blur-sm dark:bg-blue-600 dark:text-white'
                        : 'text-gray-800 dark:text-gray-300 hover:bg-white/40 hover:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white'
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    Dashboard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeTab === 'analytics'
                        ? 'bg-white/80 text-gray-900 shadow-lg backdrop-blur-sm dark:bg-blue-600 dark:text-white'
                        : 'text-gray-800 dark:text-gray-300 hover:bg-white/40 hover:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    Analytics
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('insights')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeTab === 'insights'
                        ? 'bg-white/80 text-gray-900 shadow-lg backdrop-blur-sm dark:bg-blue-600 dark:text-white'
                        : 'text-gray-800 dark:text-gray-300 hover:bg-white/40 hover:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white'
                    }`}
                  >
                    <Brain className="h-4 w-4 inline mr-2" />
                    AI Insights
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('automation')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeTab === 'automation'
                        ? 'bg-white/80 text-gray-900 shadow-lg backdrop-blur-sm dark:bg-blue-600 dark:text-white'
                        : 'text-gray-800 dark:text-gray-300 hover:bg-white/40 hover:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white'
                    }`}
                  >
                    <Bot className="h-4 w-4 inline mr-2" />
                    Automation
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('testing')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeTab === 'testing'
                        ? 'bg-white/80 text-gray-900 shadow-lg backdrop-blur-sm dark:bg-blue-600 dark:text-white'
                        : 'text-gray-800 dark:text-gray-300 hover:bg-white/40 hover:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white'
                    }`}
                  >
                    <TestTube className="h-4 w-4 inline mr-2" />
                    Testing
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {activeTab === 'dashboard' && (
              <>
                
                <StaggeredList>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div 
                      className="dashboard-card interactive-lift"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Members
                          </p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {members.length}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 animate-float">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="dashboard-card interactive-lift"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Active Now
                          </p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {statusCounts.working || 0}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 animate-float">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="dashboard-card interactive-lift"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            In Meetings
                          </p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {statusCounts.meeting || 0}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 animate-float">
                          <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="dashboard-card interactive-lift"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            On Break
                          </p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {statusCounts.break || 0}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 animate-float">
                          <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </StaggeredList>
                {}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChart(!showChart)}
                    className="btn-glass-primary flex items-center px-6 py-3"
                  >
                    {showChart ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Chart
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Show Chart
                      </>
                    )}
                  </motion.button>
                </div>
                {}
                {showChart && chartData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="chart-glass p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Team Status Distribution
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="dashboard-card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Assign New Task
                  </h3>
                  <TaskForm />
                </motion.div>
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <UserPresence />
                </motion.div>
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="dashboard-card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Team Members
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => { setSelectedMember(member); setIsMemberDetailOpen(true); }}
                        className="cursor-pointer"
                      >
                        <MemberCard member={member} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <Modal
                  isOpen={isMemberDetailOpen}
                  onClose={() => { setIsMemberDetailOpen(false); setSelectedMember(null); }}
                  title={selectedMember ? selectedMember.name : 'Member Details'}
                  size="lg"
                  variant="glass"
                >
                  {selectedMember ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {selectedMember.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMember.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Role: {selectedMember.role}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{(selectedMember.tasks || []).filter(t => !t.completed).length}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{(selectedMember.tasks || []).filter(t => t.completed).length}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400">No member selected.</div>
                  )}
                </Modal>
              </>
            )}
            {}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductivityDashboard />
              </motion.div>
            )}
            {}
            {activeTab === 'insights' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AIInsights />
              </motion.div>
            )}
            {}
            {activeTab === 'automation' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="dashboard-card"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Automation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This section has been removed. AI automation features are disabled.
                </p>
              </motion.div>
            )}
            
            {/* Testing Tab */}
            {activeTab === 'testing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FeatureTester />
              </motion.div>
            )}
          </div>
        ) : (
        // Team Member View
        <div className="space-y-8">
          {}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Your Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage your tasks and track your progress
            </p>
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="dashboard-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Your Status
            </h3>
            <StatusSelector />
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="dashboard-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Tasks ({userTasks.length})
            </h3>
            <TaskList tasks={userTasks} />
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div 
              className="dashboard-card interactive-lift text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-float">
                <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-500 mb-2">
                {userTasks.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
            </motion.div>
            <motion.div 
              className="dashboard-card interactive-lift text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-float">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-500 mb-2">
                {userTasks.filter(task => task.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </p>
            </motion.div>
            <motion.div 
              className="dashboard-card interactive-lift text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-float">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-500 mb-2">
                {userTasks.filter(task => !task.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In Progress
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="dashboard-card mt-8"
        aria-label="Page footer"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-4 text-sm">
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy</a>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms</a>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Contact</a>
          </div>
        </div>
      </motion.footer>
    </div>
  </div>
  );
};
export default Dashboard;
