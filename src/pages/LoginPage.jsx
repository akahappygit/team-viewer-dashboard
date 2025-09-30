import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Users, BarChart3, Target, Zap } from 'lucide-react';
import { loginUser } from '../redux/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
const LoginPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'team_member'
  });
  const [showPassword, setShowPassword] = useState(false);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };
  const handleDemoLogin = (role) => {
    const demoCredentials = {
      team_lead: {
        email: 'lead@teampulse.com',
        password: 'demo123',
        role: 'team_lead'
      },
      team_member: {
        email: 'member@teampulse.com',
        password: 'demo123',
        role: 'team_member'
      }
    };
    setFormData(demoCredentials[role]);
    dispatch(loginUser(demoCredentials[role]));
  };
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Management",
      description: "Manage your team members and track their performance"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Get insights with comprehensive analytics and reporting"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal Tracking",
      description: "Set and monitor team goals with real-time progress"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Updates",
      description: "Stay updated with instant notifications and alerts"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {}
          <div className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center space-x-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Team Pulse
              </h1>
            </motion.div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Enterprise Team Management Dashboard
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Empower your team with advanced analytics, real-time collaboration, and intelligent insights.
            </p>
          </div>
          {}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-white/20 dark:border-gray-700/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to access your dashboard
              </p>
            </div>
            {}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleDemoLogin('team_lead')}
                variant="gradient"
                fullWidth
                disabled={loading}
                className="justify-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Demo Login as Team Lead
              </Button>
              <Button
                onClick={() => handleDemoLogin('team_member')}
                variant="outline"
                fullWidth
                disabled={loading}
                className="justify-center"
              >
                <Target className="h-4 w-4 mr-2" />
                Demo Login as Team Member
              </Button>
            </div>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>
            {}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'team_member' })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.role === 'team_member'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    disabled={loading}
                  >
                    Team Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'team_lead' })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.role === 'team_lead'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    disabled={loading}
                  >
                    Team Lead
                  </button>
                </div>
              </div>
              {error && (
                <motion.div
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
              <Button
                type="submit"
                variant="gradient"
                fullWidth
                loading={loading}
                className="justify-center"
              >
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Contact your administrator
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
export default LoginPage;
