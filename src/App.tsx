import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import GeneratePlanPage from './pages/GeneratePlanPage';
import ReviewPage from './pages/ReviewPage';

function AppContent() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/generate-plan" element={<GeneratePlanPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/review" element={<ReviewPage />} />
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