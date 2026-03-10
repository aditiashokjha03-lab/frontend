import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { OfflineProvider } from './context/OfflineContext';
import { TimerProvider } from './context/TimerContext';

// Basic page stubs
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Timer from './pages/Timer';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Goals from './pages/Goals';
import LandingPage from './pages/LandingPage';
import OfflineIndicator from './components/OfflineIndicator';
import Navbar from './components/layout/Navbar'; // New

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
