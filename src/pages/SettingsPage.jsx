import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  Calendar, 
  Moon, 
  Sun, 
  Monitor,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { 
  Card, 
  GlassCard, 
  Button, 
  IconButton, 
  Input, 
  Badge 
} from '../components/ui';
import { StaggeredList, FloatingElements } from '../components/animations';
import { 
  updateProfile, 
  updatePreferences, 
  updateProfileField, 
  toggleTheme 
} from '../redux/slices/settingsSlice';
import { useToast } from '../hooks/useToast';
const SettingsPage = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { 
    profile, 
    preferences, 
    notifications, 
    theme,
    loading 
  } = useSelector(state => state.settings);
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    profile: {
      name: profile?.name || user?.name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    preferences: {
      language: preferences?.language || 'en',
      timezone: preferences?.timezone || 'UTC',
      dateFormat: preferences?.dateFormat || 'MM/DD/YYYY',
      theme: theme || 'system'
    },
    notifications: {
      email: notifications?.email !== false,
      push: notifications?.push !== false,
      taskUpdates: notifications?.taskUpdates !== false,
      teamUpdates: notifications?.teamUpdates !== false,
      systemAlerts: notifications?.systemAlerts !== false,
      weeklyReports: notifications?.weeklyReports !== false
    }
  });
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(formData.profile)).unwrap();
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      });
    }
  };
  const handleSavePreferences = async () => {
    try {
      await dispatch(updatePreferences(formData.preferences)).unwrap();
      showToast({
        type: 'success',
        title: 'Preferences Updated',
        message: 'Your preferences have been successfully updated.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update preferences. Please try again.'
      });
    }
  };
  const handleSaveNotifications = async () => {
    try {
      await dispatch(updateNotificationSettings(formData.notifications)).unwrap();
      showToast({
        type: 'success',
        title: 'Notifications Updated',
        message: 'Your notification settings have been successfully updated.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update notification settings. Please try again.'
      });
    }
  };
  const handleThemeChange = (newTheme) => {
    handleInputChange('preferences', 'theme', newTheme);
    dispatch(toggleTheme(newTheme));
  };
  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.profile.name}
            onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.profile.email}
            onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
            placeholder="Enter your email"
          />
          <Input
            label="Phone Number"
            value={formData.profile.phone}
            onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
            placeholder="Enter your phone number"
          />
          <Input
            label="Location"
            value={formData.profile.location}
            onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
            placeholder="Enter your location"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.profile.bio}
            onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Tell us about yourself"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.profile.currentPassword}
            onChange={(e) => handleInputChange('profile', 'currentPassword', e.target.value)}
            placeholder="Enter current password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.profile.newPassword}
              onChange={(e) => handleInputChange('profile', 'newPassword', e.target.value)}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.profile.confirmPassword}
              onChange={(e) => handleInputChange('profile', 'confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          icon={<Save />}
          variant="gradient"
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          General Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={formData.preferences.language}
              onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={formData.preferences.timezone}
              onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={formData.preferences.dateFormat}
              onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSavePreferences}
          icon={<Save />}
          variant="gradient"
          loading={loading}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive notifications via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.email}
                onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive push notifications in your browser
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.push}
                onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Task Updates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when tasks are updated or completed
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.taskUpdates}
                onChange={(e) => handleInputChange('notifications', 'taskUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Team Updates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive notifications about team member activities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.teamUpdates}
                onChange={(e) => handleInputChange('notifications', 'teamUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">System Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Important system notifications and alerts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.systemAlerts}
                onChange={(e) => handleInputChange('notifications', 'systemAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Weekly Reports</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive weekly performance and activity reports
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.weeklyReports}
                onChange={(e) => handleInputChange('notifications', 'weeklyReports', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSaveNotifications}
          icon={<Save />}
          variant="gradient"
          loading={loading}
        >
          Save Notifications
        </Button>
      </div>
    </div>
  );
  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => handleThemeChange('light')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.preferences.theme === 'light'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                <Sun className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Light</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clean and bright interface
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleThemeChange('dark')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.preferences.theme === 'dark'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                <Moon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Dark</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Easy on the eyes
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleThemeChange('system')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.preferences.theme === 'system'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-800 border border-gray-300 rounded-lg flex items-center justify-center">
                <Monitor className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">System</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Follow system preference
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Security Settings
        </h3>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Not Enabled
              </Badge>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Login Sessions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your active login sessions
                </p>
              </div>
              <Badge variant="success">
                2 Active Sessions
              </Badge>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">API Keys</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage API keys for integrations
                </p>
              </div>
              <Badge variant="outline">
                0 Keys
              </Badge>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Generate Key
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };
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
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>
          {}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
