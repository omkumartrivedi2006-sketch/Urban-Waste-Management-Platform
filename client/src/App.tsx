import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingButton from './components/FloatingButton';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedNavbar from './components/AuthenticatedNavbar';

// Lazy load page bundles
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ReportIssue = lazy(() => import('./pages/ReportIssue'));
const MyComplaints = lazy(() => import('./pages/MyComplaints'));
const VehicleDashboard = lazy(() => import('./pages/VehicleDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Rewards = lazy(() => import('./pages/Rewards'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Named exports lazy loaders
const CitizenDashboard = lazy(() => import('./pages/Dashboards').then(m => ({ default: m.CitizenDashboard })));
const DriverDashboard = lazy(() => import('./pages/Dashboards').then(m => ({ default: m.DriverDashboard })));
const AdminDashboard = lazy(() => import('./pages/Dashboards').then(m => ({ default: m.AdminDashboard })));

// Page Slide/Fade wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Helper to check if we are on dashboard portals
  const isDashboardPage = [
    '/dashboard', 
    '/driver', 
    '/admin', 
    '/report', 
    '/my-complaints', 
    '/driver/vehicle',
    '/profile',
    '/rewards',
    '/notifications',
    '/settings'
  ].includes(location.pathname);

  // YouTube / GitHub style top loading bar simulation
  useEffect(() => {
    setLoadingProgress(35);
    const t1 = setTimeout(() => setLoadingProgress(75), 150);
    const t2 = setTimeout(() => setLoadingProgress(100), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-neutral-bg dark:bg-slate-950 selection:bg-accent-lime/20 selection:text-primary-dark font-sans transition-colors duration-300">
      
      {/* Top Loading Progress Bar */}
      {loadingProgress < 100 && (
        <motion.div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-lime to-emerald-500 z-[9999]"
          initial={{ width: '0%' }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
        />
      )}

      {/* Show back-to-top floating actions only on landing page */}
      {location.pathname === '/' && <FloatingButton />}

      {/* Persistent Authenticated Navbar on Portals */}
      {isDashboardPage && <AuthenticatedNavbar />}

      {/* Routes definitions */}
      <Suspense fallback={<div className="h-1 fixed top-0 left-0 w-full bg-accent-lime animate-pulse z-[9999]" />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Landing Page */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />

            {/* Public Auth Pages (Split Screen) */}
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />

            {/* Protected Dashboard Portals */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <PageWrapper><CitizenDashboard /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <PageWrapper><ReportIssue /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <PageWrapper><MyComplaints /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['Driver']}>
                  <PageWrapper><DriverDashboard /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/vehicle"
              element={
                <ProtectedRoute allowedRoles={['Driver']}>
                  <PageWrapper><VehicleDashboard /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Municipal Admin']}>
                  <PageWrapper><AdminDashboard /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['Citizen', 'Driver', 'Municipal Admin']}>
                  <PageWrapper><Profile /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <PageWrapper><Rewards /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['Citizen', 'Driver', 'Municipal Admin']}>
                  <PageWrapper><NotificationsCenter /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['Citizen', 'Driver', 'Municipal Admin']}>
                  <PageWrapper><Settings /></PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
