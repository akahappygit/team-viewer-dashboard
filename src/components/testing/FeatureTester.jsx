import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../notifications/ToastNotifications';
import { useErrorHandler } from '../error/ErrorBoundary';
import { Bug, Bell, Zap, Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

const FeatureTester = () => {
  const [errorCount, setErrorCount] = useState(0);
  const { success, error, warning, info, loading, network, sync } = useToast();
  const { addError } = useErrorHandler();

  const testToastNotifications = () => {
    success('Success! Feature is working perfectly.', {
      title: 'Test Successful',
      duration: 4000
    });
    
    setTimeout(() => {
      info('This is an informational message.', {
        title: 'Information',
        duration: 3000
      });
    }, 1000);
    
    setTimeout(() => {
      warning('This is a warning message.', {
        title: 'Warning',
        duration: 5000
      });
    }, 2000);
    
    setTimeout(() => {
      const loadingId = loading('Processing your request...', {
        title: 'Loading',
        dismissible: false
      });
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        success('Request completed successfully!', {
          title: 'Complete'
        });
      }, 3000);
    }, 3000);
  };

  const testNetworkToasts = () => {
    network('Network status changed', {
      title: 'Network Update',
      duration: 3000
    });
    
    setTimeout(() => {
      sync('Data synchronization in progress...', {
        title: 'Syncing',
        duration: 4000
      });
    }, 1500);
  };

  const testErrorBoundary = () => {
    setErrorCount(prev => prev + 1);
    
    // Simulate different types of errors
    const errorTypes = [
      { type: 'network', message: 'Network connection failed' },
      { type: 'validation', message: 'Form validation error' },
      { type: 'authentication', message: 'Authentication failed' },
      { type: 'server', message: 'Internal server error' }
    ];
    
    const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    
    addError({
      type: randomError.type,
      severity: 'medium',
      message: randomError.message,
      context: { testId: errorCount + 1 },
      source: 'feature-test'
    });
  };

  const testOfflineMode = () => {
    // Simulate offline mode
    window.dispatchEvent(new Event('offline'));
    
    setTimeout(() => {
      window.dispatchEvent(new Event('online'));
    }, 5000);
  };

  const ErrorTrigger = () => {
    if (errorCount > 2) {
      throw new Error('Intentional error for testing error boundary');
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <Bug className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Feature Testing Center
        </h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Test various features of the Team Pulse Dashboard including error boundaries, 
        toast notifications, offline mode, and enhanced UX components.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testToastNotifications}
          className="flex items-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Test Toast Notifications</div>
            <div className="text-sm opacity-90">Success, Info, Warning, Loading</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testNetworkToasts}
          className="flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Zap className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Test Network Toasts</div>
            <div className="text-sm opacity-90">Network & Sync notifications</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testErrorBoundary}
          className="flex items-center gap-3 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Test Error Handling</div>
            <div className="text-sm opacity-90">Error boundaries & reporting</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testOfflineMode}
          className="flex items-center gap-3 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <WifiOff className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Test Offline Mode</div>
            <div className="text-sm opacity-90">Network status handling</div>
          </div>
        </motion.button>
      </div>

      <ErrorTrigger />

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Test Results</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">
              Error triggers attempted: {errorCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">
              Component rendered successfully
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureTester;