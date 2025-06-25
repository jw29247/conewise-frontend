import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import GeneratePlanPage from './pages/GeneratePlanPage';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <PrivateRoute>
            <PlansPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/generate-plan"
        element={
          <PrivateRoute>
            <GeneratePlanPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/team"
        element={
          <PrivateRoute>
            <TeamPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      {/* Temporary dev routes - bypass authentication */}
      <Route path="/dashboard-dev" element={<Dashboard />} />
      <Route path="/plans-dev" element={<PlansPage />} />
      <Route path="/team-dev" element={<TeamPage />} />
      <Route path="/settings-dev" element={<SettingsPage />} />
      <Route path="/generate-plan-dev" element={<GeneratePlanPage />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;