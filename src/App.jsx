import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import Header from './components/layout/Header';
import LoadingSpinner from './components/animations/LoadingSpinner';
import AccessibilityProvider, { AccessibilityTester } from './components/accessibility/AccessibilityProvider';
import KeyboardShortcutsProvider from './components/ux/KeyboardShortcuts';
import { AppErrorBoundary, ErrorProvider } from './components/error/ErrorBoundary';
import { ToastProvider, useNetworkToasts } from './components/notifications/ToastNotifications';
import websocketService from './services/websocket';
import './styles/globals.css';
import './styles/designSystem.css';
// Lazy load the Dashboard component for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// Network status component
const NetworkStatusHandler = () => {
  useNetworkToasts();
  return null;
};
const AppContent = () => {
  const theme = useSelector((state) => state.settings.currentTheme);
  useEffect(() => {
    // Initialize WebSocket connection
    websocketService.connect();
    return () => {
      websocketService.disconnect();
    };
  }, []);
  const handleShortcut = (shortcut) => {
    switch (shortcut) {
      case 'dashboard':
        // Navigate to dashboard
        break;
      case 'analytics':
        // Navigate to analytics
        break;
      case 'toggle-theme':
        // Toggle theme
        break;
      default:
        break;
    }
  };
  return (
    <ErrorProvider>
      <ToastProvider>
        <AppErrorBoundary>
          <AccessibilityProvider>
            <KeyboardShortcutsProvider onShortcut={handleShortcut}>
              <div className={`app ${theme}`} data-theme={theme}>
                <BrowserRouter>
                  <NetworkStatusHandler />
                  <Header />
                  <main className="main-content">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                      </Routes>
                    </Suspense>
                  </main>
                </BrowserRouter>
                {}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                      border: '1px solid var(--toast-border)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
                {}
                <AccessibilityTester />
              </div>
            </KeyboardShortcutsProvider>
          </AccessibilityProvider>
        </AppErrorBoundary>
      </ToastProvider>
    </ErrorProvider>
  );
};
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
export default App;

