import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
// Layout Components
import Layout from '../components/layout/Layout';
// Dashboard Components
import TeamLeadDashboard from '../components/dashboards/TeamLeadDashboard';
import TeamMemberDashboard from '../components/dashboards/TeamMemberDashboard';
// Page Components (to be created)
import TasksPage from '../pages/TasksPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import TeamPage from '../pages/TeamPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import { PageTransition } from '../components/animations';
// Route Guards
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
const DashboardRedirect = () => {
  const { user } = useSelector(state => state.auth);
  if (user?.role === 'team_lead') {
    return <Navigate to="/dashboard/lead" replace />;
  } else {
    return <Navigate to="/dashboard/member" replace />;
  }
};
// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <PageTransition>
                <LoginPage />
              </PageTransition>
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <TasksPage />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <TasksPage />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/:id" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <TasksPage />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <AnalyticsPage />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/team" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <TeamPage />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/team/:id" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <TeamPage />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="*" 
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};
const AppRouter = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};
export default AppRouter;
