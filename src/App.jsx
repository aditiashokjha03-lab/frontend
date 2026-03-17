import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { OfflineProvider } from './context/OfflineContext';
import { TimerProvider } from './context/TimerContext';

// Lazy loaded pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Habits = lazy(() => import('./pages/Habits'));
const Timer = lazy(() => import('./pages/Timer'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Profile = lazy(() => import('./pages/Profile'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Goals = lazy(() => import('./pages/Goals'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

import OfflineIndicator from './components/OfflineIndicator';
import Navbar from './components/layout/Navbar';

// Performance-friendly fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// Layout integrating sidebar
const Layout = ({ children }) => (
  <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
    <OfflineIndicator />
    <Navbar />
    <main className="flex-1 md:ml-64 w-full">
      {children}
    </main>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/timer" element={<ProtectedRoute><Timer /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <OfflineProvider>
            <TimerProvider>
              <AppRoutes />
            </TimerProvider>
          </OfflineProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
